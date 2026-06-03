# Termsheet Analyser

A founder-friendly Next.js app that analyses startup termsheets with Gemini and returns:

- a 0–100 safety score
- red flags (with severity)
- green flags
- plain-english summary
- negotiation points with suggested clause language
- shareable copy for Twitter / LinkedIn / WhatsApp

## Tech

- Next.js 16 (App Router) + React 19
- TypeScript + Zod validation
- Tailwind CSS v4
- `pdf-parse` v2 for PDF text extraction
- Gemini API (`gemini-2.5-flash`) via `x-goog-api-key` header

## Requirements

- Node 22 (via `nvm`)
- npm

## Setup

```bash
nvm use 22
cp .env.example .env.local
# Add GEMINI_API_KEY and RATE_LIMIT_SECRET
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `GEMINI_API_KEY` | Production | Google Gemini API key (server-only) |
| `RATE_LIMIT_SECRET` | Production | Signs daily usage cookies (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO/sitemap |
| `GOOGLE_SITE_VERIFICATION` | Optional | Search Console verification |

**Development:** If `GEMINI_API_KEY` is missing or a placeholder, sample analysis is returned (dev only). Production returns 503 without a valid key.

## Daily usage limit

Each browser gets **3 free analyses per day** (UTC midnight reset), enforced via a signed HttpOnly cookie. The UI shows remaining analyses with a progress indicator. Failed Gemini calls refund the slot.

## Security

- Security headers (HSTS, X-Frame-Options, nosniff, etc.)
- Request body size limits
- PDF magic-byte validation + parse timeout
- Zod schema validation on Gemini responses
- Sanitized error messages (no internal leaks)
- Gemini key sent via header, not query string

## How it works

1. Upload PDF/TXT, paste text, or try the sample termsheet.
2. Text is extracted (`/api/extract` for PDFs) and sent to `/api/analyse`.
3. Gemini returns structured JSON; validated and rendered in tabbed UI.
4. Usage tracked at `/api/usage`.

## Pages

- `/` — main analyser
- `/privacy` — privacy policy
- `/terms` — terms of use

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint
