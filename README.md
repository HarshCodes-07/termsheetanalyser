# Termsheet Analyser

A founder-friendly Next.js prototype that analyses a startup termsheet with Gemini and returns:

- a 0–100 safety score
- red flags (with severity)
- green flags
- plain-english summary
- negotiation points with suggested clause language
- shareable copy for Twitter / LinkedIn / WhatsApp

No auth, no database, no backend besides two Next.js API routes. Everything runs locally.

## Tech

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- `pdf-parse` v2 for PDF text extraction on the server
- Gemini API (`gemini-2.5-flash`) via `generativelanguage.googleapis.com`

## Requirements

- Node 22 (via `nvm`)
- npm

## Setup

```bash
nvm use 22      # or: nvm install 22 && nvm use 22
npm install
npm run dev
```

Open http://localhost:3000.

## Gemini API key

The prototype ships with a **hardcoded placeholder** key, as requested:

```ts
// app/api/analyse/route.ts
const GEMINI_API_KEY = "xyz";
```

Because the placeholder is not a real key, the analyse route detects this and returns a realistic **sample analysis** so the full UI (score card, tabs, flags, negotiation language, share cards) is fully testable end-to-end.

To get real analyses:

1. Get a Gemini API key from Google AI Studio.
2. Replace `"xyz"` in `app/api/analyse/route.ts` with your real key.
3. Restart `npm run dev`.

If the real API call fails for any reason (network, quota, schema mismatch), the route gracefully falls back to the sample analysis so the UI never breaks.

> For production you’d move the key to an env var and out of source control. This is a local prototype.

## How it works

1. The user lands on `/` and either:
   - drags a `.pdf` / `.txt` into the upload card,
   - pastes termsheet text, or
   - clicks **Try sample termsheet**.
2. Clicking **Analyse termsheet**:
   - For `.txt`: read in the browser via `File.text()`.
   - For `.pdf`: POST to `POST /api/extract` which uses `pdf-parse` on the server to get text.
3. The extracted text is POSTed to `POST /api/analyse` with `{ termsheetText: string }`.
4. The route builds the master prompt and calls Gemini with `responseMimeType: "application/json"`, then validates the schema and returns it to the client.
5. The client renders the tabbed result view.

## File layout

```
app/
  api/
    analyse/route.ts   # Gemini call + sample fallback
    extract/route.ts   # PDF → text via pdf-parse
  layout.tsx
  page.tsx             # landing + upload + result state machine
  globals.css          # warm palette + orange accent design tokens
components/
  Header.tsx
  UploadCard.tsx
  LoadingAnalysis.tsx
  ScoreCard.tsx
  AnalysisSection.tsx
  FlagCard.tsx          # RedFlagCard + GreenFlagCard
  CopyButton.tsx
  ResultView.tsx        # tabs: Summary / Red / Green / Negotiation / Missing / Share
lib/
  types.ts
  prompt.ts             # master prompt
  sample.ts             # sample termsheet + sample analysis
```

## File support

| Type   | Supported | Notes                                              |
| ------ | --------- | -------------------------------------------------- |
| `.txt` | yes       | read client-side via `File.text()`                 |
| `.pdf` | yes       | parsed server-side with `pdf-parse`                |
| `.doc` | no        | TODO — upload is rejected with a friendly message  |
| `.docx`| no        | TODO — same                                        |

Max file size: 10MB (enforced on client + server).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — ESLint

## Notes / next steps

- Add `.docx` support via `mammoth`.
- Move the Gemini key to an env var.
- Stream the Gemini response for a live-typing result view.
- Persist past analyses locally via IndexedDB.
