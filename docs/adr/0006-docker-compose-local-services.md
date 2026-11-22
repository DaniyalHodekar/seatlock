# 6. Docker Compose for local Postgres + Redis

Status: Accepted

## Context
Locally installed Postgres + Redis require per-machine setup, Redis has no official Windows build, and
local versions can drift from CI.

## Decision
`docker compose up -d` starts the exact Postgres and Redis versions the app and CI use.

## Consequences
- Anyone can clone and run the project in two commands.
- The same `postgres:17` image runs in CI, so local and CI behave the same.
