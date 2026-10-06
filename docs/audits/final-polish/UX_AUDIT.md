# NEXUS ECHO — Game UX Audit

Repo `/home/user/AtastNexusEcho-work`, read-only, repo-relative paths. Another agent is editing `QR.tsx`, `PlayerLayout.tsx` and a new sound layer (`SoundProvider`, `lib/audio/cues.ts`), so re-grep lines there. `rounded-*` and `shadow-*` are neutralised globally (`globals.css:775-795`), so they are not findings.

## 0. What matters most

1. **The solve moment is a UUID toast plus a 2 s flash.** `Node.tsx:150` prints `Next: <uuid>` (the RPC returns `nextNodeId` as a UUID), and `:157-159` navigates after 2000 ms, so `storyReveal` is never readable.
2. **A solved node cannot be reopened.** `get_player_node_detail` returns `{unlocked:false}` unless AVAILABLE or IN_PROGRESS (`2026100302…sql:41-48`), so `useGameEngine.ts:234` returns `null` and a revisit reads "Nothing filed here… withdrawn". The same fall-through hides network failure (`:226-229`) and locked nodes, so "Node Locked" (`Node.tsx:318`) is dead.
3. **The ending is unreachable.** `ROUTES.PLAYER_FINAL` is linked from nowhere. Solving P37 shows "Node P37 solved!" and returns to a hub that offers P37 again; no RPC sets the team COMPLETED.
4. **Final and Complete show hard-coded zeros.** `AppProvider.tsx:427,440-442` sets `hintsUsed:0`, `evidenceOwned:[]`, `inventoryOwned:{}`, `fragmentsOwned:[]`.
5. **Story fields are delivered but never rendered.** `locationClue`, `evidenceUnlocked` and `narrativeObjective` arrive pre-solve and are shown nowhere. The latest `submit_puzzle_answer` (`2026093014`) no longer grants `evidence_owned` (only superseded `2026092902:843-866` did); verify the Evidence tab fills before saying "filed".

## 1. SYSTEM LANGUAGE

Risk: L = low; M = keep wording plain; H = player must understand what to do.

| file:line | current | proposed | risk |
|---|---|---|---|
| `components/layout/Layout.tsx:16` | Loading… | OPENING FILE… | L |
| `RequireAuth.tsx:17`, `RequireAdmin.tsx:18` | Loading session… / Checking permissions… | RESUMING FIELD SESSION… / VERIFYING CLEARANCE… | L |
| `RouteError.tsx:17,23` | Something went wrong loading this screen. / Reload | This screen did not load. Check your signal, then reload. / RELOAD | M |
| `app/router/index.tsx` (no `*` route) | 404 falls into RouteError | NO SUCH RECORD. This address is not in the case file. / RETURN TO CASE | L |
| `Login.tsx:93,298` | "Invalid logic code format…" shows after the first keystroke | Show at full length or on blur: CODE INCOMPLETE — 8 CHARACTERS | M |
| `Login.tsx:87`, `AppProvider.tsx:288,364`, `player-login/index.ts:70` | Login failed. Please try again. / An unexpected error occurred / Too many login attempts… | NO LINK TO THE BUREAU. Check signal and re-enter the code. / TOO MANY ENTRIES. Wait a few minutes. | H |
| `Node.tsx:205,218,229` | Invalid Node / LOADING INVESTIGATION NODE… / INVESTIGATION BLOCKED | NO SUCH LEAD / OPENING LEAD… / NO ANSWER FROM THE BUREAU (keep "Try again", `:239`) | M |
| `Node.tsx:257-260` | Nothing filed here… may have been withdrawn | By cause: "No link. This lead did not load." / "NOT YET ISSUED. Close the open lead first." / solved: the reveal (§3) | H |
| `Node.tsx:294,358,361,367,386,414,417,451,461,469` | Node: P01 · Mission Brief / Your Task · Team Coordination / Investigation Protocol / Recovery Note / If stuck · Node Complete / RETURN TO FIELD HUB · Node Locked (dead) | LEAD P01 · ON THE FLOOR / YOUR PART · WHO HOLDS WHAT / OPERATOR'S FILE / FIELD NOTE / If the entry is rejected: · see §3 / RETURN TO CASE · NOT YET ISSUED | L |
| `Node.tsx:342,345` | figure title = raw `visualType` slug (`three-phone`, `final-boss`; fallback "Data Feed", ~92 of 141 role blocks) / "Visual readout" | `EXHIBIT {code}`; drop the eyebrow | L |
| `Node.tsx:424,432,436` | Acquired Hints / Hint 1: / Penalty: -2 minutes | FROM THE DESK / DESK NOTE 1 (hint) / +2 min on your clock | M |
| `Node.tsx:573-601` | Request Hint 1 of 3 · -2min · "subtract 2 minutes from your final score" · Request / Discard | ASK THE DESK FOR HINT 1 OF 3 · +2 MIN · "The desk will answer. 2 minutes are added to your clock." · ASK / HOLD OFF. The server adds time, not score. | H |
| `Node.tsx:556` | CORRECT / INCORRECT | ACCEPTED / REJECTED (matches `Final.tsx:289`) | L |
| `Node.tsx:144,150,152` | toasts: "No signal — answer queued…", "Node P01 verified. Next: <uuid>", "Node P37 solved!" | Delete all three (inline text and banner already cover the first; see §3) | L |
| `Node.tsx:112,164,190` | Failed to load node / Submission failed / Failed to get hint | The Bureau did not take that. Try again. | M |
| Server strings (`2026093014`, `game-use-hint/index.ts:48,51`) | Rate limited. Please wait… / Node not accessible / Game not active / No team found for player / Hint already used | One client `humanizeError()`: Too many entries. Wait one minute. / This lead is not open to your team. / The case is not open. / This handset has no team. See the Bureau. / The desk has already answered. | H |
| Notification inserts `2026092902:905,983,1091,1217,1246`, `2026093014:207`, `bureau-operations/index.ts:1523` | Puzzle Solved / Your team has solved this puzzle. · QR Code Scanned · Hint Used · Node Unlocked · Node Reset · Emergency Hint | LEAD CLOSED / Your unit closed a lead. · MARKER READ · DESK CONSULTED / N minutes added to the clock. · LEAD ISSUED · DESK NOTE (BUREAU-ISSUED). New migration. | M |
| `Notifications.tsx:18-23` | Low / Normal / High / Critical | ROUTINE / (no stamp) / PRIORITY / URGENT | M |
| `Notifications.tsx:119,122`; aria "RETURN TO FIELD" (Node, QR, Inventory, Leaderboard, Final); `BottomNav.tsx:40,47`; `PlayerHeader.tsx:54` | aria and visible text disagree (`Open {title}` vs [ MARK READ ]; "RETURN TO FIELD" vs hub label CASE; "Online" vs LINKED) | aria starts with the visible words; [ ACKNOWLEDGE ]; "Return to case" | L |
| `OfflineBanner.tsx:126,139,168` | SUBMITTED / 2 queued answers delivered. / OK | TRANSMITTED / 2 held answers sent. Open the lead for the verdict. / NOTED. "Delivered" is not "accepted". | M |
| `QR.tsx:504,621` | FIELD MARKER ACQUIRED (shown on failure too) / Verify Code | MARKER READ / MARKER NOT RECOGNISED / MARKER SEALED by result; READ CODE | L |
| `QR.tsx:410,634` | "Simulation mode…" / "In simulation, use QR-NODE-02 or 037-A-4821" | Remove from the player build (show only if `isQASimulation`) | L |
| `useGameEngine.ts:371,382` | ACCESS DENIED. The system recognizes the marker… sealed. (also for unknown code and network failure) | Unknown: NO MATCH. This code is not in the case file. Network: NO LINK. Try again. Keep "sealed" only for `discovered:false` with no error. | H |
| `Inventory.tsx:91-92,137-138,176` | Item {code} / Recovered investigation equipment / Inventory / SYNCHRONIZING… | OBJECT {code} / Recovered object. Not yet described. / OBJECT REGISTER / READING THE REGISTER… | L |
| `Leaderboard.tsx:77,83,85,96,148-157` | Your Team / Rank: #3 / pts / Leaderboard / No rankings available | YOUR UNIT / STANDING 3 / SCORE / FIELD RECORD / NO UNITS ON RECORD; Trophy glyphs (`:92`, `Complete.tsx:153`) become Flag | L |
| `CustomNotificationModal.tsx:102,236,250,266`; `TeamCreationWizard.tsx:229` | Send Notification / "Important Update" / "Server maintenance at 18:00 UTC" / Create Team | Transmit dispatch / "Move to the Library. 40 minutes remain." / Register field unit (keep the tooling; success banner `:122` uses the Alert glyph) | L |

## 2. State communication (IDLE → INTERACTING → PROCESSING → SUCCESS / FAILURE)

Players cannot switch roles: the role is server-assigned (`2026100302`) and only the QA hub calls `setRole`. Role shows as a static profile card (`Node.tsx:301`).

**QR scanner.**
- Offline start sets `INSECURE_CONTEXT` (`QR.tsx:211`): "SECURE CHANNEL REQUIRED".
- `REQUESTING_CAMERA` renders two overlays (`:435`, `:473`) and offers REACQUIRE (`:336`).
- The reader keeps scanning after a result (`:274`); the same code is blocked for 3 s only (`:204`).
- Manual entry has no PROCESSING state, and the field clears on submit (`:304`), so a failed code is lost.
- The result header says "ACQUIRED" on failure; success links to the hub, not the node (`:557`).

**Answer submission.**
- PROCESSING is good. A wrong answer is only a stamp in a list below the fold, with the input cleared; the `refuse` and `verify` cues exist but are not wired here.
- `attemptNumber` is unused. Attempt 2 scores half and attempt 3 zero (`2026093014`), and the player is never told.
- A queued answer shows QUEUED, but nothing updates after the flush: `useGameEngine.ts:430-431` discards `results[].isCorrect`, the banner says "delivered", and the Node screen stays stale.

**Hint.** The confirm panel closes at once (`:588`) with no busy state. The result renders above the form (`:424`), off-screen from the thumb; errors render under the answer input (`:505`). `setHints([])` on load (`:107`) loses a paid hint on leaving.

**Evidence open, mark, compare, place.** The strongest area. Gaps:
- The refresh button has no busy state (`EvidenceArchive.tsx:383`).
- A failed fetch is swallowed (`useGameEngine.ts:173`) and reads as "ARCHIVE EMPTY".
- Workspace save failures are silent (`investigationWorkspace.ts:264,277`); PLACE / ON TABLE (`Inventory.tsx:262`) versus ADD TO BOARD (`ArtifactInspection.tsx:443`).

**Offline queue.** Shown in three places (header, banner, bottom strip); the verdict is missing. `Final.tsx:61` refuses offline instead of queuing.

**Notifications.** `[ MARK READ ]` is local-only (`AppProvider.tsx:461`); the 30 s poll restores it to unread. ACKNOWLEDGE ALL marks read locally even when the server call failed (`:503-510`).

**Navigation.** `window.location.href` (`Navigation.tsx:73`) forces a full reload, the most website-like act in the app.

## 3. Success, failure and discovery

**What the client receives.** After a solve the client holds only the pre-solve payload.
- `get_player_node_detail` delivers `storyReveal`, `locationClue{clueText,nextPhysicalLocation,nextQrNode}`, `evidenceUnlocked{title,source,content}` and `narrativeObjective` while the node is open.
- The submit result carries `isCorrect`, `pointsAwarded`, `attemptNumber` and a UUID `nextNodeId`, and **none** of the story fields. Afterwards the node returns `unlocked:false`, so the story cannot be re-read. The next location and QR code are also visible in the network tab before the solve.
- `nexus_redact_answer` swaps a whole string for `[ sealed ]` when it contains the answer; that can surface in these fields.
- Fix: `submit_puzzle_answer` returns `reveal{storyReveal, clueText, nextPhysicalLocation, evidenceTitle, evidenceSource}`; remove those fields pre-solve; let SOLVED nodes return the reveal; use `[ REDACTED ]`.

**Incident-solved screen** (`Node.tsx:448-474`; no toast, no timer, button exit):
```
[stamp: VERIFIED]
{storyReveal}            Facade terminal: "ACCESS GRANTED. PROCEED TO ARCHIVE WING."
NEW MATERIAL: {evidenceUnlocked.title} — {source}      (only if the RPC really files it)
{locationClue.clueText}  LINA'S NOTE: "From the facade, walk through the main doors…"
NEXT: {nextPhysicalLocation}
[ RETURN TO CASE ]
```
**Hub at next lead** (`Game.tsx:94-107`): eyebrow `NEW LEAD · STAGE 2`; `note` is `locationClue.clueText` until opened, then `narrative.observation`; show the unused `narrativeObjective` on the card.

**Wrong answer.** A `role="status"` line under the input, "The terminal rejects the entry. Attempt 2.", with the `refuse` cue. **Hint reveal.** The note appears above the hint button, scrolled into view, "DESK NOTE 1 · +2 MIN on your clock", with the `hint` cue.

## 4. Final sequence P33–P37

Now:
- P33–P36 use the ordinary Node screen, each ending in the UUID toast and a hub bounce.
- P35: observer and analyst read `Do you agree to proceed… (Y/N)` with no control. The Operator types `AGREE` into the usual field, and any one player can pass, so "all three confirm simultaneously" is copy only.
- P37 (answer `NEXUS`): the reveal `CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING.` and `ENDING-CERTIFICATE` are never shown.
- `Final.tsx` is an unlinked web form (title, zero checklist, "SUBMIT SOLUTION"); a *correct* answer is listed under "Previous Attempts" as "Rejected" (`:67` pushes before checking `isCorrect`).
- `Complete.tsx`: MISSION COMPLETE, hard-coded "Case 037", "EVIDENCE VERIFIED" = solved/total, MISSION TIME runs to *now*, TRANSMIT REPORT is a social-post share.

Copy and data edits:
- P35 observer and analyst: `Say it to the Operator: "I agree."` Operator: `All three have spoken. Enter the word.`
- P37 observer and analyst: `THE RECORD ADDRESSES YOU. Read it aloud to the Operator.`
- `Final.tsx`: THE LAST ENTRY; locked text `THE LAST ENTRY IS SEALED. {n} leads remain open.`; delete "Required Components"; ENTRY / FILE ENTRY; "Time Critical" becomes `The window on this case is closing.`; CASE CLOSED / `The last entry was accepted.`
- `Complete.tsx`: CASE 037 — CLOSED with `The Bureau has taken the file from {team.name}.` plus the P37 `storyReveal`; UNIT FILED; LEADS CLOSED; TIME ON CASE (frozen at the solve); DESK CONSULTATIONS; drop the ARTIFACTS and ITEMS rows until the data is real; VIEW FIELD RECORD / COPY CASE SUMMARY / CLOSE DEVICE (confirm before logout).

Behavioural edits: after a correct P37 show the reveal, then go to Complete; give `Game.tsx` a Complete action when `closed`; fix `Final.tsx:67` and handle `queued`; populate `AppProvider.tsx:440-442` from `getInventory` or hide the rows; mark the team COMPLETED in the RPC.

## 5. Over-animation, dashboard patterns, dead UI

Effects are restrained: no glow, strobe or confetti. Real items:
- `DiscoveryToast.tsx` is the one SaaS-pattern component left: pill with an X, **no auto-dismiss**, all toasts stacked at one fixed position.
- Spinners at `Node:217,525`, `Waiting:50,110`, `Final:259`, `Notifications:71`: use the blinking block from `Login.tsx:121`.
- `Waiting.tsx:136-152`, three stat tiles: "Team" and "Role" repeat the header and panel, and "Slot 3h" is hard-coded (`:145`).
- `Navigation.tsx`: "Quick Access" (`:276`) and the no-op `handleNodeHover` (`:76`).
- `Node.tsx:591` uses `nexus-btn-warning`, which has no CSS.
- Dead UI: locked panel (`Node.tsx:318`), solved-flag icon (`:314`), Final's Required Components, `QR.tsx:267`, three connection indicators.

## 6. Ranked fixes (C = pure copy, safe; B = behavioural)

1. **B** `Node.tsx:147-159`: drop the UUID toast and auto-navigate; render the §3 solved screen.
2. **B** `useGameEngine.ts:221-237`: return `failed | locked | solved | ok`, not `null`.
3. **B** `submit_puzzle_answer` (new migration): return `reveal{…}`, serve it for SOLVED, remove story fields pre-solve.
4. **B** Correct P37 goes to Complete; `Game.tsx:109` links it when `closed`; the RPC marks COMPLETED.
5. **B** Link `PLAYER_FINAL` after P36, or delete it and let P37 be the ending.
6. **B** `Final.tsx:67`: push only rejected attempts; handle `queued`.
7. **B** `AppProvider.tsx:427,440-442`: populate or hide the rows.
8. **B** `useGameEngine.ts:430`: pass `results` to the banner ("x accepted, y rejected").
9. **B** `AppProvider.tsx:461,503`: persist mark-read; no local read-all on server failure.
10. **B** `Node.tsx:424-443`: hint note beside the button, busy state, kept across loads.
11. **B** `Node.tsx`: inline rejection line with attempt number; wire the `refuse` and `verify` cues.
12. **B** `QR.tsx:211,336,435`: OFFLINE state; one overlay; no retry while requesting.
13. **B** `QR.tsx:274,304`: freeze the reader on a result; keep the manual code on failure.
14. **B** `Navigation.tsx:73`: `navigate()`; remove the no-op hover.
15. **B** `router/index.tsx`: add a `*` route.
16. **B** `Login.tsx:93,298`: validate on blur or at full length.
17. **B** `Game.tsx:77,132`: expired-timer line, "The window on this case has closed."
18. **B** `EvidenceArchive.tsx:383`, `useGameEngine.ts:173`: failed fetch is not "empty"; refresh busy state.
19. **B** `DiscoveryToast.tsx`: delete or time it out; replace spinners; delete the `Waiting.tsx:136-152` tiles.
20. **C** `Node.tsx:573-601`: "time on your clock", not "final score".
21. **C** `Node.tsx:342-345`, `:556`, `:358-417`: drop the slug and "Data Feed"; ACCEPTED / REJECTED; label wording (§1).
22. **C** `useGameEngine.ts:371,382`: split unknown, network, sealed.
23. **C** `QR.tsx:410,504,557,621,634`: remove simulation text; result-based header; READ CODE.
24. **C** `Final.tsx`, `Complete.tsx`, P35/P37 role text in the node seed: §4 copy.
25. **C** `OfflineBanner.tsx:126,139,168`: TRANSMITTED, no verdict implied.
26. **C** One `humanizeError()` for server strings; `Login.tsx:87`, `AppProvider.tsx:288,364`: "no link" versus "bad code".
27. **C** `RouteError.tsx`, `Layout.tsx:16`, `RequireAuth.tsx:17`, `RequireAdmin.tsx:18`; `Waiting.tsx:95-130` (Game in progress / Live / Enter Game become Case open / OPEN / OPEN CASE FILE).
28. **C** New migration: notification titles and messages; `[ sealed ]` becomes `[ REDACTED ]`.
29. **C** `Notifications.tsx:18-23,119,122`, `Inventory.tsx`, `Leaderboard.tsx`, and aria mismatches (§1).
30. **C** Admin: `CustomNotificationModal.tsx:102,122,236,250,266`, `TeamCreationWizard.tsx:229`.
