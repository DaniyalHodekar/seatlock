# 2. Next.js App Router instead of a Vite React SPA

Status: Accepted

## Context
Public event pages are shared on WhatsApp and found through search. A Vite SPA is a simpler mental
model with no server rendering, but it ships an empty HTML shell — link previews and indexing suffer
and first load is slower.

## Decision
`apps/web` is Next.js App Router. Public event pages are server-rendered and cached; the organiser
dashboard stays fully client-side.

## Consequences
- Better link previews, SEO, and first paint for public pages.
- Cost: server vs client components and Next's caching layers are extra concepts to hold.
