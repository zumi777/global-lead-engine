# Global Lead Engine

Worldwide B2B company discovery SaaS. The application deliberately does not ship with fake/sample lead records: searches are executed against a configured live provider.

## Current working pipeline

Browser search -> `/api/leads/search` -> Hunter Discover API -> normalized company results -> dashboard.

## Setup

1. Create a Hunter account/API key.
2. Set `HUNTER_API_KEY` in your local `.env.local` or Vercel environment variables.
3. Run `npm install` then `npm run dev`.

## Product roadmap

Next: email finder/verifier, fallback enrichment, saved lists, exports, database, auth, credits and billing.
