# 4. Prisma, with raw SQL for the seat-claiming path

Status: Accepted

## Context
Options were raw `pg` everywhere (most control, no generated types/migrations) or Drizzle (closer to
SQL, less common in job posts). The seat-claiming query must be exactly right (`SELECT … FOR UPDATE`).

## Decision
Prisma for schema, migrations, and routine queries; raw SQL inside a Prisma transaction for the
concurrency-critical seat-claiming path.

## Consequences
- Typed queries and solid migrations from the schema; Prisma is the most-listed Node ORM.
- The one query that must be exactly right stays explicit SQL you can explain line by line.
