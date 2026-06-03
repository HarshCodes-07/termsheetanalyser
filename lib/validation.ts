import { z } from "zod";
import { MAX_ANALYSIS_ARRAY_ITEMS } from "./constants";
import type { Analysis, NotTermsheet, NotTermsheetType, ScoreLabel, Severity } from "./types";

function normalizeSeverity(raw: unknown): Severity {
  if (typeof raw !== "string") return "Medium";
  const s = raw.trim().toLowerCase();
  if (s.startsWith("high")) return "High";
  if (s.startsWith("med")) return "Medium";
  if (s.startsWith("low")) return "Low";
  return "Medium";
}

function scoreLabelFromScore(score: number): ScoreLabel {
  if (score >= 80) return "Founder Friendly";
  if (score >= 60) return "Balanced";
  if (score >= 40) return "Investor Friendly";
  return "Risky";
}

export function normalizeScoreLabel(
  raw: unknown,
  safetyScore?: number
): ScoreLabel {
  if (typeof raw === "string") {
    const s = raw.trim().toLowerCase();

    const exact: Record<string, ScoreLabel> = {
      "founder friendly": "Founder Friendly",
      balanced: "Balanced",
      "investor friendly": "Investor Friendly",
      "investor friendly / needs review": "Investor Friendly",
      "investor-friendly": "Investor Friendly",
      risky: "Risky",
      "high risk": "Risky",
    };
    if (exact[s]) return exact[s];

    if (s.includes("founder") && s.includes("friendly")) return "Founder Friendly";
    if (s.includes("balanced")) return "Balanced";
    if (s.includes("investor")) return "Investor Friendly";
    if (s.includes("risky") || s.includes("high risk")) return "Risky";
  }

  if (typeof safetyScore === "number" && !Number.isNaN(safetyScore)) {
    return scoreLabelFromScore(safetyScore);
  }

  return "Balanced";
}

const severitySchema = z.enum(["High", "Medium", "Low"]);
const scoreLabelSchema = z.enum([
  "Founder Friendly",
  "Balanced",
  "Investor Friendly",
  "Risky",
]);

const notTermsheetTypeSchema = z.enum([
  "parody",
  "joke",
  "unrelated_document",
  "wrong_contract",
  "resume",
  "marketing",
  "recipe",
  "lyrics",
  "gibberish",
  "blank",
  "prompt_injection",
  "offensive",
  "unknown",
]);

function capStrings(arr: string[]): string[] {
  return arr.slice(0, MAX_ANALYSIS_ARRAY_ITEMS);
}

const redFlagSchema = z.object({
  title: z.string(),
  severity: severitySchema,
  whyItMatters: z.string(),
  founderImpact: z.string(),
  suggestedAsk: z.string(),
});

const greenFlagSchema = z.object({
  title: z.string(),
  whyItIsGood: z.string(),
});

const negotiationPointSchema = z.object({
  clause: z.string(),
  currentRisk: z.string(),
  betterPosition: z.string(),
  suggestedLanguage: z.string(),
});

const shareableSummarySchema = z.object({
  tweet: z.string(),
  linkedin: z.string(),
  whatsapp: z.string(),
});

const analysisSchema = z
  .object({
    isTermsheet: z.literal(true).optional(),
    overallVerdict: z.string(),
    safetyScore: z.coerce.number(),
    scoreLabel: scoreLabelSchema,
    oneLineSummary: z.string(),
    plainEnglishSummary: z.string(),
    redFlags: z.array(redFlagSchema),
    greenFlags: z.array(greenFlagSchema),
    negotiationPoints: z.array(negotiationPointSchema),
    investorFriendlyTerms: z.array(z.string()),
    founderFriendlyTerms: z.array(z.string()),
    missingOrUnclearTerms: z.array(z.string()),
    shareableSummary: shareableSummarySchema,
    disclaimer: z.string(),
  })
  .transform(
    (data): Analysis => ({
      overallVerdict: data.overallVerdict,
      safetyScore: Math.max(0, Math.min(100, Math.round(data.safetyScore))),
      scoreLabel: data.scoreLabel,
      oneLineSummary: data.oneLineSummary,
      plainEnglishSummary: data.plainEnglishSummary,
      redFlags: data.redFlags.slice(0, MAX_ANALYSIS_ARRAY_ITEMS),
      greenFlags: data.greenFlags.slice(0, MAX_ANALYSIS_ARRAY_ITEMS),
      negotiationPoints: data.negotiationPoints.slice(
        0,
        MAX_ANALYSIS_ARRAY_ITEMS
      ),
      investorFriendlyTerms: capStrings(data.investorFriendlyTerms),
      founderFriendlyTerms: capStrings(data.founderFriendlyTerms),
      missingOrUnclearTerms: capStrings(data.missingOrUnclearTerms),
      shareableSummary: data.shareableSummary,
      disclaimer: data.disclaimer,
    })
  );

const notTermsheetSchema = z
  .object({
    isTermsheet: z.literal(false).optional(),
    detectedType: notTermsheetTypeSchema,
    detectedTypeLabel: z.string(),
    headline: z.string(),
    whyNotTermsheet: z.string(),
    documentLooksLike: z.string(),
    funniestClauseOrLine: z.string().optional().default(""),
    whatToDoNext: z.array(z.string()),
    shareableQuip: z.string().optional().default(""),
    disclaimer: z.string(),
  })
  .transform(
    (data): NotTermsheet => ({
      detectedType: data.detectedType as NotTermsheetType,
      detectedTypeLabel: data.detectedTypeLabel,
      headline: data.headline,
      whyNotTermsheet: data.whyNotTermsheet,
      documentLooksLike: data.documentLooksLike,
      funniestClauseOrLine: data.funniestClauseOrLine ?? "",
      whatToDoNext: capStrings(data.whatToDoNext),
      shareableQuip: data.shareableQuip ?? "",
      disclaimer: data.disclaimer,
    })
  );

export function isNotTermsheetPayload(
  obj: Record<string, unknown>
): boolean {
  if (obj.isTermsheet === false) return true;
  if (obj.isTermsheet === "false") return true;
  return false;
}

function preprocessAnalysisRaw(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const obj = { ...(raw as Record<string, unknown>) };

  const parsedScore =
    typeof obj.safetyScore === "number"
      ? obj.safetyScore
      : typeof obj.safetyScore === "string"
        ? Number.parseFloat(obj.safetyScore)
        : NaN;

  if (!Number.isNaN(parsedScore)) {
    obj.safetyScore = parsedScore;
  }

  obj.scoreLabel = normalizeScoreLabel(
    obj.scoreLabel,
    Number.isNaN(parsedScore) ? undefined : parsedScore
  );

  if (Array.isArray(obj.redFlags)) {
    obj.redFlags = obj.redFlags.map((flag) => {
      if (!flag || typeof flag !== "object") return flag;
      const f = { ...(flag as Record<string, unknown>) };
      f.severity = normalizeSeverity(f.severity);
      return f;
    });
  }

  return obj;
}

export function parseGeminiAnalysis(raw: unknown): Analysis {
  return analysisSchema.parse(preprocessAnalysisRaw(raw));
}

export function parseGeminiNotTermsheet(raw: unknown): NotTermsheet {
  return notTermsheetSchema.parse(raw);
}
