# AGENTS.md

## Commands

- **Typecheck**: `npx tsc --noEmit`
- **Tests**: `npx vitest run` (run it for the current count)
- **Lint**: `npm run lint`
- **Database**: `PGHOST=localhost PGUSER=postgres scripts/db/verify-migrations.sh` replays every migration on a throwaway Postgres and runs `supabase/tests/*.sql`
- **Audio**: `npm run audio:check` (recordings must sit at their loudness target)
- **Dev**: `npm run dev`

## Project Structure

- **Player** (handset): `src/features/player/` — mobile-first field device screens
- **Admin** (desktop): `src/features/admin/` — bureau workstation screens
- **Bureau primitives**: `src/components/bureau/` — `TerminalFrame`, `EvidenceBoard`, `DocumentShell`, `RegisterList`, etc.
- **Player primitives**: `src/components/player/` — `BottomNav`, `PlayerHeader`, `OfflineBanner`, `map/`

## Visual Language

- Player = handset (bordered, bezel, safe-area)
- Admin = terminal (boot sequence, register, monitor)
- Shared DNA via `--nx-*` CSS custom properties in `src/styles/globals.css`
