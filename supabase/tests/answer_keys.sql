-- A team that does exactly what the screen tells it must be accepted.
--
-- P33 once accepted CONVERGENCE while every hint, the slot display and the
-- recorded solution said CONVERGE, and P34 accepted C while all of them said
-- D. Both made the case impossible to finish by following the instructions.
-- Wherever a node's last hint says "Submit X.", X is what the server accepts.
\set ON_ERROR_STOP on
do $$
declare r record; bad text := '';
begin
  for r in
    select code,
           upper(trim(answer_metadata->>'acceptedAnswer')) as accepted,
           upper(trim((regexp_match(content->'hints'->>(jsonb_array_length(content->'hints') - 1), '^Submit (.+)\.$'))[1])) as hinted
      from puzzle_nodes
     where jsonb_typeof(content->'hints') = 'array' and jsonb_array_length(content->'hints') > 0
  loop
    if r.hinted is not null and r.hinted is distinct from r.accepted then
      bad := bad || format(' %s (hint says %s, server accepts %s)', r.code, r.hinted, r.accepted);
    end if;
  end loop;
  if bad <> '' then raise exception 'answer keys disagree with their own hints:%', bad; end if;

  -- The closing lead must not tell a team to go to a place that is not a lead.
  if exists (select 1 from puzzle_nodes where metadata->>'storyReveal' ~ 'PROCEED TO P[0-9]+') then
    raise exception 'a story reveal still names an internal node code';
  end if;
  raise notice 'answer keys test passed';
end $$;
