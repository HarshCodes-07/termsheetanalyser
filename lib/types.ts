export type Severity = "High" | "Medium" | "Low";

export type ScoreLabel =
  | "Founder Friendly"
  | "Balanced"
  | "Investor Friendly"
  | "Risky";

export interface RedFlag {
  title: string;
  severity: Severity;
  whyItMatters: string;
  founderImpact: string;
  suggestedAsk: string;
}

export interface GreenFlag {
  title: string;
  whyItIsGood: string;
}

export interface NegotiationPoint {
  clause: string;
  currentRisk: string;
  betterPosition: string;
  suggestedLanguage: string;
}

export interface ShareableSummary {
  tweet: string;
  linkedin: string;
  whatsapp: string;
}

export interface Analysis {
  overallVerdict: string;
  safetyScore: number;
  scoreLabel: ScoreLabel;
  oneLineSummary: string;
  plainEnglishSummary: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  negotiationPoints: NegotiationPoint[];
  investorFriendlyTerms: string[];
  founderFriendlyTerms: string[];
  missingOrUnclearTerms: string[];
  shareableSummary: ShareableSummary;
  disclaimer: string;
}

export type NotTermsheetType =
  | "parody"
  | "joke"
  | "unrelated_document"
  | "wrong_contract"
  | "resume"
  | "marketing"
  | "recipe"
  | "lyrics"
  | "gibberish"
  | "blank"
  | "prompt_injection"
  | "offensive"
  | "unknown";

export interface NotTermsheet {
  detectedType: NotTermsheetType;
  detectedTypeLabel: string;
  headline: string;
  whyNotTermsheet: string;
  documentLooksLike: string;
  funniestClauseOrLine: string;
  whatToDoNext: string[];
  shareableQuip: string;
  disclaimer: string;
}

export type AnalyseSource = "gemini" | "sample";

export interface AnalysisResponse {
  kind: "analysis";
  analysis: Analysis;
  source: AnalyseSource;
  note?: string;
}

export interface NotTermsheetResponse {
  kind: "notTermsheet";
  notTermsheet: NotTermsheet;
  source: AnalyseSource;
  note?: string;
}

export type AnalyseResponse = AnalysisResponse | NotTermsheetResponse;
