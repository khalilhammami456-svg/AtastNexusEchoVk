# Transition inventory (play order): exact text the player sees when a node completes
storyReveal = shown on the solved screen; clue = metadata.locationClue.clueText (hub lead).

| # | Node | storyReveal (exact) | clueText (exact) | Verdict | Carries |
|---|---|---|---|---|---|
| 1 | P01 | Facade terminal: "ACCESS GRANTED. PROCEED TO ARCHIVE WING." | LINA'S NOTE: "From the facade, walk through the main doors into the Lobby. The first archive alcove is on your left." | WEAK | lead |
| 2 | P02 | Clock terminal: "TIME IS VERIFIED. THE PAST IS UNLOCKED." | LINA'S NOTE: "Proceed to the Main Hall. The central staircase awaits." | OK | question |
| 3 | P03 | Terminal: "PIN ACCEPTED. ARCHIVE ACCESS GRANTED." | LINA'S NOTE: "The archive contains a poster about a 2021 student project. Look at the dates." | WEAK | lead |
| 4 | P04 | Terminal: "LETTER VERIFIED. THE THIRD FIGURE IS REVEALED." | LINA'S NOTE: "Look for the person who is not shown but whose initial completes the name." | WEAK | lead (overstates: third figure not yet revealed) |
| 5 | P05 | Terminal: "IDENTITY RECONSTRUCTED. THE FIRST FRAGMENT AWAITS." | LINA'S NOTE: "The archive has a hidden compartment behind the third frame. Inside is your first fragment." | OK | lead, identity |
| 6 | M01 | Terminal: "META LOCK DISENGAGED. STAGE 2 ACCESS GRANTED." | LINA'S NOTE: "The library basement holds the next stage. Descend the east stairwell." | WEAK | lead; clue/location mismatch (basement vs stack desk) |
| 7 | P06 | Terminal: "PIVOT RECALLED. BINARY GATE UNLOCKED." | LINA'S NOTE: "The library basement contains a server rack with blinking binary LEDs." | WEAK | lead |
| 8 | P07 | Terminal: "TIME SYNC CONFIRMED. PROCEED TO THE ARCHIVE." | LINA'S NOTE: "Return to the archive. Check the 2021 project folder in cabinet 3." | WEAK | lead |
| 9 | P08 | Terminal: "NETWORK PATH CONFIRMED. THE NEXT GATE IS CHRONOLOGICAL." | LINA'S NOTE: "The next room has a clock with Roman numerals. Find 17:00." | WEAK | lead |
| 10 | P09 | Terminal: "TIME DECODED. THE BLUE PATH IS REVEALED." | LINA'S NOTE: "Find the blue-marked door in the corridor. It was hidden behind a tapestry." | WEAK | lead |
| 11 | P10 | Terminal: "LIGHT ACCEPTED. THE SYMBOL IS REVEALED." | LINA'S NOTE: "Look at the wall. One symbol is glowing blue." | WEAK | lead |
| 12 | P11 | Terminal: "ARCHWAY VERIFIED. ACCESS TO THE LECTURE HALL GRANTED." | LINA'S NOTE: "Room 214 — the old lecture hall. Seats face forward. Look under seat 42." | WEAK | location |
| 13 | P12 | Terminal: "SEAT VERIFIED. THE FINAL ARCHIVE KEY IS REVEALED." | LINA'S NOTE: "Under the seat is a keycard. It opens the Research Lab in the Science Building." | WEAK | lead; "FINAL" overstated |
| 14 | P13 | Door: "ACCESS GRANTED. THE LAB IS YOURS TO INVESTIGATE." | LINA'S NOTE: "Inside the lab, find the symbol drawer. The second glyph is marked with a star." | WEAK | location |
| 15 | M02 | Terminal: "NETWORK META VERIFIED. MEMORY TRANSFER INITIATED." | LINA'S NOTE: "Enter the memory lab. The transfer chamber is in the basement." | OK | consequence (memory transfer begins) |
| 16 | P06b | Clock: "TIME RESTORED. ACCESS GRANTED." | LINA'S NOTE: "The symbol drawer is open. Take the glyph key." | WEAK | nothing restored |
| 17 | P07b | Terminal: "CONNECTION ESTABLISHED. THE ARCHIVE DEEPENS." | LINA'S NOTE: "Take the staircase down. Three flights. Stop at the bottom." | WEAK | filler |
| 18 | P14 | Terminal: "MEMORY ACCESS GRANTED. THE ARCHIVE EXPANDS." | LINA'S NOTE: "Find the second symbol on campus. It is near the library entrance." | WEAK | filler |
| 19 | P15 | Terminal: "CIPHER VERIFIED. THE THIRD SYMBOL IS REVEALED." | LINA'S NOTE: "Find the ⧫ symbol on campus. Check the library book return area." | WEAK | symbol count wrong (shows 4th as 3rd) |
| 20 | P16 | Terminal: "COUNT VERIFIED. THE FOURTH SYMBOL IS REVEALED." | LINA'S NOTE: "Behind the auditorium stage, find the fourth glyph carved in wood." | WEAK | symbol count wrong |
| 21 | P17 | Terminal: "ECHO CONFIRMED. THE FIFTH SYMBOL IS FOUND." | LINA'S NOTE: "Find the fifth glyph in the library reading room. It is ⍟." | BROKEN | clue skips P17b |
| 22 | P17b | Terminal: TIME IS A MEASURE, NOT A DESTINATION. | LINA'S NOTE: The reading room holds the next truth. Seek the fifth glyph carved in wood. | WEAK | aphorism, no lead; unquoted |
| 23 | P18 | Terminal: "PASSWORDS MATCH. THE SIXTH SYMBOL REMAINS." | LINA'S NOTE: "Check the campus sculpture garden for the final symbol." | WEAK | symbol count; no symbol found |
| 24 | P19 | Terminal: "ACTION VERIFIED. THE SEVENTH SYMBOL IS REVEALED." | LINA'S NOTE: "The seventh and final symbol is ⎔ — FINALITY. It rests atop the Admin Building dome." | WEAK | "seventh" correct but sixth missing |
| 25 | P20 | Terminal: "SYMBOLS UNIFIED. THE FINAL STAGE AWAITS." | LINA'S NOTE: "Return to the Admin Building main doors. The fourth floor window has a view." | BROKEN | "final stage" wrong: next is Stage 4 |
| 26 | P21 | Terminal: "ARCHIVE ACCESSIBLE. STAGE 3 COMPLETE." | LINA'S NOTE: "The rooftop spire awaits your return for Stage 5." | BROKEN | clue sends to rooftop (Stage 5) from Stage 3 |
| 27 | M03 | Terminal: "SYMBOL SYNTHESIS COMPLETE. THE NEXUS CORE IS REVEALED." | LINA'S NOTE: "Return to the rooftop spire. The final stage begins." | BROKEN | clue sends to rooftop; P22 is Science Building |
| 28 | P22 | System warning: "OLD DATA IS NEVER OBSOLETE. ALL ANSWERS REMAIN CONCURRENT." | LINA'S NOTE: "The robotics lab has autonomous arms in darkness. Find Bay 1." | GOOD | theme: old data returns |
| 29 | P23 | Subject 00 log: "I thought the ciphers were gates. They were mirrors." | LINA'S NOTE: "Ascend the external spiral staircase to the communications antenna deck." | BROKEN | clue skips P23b; revelation line is good |
| 30 | P23b | Terminal: VENT SEAL DISENGAGED. ACCESS RESTORED. | LINA'S NOTE: The antenna deck has data streams flooding the terminal. | WEAK | unquoted; clue repeats data-stream line |
| 31 | P24 | Terminal alert: "CONNECTION CHANNEL RESTORED. HIGH-VOLUME STREAM INCOMING." | LINA'S NOTE: "Descend to the server room cooling corridor. Data streams flood the terminal." | BROKEN | clue skips P24b; evidence says optics lab |
| 32 | P24b | Terminal: CONTRADICTION LOGGED. THE NOISE CANAL IS EXPOSED. | LINA'S NOTE: Descend to the server room cooling corridor. Data streams flood the terminal. | BROKEN | "NOISE CANAL"; unquoted; clue duplicates P24 |
| 33 | P25 | System message: "NOISE PURGED. 3-WAY MIRROR CHANNEL STABILIZED." | LINA'S NOTE: "Ascend to the holographic optics lab on the 1st floor." | OK | lead + consequence |
| 34 | P26 | Hologram activates: "The true reflection is not on glass. It is between three minds." | LINA'S NOTE: "Ascend to the systems architecture lab. Whiteboards map dependency trees." | GOOD | revelation: reflection between three minds |
| 35 | P27 | Terminal: "FOUNDATIONAL STRUCTURE COMPILED. FRAGMENT 5 INITIATED." | LINA'S NOTE: "Enter the cyber-physical research chamber. The fragment cylinder glows on its pedestal." | BROKEN | clue skips P27b |
| 36 | P27b | Terminal: TRACE CORRECTED. MEMORY RESTORED. | LINA'S NOTE: The vault holds the next key. | BROKEN | clue jumps to Vault Delta, skipping the chamber |
| 37 | P28 | HUD: "FRAGMENT 05 STORED IN INVENTORY. THE FINAL TRUTH DRAWS NEAR." | LINA'S NOTE: "Step to the Core Declassification Vault behind reinforced blast doors." | WEAK | "05" vs "5"; "FINAL TRUTH DRAWS NEAR" generic |
| 38 | P29 | Terminal voice: "NOW YOU KNOW WHAT I AM. BUT DO YOU KNOW WHAT YOU ARE?" | LINA'S NOTE: "Step to the Core Declassification Vault behind reinforced blast doors." | GOOD | revelation + question; clue duplicates P28 |
| 39 | M04 | PA System: "SYSTEM PURGE IMMINENT. THE REMAINING TEAMS ARE SUMMONED TO THE CORE." | LINA'S NOTE: "Ascend to the central transmitter spire on the rooftop. The midnight hour approaches." | OK | consequence: purge/summons; title duplicates P22 |
| 40 | P30 | Spire hums: "29 OF 28 SLOTS FILLED. CONSCIOUSNESS SYNCHRONIZED." | LINA'S NOTE: "Descend to the Nexus Core basement. The memory cylinder array awaits." | GOOD | revelation: 29 of 28 slots (you) |
| 41 | P31 | Terminal: "MEMORY BANKS SYNCED. ACCESS GRANTED TO FINAL VAULT." | LINA'S NOTE: "Enter the Final Vault. The GM key awaits." | WEAK | lead only |
| 42 | P32 | GM voice: "NEXUS cannot be defeated by one. It requires all three roles as one." | GM NOTE: "The GM key is 7 letters. Enter it to proceed." | GOOD | consequence: roles as one |
| 43 | P33 | Terminal: "CONVERGE ACCEPTED. FINAL STAGE INITIATED." | LINA'S NOTE: "Enter the Nexus Core central hub. The final truth awaits." | WEAK | "final stage initiated" |
| 44 | P34 | Terminal: "SEQUENCE COMPLETE. FINAL ENTITY ENTRY DETECTED." | LINA'S NOTE: "The entity awaits. All three must agree to proceed." | WEAK | lead only |
| 45 | P35 | Entity voice: "NOW YOU ARE READY. PROCEED TO P36." | LINA'S NOTE: "The GM watches and will now guide you." | BROKEN | node code in fiction ("PROCEED TO P36") |
| 46 | P36 | GM voice: "You have seen the game. Now you must defeat it." | GM NOTE: "The final boss awaits. Only the complete team may enter." | WEAK | "defeat it" contradicts ending |
| 47 | P37 | GM voice: "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING." | The game ends here. No further location. | WEAK | congratulation banner, no consequence |
