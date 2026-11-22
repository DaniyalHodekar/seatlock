# 3. Postgres is the source of truth for seat holds; Redis only for side effects

Status: Accepted

## Context
A seat hold could live in Redis with a TTL, or be released by a BullMQ delayed job after 10 minutes.
But then correctness depends on a job firing or a key expiring in a second system — if the worker is
down, seats stay locked.

## Decision
A hold is a Postgres row with `expires_at`. A seat is available if it has no sale and no hold whose
`expires_at` is in the future. Claiming a seat is one transaction with a row lock (`SELECT … FOR UPDATE`)
or a conditional update, so two buyers can never get the same seat. Redis/BullMQ only do things that
may safely be late: deleting old holds, PDFs, emails, webhook retries.

## Consequences
- An expired hold is free the instant it expires, whether or not any cleanup runs.
- Every availability query checks `expires_at > now()` — cheap with an index.
- Interview line: "I didn't make correctness depend on a background job firing."
