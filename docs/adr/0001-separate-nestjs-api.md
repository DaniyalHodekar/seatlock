# 1. A separate NestJS API instead of Next.js route handlers

Status: Accepted

## Context
`apps/web` could serve every endpoint with Next.js route handlers + server actions — one app, one
deploy. Note that **Next.js is not inherently serverless**: self-hosted with `next start` it is a
long-lived Node server that *could* hold SSE connections and run background work. But we deploy
`apps/web` to **Vercel** (ADR-0002) for its SSR/preview/edge benefits, where route handlers run as
**serverless functions with execution-time limits**. Several requirements then argue for a dedicated
backend — some tied to that deployment choice, most holding regardless of how Next is hosted:

1. **Live seat availability.** Open event pages must see seats turn held/sold within a second — a
   long-lived SSE connection per viewer. On Vercel's serverless functions that doesn't fit (time
   limits, not built for thousands of open connections). *(This point depends on the Vercel target;
   a self-hosted Next could stream SSE, though we'd still prefer not to couple it to the web server.)*
2. **Always-on background work.** Hold cleanup, ticket PDFs/emails, webhook retries — a BullMQ worker
   that must run continuously. That is a separate long-running process **anyway**, independent of how
   the web is hosted; once it exists, it should own the domain logic.
3. **More than one client.** The web app, the door-scanner check-in page (`POST /tickets/:code/check-in`),
   and organiser integrations need a standalone, documented REST API regardless of the web's runtime.
4. **Different scaling and failure profile.** Sales spike at open — the checkout API takes the load,
   not page rendering. A separate API scales and fails independently of the frontend.

Point 1 depends on choosing Vercel; points 2–4 hold even if Next were self-hosted.

## Decision
`apps/api` (NestJS) owns all business logic and data; `apps/web` (Next.js) is a client of it.

## Consequences
- Two deploys, CORS and environment config between them, and more boilerplate.
- Shared DTO types live in the monorepo (ADR-0005) so the two can't drift.
- Interview answer: "For a simple CRUD app I'd use Next.js alone. This one has live seat updates over
  SSE, a continuous background worker, and a second client (the scanner) plus a documented API — none
  of which serverless route handlers serve well; and once I needed a long-running process anyway, a
  NestJS API with DI made the logic testable and independently scalable."
