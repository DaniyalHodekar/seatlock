# SeatLock

## What it is
A seat booking application which supports seat holding upto a fixed interval while they pay, with live seat availability.

## The stack
A monorepo (pnpm workspaces) consisting of NestJS for backend services and API endpoints (apps/api), Next.js/React for the web app (apps/web), Postgres as the primary database, Prisma ORM for db schema and migrations (planned), Redis for background workers (BullMQ) (planned), Postgres and Redis are setup with Docker Compose. Github Actions CI for linting and typechecks.

## Prerequisites
Requires Node 22, pnpm 10 and Docker

## Run it locally
1. Clone the repo
2. Create .env from .env.example
3. Run `docker compose up -d` (postgres and redis)
4. From the root run `pnpm install` and then `pnpm dev` (default ports: NestJS 3000 , Next.js 3001)
