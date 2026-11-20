# MVP AlToque: Levels 1, 2 and 3

## Objective
Turn the existing triage base into a complete, demo-ready prototype deployed on Vercel:
Level 1 (guided self-repair with a simulated AI chat), Level 2 (mechanic connection) and
Level 3 (tow truck), plus a simulated login that gates Levels 2 and 3.

## Problem / why
Drivers without mechanical knowledge get stranded. The pitch needs a live demo where the
whole flow works on a phone. The base repo only has triage; all level screens are placeholders.

## Scope
- Simulated AI (scripted, no API key): 4 demo cases: flat tire, dead battery, dashboard
  light, severe failure escalating to Level 3.
- Level 1: safety alert, one-step-at-a-time guide, contextual chat with quick replies,
  always-visible "Necesito un mecánico" / "Necesito una grúa", escalation rules, closing
  with prevention tips and rating.
- Level 2: location + "can the car move?" filter, up to 5 mechanics, profile, simulated
  WhatsApp availability check (wa.me link with prefilled summary), waiting, closing.
- Level 3: priority safety alert, access (open road / basement) + wheel state filter,
  up to 5 tow trucks, destination workshop, waiting, closing.
- Simulated login (`/ingresar`) required before Levels 2 and 3, with a test account
  documented in `lib/mock/usuario.ts` and the README.
- Visual polish inspired by community kits (React Bits, Untitled UI), within the design tokens.

## Constraints
- Follow `CLAUDE.md` and `design/README.md` (design `.dc.html` files are the visual source of truth).
- Mobile first, 48 px targets, Spanish (Peru) UI copy, no em dashes in copy, prices as ranges + "referencial".
- No real API keys, no real messaging; images as inline SVG illustrations (no hotlinked photos).
- `npm run lint` and `npm run build` must pass.

## TDD
Mode: off. Source: repo has no test runner configured. Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`, browser walkthrough at 390x844.

## Delivery
Strategy: single-pr (prototype for a course demo; one PR from `feat/mvp-niveles` to `main`).

## Tasks
- [ ] T1 UX/UI foundations: effects components, shared polish, login screen + session guard. Route: delegated (UX/UI agent; 2+ non-trivial files).
- [ ] T2 Level 1 + triage scripts for the 4 cases. Route: delegated (Level 1 agent).
- [ ] T3 Levels 2 and 3 behind login. Route: delegated (Levels 2-3 agent).
- [ ] T4 UX/UI review and polish pass over all new screens. Route: delegated (UX/UI agent).
- [ ] T5 Verification: lint, build, browser demo of the 4 cases. Route: inline.
- [ ] T6 Vercel deployment guide in README. Route: inline.

## Acceptance criteria
- The 4 demo scripts run end to end without dead ends.
- Levels 2 and 3 redirect to `/ingresar` when there is no session and return afterwards.
- Lint and build pass.

## Progress
- Branch `feat/mvp-niveles` created from `main` (752c54e). No teammate branches or PRs existed.
