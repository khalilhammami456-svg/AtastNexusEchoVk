-- Migration: 2026100402_narrative_continuity
--
-- The final narrative pass over the 47 leads, as one investigation rather
-- than 47 puzzles. Player-readable text only, plus two answer keys that
-- contradicted the game's own instructions.
--
-- 1. BROKEN ANSWER KEYS (a team following the on-screen instructions was
--    rejected, so the case could not be finished):
--      P33  accepted CONVERGENCE, but every hint, the slot display and the
--           recorded solution say the key is CONVERGE. CONVERGE is the
--           accepted answer now; the "7 letters" the node claimed is 8
--           (the Analyst's "too long by 3" is against the 11-letter
--           CONVERGENCE).
--      P34  accepted C, but the sequence is A B C ? and every hint and the
--           recorded solution say the missing letter is D.
--
-- 2. HAND-OFFS THAT SENT TEAMS THE WRONG WAY. Lina's notes at M03 and P21
--    pointed at the rooftop (stage 5) while the next lead is in the Science
--    Building and the Central Archive; the notes at P17, P23, P24 and P27
--    skipped the lead inserted after them; P35 told the player to "PROCEED
--    TO P36". Each now names the place the next lead really is.
--
-- 3. SETUP AND PAYOFF: the Subject 05 thread (P07) pays off in the closing
--    memo; Carter, Vale and Rahal acquire a trace; Lina's voice returns in
--    margins and notes; the date she checked out the book and the date the
--    clock was set agree.
--
-- 4. THE ENDING asks what to do with the truth rather than which word to
--    type: each role gets a distinct stake at P35, P36 says "decide what it
--    was for", and P37 stops congratulating.
--
-- 5. Leaked author scratch text ("Hmm, that seems wrong"), missing quote
--    marks and a typo are removed.
--
-- Deliberately NOT touched: anything that changes what a puzzle physically
-- shows or how it is solved (counts of glyphs, clock readings, document
-- layouts), fragment words, titles, IDs, prerequisites, scoring and every
-- other answer. Those need someone who has stood in the building. See
-- docs/audits/NARRATIVE_OPEN_ITEMS.md.
--
-- Every UPDATE fires only while the old text is still present, so the
-- migration is safe to run twice.

-- T1 #1 [F1] M03 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Return to the rooftop spire. The final stage begins."$o$, $n$LINA'S NOTE: "Seven symbols, seven doors I could not close. Go back to where this began and read it again: the research lab, Science Building. Bring every answer you have."$n$))) WHERE code = 'M03' AND position($o$LINA'S NOTE: "Return to the rooftop spire. The final stage begins."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #2 [F1] M03 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ROOFTOP] — Transmitter Spire$o$, $n$[SCIENCE BUILDING] — Research Lab$n$))) WHERE code = 'M03' AND position($o$[ROOFTOP] — Transmitter Spire$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #3 [F1] M03 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$Proceed to the rooftop spire. The 3-hour countdown begins.$o$, $n$The Core is not open yet. Read the early locks again.$n$))) WHERE code = 'M03' AND position($o$Proceed to the rooftop spire. The 3-hour countdown begins.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$Proceed to the rooftop spire. The 3-hour countdown begins.$o$, $n$The Core is not open yet. Read the early locks again.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$Proceed to the rooftop spire. The 3-hour countdown begins.$o$, $n$The Core is not open yet. Read the early locks again.$n$))) WHERE code = 'EVID-M03';
-- T1 #4 [F2] P21 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "The rooftop spire awaits your return for Stage 5."$o$, $n$LINA'S NOTE: "That is seven. Alone they say nothing. Go down to the Central Archive and read them together."$n$))) WHERE code = 'P21' AND position($o$LINA'S NOTE: "The rooftop spire awaits your return for Stage 5."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #5 [F2] P21 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ROOFTOP] — Spire Access$o$, $n$[ADMIN BUILDING] — Central Archive$n$))) WHERE code = 'P21' AND position($o$[ROOFTOP] — Spire Access$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #8 [F3] P05 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "IDENTITY RECONSTRUCTED. THE FIRST FRAGMENT AWAITS."$o$, $n$Terminal: "IDENTITY RECONSTRUCTED. ONE NAME, TWO ENTRIES. THE FIRST FRAGMENT AWAITS."$n$))) WHERE code = 'P05' AND position($o$Terminal: "IDENTITY RECONSTRUCTED. THE FIRST FRAGMENT AWAITS."$o$ in metadata #>> '{storyReveal}') > 0;
-- T1 #9 [F4] P17 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Find the fifth glyph in the library reading room. It is ⍟."$o$, $n$LINA'S NOTE: "The fifth glyph is in the library reading room, but the way there is written under this stage. Copper tape on the basement pillar. Zigzag. Read it before you leave."$n$))) WHERE code = 'P17' AND position($o$LINA'S NOTE: "Find the fifth glyph in the library reading room. It is ⍟."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #10 [F4] P17 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[LIBRARY] — Reading Room Fifth Symbol$o$, $n$[SCIENCE BUILDING] — Auditorium Basement Archive$n$))) WHERE code = 'P17' AND position($o$[LIBRARY] — Reading Room Fifth Symbol$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #11 [F5] P23 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Ascend the external spiral staircase to the communications antenna deck."$o$, $n$LINA'S NOTE: "The cabinet hums because the vent behind it is warm. Open the vent before you climb anything."$n$))) WHERE code = 'P23' AND position($o$LINA'S NOTE: "Ascend the external spiral staircase to the communications antenna deck."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #12 [F5] P23 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ENGINEERING BLOCK] — Antenna Deck$o$, $n$[ENGINEERING BLOCK] — Robotics Bay 1 Maintenance Vent$n$))) WHERE code = 'P23' AND position($o$[ENGINEERING BLOCK] — Antenna Deck$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #13 [F6] P24 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Descend to the server room cooling corridor. Data streams flood the terminal."$o$, $n$LINA'S NOTE: "They sat me down on this deck and asked the same four questions. The recording room is behind the console."$n$))) WHERE code = 'P24' AND position($o$LINA'S NOTE: "Descend to the server room cooling corridor. Data streams flood the terminal."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #14 [F6] P24 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ENGINEERING BLOCK] — Cooling Corridor$o$, $n$[ENGINEERING BLOCK] — Antenna Deck Interrogation Room$n$))) WHERE code = 'P24' AND position($o$[ENGINEERING BLOCK] — Cooling Corridor$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #15 [F7] P27 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Enter the cyber-physical research chamber. The fragment cylinder glows on its pedestal."$o$, $n$LINA'S NOTE: "Before the chamber, the debug console. Its trace is wrong in one place. Find it before you touch the cylinder."$n$))) WHERE code = 'P27' AND position($o$LINA'S NOTE: "Enter the cyber-physical research chamber. The fragment cylinder glows on its pedestal."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #16 [F7] P27 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ENGINEERING BLOCK] — Research Chamber$o$, $n$[ENGINEERING BLOCK] — Architecture Lab Debug Console$n$))) WHERE code = 'P27' AND position($o$[ENGINEERING BLOCK] — Research Chamber$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #17 [F7] P27b locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: The vault holds the next key.$o$, $n$LINA'S NOTE: "Patched. Now the chamber. The fragment cylinder glows on its pedestal. Do not rush it."$n$))) WHERE code = 'P27b' AND position($o$LINA'S NOTE: The vault holds the next key.$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #18 [F7] P27b locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[ENGINEERING BLOCK] — Vault Delta Door Frame$o$, $n$[ENGINEERING BLOCK] — Research Chamber$n$))) WHERE code = 'P27b' AND position($o$[ENGINEERING BLOCK] — Vault Delta Door Frame$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T1 #19 [F8] P35 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Entity voice: "NOW YOU ARE READY. PROCEED TO P36."$o$, $n$Entity voice: "NOW YOU ARE READY. THE OBSERVATION DECK IS OPEN."$n$))) WHERE code = 'P35' AND position($o$Entity voice: "NOW YOU ARE READY. PROCEED TO P36."$o$ in metadata #>> '{storyReveal}') > 0;
-- T1 #20 [F8] P35 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "The GM watches and will now guide you."$o$, $n$LINA'S NOTE: "My handwriting ends here. What speaks next has my habits, not my hand."$n$))) WHERE code = 'P35' AND position($o$LINA'S NOTE: "The GM watches and will now guide you."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T1 #21 [F8] P35 observer.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{observer,dataPayload}', to_jsonb(replace(content #>> '{observer,dataPayload}', $o$CONFIRMATION: "Do you agree$o$, $n$You saw it all: nothing here was filed, it was run. Stopping it erases what you saw; letting it run keeps writing it.
CONFIRMATION: "Do you agree$n$))) WHERE code = 'P35' AND position($o$CONFIRMATION: "Do you agree$o$ in content #>> '{observer,dataPayload}') > 0;
-- T1 #22 [F8] P35 analyst.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{analyst,dataPayload}', to_jsonb(replace(content #>> '{analyst,dataPayload}', $o$CONFIRMATION: "Do you agree$o$, $n$You bound the evidence: the design needs three minds and cannot be copied. Whatever is decided, nobody else can decide it for you.
CONFIRMATION: "Do you agree$n$))) WHERE code = 'P35' AND position($o$CONFIRMATION: "Do you agree$o$ in content #>> '{analyst,dataPayload}') > 0;
-- T1 #23 [F8] P35 operator.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{operator,dataPayload}', to_jsonb(replace(content #>> '{operator,dataPayload}', $o$CONFIRMATION: "Do you agree$o$, $n$You act: whatever the three of you decide, yours is the hand that enters it.
CONFIRMATION: "Do you agree$n$))) WHERE code = 'P35' AND position($o$CONFIRMATION: "Do you agree$o$ in content #>> '{operator,dataPayload}') > 0;
-- T1 #24 [F9] P36 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$GM voice: "You have seen the game. Now you must defeat it."$o$, $n$GM voice: "You have seen the game. Now decide what it was for."$n$))) WHERE code = 'P36' AND position($o$GM voice: "You have seen the game. Now you must defeat it."$o$ in metadata #>> '{storyReveal}') > 0;
-- T1 #25 [F9] P37 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$GM voice: "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING."$o$, $n$Entity voice: "NOTHING WAS DEFEATED. THREE OF YOU AGREED. THAT IS ALL I EVER WAS."$n$))) WHERE code = 'P37' AND position($o$GM voice: "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING."$o$ in metadata #>> '{storyReveal}') > 0;
-- T1 #26 [F9] P37 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$It was the mirror.

GAME COMPLETE.$o$, $n$It was the mirror.

What three minds do with the truth is not recorded.

GAME COMPLETE.$n$))) WHERE code = 'P37' AND position($o$It was the mirror.

GAME COMPLETE.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$It was the mirror.

GAME COMPLETE.$o$, $n$It was the mirror.

What three minds do with the truth is not recorded.

GAME COMPLETE.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$It was the mirror.

GAME COMPLETE.$o$, $n$It was the mirror.

What three minds do with the truth is not recorded.

GAME COMPLETE.$n$))) WHERE code = 'ENDING-CERTIFICATE';
-- T1 #27 [F10] P06 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$Binary sequence: 01001001 01001100 01001001 01001001 01001110. Decoded: "ILILINE". Hmm, that seems wrong. Try 01001001 01001100 01001001 01001110.$o$, $n$Rack LED log, copied by hand. Margin, in pencil: "Not a word. A reading."$n$))) WHERE code = 'P06' AND position($o$Binary sequence: 01001001 01001100 01001001 01001001 01001110. Decoded: "ILILINE". Hmm, that seems wrong. Try 01001001 01001100 01001001 01001110.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$Binary sequence: 01001001 01001100 01001001 01001001 01001110. Decoded: "ILILINE". Hmm, that seems wrong. Try 01001001 01001100 01001001 01001110.$o$, $n$Rack LED log, copied by hand. Margin, in pencil: "Not a word. A reading."$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$Binary sequence: 01001001 01001100 01001001 01001001 01001110. Decoded: "ILILINE". Hmm, that seems wrong. Try 01001001 01001100 01001001 01001110.$o$, $n$Rack LED log, copied by hand. Margin, in pencil: "Not a word. A reading."$n$))) WHERE code = 'EVID-P06';
-- T1 #32 [F17] P02 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$October 14, 2024$o$, $n$October 17, 2024$n$))) WHERE code = 'P02' AND position($o$October 14, 2024$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$October 14, 2024$o$, $n$October 17, 2024$n$) WHERE code = 'EVID-P02';
-- T1 #33 [F17] P02 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$Clock manually set to 21:47 for synchronization event."$o$, $n$Clock manually set to 21:47 to hold the moment of the synchronization event. — N. Rahal, Facilities."$n$))) WHERE code = 'P02' AND position($o$Clock manually set to 21:47 for synchronization event."$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$Clock manually set to 21:47 for synchronization event."$o$, $n$Clock manually set to 21:47 to hold the moment of the synchronization event. — N. Rahal, Facilities."$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$Clock manually set to 21:47 for synchronization event."$o$, $n$Clock manually set to 21:47 to hold the moment of the synchronization event. — N. Rahal, Facilities."$n$))) WHERE code = 'EVID-P02';
-- T1 #34 [F20] P28 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$The entire architecture has been deployed into the minds of Candidate 01. The answer to P29 will explain what NEXUS truly is.$o$, $n$The entire architecture has been deployed into the minds of Candidate 01: one who reads, one who binds, one who acts. Subject 05 was me. The next file will explain what NEXUS truly is.$n$))) WHERE code = 'P28' AND position($o$The entire architecture has been deployed into the minds of Candidate 01. The answer to P29 will explain what NEXUS truly is.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$The entire architecture has been deployed into the minds of Candidate 01. The answer to P29 will explain what NEXUS truly is.$o$, $n$The entire architecture has been deployed into the minds of Candidate 01: one who reads, one who binds, one who acts. Subject 05 was me. The next file will explain what NEXUS truly is.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$The entire architecture has been deployed into the minds of Candidate 01. The answer to P29 will explain what NEXUS truly is.$o$, $n$The entire architecture has been deployed into the minds of Candidate 01: one who reads, one who binds, one who acts. Subject 05 was me. The next file will explain what NEXUS truly is.$n$))) WHERE code = 'CASE-LV07';
-- T1 #36 [F6] P24b evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$contradicted by the camera maintenance log (power-down at 04:15).$o$, $n$contradicted by the camera maintenance log (power-down at 04:15). He countersigned the incident report on Prof. Carter's authority anyway. Someone needed Dr. Vey placed in the east lab.$n$))) WHERE code = 'P24b' AND position($o$contradicted by the camera maintenance log (power-down at 04:15).$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$contradicted by the camera maintenance log (power-down at 04:15).$o$, $n$contradicted by the camera maintenance log (power-down at 04:15). He countersigned the incident report on Prof. Carter's authority anyway. Someone needed Dr. Vey placed in the east lab.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$contradicted by the camera maintenance log (power-down at 04:15).$o$, $n$contradicted by the camera maintenance log (power-down at 04:15). He countersigned the incident report on Prof. Carter's authority anyway. Someone needed Dr. Vey placed in the east lab.$n$))) WHERE code = 'EVID-P24b';
-- T1 #38 [F19] P29 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "Step to the Core Declassification Vault behind reinforced blast doors."$o$, $n$LINA'S NOTE: "The file is open. The door behind it is Vault Delta Core. Bring the fragment."$n$))) WHERE code = 'P29' AND position($o$LINA'S NOTE: "Step to the Core Declassification Vault behind reinforced blast doors."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F4] P17b storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: TIME IS A MEASURE, NOT A DESTINATION.$o$, $n$Terminal: "TIME IS A MEASURE, NOT A DESTINATION."$n$))) WHERE code = 'P17b' AND position($o$Terminal: TIME IS A MEASURE, NOT A DESTINATION.$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F4] P17b locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: The reading room holds the next truth. Seek the fifth glyph carved in wood.$o$, $n$LINA'S NOTE: "The reading room holds the next truth. Seek the fifth glyph, and leave the clocks alone."$n$))) WHERE code = 'P17b' AND position($o$LINA'S NOTE: The reading room holds the next truth. Seek the fifth glyph carved in wood.$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F5] P23b storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: VENT SEAL DISENGAGED. ACCESS RESTORED.$o$, $n$Terminal: "VENT SEAL DISENGAGED. ACCESS RESTORED."$n$))) WHERE code = 'P23b' AND position($o$Terminal: VENT SEAL DISENGAGED. ACCESS RESTORED.$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F6] P24 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$But three people filtering the noise only need to hold a fraction each. Proceed to the optics lab.$o$, $n$But three people filtering the noise only need to hold a fraction each. The page is torn below this line.$n$))) WHERE code = 'P24' AND position($o$But three people filtering the noise only need to hold a fraction each. Proceed to the optics lab.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$But three people filtering the noise only need to hold a fraction each. Proceed to the optics lab.$o$, $n$But three people filtering the noise only need to hold a fraction each. The page is torn below this line.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$But three people filtering the noise only need to hold a fraction each. Proceed to the optics lab.$o$, $n$But three people filtering the noise only need to hold a fraction each. The page is torn below this line.$n$))) WHERE code = 'EVID-P24';
-- T2 [F6] P24b locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: Descend to the server room cooling corridor. Data streams flood the terminal.$o$, $n$LINA'S NOTE: "One of them lied about a camera. Follow the noise down to the server room cooling corridor."$n$))) WHERE code = 'P24b' AND position($o$LINA'S NOTE: Descend to the server room cooling corridor. Data streams flood the terminal.$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F6] P24b storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: CONTRADICTION LOGGED. THE NOISE CANAL IS EXPOSED.$o$, $n$Terminal: "CONTRADICTION LOGGED. THE NOISE CHANNEL IS EXPOSED."$n$))) WHERE code = 'P24b' AND position($o$Terminal: CONTRADICTION LOGGED. THE NOISE CANAL IS EXPOSED.$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F6] P24b observer.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{observer,dataPayload}', to_jsonb(replace(content #>> '{observer,dataPayload}', $o$AUDIO TRANSCRIPT:

DR. VALE$o$, $n$AUDIO TRANSCRIPT (REC-19, 18/10/2024):

DR. VALE$n$))) WHERE code = 'P24b' AND position($o$AUDIO TRANSCRIPT:

DR. VALE$o$ in content #>> '{observer,dataPayload}') > 0;
-- T2 [F7] P27b storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: TRACE CORRECTED. MEMORY RESTORED.$o$, $n$Terminal: "TRACE CORRECTED. MEMORY RESTORED."$n$))) WHERE code = 'P27b' AND position($o$Terminal: TRACE CORRECTED. MEMORY RESTORED.$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F9] P36 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$The answer is the name of this game, in the format of an acronym.$o$, $n$The answer is the name of the system, which is also the name of this game.$n$))) WHERE code = 'P36' AND position($o$The answer is the name of this game, in the format of an acronym.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$The answer is the name of this game, in the format of an acronym.$o$, $n$The answer is the name of the system, which is also the name of this game.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$The answer is the name of this game, in the format of an acronym.$o$, $n$The answer is the name of the system, which is also the name of this game.$n$))) WHERE code = 'EVID-P36';
-- T2 [F10] P06 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "The library basement contains a server rack with blinking binary LEDs."$o$, $n$LINA'S NOTE: "The 1974 plan shows a decommissioned security office under the library. Someone has put a server rack in it. The LEDs are not decoration."$n$))) WHERE code = 'P06' AND position($o$LINA'S NOTE: "The library basement contains a server rack with blinking binary LEDs."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F10] M01 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$LINA'S NOTE: "The library basement holds the next stage. Descend the east stairwell."$o$, $n$LINA'S NOTE: "The library holds the next stage. Start at the stack reference desk. The basement comes after."$n$))) WHERE code = 'M01' AND position($o$LINA'S NOTE: "The library basement holds the next stage. Descend the east stairwell."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F10] M01 locationClue.nextPhysicalLocation
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,nextPhysicalLocation}', to_jsonb(replace(metadata #>> '{locationClue,nextPhysicalLocation}', $o$[LIBRARY] — Basement East Stairwell$o$, $n$[LIBRARY] — Stack Reference Desk$n$))) WHERE code = 'M01' AND position($o$[LIBRARY] — Basement East Stairwell$o$ in metadata #>> '{locationClue,nextPhysicalLocation}') > 0;
-- T2 [F12] P04 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$Initial: V.$o$, $n$Initial: V. Four review sessions logged in 2021; against the last, 01 Dec: "Subject 00 withdrawn."$n$))) WHERE code = 'P04' AND position($o$Initial: V.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$Initial: V.$o$, $n$Initial: V. Four review sessions logged in 2021; against the last, 01 Dec: "Subject 00 withdrawn."$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$Initial: V.$o$, $n$Initial: V. Four review sessions logged in 2021; against the last, 01 Dec: "Subject 00 withdrawn."$n$))) WHERE code = 'EVID-P04';
-- T2 [F15] P31 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$simultaneously agree.$o$, $n$simultaneously agree. Last line on the page, underlined twice: "Eat something, all three of you."$n$))) WHERE code = 'P31' AND position($o$simultaneously agree.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$simultaneously agree.$o$, $n$simultaneously agree. Last line on the page, underlined twice: "Eat something, all three of you."$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$simultaneously agree.$o$, $n$simultaneously agree. Last line on the page, underlined twice: "Eat something, all three of you."$n$))) WHERE code = 'EVID-P31';
-- T2 [F16] P33 observer.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{observer,dataPayload}', to_jsonb(replace(content #>> '{observer,dataPayload}', $o$ANALYZER: All 30 stages converge into single principle.$o$, $n$ANALYZER: Every answer you carried here converges into a single principle.$n$))) WHERE code = 'P33' AND position($o$ANALYZER: All 30 stages converge into single principle.$o$ in content #>> '{observer,dataPayload}') > 0;
-- T2 [F20] P28 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$FRAGMENT 05 STORED$o$, $n$FRAGMENT 5 STORED$n$))) WHERE code = 'P28' AND position($o$FRAGMENT 05 STORED$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F21] P18 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "PASSWORDS MATCH. THE SIXTH SYMBOL REMAINS."$o$, $n$Terminal: "PASSWORDS MATCH. SHE NEVER CHANGED THE CODE. THE SIXTH SYMBOL REMAINS."$n$))) WHERE code = 'P18' AND position($o$Terminal: "PASSWORDS MATCH. THE SIXTH SYMBOL REMAINS."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F21] P20 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Stage 2→3 Transition Clue$o$, $n$Stage 3 Closing Clue$n$))) WHERE code = 'P20' AND position($o$Stage 2→3 Transition Clue$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Stage 2→3 Transition Clue$o$, $n$Stage 3 Closing Clue$n$) WHERE code = 'EVID-P20';
-- T2 [F21] P20 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$The answer 2147 is not just a number — it is also 17:47 in a different base. Keep this in mind for the rooftop.$o$, $n$2147 is not just a number. It is the lobby clock's 21:47 with the colon taken out; the rack's 17:47 is its shadow. Keep both.$n$))) WHERE code = 'P20' AND position($o$The answer 2147 is not just a number — it is also 17:47 in a different base. Keep this in mind for the rooftop.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$The answer 2147 is not just a number — it is also 17:47 in a different base. Keep this in mind for the rooftop.$o$, $n$2147 is not just a number. It is the lobby clock's 21:47 with the colon taken out; the rack's 17:47 is its shadow. Keep both.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$The answer 2147 is not just a number — it is also 17:47 in a different base. Keep this in mind for the rooftop.$o$, $n$2147 is not just a number. It is the lobby clock's 21:47 with the colon taken out; the rack's 17:47 is its shadow. Keep both.$n$))) WHERE code = 'EVID-P20';
-- T2 [F22] P25 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$In 2021, Candidate 00 tried to ingest all 2000 bytes at once. His mental stack overflowed. But three people filtering the noise, each only needs to hold a fraction.$o$, $n$Page 64. Candidate 00 read the noise as a message. It is not a message. It is the load. The skill is knowing which row to read, and for that you need something you carried from the beginning.$n$))) WHERE code = 'P25' AND position($o$In 2021, Candidate 00 tried to ingest all 2000 bytes at once. His mental stack overflowed. But three people filtering the noise, each only needs to hold a fraction.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$In 2021, Candidate 00 tried to ingest all 2000 bytes at once. His mental stack overflowed. But three people filtering the noise, each only needs to hold a fraction.$o$, $n$Page 64. Candidate 00 read the noise as a message. It is not a message. It is the load. The skill is knowing which row to read, and for that you need something you carried from the beginning.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$In 2021, Candidate 00 tried to ingest all 2000 bytes at once. His mental stack overflowed. But three people filtering the noise, each only needs to hold a fraction.$o$, $n$Page 64. Candidate 00 read the noise as a message. It is not a message. It is the load. The skill is knowing which row to read, and for that you need something you carried from the beginning.$n$))) WHERE code = 'EVID-P25';
-- T2 [F23] P11 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$Look under seat 42."$o$, $n$Look under seat 42: nobody ever sat there, so nobody ever looked. It holds a chart, not an answer."$n$))) WHERE code = 'P11' AND position($o$Look under seat 42."$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F23] P12 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$Grants access to the Science Building research labs.$o$, $n$Grants access to the Science Building research labs. Holder line: CANDIDATE 01 — NOT YET ISSUED. Taped to the back, in pencil: "Lost this twice. Third time is someone else's problem. — L."$n$))) WHERE code = 'P12' AND position($o$Grants access to the Science Building research labs.$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$Grants access to the Science Building research labs.$o$, $n$Grants access to the Science Building research labs. Holder line: CANDIDATE 01 — NOT YET ISSUED. Taped to the back, in pencil: "Lost this twice. Third time is someone else's problem. — L."$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$Grants access to the Science Building research labs.$o$, $n$Grants access to the Science Building research labs. Holder line: CANDIDATE 01 — NOT YET ISSUED. Taped to the back, in pencil: "Lost this twice. Third time is someone else's problem. — L."$n$))) WHERE code = 'EVID-P12';
-- T2 [F23] P07 evidenceUnlocked.content
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,content}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,content}', $o$network state."$o$, $n$network state." Oversight signature: Dr. A. Vale.$n$))) WHERE code = 'P07' AND position($o$network state."$o$ in metadata #>> '{evidenceUnlocked,content}') > 0;
UPDATE evidence SET description = replace(description, $o$network state."$o$, $n$network state." Oversight signature: Dr. A. Vale.$n$), content = jsonb_set(content, '{text}', to_jsonb(replace(content->>'text', $o$network state."$o$, $n$network state." Oversight signature: Dr. A. Vale.$n$))) WHERE code = 'EVID-P07';
-- T2 [F24] M04 analyst.dataPayload
UPDATE puzzle_nodes SET content = jsonb_set(content, '{analyst,dataPayload}', to_jsonb(replace(content #>> '{analyst,dataPayload}', $o$All seven cognitive operations verified. Authorize Fragment 5.$o$, $n$All seven cognitive operations verified. Operators of record: three. Machine contribution: none. Authorize Fragment 5.$n$))) WHERE code = 'M04' AND position($o$All seven cognitive operations verified. Authorize Fragment 5.$o$ in content #>> '{analyst,dataPayload}') > 0;
-- T2 [F24] M04 locationClue.clueText
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}', to_jsonb(replace(metadata #>> '{locationClue,clueText}', $o$The midnight hour approaches.$o$, $n$The hour approaches.$n$))) WHERE code = 'M04' AND position($o$The midnight hour approaches.$o$ in metadata #>> '{locationClue,clueText}') > 0;
-- T2 [F26] P22 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Lab Notebook Fragment #51$o$, $n$Lab Notebook Page #51$n$))) WHERE code = 'P22' AND position($o$Lab Notebook Fragment #51$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Lab Notebook Fragment #51$o$, $n$Lab Notebook Page #51$n$) WHERE code = 'EVID-P22';
-- T2 [F26] P24 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Lab Notebook Fragment #58$o$, $n$Lab Notebook Page #58$n$))) WHERE code = 'P24' AND position($o$Lab Notebook Fragment #58$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Lab Notebook Fragment #58$o$, $n$Lab Notebook Page #58$n$) WHERE code = 'EVID-P24';
-- T2 [F26] P25 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Lab Notebook Fragment #64$o$, $n$Lab Notebook Page #64$n$))) WHERE code = 'P25' AND position($o$Lab Notebook Fragment #64$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Lab Notebook Fragment #64$o$, $n$Lab Notebook Page #64$n$) WHERE code = 'EVID-P25';
-- T2 [F26] P27 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Lab Notebook Fragment #72$o$, $n$Lab Notebook Page #72$n$))) WHERE code = 'P27' AND position($o$Lab Notebook Fragment #72$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Lab Notebook Fragment #72$o$, $n$Lab Notebook Page #72$n$) WHERE code = 'EVID-P27';
-- T2 [F26] P31 evidenceUnlocked.title
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{evidenceUnlocked,title}', to_jsonb(replace(metadata #>> '{evidenceUnlocked,title}', $o$Lab Notebook Fragment #81$o$, $n$Lab Notebook Page #81$n$))) WHERE code = 'P31' AND position($o$Lab Notebook Fragment #81$o$ in metadata #>> '{evidenceUnlocked,title}') > 0;
UPDATE evidence SET title = replace(title, $o$Lab Notebook Fragment #81$o$, $n$Lab Notebook Page #81$n$) WHERE code = 'EVID-P31';
-- T2 [F27] P20 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "SYMBOLS UNIFIED. THE FINAL STAGE AWAITS."$o$, $n$Terminal: "SYMBOLS UNIFIED. SEVEN FUNCTIONS, ONE WIRING DIAGRAM. THE WINDOW IS NEXT."$n$))) WHERE code = 'P20' AND position($o$Terminal: "SYMBOLS UNIFIED. THE FINAL STAGE AWAITS."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P14 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "MEMORY ACCESS GRANTED. THE ARCHIVE EXPANDS."$o$, $n$Terminal: "MEMORY ACCESS GRANTED. THE FIRST FRAGMENT WAS A KEY, NOT A CLUE. SYMBOL TWO IS OUTSIDE."$n$))) WHERE code = 'P14' AND position($o$Terminal: "MEMORY ACCESS GRANTED. THE ARCHIVE EXPANDS."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P31 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "MEMORY BANKS SYNCED. ACCESS GRANTED TO FINAL VAULT."$o$, $n$Terminal: "MEMORY BANKS SYNCED. THREE RECALLS, ONE RECORD. THE VAULT IS OPEN."$n$))) WHERE code = 'P31' AND position($o$Terminal: "MEMORY BANKS SYNCED. ACCESS GRANTED TO FINAL VAULT."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P33 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "CONVERGE ACCEPTED. FINAL STAGE INITIATED."$o$, $n$Terminal: "CONVERGE ACCEPTED. THE KEY WAS A VERB. THREE OF YOU, ONE POINT."$n$))) WHERE code = 'P33' AND position($o$Terminal: "CONVERGE ACCEPTED. FINAL STAGE INITIATED."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P34 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "SEQUENCE COMPLETE. FINAL ENTITY ENTRY DETECTED."$o$, $n$Terminal: "SEQUENCE COMPLETE. SOMETHING HAS ENTERED THE HUB. IT IS WAITING FOR ALL THREE OF YOU."$n$))) WHERE code = 'P34' AND position($o$Terminal: "SEQUENCE COMPLETE. FINAL ENTITY ENTRY DETECTED."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P12 storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Terminal: "SEAT VERIFIED. THE FINAL ARCHIVE KEY IS REVEALED."$o$, $n$Terminal: "SEAT VERIFIED. SHE LEFT A KEY WHERE ONLY SHE WOULD SIT."$n$))) WHERE code = 'P12' AND position($o$Terminal: "SEAT VERIFIED. THE FINAL ARCHIVE KEY IS REVEALED."$o$ in metadata #>> '{storyReveal}') > 0;
-- T2 [F27] P06b storyReveal
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}', to_jsonb(replace(metadata #>> '{storyReveal}', $o$Clock: "TIME RESTORED. ACCESS GRANTED."$o$, $n$Clock: "TIME RESTORED. THE DRAWER IS UNLOCKED."$n$))) WHERE code = 'P06b' AND position($o$Clock: "TIME RESTORED. ACCESS GRANTED."$o$ in metadata #>> '{storyReveal}') > 0;

-- ----------------------------------------------------------------------------
-- Answer keys
-- ----------------------------------------------------------------------------
UPDATE puzzle_nodes
   SET answer_metadata = jsonb_set(answer_metadata, '{acceptedAnswer}', '"CONVERGE"')
 WHERE code = 'P33' AND answer_metadata->>'acceptedAnswer' = 'CONVERGENCE';

UPDATE puzzle_nodes
   SET answer_metadata = jsonb_set(answer_metadata, '{acceptedAnswer}', '"D"')
 WHERE code = 'P34' AND answer_metadata->>'acceptedAnswer' = 'C';

-- CONVERGE is eight letters. The node and the node before it said seven.
UPDATE puzzle_nodes
   SET content = replace(replace(replace(replace(content::text,
         '7-letter', '8-letter'),
         '7 letters', '8 letters'),
         '[ _ _ _ _ _ _ _ ]', '[ _ _ _ _ _ _ _ _ ]'),
         '= 10 letters. Too long by 3', '= 11 letters. Too long by 3')::jsonb,
       metadata = replace(replace(metadata::text, '7 letters', '8 letters'), '7-letter', '8-letter')::jsonb,
       answer_metadata = replace(answer_metadata::text, '7-letter', '8-letter')::jsonb
 WHERE code IN ('P32', 'P33')
   AND (content::text LIKE '%7 letter%' OR content::text LIKE '%7-letter%' OR content::text LIKE '%= 10 letters%'
        OR metadata::text LIKE '%7 letter%' OR answer_metadata::text LIKE '%7-letter%');

UPDATE evidence
   SET description = replace(description, '7 letters', '8 letters'),
       content = replace(content::text, '7 letters', '8 letters')::jsonb
 WHERE code = 'EVID-P32' AND (description LIKE '%7 letters%' OR content::text LIKE '%7 letters%');

-- ----------------------------------------------------------------------------
-- Pacing: breathing room at the stage boundaries, and reading made a team act
-- ----------------------------------------------------------------------------
UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}',
    to_jsonb((metadata #>> '{locationClue,clueText}') || ' Walk it slowly and talk through what you have learned.'))
 WHERE code = 'M03' AND position('Walk it slowly' in metadata #>> '{locationClue,clueText}') = 0;

UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{storyReveal}',
    to_jsonb((metadata #>> '{storyReveal}') || ' THREE OPERATORS ENTER. NONE LEAVE THE SAME.'))
 WHERE code = 'M04' AND position('THREE OPERATORS ENTER' in metadata #>> '{storyReveal}') = 0;

UPDATE puzzle_nodes SET metadata = jsonb_set(metadata, '{locationClue,clueText}',
    to_jsonb((metadata #>> '{locationClue,clueText}') || ' The way there is long. Use it: share what the last hour cost you.'))
 WHERE code = 'M04' AND position('The way there is long' in metadata #>> '{locationClue,clueText}') = 0;

UPDATE puzzle_nodes SET content = jsonb_set(content, '{observer,taskPrompt}',
    to_jsonb((content #>> '{observer,taskPrompt}') || ' Play each clip aloud, or have each teammate read one speaker''s lines.'))
 WHERE code = 'P24b' AND position('Play each clip aloud' in content #>> '{observer,taskPrompt}') = 0;

UPDATE puzzle_nodes SET content = jsonb_set(content, '{observer,taskPrompt}',
    to_jsonb((content #>> '{observer,taskPrompt}') || ' Read the trace aloud, line by line, to your Analyst.'))
 WHERE code = 'P27b' AND position('Read the trace aloud' in content #>> '{observer,taskPrompt}') = 0;

UPDATE puzzle_nodes SET content = jsonb_set(content, '{narrativeObjective}',
    to_jsonb('Open-air stop: look around before you deduce. ' || (content #>> '{narrativeObjective}')))
 WHERE code = 'P19' AND position('Open-air stop' in content #>> '{narrativeObjective}') = 0;

UPDATE puzzle_nodes SET content = jsonb_set(content, '{narrativeObjective}',
    to_jsonb((content #>> '{narrativeObjective}') || ' Take a moment together before the meta.'))
 WHERE code = 'P21' AND position('Take a moment together' in content #>> '{narrativeObjective}') = 0;

