-- The rebuilt case is one investigation. These checks keep it playable:
-- every lead has four hints, a claim with accepted variants, exhibits that
-- exist, nothing blanked by the redaction layer, and no exhibit nobody files.
\set ON_ERROR_STOP on
do $$
declare r record; bad text := ''; key text; role text; red text;
begin
  for r in select code, content, metadata, answer_metadata from puzzle_nodes loop
    if jsonb_array_length(r.content->'hints') <> 4 then bad := bad || format(' %s(hints=%s)', r.code, jsonb_array_length(r.content->'hints')); end if;
    if coalesce(jsonb_array_length(r.answer_metadata->'alternatives'), 0) < 1 then bad := bad || format(' %s(no alternatives)', r.code); end if;
    if r.answer_metadata->>'redact' is null then bad := bad || format(' %s(no redact flag)', r.code); end if;
    if coalesce(r.answer_metadata->>'question','') = '' or coalesce(r.answer_metadata->>'format','') = '' then bad := bad || format(' %s(no question/format)', r.code); end if;
    if coalesce(r.metadata->'evidenceBundle', '[]'::jsonb) = '[]'::jsonb then bad := bad || format(' %s(no exhibits)', r.code); end if;
    if exists (
      select 1 from jsonb_array_elements_text(r.metadata->'evidenceBundle') c
       where not exists (select 1 from evidence e where e.code = c)
    ) then bad := bad || format(' %s(missing exhibit)', r.code); end if;
    if not exists (select 1 from evidence e where e.code = r.metadata->'evidenceUnlocked'->>'id') then bad := bad || format(' %s(primary exhibit missing)', r.code); end if;
    -- redaction must not blank anything the team needs to read
    key := case when coalesce(r.answer_metadata->>'redact','true') = 'false' then null else r.answer_metadata->>'acceptedAnswer' end;
    foreach role in array array['observer','analyst','operator'] loop
      red := nexus_redact_jsonb(r.content->role, key)::text;
      if red like '%[ sealed ]%' then bad := bad || format(' %s/%s(redaction blanks text)', r.code, role); end if;
    end loop;
    if r.content ? 'intermediateOutput' or (r.content->'observer') ? 'intermediateOutput' then bad := bad || format(' %s(leaks intermediateOutput)', r.code); end if;
  end loop;
  if bad <> '' then raise exception 'case content defects:%', bad; end if;

  if exists (
    select 1 from evidence e
     where not exists (select 1 from puzzle_nodes n where e.code in (select jsonb_array_elements_text(n.metadata->'evidenceBundle')))
  ) then raise exception 'orphan evidence: %', (select string_agg(e.code, ', ') from evidence e where not exists (select 1 from puzzle_nodes n where e.code in (select jsonb_array_elements_text(n.metadata->'evidenceBundle')))); end if;

  if exists (select 1 from evidence where coalesce(content->>'image_url', content->>'audio_url') is null and coalesce(content->>'text','') = '') then
    raise exception 'an exhibit has neither media nor text';
  end if;

  if exists (select 1 from puzzle_nodes where metadata->>'storyReveal' ~ 'PROCEED TO P[0-9]+') then
    raise exception 'a story reveal still names an internal node code';
  end if;
  raise notice 'case content test passed (% leads)', (select count(*) from puzzle_nodes);
end $$;

-- A team may type a claim the way it likes: any accepted variant, any case,
-- spacing or punctuation; a wrong claim never scores.
do $$
declare
  v_team uuid; v_user uuid; p record; i int := 0; n int := 0; v_code text; v_node uuid; ans text; alt text;
  st jsonb; r jsonb; shapes int := 0;
begin
  perform set_config('request.jwt.claim.role','service_role',true);
  select * into p from bureau_provision_team('ALT TEST','[{"name":"O","role":"OBSERVER"},{"name":"A","role":"ANALYST"},{"name":"P","role":"OPERATOR"}]'::jsonb,'alt-test');
  v_team := p.team_id;
  for p in select id from players where team_id = v_team loop
    i := i + 1; v_user := ('00000000-0000-0000-0000-00000000d0'||lpad(i::text,2,'0'))::uuid;
    insert into auth.users(id,email) values (v_user,'alt'||i||'@test');
    update players set auth_user_id=v_user, device_session_token=gen_random_uuid()::text, device_fingerprint_hash=md5(id::text) where id=p.id;
  end loop;
  perform * from bureau_reissue_login_codes(v_team, null);
  perform * from bureau_start_team(v_team, 'alt test');
  select auth_user_id into v_user from players where team_id = v_team and role = 'OPERATOR';
  loop
    n := n + 1;
    if n > 80 then raise exception 'the case did not end'; end if;
    reset role;
    update submissions set submitted_at = submitted_at - interval '10 minutes' where team_id = v_team;
    perform set_config('request.jwt.claim.role','authenticated',true);
    perform set_config('request.jwt.claim.sub',v_user::text,true);
    set local role authenticated;
    st := get_team_game_state();
    exit when st #>> '{team,status}' = 'COMPLETED';
    v_code := st #>> '{currentNode,code}';
    reset role;
    select id, answer_metadata->>'acceptedAnswer',
           coalesce(answer_metadata->'alternatives'->>(jsonb_array_length(answer_metadata->'alternatives') - 1), answer_metadata->>'acceptedAnswer')
      into v_node, ans, alt from puzzle_nodes where code = v_code;
    set local role authenticated;
    r := submit_puzzle_answer(v_node, 'zz not it zz');
    if (r->>'isCorrect')::boolean then raise exception '% accepted a wrong claim', v_code; end if;
    reset role;
    update submissions set submitted_at = submitted_at - interval '10 minutes' where team_id = v_team;
    set local role authenticated;
    -- the last accepted variant, shouted, with stray spacing
    r := submit_puzzle_answer(v_node, '  ' || lower(alt) || '  ');
    if not (r->>'isCorrect')::boolean then raise exception '% rejected its own accepted variant "%": %', v_code, alt, r; end if;
    shapes := shapes + 1;
  end loop;
  raise notice 'every lead accepted a variant (% leads)', shapes;
end $$;
