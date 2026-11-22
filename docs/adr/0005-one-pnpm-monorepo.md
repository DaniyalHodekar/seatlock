# 5. One pnpm monorepo

Status: Accepted

## Context
The alternative is two separate repos for the API and web. That duplicates CI and lets shared types
drift between the two.

## Decision
One pnpm monorepo: `apps/api`, `apps/web`, and `packages/shared` for DTO types.

## Consequences
- One clone, one CI pipeline, and a shared typed contract — renaming a field in the API breaks the web
  build in CI instead of breaking in production.
