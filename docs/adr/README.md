# Architecture Decision Records

Each file records one significant decision: its context, the decision, and the consequences.
Format: Michael Nygard's ADR template. Decisions are never deleted — when one changes, the old
record is marked `Superseded by NNNN` and a new record is written, so the history stays with the code.

| # | Decision | Status |
|---|---|---|
| [0001](0001-separate-nestjs-api.md) | A separate NestJS API instead of Next.js route handlers | Accepted |
| [0002](0002-nextjs-over-spa.md) | Next.js App Router instead of a Vite React SPA | Accepted |
| [0003](0003-postgres-source-of-truth-for-holds.md) | Postgres is the source of truth for seat holds; Redis only for side effects | Accepted |
| [0004](0004-prisma-with-raw-sql.md) | Prisma, with raw SQL for the seat-claiming path | Accepted |
| [0005](0005-one-pnpm-monorepo.md) | One pnpm monorepo | Accepted |
| [0006](0006-docker-compose-local-services.md) | Docker Compose for local Postgres + Redis | Accepted |
| [0007](0007-sessions-over-jwt.md) | Sessions over JWT for web auth | Accepted |
