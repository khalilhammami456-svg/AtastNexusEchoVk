# NEXUS ECHO - Production Cleanup Audit

Repo `/home/user/AtastNexusEcho-work`. Read-only audit, no tracked file touched. Baseline verified: `tsc --noEmit` clean, `tsc` with `noUnusedLocals/Parameters` clean, `eslint . --max-warnings 0` clean, `vitest run` 58 files / 800 tests pass, `dist/` inspected (local build of 2026-10-06, gitignored).

NOTE: another agent is mid-work in the tree (modified `main.tsx`, `providers/index.ts`, `PuzzleVisual.tsx`, `Accessibility.tsx`, `AudioView.tsx`; untracked `src/lib/audio/`, `SoundProvider.tsx`, `Transmission.tsx`, `scripts/audio/`, `sound-engine.test.ts`). I treat all of that as in-flight and exclude it from findings.

## 1. Marker grep (TODO/FIXME/HACK/XXX/TEMP/DEBUG/MOCK/PLACEHOLDER/WIP)

Raw regex gives 72 hits in src/supabase/scripts/public/root. **Zero are real TODO/FIXME/HACK debt.** Classification:

| Hits | Verdict |
|---|---|
| ~58x `TEMPORAL` (src/lib/investigationWorkspace.ts, evidence/clues.ts, tests, scripts/evidence-gen/library.mjs, public/evidence/manifest.json) | KEEP, false positive (relationship kind enum) |
| `ATTEMPT_LIMIT/MAX_LOGIN_ATTEMPTS` (domain.ts, schemas.ts, 2 login migrations, security.test.ts), `TIME_LIMIT` | KEEP, false positive |
| `src/tests/evidence-series.test.ts:39` `'31 XXX 94'`, `qr-pipeline.test.ts:281` `XXXXXXXX` | KEEP, intentional invalid-input fixtures |
| `src/content/puzzles/index.ts:511` + 3 migrations "Architecture Lab - Debug Console" | KEEP, in-fiction location name |
| `src/app/providers/AppProvider.tsx:554` comment "receive mock data" | KEEP, documents the QA simulator delegation |
| `src/lib/supabase/client.ts:20-21` `placeholder.supabase.co` / `placeholder-key` fallback | NEEDS-DECISION: a prod build with missing env vars silently talks to a fake host after a console.warn. Prefer fail-fast/visible error screen in prod. |
| `migrations/2026093025_player_device_identity.sql` "placeholder" fingerprint (`pending:`+UUID) | KEEP, designed mechanism |
| `migrations/2026100309...sql:73` `pg_temp` | KEEP, false positive (search_path hardening) |
| `scripts/evidence-gen/lib/paper.mjs:383` "not a placeholder box" | KEEP, comment |
| `eslint.config.js:14` "Debug decoders left in the repo root" | dev residue, goes away with item 8 |
| `PuzzleVisual.tsx:521-527` `placeholder` loop variable; ~40 HTML `placeholder=` attrs; `vi.mock` in tests | KEEP, false positives |
| `.env.example`, `vercel.json`, `index.html`, `tailwind.config.ts` | no hits |

## 2. Debug exposure in production bundles

| Item | Verdict |
|---|---|
| `src/lib/devAdminBypass.ts` | KEEP, **not reachable in prod**. Gate is `import.meta.env.DEV === true` as a default parameter, plus localStorage flag. Verified in `dist/assets/index-CI88AlQf.js`: `function Wn(e=!1){if(e!==!0)return!1;...}` and the only call site (`AdminProvider.tsx:53`) calls `Wn()` with no argument, so it always returns false. Even if forced true it only yields a client-side plain ADMIN with no session, and every edge function still verifies the JWT. Cosmetic residue: literals `nexus_dev_admin`, `DEV OPERATOR`, `dev-admin` remain in the prod index chunk because the param form blocks tree-shaking. Optional hardening: early `if (!import.meta.env.DEV) return false` so Rollup drops them. |
| `src/harness/*` (6 files) + `{board,compare,glyphs,inspect,player,vfx}-harness.html` | Untracked, **not in git**: excluded only via `.git/info/exclude` (local, not shared). `vite build` has a single entry (`index.html`), `dist/` contains no harness. NEEDS-DECISION: add `src/harness/` and `*-harness.html` to `.gitignore` (or move to a tracked `tools/`), otherwise a fresh clone/CI differs from this machine (e.g. `tsc` typechecks them only locally). |
| `showcaseCatalog` (`src/lib/evidence/showcaseCatalog.ts`) | `showcaseEnabled()` = `import.meta.env.DEV`, folded to `false` in prod, so showcase records never display. BUT `assetLibrary.generated.ts` still ships: `dist/assets/showcaseCatalog-Z8XD81zQ.js` (44 KB, full NX-037 fake-case dataset) is a shared chunk imported by player `Evidence`, admin `Login`, `Workstation`, `index`. Cause: module-level `new Map(GENERATED_ASSETS.map(...))` (line 1558) is not provably pure. NEEDS-DECISION (recommended fix): mark `/*#__PURE__*/` or build the map lazily, or load the catalog via `if (import.meta.env.DEV) await import(...)`. |
| `public/evidence/**` (66 thumbs/images, 7.2 MB, + `manifest.json` 64 KB) | Copied to `dist/evidence` and served publicly. Only 5 files are referenced outside dev (`evidenceLabCatalog.ts:35-39`, used by QA simulator/Lab fallback). The other ~60 files + manifest.json (lists clues/relationships) are dev showcase only. NEEDS-DECISION: serve only in dev / move out of `public/`. |
| `EvidenceLab.tsx:61` falls back to `buildDevelopmentCatalog()` (fake `EVID-001...` records) when the live API fails, **in production too**, with a visible "DEVELOPMENT FALLBACK DATA" banner. NEEDS-DECISION: show an error instead of fake rows in prod. |
| M-12 "EVIDENCE ARCHIVE" (`apps.ts:65`, `WindowBody.tsx:73`, `EvidenceShowcase.tsx`) | Registered in the production workstation, but its data is dev-only, so it opens empty in prod. NEEDS-DECISION: hide from `APP_ORDER` unless `showcaseEnabled()`. |
| QA Simulator (M-09 `QAHub.tsx`, `QAPlayerShell.tsx`, `QAViewer`, `qaDummyContext.ts`, `contexts/QASimulatorContext.tsx`) | Reachable in prod, **not DEV-guarded**, but only through `admin/*` -> `RequireAdmin` -> Workstation (any ADMIN, not only SUPER_ADMIN). Provider is mounted only inside QAHub; no player route can set `qaContext.isActive`, so players cannot reach it. Code is in lazy chunks. KEEP if staff use it on event day; NEEDS-DECISION whether to restrict to SUPER_ADMIN. The QA branches in `useApp`, `useGameEngine`, `QR.tsx` ship in player chunks (size only). |
| Test routes / debug panels / overlays | None. Router has no test routes. Only `import.meta.env.DEV` uses: devAdminBypass, showcaseCatalog, `PuzzleVisual.tsx:701` (console.warn, dev only). |
|`vite.config.ts:25` `build.sourcemap: true` | NEEDS-DECISION: 47 `.map` files, 7.0 MB, are deployed publicly (full TS source incl. QA/admin code). Use `'hidden'` or off unless needed for error tracking. |
| `vercel.json` | KEEP: CSP/XFO/nosniff/Referrer-Policy present, `script-src 'self'` (no inline scripts), `connect-src` limited to `*.supabase.co`. Gaps (minor): no HSTS header (Vercel adds on its domains), `style-src 'unsafe-inline'`. |
| Root tracked junk | See item 8: `decode.cjs`, `decode_crash.cjs`, `decode_sourcemap.cjs`, `reproduce_crash.cjs`, `crash_screenshot.png` - SAFE-TO-REMOVE (no references; `reproduce_crash.cjs` hardcodes `C:\Program Files\Google\Chrome`, decoders point at stale `dist/assets/vendor-Dpze96Sf.js.map`). Not shipped in `dist/` since Vite ignores root files. |

## 3. console.* audit

`console.log/debug/info/trace`: none in src or supabase/functions. `debugger`: none. Only `scripts/brand/build.ts:116` and `scripts/audio/normalize.mjs` (CLI output, KEEP). No stripping configured (`esbuild.drop` unset), acceptable since all are error-path.

**src (24, all KEEP, intentional error/warn reporting):** `RouteError.tsx:11`; `useGameEngine.ts:173,186,199,226,394`; `AppProvider.tsx:118,127,205,244,363,384,411,457,494,508`; `AdminProvider.tsx:95,154,173`; `supabase/client.ts:13` (missing-env warning; see item 1). Only `PuzzleVisual.tsx:704` is dev-only (inside `import.meta.env.DEV`).

**supabase/functions (~45, all KEEP):** every `Unhandled error in <fn>` / `<rpc> error` in game-*.ts, admin-check, player-login (66,101,153,179), bureau-operations (128,202,205,333,336,453,1563,1704,1742,1870,1916,1967,2067). Server-side logs only.

PII/secret check: none log access codes, tokens, passwords, fingerprints or request bodies. Details: `encryptLoginCode` failures log only `err`/`cipherError.message` (never the code); provisioning logs `reason` string only; team UUIDs appear in `Reset failed for team ${t.id}` (not PII). Low-risk caveat (NEEDS-DECISION, optional): `player-login/index.ts:101` logs the raw PostgREST `loginError` object, which can carry `details` with row values (e.g. a unique-violation on the device fingerprint hash); log `loginError.code/message` instead.

## 4. Dependencies (no upgrades)

| Package | Finding |
|---|---|
| `gsap` | **SAFE-TO-REMOVE.** Only importer is `src/hooks/useAnimation.ts`, reachable only from the unimported barrel `components/visual/index.ts`. Not in `dist` (no gsap chunk). 6.4 MB install. Also drop the dead `gsap` branch in `vite.config.ts` manualChunks. |
| `zod` | NEEDS-DECISION. Only `src/lib/validation/schemas.ts` (713 lines), imported by `validation/index.ts`, which only `tests/validation.test.ts` imports. Not in the prod bundle (`utils` chunk is clsx + tailwind-merge, 20 KB). Either delete schemas+test+dep, or move `zod` to devDependencies. |
| `jspdf` ^4.2.1 | KEEP. Lazy via `await import('jspdf')` in `src/lib/qr-download.ts:81`; separate 390 KB chunk, plus on-demand `html2canvas` (202 KB, optional jsPDF dep never invoked) and `index.es` (canvg) chunks. Not on initial load. |
| `jsqr`, `qrcode` | KEEP, both dynamically imported (`QR.tsx:29`, `FieldMarker.tsx:46`, `qr-download.ts:78`). Different roles (decode vs encode). |
| `@fontsource/*` x4 | KEEP, imported from `src/styles/fonts.css`. |
| `clsx`, `tailwind-merge` | KEEP, `lib/utils` `cn()` (used widely). No duplicate-functionality pairs found. |
| `puppeteer` (dev) | SAFE-TO-REMOVE with root junk: sole user `reproduce_crash.cjs`. |
| `source-map` (dev) | SAFE-TO-REMOVE with `decode*.cjs`. |
| `sharp` (dev) | KEEP (evidence-gen, brand build, screenshots). Heavy native; dev only, fine. |
| `@testing-library/dom`, `jsdom`, `@types/node`, `autoprefixer`, `postcss` | KEEP (peer dep / vitest env / vite.config / postcss.config). |
| Missing/undeclared | NEEDS-DECISION: `playwright-core` (used by `scripts/screenshots/capture.mjs`, resolved from `/opt/node-tools`), `vite-node` (used by `evidence:registry/lock`, only transitive via vitest), `@vitest/ui` (script `test:ui` is broken without it). |
| Orphan configs | NEEDS-DECISION: `.oxlintrc.json` (oxlint not installed), `.prettierrc` (prettier not installed), `tsconfig.app.json` (referenced by nothing; `tsconfig.json` is what `tsc` uses). |

## 5. Assets

All 163 `public/` files checked by stem against src, supabase, scripts, index.html (static and string-pattern references; DB seed counts).

- `public/audio/*.mp3` (12): all KEEP, referenced by `supabase/migrations/2026093035_audio_evidence_integration.sql` and `2026093036_fix_p17_audio_url.sql` (and `evidence-gen/library.mjs`). 1.9 MB.
- `public/evidence/**`: referenced via `assetLibrary.generated.ts` and `manifest.json`; none unreferenced. Shipping question handled in item 2.
- `public/brand/` (17): KEEP as a generated brand kit (`scripts/brand/build.ts`); only `apple-touch-icon.png` is linked by `index.html`. `icon-192.png`, `icon-512.png`: NEEDS-DECISION, zero references (no web manifest). `public/brand/favicon.svg` is byte-identical to `public/favicon.svg` (the only one linked): SAFE-TO-REMOVE or leave as kit output.
- `src/` contains no image/audio/font/json assets (only the generated `.ts` library). `scripts/evidence-gen/fonts/Caveat-Regular.ttf` KEEP (used by build).
- `src/index.css` and `src/styles/variables.css`: **SAFE-TO-REMOVE**, self-declared legacy/not imported; 0 usages of `var(--color-*)` outside variables.css.

## 6. Dead code

Scan: reachability from `main.tsx` (static + dynamic imports) and per-export reference counts over src+scripts, with tests counted separately.

SAFE-TO-REMOVE (no importer anywhere, tests included):
- `src/components/admin/ConnectionStatus.tsx` (90 lines)
- `src/components/auth/index.ts` (barrel, unimported; guards imported directly)
- `src/components/visual/index.ts`, `EvidenceSurface.tsx`, `PaperTexture.tsx`, `src/hooks/useAnimation.ts` (the whole gsap chain)
- Unused exports (no importer in prod or tests), by file: `app/config` (all but `ROUTES`: `APP_CONFIG, STORAGE_KEYS, QUERY_KEYS, REALTIME_CHANNELS, ROLE_COLORS, PLAYER_STATUS_COLORS, DIFFICULTY_LABELS, LOCATION_STATUSES`); `content/campus` `CAMPUS_BOUNDS, getPOIsForBuilding, locationFromNode`; `content/constants` `STAGE_GROUPS, SUBMISSION_RATE_LIMIT_WINDOW_MS, ANTI_SPAM_COOLDOWN_SECONDS, DEFAULT_GAME_DURATION_MINUTES, LOGIN_CODE_TTL_MINUTES`; `lib/utils` `formatPercent, randomInt, createEventEmitter, sanitizeHtml`; `lib/time` `formatDateTimeFull, debounce, throttle`; `useNarrative` `useArtifactAnomaly, HORROR_ATTRIBUTE`; `lib/qr` `getBuildingName, manualCodeForLocation, formatQRPayload, formatPayloadForDisplay, validateToScanResult`; `offlineQueue.clearQueue`; `team-readiness` `getMissingRoles, getPlayerByRole, canAssignRole`; `evidence/types` `isDegraded, isFlagged, isPlayable, isVisual`; `showcaseCatalog` `showcaseByCode, showcaseTypeCounts`; `StatusBadge.TeamPhaseBadge`, `ConnectionStatus` badges. (`lib/audio/*` is in-flight work, excluded.) knip/depcheck are not installed; run knip as follow-up for the remaining type-only exports.

NEEDS-DECISION (test-only code, i.e. would take its tests with it): `src/lib/validation/*` (zod, 713+ lines), `src/lib/content/validation.ts` (tests: game-engine.test.ts), many `lib/utils`/`lib/time` helpers kept alive only by `utils.test.ts`/`time.test.ts` (`slugify, lerp, shuffleArray, groupBy, deepClone, isEqual, omit, pick, parseQueryString, ...`), `lib/auth` `generateLoginCode, validateLoginCodeFormat, createDeviceBinding`, `team-readiness`/`team-state-machine` helpers.

Duplicates/overlap: three admin evidence UIs (`EvidenceLab.tsx`, `EvidenceShowcase.tsx`, `EvidenceShowcaseOverlay.tsx`) share models; consolidate after deciding item 2.

Obsolete tests: none skipped (`.skip/.only/.todo` = 0). Weak/tautological: `security.test.ts` builds its own session objects and asserts on them (does not exercise `AppProvider`); `bottom-nav.test.tsx`, `evidence-archive-thumbs.test.tsx` import nothing via `@/` (verify they test real code).

## 7. Config audit

- **Secrets:** none committed. Scanned working tree and history (`eyJ`, `sb_`, `service_role`, PEM, `ghp_/AKIA/sk-`, password/token literals): only hit is the `.env.example` placeholder JWT header `eyJhbGciOi...YOUR_ANON_KEY_HERE` (history: 1 commit). `SUPABASE_SERVICE_ROLE_KEY` appears only in Deno edge functions via `Deno.env.get`. NEEDS-DECISION (minor): replace that JWT-looking placeholder with `your-anon-key` so secret scanners stay quiet.
- **env vars:** code reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (+ `import.meta.env.DEV`). `VITE_APP_NAME`, `VITE_APP_VERSION`, `VITE_APP_ENV`, `VITE_ENABLE_DEV_TOOLS` are declared in `.env.example` and `src/vite-env.d.ts` but **never read**: `VITE_ENABLE_DEV_TOOLS=false` gives false assurance (PRODUCTION_DEPLOYMENT.md sec 2.2 and checklist rely on it). README lists a further `VITE_ENABLE_MOCK_DATA` that exists nowhere else. NEEDS-DECISION: delete the dead variables from .env.example, vite-env.d.ts, README and deployment doc. `.env.example` header also mentions non-VITE `SUPABASE_URL/ANON_KEY` and `BUREAU_EMAIL/PASSWORD` (unused anywhere).
- **Edge function env:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` only; login-code cipher key is derived from the service-role key (`_shared/loginCodeCipher.ts:39`), so rotating that key invalidates stored ciphertexts: undocumented in docs/deployment. CORS is `Access-Control-Allow-Origin: *` in all functions: NEEDS-DECISION (restrict to prod origin).
- **.gitignore:** covers node_modules, dist, .env*, tsbuildinfo, logs, .vercel (listed twice). Issues: final `.env*` also matches `.env.example` (tracked only because it was force-added; use `!.env.example`); harness files rely on `.git/info/exclude` (see item 2); no entry for `coverage` beyond `coverage/` (fine). `video/` has its own `.gitignore` for `node_modules/`, `out/`, `public/shots/` (verified ignored).
- **tsconfig:** `strict`, `noUnusedLocals/Parameters`, `noFallthroughCasesInSwitch` on. `tsconfig.app.json` is orphaned. `tsconfig.node.json` `composite` has no consumer (no `tsc -b`). OK.
- **package.json scripts:** `test:ui` broken (missing `@vitest/ui`); `lint` uses `--ext`, a flag flat config ignores (still passes); `build` = `tsc && vite build` OK.
- **Docs drift:** `AGENTS.md` says 478 tests / 27 files (actual 800 / 58). `README.md` says Tailwind v4 (project uses 3.4), "Placeholder screens", env table above. `docs/deployment/PRODUCTION_DEPLOYMENT.md` mentions Docker (`docker build`, no Dockerfile), pnpm (lockfile is npm), `supabase hosting upload` (not a real command), while `vercel.json` is the real target; no `supabase/config.toml` in repo.

## 8. Root clutter and docs sprawl

Root has 25 tracked `.md` (about 300 KB) plus `crash_screenshot.png`, 4 `.cjs`, and 6 untracked harness HTML files. Also: `.agents/` and `.aider-desk/` are byte-identical copies (37 files each, vendored ElevenLabs skills; `skills-lock.json` points at them) and `.kilo/kilo.jsonc` is a 3-line stub: NEEDS-DECISION, keep at most one. `video/nexus-echo-teaser/.agents` (279 files) and `.claude` (12) are vendored Remotion skills inside the kept video project. Tracked repo is 57 MB; `docs/evidence-screenshots` is ~25 MB of regenerable PNGs (`scripts/screenshots/capture.mjs`): NEEDS-DECISION.

**Hard references found (must be handled before moving):**
1. `scripts/evidence-gen/registry.ts:22` writes `EVIDENCE_ASSET_REGISTRY.md` at root, and `npm run evidence:lock` checks it. Move requires editing `MD_PATH`, then `npm run evidence:registry`, then `evidence:lock`. Line 36 also embeds the string `ARCHITECTURE_NOTES.md` into the generated file.
2. Comment-only refs: `src/styles/fonts.css` -> `NEXUS_ECHO_DESIGN_SYSTEM.md`; `src/components/brand/glyphs.tsx` -> `NEXUS_ECHO_ICON_GUIDELINES.md`.
3. Docs cross-reference each other by bare filename (backticks), e.g. `TEASER_STORY_BIBLE.md` cites most root docs. Fix with `git grep -l` + sed after moving; no test or script reads them.
4. `AGENTS.md` and `README.md` stay at root (tooling and GitHub convention). Nothing else in `package.json`, tests, or CI reads root docs.
5. Root `TEASER_SPOILER_MAP.md` and `TEASER_STORY_BIBLE.md` are byte-identical to `video/nexus-echo-teaser/` copies (video README references those). Root `TEASER_SHOT_LIST.md` is stale (from old `timeline.json`; the video copy is regenerated from `timeline2.json`). `NEXUS_ECHO_TEASER_SCRIPT.md` has no video counterpart and is stale output of `video/.../scripts/docs.mjs`.

**Step A - SAFE-TO-REMOVE (no references):**
```
git rm crash_screenshot.png decode.cjs decode_crash.cjs decode_sourcemap.cjs reproduce_crash.cjs
git rm TEASER_SPOILER_MAP.md TEASER_STORY_BIBLE.md TEASER_SHOT_LIST.md
# then: drop '*.cjs' ignore + debug-decoder comment in eslint.config.js; remove puppeteer, source-map from devDependencies
```
**Step B - NEEDS-DECISION (stale teaser script):** `git rm NEXUS_ECHO_TEASER_SCRIPT.md` or `git mv NEXUS_ECHO_TEASER_SCRIPT.md video/nexus-echo-teaser/docs/`.

**Step C - tidy structure (docs/ already has architecture, brand, deployment, development, event, evidence):**
```
mkdir -p docs/audits docs/brand docs/evidence
git mv ARCHITECTURE_NOTES.md SYSTEM_ARCHITECTURE_AUDIT.md docs/architecture/
git mv SECURITY_AUDIT.md FINAL_BUG_AUDIT.md GAME_SCOPE_AUDIT.md MOBILE_GAME_AUDIT.md MOBILE_UI_UX_AUDIT.md \
       EVIDENCE_ECOSYSTEM_AUDIT.md EVIDENCE_IMPLEMENTATION_AUDIT.md docs/audits/
git mv EVIDENCE_MATRIX.md EVIDENCE_REFERENCE_NOTES.md EVIDENCE_SHOWCASE.md docs/evidence/
git mv EVIDENCE_ASSET_REGISTRY.md docs/evidence/        # also edit scripts/evidence-gen/registry.ts:22 + :36, rerun evidence:registry && evidence:lock
git mv NEXUS_ECHO_BRAND_BOOK.md NEXUS_ECHO_BRAND_MOODBOARD.md NEXUS_ECHO_DESIGN_SYSTEM.md \
       NEXUS_ECHO_ICON_GUIDELINES.md NEXUS_ECHO_MOBILE_DESIGN.md DESIGN_RESEARCH.md docs/brand/
# afterwards: update paths in src/styles/fonts.css and src/components/brand/glyphs.tsx comments, and bare-filename mentions:
git grep -nE '(ARCHITECTURE_NOTES|SECURITY_AUDIT|FINAL_BUG_AUDIT|EVIDENCE_[A-Z_]+|NEXUS_ECHO_[A-Z_]+|DESIGN_RESEARCH|GAME_SCOPE_AUDIT|MOBILE_[A-Z_]+|SYSTEM_ARCHITECTURE_AUDIT)\.md' -- ':!video/node_modules'
```
Result: root keeps `README.md`, `AGENTS.md` and config. Add `docs/README.md` index. Also: `.agents` vs `.aider-desk` duplicate (`git rm -r .aider-desk` if Aider unused).
