-- The core loop on the migrated schema: a started team solves a node, scores
-- once, unlocks the next, and the state the app reads agrees with the progress.
\set ON_ERROR_STOP on
do $$
declare
  v_team uuid; v_user uuid; p record; i int := 0; v_node uuid; v_next uuid; ans text;
  wrong jsonb; good jsonb; again jsonb; st jsonb; codes jsonb;
begin
  perform set_config('request.jwt.claim.role','service_role',true);
  select * into p from bureau_provision_team('FLOW TEST','[{"name":"O","role":"OBSERVER"},{"name":"A","role":"ANALYST"},{"name":"P","role":"OPERATOR"}]'::jsonb,'flow-test');
  v_team := p.team_id;
  for p in select id from players where team_id = v_team loop
    i := i + 1; v_user := ('00000000-0000-0000-0000-00000000f0'||lpad(i::text,2,'0'))::uuid;
    insert into auth.users(id,email) values (v_user,'flow'||i||'@test');
    update players set auth_user_id=v_user, device_session_token=gen_random_uuid()::text, device_fingerprint_hash=md5(id::text) where id=p.id;
  end loop;
  perform * from bureau_reissue_login_codes(v_team, null);
  perform * from bureau_start_team(v_team, 'flow test');

  select id, answer_metadata->>'acceptedAnswer' into v_node, ans from puzzle_nodes where code = 'P01';
  select auth_user_id into v_user from players where team_id = v_team and role = 'OBSERVER';
  perform set_config('request.jwt.claim.role','authenticated',true);
  perform set_config('request.jwt.claim.sub',v_user::text,true);
  set local role authenticated;

  st := get_team_game_state();
  if st #>> '{currentNode,code}' <> 'P01' then raise exception 'a started team should be on P01: %', st; end if;

  wrong := submit_puzzle_answer(v_node, 'not the answer');
  if (wrong ->> 'isCorrect')::boolean then raise exception 'a wrong answer was accepted'; end if;
  if (wrong ->> 'pointsAwarded')::int <> 0 then raise exception 'points for a wrong answer'; end if;

  good := submit_puzzle_answer(v_node, ans);
  if not (good ->> 'isCorrect')::boolean then raise exception 'the right answer was rejected: %', good; end if;
  if (good ->> 'pointsAwarded')::int <= 0 then raise exception 'no points for the right answer'; end if;

  -- What a solve reveals comes with the solve, and not before it.
  if good #>> '{reveal,storyReveal}' is null then raise exception 'a correct answer carried no reveal: %', good; end if;
  if good #>> '{reveal,clueText}' is null then raise exception 'a correct answer carried no next-lead note: %', good; end if;
  if (good ->> 'isFinal')::boolean then raise exception 'P01 is not the end of the case: %', good; end if;
  if (wrong ? 'reveal') then raise exception 'a wrong answer carried a reveal: %', wrong; end if;
  -- Closing a lead files its evidence: the archive must not stay empty.
  if not exists (select 1 from jsonb_array_elements(get_team_inventory() -> 'evidence') e where e ->> 'code' = 'EVID-P01') then
    raise exception 'solving P01 did not file EVID-P01 in the team archive';
  end if;
  -- A solved lead is closed, not locked, and can be read again.
  st := get_player_node_detail(v_node, 'OBSERVER');
  if not coalesce((st ->> 'solved')::boolean, false) then raise exception 'a solved node was not reported as solved: %', st; end if;
  if st #>> '{reveal,storyReveal}' is null then raise exception 'a solved node did not return its reveal: %', st; end if;
  -- The open lead must not carry its own reward or the next location.
  st := get_team_game_state();
  v_next := resolve_node_ref(st #>> '{currentNode,code}');
  st := get_player_node_detail(v_next, 'OBSERVER');
  if st ? 'storyReveal' or st ? 'locationClue' or st ? 'evidenceUnlocked' then
    raise exception 'an open lead leaked what it reveals: %', st;
  end if;

  again := submit_puzzle_answer(v_node, ans);
  if again ? 'pointsAwarded' and (again ->> 'pointsAwarded')::int <> 0 then raise exception 'a solved node paid out twice: %', again; end if;

  st := get_team_game_state();
  if (st #>> '{progress,solvedCount}')::int <> 1 then raise exception 'solvedCount should be 1: %', st; end if;
  if (st #>> '{team,score}')::int <> (good ->> 'pointsAwarded')::int then raise exception 'score drifted: %', st; end if;

  -- availableNodeIds must be what is actually open: not the solved node, and the one that unlocked.
  codes := st #> '{progress,availableNodeIds}';
  if codes ? 'P01' then raise exception 'solved P01 is still advertised as available: %', codes; end if;
  if jsonb_array_length(codes) < 1 then raise exception 'nothing unlocked after solving P01: %', st; end if;
  if not (codes ? (st #>> '{currentNode,code}')) then raise exception 'current node is not among the available nodes: %', st; end if;
  reset role;
  raise notice 'game flow test passed';
end $$;

-- Walk the whole case. Solving the last node must close it: the team becomes
-- COMPLETED, the result says isFinal, and the state reports when it finished.
do $$
declare
  v_team uuid; v_user uuid; p record; i int := 0; v_node uuid; ans text; v_code text;
  st jsonb; r jsonb; n int := 0; saw_final boolean := false;
begin
  perform set_config('request.jwt.claim.role','service_role',true);
  select * into p from bureau_provision_team('WALK TEST','[{"name":"O","role":"OBSERVER"},{"name":"A","role":"ANALYST"},{"name":"P","role":"OPERATOR"}]'::jsonb,'walk-test');
  v_team := p.team_id;
  for p in select id from players where team_id = v_team loop
    i := i + 1; v_user := ('00000000-0000-0000-0000-00000000e0'||lpad(i::text,2,'0'))::uuid;
    insert into auth.users(id,email) values (v_user,'walk'||i||'@test');
    update players set auth_user_id=v_user, device_session_token=gen_random_uuid()::text, device_fingerprint_hash=md5(id::text) where id=p.id;
  end loop;
  perform * from bureau_reissue_login_codes(v_team, null);
  perform * from bureau_start_team(v_team, 'walk test');
  select auth_user_id into v_user from players where team_id = v_team and role = 'OPERATOR';

  loop
    n := n + 1;
    if n > 80 then raise exception 'the case did not end after 80 solves'; end if;
    -- age the submissions so the per-minute limit is not what is being tested
    reset role;
    update submissions set submitted_at = submitted_at - interval '10 minutes' where team_id = v_team;
    perform set_config('request.jwt.claim.role','authenticated',true);
    perform set_config('request.jwt.claim.sub',v_user::text,true);
    set local role authenticated;
    st := get_team_game_state();
    exit when st #>> '{team,status}' = 'COMPLETED';
    v_code := st #>> '{currentNode,code}';
    reset role;
    select id, answer_metadata->>'acceptedAnswer' into v_node, ans from puzzle_nodes where code = v_code;
    set local role authenticated;
    r := submit_puzzle_answer(v_node, ans);
    if not (r ->> 'isCorrect')::boolean then raise exception 'walkthrough rejected %: %', v_code, r; end if;
    if coalesce((r ->> 'isFinal')::boolean, false) then saw_final := true; end if;
  end loop;

  if not saw_final then raise exception 'no solve reported isFinal'; end if;
  if st #>> '{team,completedAt}' is null then raise exception 'a completed team reported no completedAt: %', st; end if;
  reset role;
  if (select count(*) from game_events where team_id = v_team and type = 'TEAM_COMPLETED') <> 1 then
    raise exception 'TEAM_COMPLETED should be recorded exactly once';
  end if;
  raise notice 'case walkthrough passed (% solves)', n - 1;
end $$;

-- A node can be named by its code or its id (the app sends the code).
do $$
declare v_user uuid := '00000000-0000-0000-0000-0000000000f9'; v_id uuid; r uuid;
begin
  select id into v_id from puzzle_nodes where code = 'P01';
  insert into auth.users(id,email) values (v_user,'resolve@test');
  perform set_config('request.jwt.claim.role','authenticated',true);
  perform set_config('request.jwt.claim.sub',v_user::text,true);
  set local role authenticated;
  r := resolve_node_ref('P01');                if r is distinct from v_id then raise exception 'code did not resolve'; end if;
  r := resolve_node_ref('p01');                if r is distinct from v_id then raise exception 'lower-case code did not resolve'; end if;
  r := resolve_node_ref(v_id::text);           if r is distinct from v_id then raise exception 'uuid did not resolve'; end if;
  r := resolve_node_ref('00000000-0000-0000-0000-000000000000'); if r is not null then raise exception 'unknown uuid resolved'; end if;
  r := resolve_node_ref('P01; drop table teams'); if r is not null then raise exception 'junk resolved'; end if;
  reset role;
  raise notice 'resolve_node_ref test passed';
end $$;
