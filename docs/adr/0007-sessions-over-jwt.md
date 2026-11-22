# 7. Sessions over JWT for web auth

Status: Accepted

## Context
This is a single backend we own with a browser client, and revocation matters (logout, "log out all
devices", ban a user, invalidate on password change). JWT is stateless but can't be un-issued before
it expires; a per-request `tokenVersion` DB check to revoke it reintroduces exactly the lookup JWT was
meant to avoid — JWT's complexity with a session's statefulness.

## Decision
Server-side sessions: an opaque session ID in an `httpOnly`, `secure`, `sameSite` cookie, with session
state stored in Redis. Passwords are hashed with argon2. JWT/OAuth is reserved for future
cross-service surfaces (e.g. the door-scanner client), not the web app.

## Consequences
- Revocation is instant and trivial (delete the session).
- The opaque ID in an `httpOnly` cookie can't be read by JS, so XSS can't steal it — safer than a JWT
  in `localStorage`.
- Cost: a Redis lookup per authenticated request (cheap) and CSRF defence via `sameSite` + CSRF tokens.
