# In-app chat, payment and provider app

## Objective
Replace the WhatsApp handoff with an in-app chat and integrated payment (PedidosYa / Rappi / Uber
style), and add a provider app (mechanic or tow truck) so the demo shows both sides of the
conversation and how AlToque earns a commission.

## Problem / why
Redirecting to WhatsApp moves the deal outside the platform, so the commission model is not
credible. Keeping chat and payment in-app justifies the fee and protects both parties.

## Scope
- Shared order state `lib/servicio.ts` (localStorage + BroadcastChannel; same device only).
- Revenue model `lib/mock/comision.ts`: 12 % provider commission + S/ 4 driver service fee.
- Driver: send request in-app, chat with status, pay inside the app (Yape, Plin, card, simulated), receipt with breakdown.
- Provider app `/proveedor`: incoming request with AI summary, accept/reject, chat, status updates, quote, payment received with commission and net earnings.
- Demo `/demo`: both phones side by side on a laptop; role switch on a single phone.
- Auto-pilot provider replies when no provider view is open, so a single phone still works.

## Constraints
- Same rules as `CLAUDE.md`. No real payments, no card numbers collected, no real messaging.
- Decision (user, 2026-11-21): same-device sync, no backend.

## TDD
Mode: off (no test runner). Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`, browser walkthrough.

## Delivery
single-pr from `feat/chat-pago-in-app`.

## Tasks
- [x] T1 Shared contract: `lib/servicio.ts`, `lib/mock/comision.ts`, routes. Route: inline.
- [x] T2 Driver flow: request, chat, payment, receipt; remove WhatsApp handoff. Route: delegated (driver agent). Commits 59f... (feat(servicio)), 167bbd3.
- [x] T3 Provider app and `/demo`. Route: delegated (provider agent, parallel, disjoint folders). Commit bbff41d.
- [x] T4 UX/UI pass over both sides. Route: delegated (UX/UI agent). Commit a8a4d88.
- [x] T5 Browser verification, README update. Route: inline. Commit bf9098b. PR pending user decision.

## Progress
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build` (31 routes) pass.
- Browser, /demo at 1400x900: request → provider accept → chat both ways → en camino → llegó → quote S/ 90 → driver pays Yape S/ 94 → provider sees S/ 79.20 net → finalizado → driver closing. Commission panel S/ 94 / S/ 79.20 / S/ 14.80 live. No console errors.
- Browser, single phone 390x844: auto-pilot accepted, greeted, arrived and quoted within 20 s.
- Not exercised in browser: Level 3 tow flow through /servicio (destination card), Plin/card/cash payment variants, reject path.
- Native review: assess fails pre-native (`git diff` "'$GIT_DIR' too big", Windows path length). Not run.
