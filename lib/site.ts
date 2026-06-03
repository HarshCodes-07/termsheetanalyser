export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://termsheetanalyser.vercel.app";

export const SITE_NAME = "Termsheet Analyser";

export const SITE_TITLE = "Termsheet Analyser — understand before you sign";

export const SITE_DESCRIPTION =
  "AI-powered termsheet analyser for founders. Get red flags, green flags, a safety score, and negotiation notes in plain english — before you sign.";

export const SITE_KEYWORDS = [
  "termsheet analyser",
  "term sheet analyzer",
  "VC term sheet",
  "startup termsheet review",
  "founder tools",
  "venture capital",
  "SAFE note analysis",
  "investor negotiation",
  "liquidation preference",
  "cap table",
  "equity dilution",
  "fundraising",
  "seed round",
  "Series A termsheet",
  "AI termsheet review",
] as const;

export const TWITTER_HANDLE = "@harsh_dwivedi7";

export const AUTHOR_NAME = "Harsh Dwivedi";

export const AUTHOR_URL = "https://www.x.com/harsh_dwivedi7";

export const HOW_IT_WORKS_STEPS = [
  {
    title: "Upload your termsheet",
    description:
      "Drop a PDF or TXT file, paste the text, or try our sample SAFE termsheet. We extract readable text on the server — nothing is stored in a database.",
  },
  {
    title: "AI reviews the clauses",
    description:
      "Gemini analyses valuation, liquidation preference, board control, vesting, ESOP, no-shop, protective provisions, and other founder-critical terms.",
  },
  {
    title: "Get a founder-friendly report",
    description:
      "See your safety score, red and green flags, plain-english summary, negotiation points with suggested language, and shareable copy for your team.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Is Termsheet Analyser legal advice?",
    answer:
      "No. This tool provides AI-generated business analysis to help founders understand deal terms in plain english. Always consult a qualified lawyer before signing any investment document.",
  },
  {
    question: "What file types are supported?",
    answer:
      "PDF and TXT files up to 10MB. Text can also be pasted directly. DOC and DOCX support is planned for a future release.",
  },
  {
    question: "What is the safety score?",
    answer:
      "A 0–100 founder-friendliness score: 80–100 is founder friendly, 60–79 balanced, 40–59 investor-leaning and worth review, below 40 risky. The score reflects how terms in your document affect founders, not legal enforceability.",
  },
  {
    question: "Is my document stored?",
    answer:
      "No database is used in this prototype. Your file is processed in memory during the request and is not persisted on our servers after the analysis completes.",
  },
  {
    question: "Can you analyse SAFEs and priced rounds?",
    answer:
      "Yes. The analyser is built for startup investment termsheets including SAFEs, convertible notes, and priced equity rounds. If a term is missing from your document, we flag it under missing or unclear terms.",
  },
  {
    question: "Is there a daily usage limit?",
    answer:
      "Yes. Each browser gets 3 free analyses per day (resets at midnight UTC). This keeps the tool sustainable and prevents abuse. Your usage is tracked via a signed cookie — no account required.",
  },
  {
    question: "Why did my upload fail the termsheet check?",
    answer:
      "If the text is not an investment termsheet — for example a resume, recipe, or unrelated contract — we show a friendly message instead of a fake analysis. Upload a real termsheet or use the sample to see a full report.",
  },
] as const;
