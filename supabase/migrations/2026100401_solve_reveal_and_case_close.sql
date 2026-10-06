-- Migration: 2026100401_solve_reveal_and_case_close
--
-- Three connected defects in how a solved lead and the end of the case were
-- handled, found by the final immersion audit:
--
-- 1. What a solve REVEALS was delivered before the solve. get_player_node_detail
--    returned storyReveal, locationClue (including where to go next) and
--    evidenceUnlocked while the node was still open, so a team could read the
--    reward, and the next location, from the network response before earning
--    them. submit_puzzle_answer returned none of it, so the app had nothing to
--    show at the moment of the solve except a UUID. Now:
--      - get_player_node_detail no longer returns those three fields;
--      - submit_puzzle_answer returns them as `reveal` when the answer is right;
--      - get_player_node_detail returns the same `reveal` for a SOLVED node
--        ({unlocked:false, solved:true, reveal}), so it can be read again.
--
-- 2. The case never closed. The last node has nothing after it, and solving it
--    changed nothing: the team stayed ACTIVE, the hub offered the solved lead
--    again and the ending screens were unreachable. Solving a node with no
--    successor now completes the team (ACTIVE -> COMPLETED, a transition the
--    state machine already allows), records TEAM_COMPLETED, and the result
--    carries isFinal.
--
-- 3. Solving a lead files its evidence. The archive of a real team was empty:
--    nothing wrote team_progress.evidence_owned after the first rewrite of
--    submit_puzzle_answer.
--
-- 4. get_team_game_state now reports completedAt, so the closing screen can
--    show the time the case took instead of a clock that keeps running.
--
-- Notification wording for a solve is now in the voice of the game.
-- Answers, scoring, prerequisites and unlock logic are unchanged.

-- What a solved lead reveals. Internal: never granted to clients directly.
CREATE OR REPLACE FUNCTION nexus_node_reveal(p_node_id UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_strip_nulls(jsonb_build_object(
    'storyReveal', metadata->>'storyReveal',
    'clueText', metadata->'locationClue'->>'clueText',
    'nextPhysicalLocation', metadata->'locationClue'->>'nextPhysicalLocation',
    'evidenceId', metadata->'evidenceUnlocked'->>'id',
    'evidenceTitle', metadata->'evidenceUnlocked'->>'title',
    'evidenceSource', metadata->'evidenceUnlocked'->>'source',
    'evidenceCategory', metadata->'evidenceUnlocked'->>'category',
    'evidenceContent', metadata->'evidenceUnlocked'->>'content'
  ))
  FROM puzzle_nodes
  WHERE id = p_node_id;
$$;

REVOKE ALL ON FUNCTION nexus_node_reveal(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION nexus_node_reveal(UUID) TO service_role;

CREATE OR REPLACE FUNCTION submit_puzzle_answer(
  p_node_id UUID,
  p_answer TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_team_id UUID;
  v_player_id UUID;
  v_player_role player_role;
  v_team_status team_status;
  v_game_started_at TIMESTAMPTZ;
  v_answer_meta JSONB;
  v_rewards JSONB;
  v_branches JSONB;
  v_progress RECORD;
  v_normalized_answer TEXT;
  v_accepted TEXT;
  v_is_correct BOOLEAN;
  v_attempt_number INTEGER;
  v_response_time INTEGER;
  v_points_awarded INTEGER;
  v_recent_submissions INTEGER;
  v_base_points INTEGER;
  v_next_code TEXT;
  v_next_uuid UUID;
  v_reveal JSONB;
  v_node_meta JSONB;
  v_evidence_code TEXT;
  v_is_final BOOLEAN := false;
  result JSONB;
  MAX_SUBMISSIONS_PER_MINUTE CONSTANT INTEGER := 5;
BEGIN
  SELECT team_id, id, role INTO v_team_id, v_player_id, v_player_role
  FROM players
  WHERE auth_user_id = auth.uid()
  LIMIT 1;

  IF v_team_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No team found for player');
  END IF;

  SELECT status, game_started_at
    INTO v_team_status, v_game_started_at
    FROM teams
   WHERE id = v_team_id;

  IF v_team_status <> 'ACTIVE' THEN
    RETURN jsonb_build_object('error', 'Game not active');
  END IF;

  v_response_time := GREATEST(
    0,
    EXTRACT(EPOCH FROM (now() - v_game_started_at))::INTEGER
  );

  SELECT COUNT(*) INTO v_recent_submissions
  FROM submissions
  WHERE team_id = v_team_id
  AND submitted_at > now() - INTERVAL '1 minute';

  IF v_recent_submissions >= MAX_SUBMISSIONS_PER_MINUTE THEN
    RETURN jsonb_build_object('error', 'Rate limited. Please wait before submitting again.');
  END IF;

  -- answer_metadata is server-only and is never returned to the client.
  SELECT answer_metadata, rewards, branches, metadata
    INTO v_answer_meta, v_rewards, v_branches, v_node_meta
  FROM puzzle_nodes
  WHERE id = p_node_id
    AND id IN (
      SELECT node_id FROM node_progress
      WHERE team_id = v_team_id
      AND status IN ('AVAILABLE', 'IN_PROGRESS')
    );

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Node not accessible');
  END IF;

  SELECT * INTO v_progress
  FROM node_progress
  WHERE team_id = v_team_id AND node_id = p_node_id;

  IF NOT FOUND THEN
    INSERT INTO node_progress (team_id, node_id, status)
    VALUES (v_team_id, p_node_id, 'IN_PROGRESS')
    RETURNING * INTO v_progress;
  END IF;

  v_attempt_number := v_progress.attempts + 1;

  -- Normalize both sides identically: upper-case, trim, collapse inner runs
  -- of whitespace. This makes "exact" and "case_insensitive" equivalent,
  -- which is the behaviour the seed's validationMethod values describe.
  v_normalized_answer := UPPER(TRIM(p_answer));
  v_normalized_answer := REGEXP_REPLACE(v_normalized_answer, '\s+', ' ', 'g');

  v_accepted := UPPER(TRIM(COALESCE(v_answer_meta->>'acceptedAnswer', '')));
  v_accepted := REGEXP_REPLACE(v_accepted, '\s+', ' ', 'g');

  v_is_correct := (
    v_accepted <> ''
    AND v_normalized_answer = v_accepted
  );

  v_base_points := COALESCE((v_rewards->>'points')::INTEGER, 0);

  v_points_awarded := CASE
    WHEN NOT v_is_correct THEN 0
    WHEN v_attempt_number = 1 THEN v_base_points
    WHEN v_attempt_number = 2 THEN (v_base_points + 1) / 2
    ELSE 0
  END;

  INSERT INTO submissions (
    team_id, node_id, player_id, role, submitted_answer,
    normalized_answer, is_correct, attempt_number,
    response_time_seconds, points_awarded
  ) VALUES (
    v_team_id, p_node_id, v_player_id, v_player_role, p_answer,
    v_normalized_answer, v_is_correct, v_attempt_number,
    v_response_time, v_points_awarded
  );

  UPDATE node_progress
  SET attempts = v_attempt_number,
      updated_at = now()
  WHERE team_id = v_team_id AND node_id = p_node_id;

  IF v_is_correct THEN
    UPDATE node_progress
    SET status = 'SOLVED',
        solved_at = now(),
        solved_answer = v_normalized_answer,
        attempts = v_attempt_number,
        time_spent_seconds = time_spent_seconds + v_response_time,
        points_awarded = v_points_awarded
    WHERE team_id = v_team_id AND node_id = p_node_id;

    UPDATE teams
    SET score = score + v_points_awarded
    WHERE id = v_team_id;

    -- Mirror the solved node into the team's aggregate progress so the
    -- player's map and counter update without a second round trip.
    UPDATE team_progress
    SET solved_nodes = (
          SELECT COALESCE(jsonb_agg(jsonb_build_array(np.node_id)), '[]'::jsonb)
          FROM node_progress np
          WHERE np.team_id = v_team_id AND np.status = 'SOLVED'
        ),
        score = (SELECT score FROM teams WHERE id = v_team_id)
    WHERE team_id = v_team_id;

    v_next_code := NULLIF(v_branches->>'unlocks', '');
    IF v_next_code IS NOT NULL THEN
      SELECT id INTO v_next_uuid
      FROM puzzle_nodes
      WHERE code = v_next_code;

      IF v_next_uuid IS NOT NULL THEN
        -- DO UPDATE, not DO NOTHING: bureau_reset_node() pre-creates every
        -- node as LOCKED, so the row usually already exists. With DO NOTHING
        -- the freshly unlocked node stayed LOCKED and get_player_node_detail
        -- kept answering {unlocked:false}, stalling the game after one puzzle.
        -- A node that was already solved or in progress keeps its status.
        INSERT INTO node_progress (team_id, node_id, status)
        VALUES (v_team_id, v_next_uuid, 'AVAILABLE')
        ON CONFLICT (team_id, node_id) DO UPDATE
        SET status = 'AVAILABLE',
            updated_at = now()
        WHERE node_progress.status = 'LOCKED';

        UPDATE teams
        SET current_node_id = v_next_uuid,
            current_node_code = v_next_code
        WHERE id = v_team_id;

        UPDATE team_progress
        SET current_node_id = v_next_uuid,
            current_node_code = v_next_code
        WHERE team_id = v_team_id;
      END IF;
    END IF;

    INSERT INTO game_events (type, team_id, player_id, node_id, payload)
    VALUES ('NODE_SOLVED', v_team_id, v_player_id, p_node_id,
            jsonb_build_object('points', v_points_awarded, 'attempts', v_attempt_number));

    -- A node with nothing after it is the end of the case. Nothing used to
    -- close it: the last solve left the team ACTIVE on a hub that offered the
    -- solved lead again, and the ending screens were unreachable.
    IF v_next_code IS NULL THEN
      v_is_final := true;
      UPDATE teams
      SET status = 'COMPLETED',
          completed_at = now()
      WHERE id = v_team_id AND status = 'ACTIVE';

      INSERT INTO game_events (type, team_id, player_id, node_id, payload)
      VALUES ('TEAM_COMPLETED', v_team_id, v_player_id, p_node_id,
              jsonb_build_object('points', v_points_awarded));
    END IF;

    -- File the material this lead recovered. The earliest version of this
    -- function did; the rewrites that fixed scoring and unlocking dropped it,
    -- so the evidence archive of a real team stayed empty however many leads
    -- it closed.
    v_evidence_code := v_node_meta->'evidenceUnlocked'->>'id';
    IF v_evidence_code IS NOT NULL THEN
      UPDATE team_progress tp
         SET evidence_owned = tp.evidence_owned || e.id
        FROM evidence e
       WHERE tp.team_id = v_team_id
         AND e.code = v_evidence_code
         AND NOT (e.id = ANY (tp.evidence_owned));
    END IF;

    v_reveal := nexus_node_reveal(p_node_id);

    INSERT INTO notifications (team_id, target_roles, type, title, message)
    VALUES (v_team_id, ARRAY['OBSERVER', 'ANALYST', 'OPERATOR'],
            'PUZZLE_SOLVED',
            CASE WHEN v_is_final THEN 'CASE CLOSED' ELSE 'LEAD CLOSED' END,
            CASE WHEN v_is_final THEN 'Your unit filed the last entry.' ELSE 'Your unit closed a lead.' END);

    result := jsonb_build_object(
      'isCorrect', true,
      'pointsAwarded', v_points_awarded,
      'attemptNumber', v_attempt_number,
      'nextNodeId', v_next_uuid,
      'nextNodeCode', v_next_code,
      'isFinal', v_is_final,
      'reveal', v_reveal
    );
  ELSE
    INSERT INTO game_events (type, team_id, player_id, node_id, payload)
    VALUES ('SUBMISSION_MADE', v_team_id, v_player_id, p_node_id,
            jsonb_build_object('correct', false, 'attempt', v_attempt_number));

    result := jsonb_build_object(
      'isCorrect', false,
      'pointsAwarded', 0,
      'attemptNumber', v_attempt_number
    );
  END IF;

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION get_player_node_detail(
  p_node_id UUID,
  p_player_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_team_id UUID;
  v_actual_role TEXT;
  v_is_unlocked BOOLEAN;
  v_node RECORD;
  v_role_key TEXT;
  v_role_content JSONB;
  v_investigation JSONB;
  v_resolved_location TEXT;
  v_resolved_status TEXT;
  v_solved_node RECORD;
BEGIN
  SELECT pl.team_id, pl.role::text INTO v_team_id, v_actual_role
  FROM players pl
  WHERE pl.auth_user_id = auth.uid()
  LIMIT 1;

  IF v_team_id IS NULL THEN
    RETURN jsonb_build_object('unlocked', false);
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM node_progress
    WHERE team_id = v_team_id
    AND node_id = p_node_id
    AND status IN ('AVAILABLE', 'IN_PROGRESS')
  ) INTO v_is_unlocked;

  IF NOT v_is_unlocked THEN
    -- A solved lead is not locked: it is closed. Say so, and return what it
    -- revealed, so the team can read it again. Before this a solved node
    -- answered {unlocked:false}, which the app could not tell apart from a
    -- node that was never issued.
    IF EXISTS (
      SELECT 1 FROM node_progress
      WHERE team_id = v_team_id AND node_id = p_node_id AND status = 'SOLVED'
    ) THEN
      SELECT code, title, stage, location INTO v_solved_node
        FROM puzzle_nodes WHERE id = p_node_id;
      RETURN jsonb_build_object(
        'unlocked', false,
        'solved', true,
        'code', v_solved_node.code,
        'title', v_solved_node.title,
        'stage', v_solved_node.stage,
        'location', v_solved_node.location,
        'reveal', nexus_node_reveal(p_node_id)
      );
    END IF;
    RETURN jsonb_build_object('unlocked', false);
  END IF;

  SELECT code, title, type, difficulty, estimated_minutes, location, stage,
         content, metadata, rewards, answer_metadata
    INTO v_node
    FROM puzzle_nodes
   WHERE id = p_node_id;

  IF v_node.code IS NULL THEN
    RETURN jsonb_build_object('unlocked', false);
  END IF;

  -- Resolve the runtime location: prefer admin override, fall back to node's
  -- static location column.
  SELECT rl.location_name, rl.location_status
  INTO v_resolved_location, v_resolved_status
  FROM resolve_node_location(p_node_id) rl;

  IF v_resolved_location IS NULL THEN
    v_resolved_location := v_node.location;
  END IF;

  -- The caller's role comes from the database, never from the request.
  v_role_key := UPPER(v_actual_role);

  v_role_content := COALESCE(v_node.content -> LOWER(v_role_key), '{}'::jsonb);

  v_investigation := CASE
    WHEN v_role_key = 'OPERATOR' THEN v_node.content -> 'operatorInvestigation'
    ELSE NULL
  END;

  RETURN jsonb_build_object(
    'unlocked', true,
    'code', v_node.code,
    'title', v_node.title,
    'type', v_node.type::text,
    'difficulty', v_node.difficulty,
    'estimatedMinutes', v_node.estimated_minutes,
    'location', v_resolved_location,
    'locationStatus', v_resolved_status,
    'stage', v_node.stage,
    'narrativeObjective', nexus_redact_answer(v_node.content->>'narrativeObjective', v_node.answer_metadata->>'acceptedAnswer'),
    'roleDependencyLevel', v_node.content->>'roleDependencyLevel',
    'roleContent', nexus_redact_jsonb(v_role_content, v_node.answer_metadata->>'acceptedAnswer'),
    'operatorInvestigation', nexus_redact_jsonb(v_investigation, v_node.answer_metadata->>'acceptedAnswer'),
    'coordinationChain', nexus_redact_jsonb(v_node.content->'coordinationChain', v_node.answer_metadata->>'acceptedAnswer'),
    'failurePropagation', nexus_redact_jsonb(v_node.content->'failurePropagation', v_node.answer_metadata->>'acceptedAnswer'),
    'whyTeamworkMatters', nexus_redact_answer(v_node.metadata->>'whyTeamworkMatters', v_node.answer_metadata->>'acceptedAnswer'),
    'branchConditions', COALESCE(v_node.content->'branchConditions', '[]'::jsonb),
    'points', COALESCE((v_node.rewards->>'points')::INTEGER, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_team_game_state()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
  v_team_id UUID;
  v_team_status text;
  v_team_name TEXT;
  v_team_code CHAR(6);
  v_team_score INTEGER;
  v_team_started TIMESTAMPTZ;
  v_team_deadline TIMESTAMPTZ;
  v_team_completed TIMESTAMPTZ;
  v_current_node UUID;
  v_solved_count INTEGER;
  v_current_node_code TEXT;
  v_current_node_title TEXT;
  v_current_node_type puzzle_type;
  v_current_node_location TEXT;
  v_current_node_stage INTEGER;
  v_unread_count INTEGER;
  v_available_node_codes TEXT[];
  result JSONB;
BEGIN
  SELECT team_id INTO v_team_id
  FROM players
  WHERE auth_user_id = auth.uid()
  LIMIT 1;

  IF v_team_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No team found for player');
  END IF;

  SELECT t.status, t.name, t.code, t.score, t.game_started_at, t.game_deadline,
         t.current_node_id, t.completed_at
  INTO v_team_status, v_team_name, v_team_code, v_team_score,
       v_team_started, v_team_deadline, v_current_node, v_team_completed
  FROM teams t
  WHERE t.id = v_team_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Team not found');
  END IF;

  SELECT COUNT(*) INTO v_solved_count
  FROM node_progress
  WHERE team_id = v_team_id AND status = 'SOLVED';

  IF v_current_node IS NOT NULL THEN
    SELECT code, title, type, location, stage
    INTO v_current_node_code, v_current_node_title, v_current_node_type,
         v_current_node_location, v_current_node_stage
    FROM puzzle_nodes
    WHERE id = v_current_node;
  END IF;

  SELECT COUNT(*) INTO v_unread_count
  FROM notifications
  WHERE team_id = v_team_id AND is_read = false;

  -- The nodes open to the team right now, as codes. Derived from node_progress,
  -- which every unlock and solve already maintains. team_progress.available_node_ids
  -- is only written on start and reset, so it kept advertising a solved P01 and
  -- never listed anything that unlocked later.
  SELECT COALESCE(array_agg(pn.code ORDER BY pn.stage, pn.code), ARRAY[]::TEXT[])
  INTO v_available_node_codes
  FROM node_progress np
  JOIN puzzle_nodes pn ON pn.id = np.node_id
  WHERE np.team_id = v_team_id
    AND np.status IN ('AVAILABLE', 'IN_PROGRESS');

  result := jsonb_build_object(
    'team', jsonb_build_object(
      'id', v_team_id::text,
      'name', v_team_name,
      'code', v_team_code,
      'status', v_team_status,
      'score', v_team_score,
      'startedAt', v_team_started,
      'deadline', v_team_deadline,
      'completedAt', v_team_completed
    ),
    'progress', jsonb_build_object(
      'solvedCount', v_solved_count,
      'currentNodeId', v_current_node::text,
      'availableNodeIds', v_available_node_codes
    ),
    'currentNode', CASE
      WHEN v_current_node IS NOT NULL THEN
        jsonb_build_object(
          'code', v_current_node_code,
          'title', v_current_node_title,
          'type', v_current_node_type::text,
          'location', v_current_node_location,
          'stage', v_current_node_stage
        )
      ELSE NULL
    END,
    'unreadNotifications', v_unread_count
  );

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION submit_puzzle_answer(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION submit_puzzle_answer(UUID, TEXT) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_player_node_detail(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_player_node_detail(UUID, TEXT) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_team_game_state() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_team_game_state() TO authenticated, service_role;


-- Teams already mid-case: file the evidence of every lead they have closed.
UPDATE team_progress tp
   SET evidence_owned = COALESCE((
         SELECT array_agg(DISTINCT x)
           FROM unnest(tp.evidence_owned || COALESCE((
                  SELECT array_agg(e.id)
                    FROM node_progress np
                    JOIN puzzle_nodes n ON n.id = np.node_id
                    JOIN evidence e ON e.code = n.metadata->'evidenceUnlocked'->>'id'
                   WHERE np.team_id = tp.team_id AND np.status = 'SOLVED'
                ), '{}'::uuid[])) AS x
       ), '{}'::uuid[])
 WHERE EXISTS (SELECT 1 FROM node_progress np WHERE np.team_id = tp.team_id AND np.status = 'SOLVED');
