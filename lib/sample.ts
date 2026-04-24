import type { Analysis } from "./types";

export const SAMPLE_TERMSHEET = `Company: Acme AI Pvt Ltd
Investor: Orange Seed Ventures
Investment: $500,000
Valuation Cap: $5,000,000
Instrument: SAFE
Discount: 20%
Pro-rata Rights: Investor has pro-rata participation rights in future rounds
Liquidation Preference: 1x non-participating
Board Seat: Investor gets one board observer seat
Founder Vesting: Founders subject to 4 year vesting with 1 year cliff
ESOP: Company to create 10% ESOP pool prior to investment
Information Rights: Quarterly financial updates and annual budget
No-shop: Company cannot solicit other investment offers for 45 days
Protective Provisions: Investor consent required for issuing senior securities, sale of company, change in business, taking debt above $100,000`;

export const SAMPLE_ANALYSIS: Analysis = {
  overallVerdict:
    "Mostly balanced seed-stage SAFE with reasonable investor protections. A few terms skew investor-friendly and are worth negotiating.",
  safetyScore: 72,
  scoreLabel: "Balanced",
  oneLineSummary:
    "Balanced seed SAFE at a $5M cap — founder-friendly on economics, but watch the pre-money ESOP expansion and 45-day no-shop.",
  plainEnglishSummary:
    "Orange Seed Ventures is putting in $500K on a SAFE with a $5M valuation cap and a 20% discount. The instrument and 1x non-participating liquidation preference are standard and founder-reasonable.\n\nThe big dilution lever here is the 10% ESOP pool being created *before* the investment — that dilution sits entirely on founders, not the new investor. You should also note the 45-day no-shop, which is longer than normal for a SAFE.\n\nControl is light: the investor only gets a board *observer* seat, no director, and the protective provisions are reasonable. Founder vesting is standard 4-years with a 1-year cliff. Overall the deal is workable, but the ESOP and no-shop are worth pushing back on.",
  redFlags: [
    {
      title: "10% ESOP pool created pre-money",
      severity: "High",
      whyItMatters:
        "A pre-money ESOP dilutes only existing founders and early team, not the new investor. It effectively lowers the real valuation.",
      founderImpact:
        "At a $5M cap, a 10% pre-money pool means founders absorb an extra ~10% dilution before the SAFE even converts.",
      suggestedAsk:
        "Ask for the ESOP to be created post-money, or cap the top-up to what's actually needed for the next 12 months of hires (often 5-7%).",
    },
    {
      title: "45-day no-shop / exclusivity",
      severity: "Medium",
      whyItMatters:
        "A no-shop stops you from talking to other investors while this deal is live. 45 days is long for a seed SAFE.",
      founderImpact:
        "If the deal stalls or falls through, you lose 1.5 months of fundraising momentum and negotiating leverage.",
      suggestedAsk:
        "Negotiate down to 21-30 days, and add a clause that the no-shop terminates automatically if the investor hasn't signed and wired by a fixed date.",
    },
    {
      title: "Protective provisions include 'change in business'",
      severity: "Low",
      whyItMatters:
        "'Change in business' can be interpreted broadly and give the investor a quiet veto on pivots.",
      founderImpact:
        "Early startups pivot. A vague veto right lets an investor slow down or block a necessary pivot.",
      suggestedAsk:
        "Define 'change in business' narrowly — e.g. 'material change outside current line of business' — or remove it entirely at the SAFE stage.",
    },
  ],
  greenFlags: [
    {
      title: "1x non-participating liquidation preference",
      whyItIsGood:
        "This is the founder-friendly standard. Investor either takes their money back or converts to equity — not both.",
    },
    {
      title: "Board observer instead of board seat",
      whyItIsGood:
        "Observer rights give the investor visibility without voting control on the board. Much lighter than a director seat at the seed stage.",
    },
    {
      title: "Standard 4-year vesting with 1-year cliff",
      whyItIsGood:
        "This is the market norm and signals the investor is not trying to impose unusual reverse-vesting terms on founders.",
    },
    {
      title: "Quarterly information rights only",
      whyItIsGood:
        "Quarterly updates plus an annual budget is light-touch reporting — not the monthly board packs that bigger funds demand.",
    },
  ],
  negotiationPoints: [
    {
      clause: "ESOP Pool",
      currentRisk: "10% pool created pre-money, fully diluting founders.",
      betterPosition:
        "Post-money ESOP, or a smaller pre-money top-up (5-7%) sized to a 12-month hiring plan.",
      suggestedLanguage:
        "The ESOP pool shall be created or topped up post-money, sized to the Company's 12-month hiring plan and not to exceed 7%.",
    },
    {
      clause: "No-shop / Exclusivity",
      currentRisk: "45 days with no auto-expiry if the investor goes quiet.",
      betterPosition:
        "21-30 days with automatic termination if the investor has not signed and funded by a set date.",
      suggestedLanguage:
        "The Company agrees not to solicit alternative offers for 21 days from signing; this exclusivity terminates automatically if the Investor has not completed the investment by [date].",
    },
    {
      clause: "Protective Provisions",
      currentRisk:
        "'Change in business' is broad and can block pivots; debt threshold is only $100K.",
      betterPosition:
        "Remove 'change in business' or define it narrowly; raise the debt threshold to $250K-$500K.",
      suggestedLanguage:
        "Investor consent is required for: (i) issuance of senior securities, (ii) sale of the Company, and (iii) incurrence of debt above $500,000. All other operating decisions remain with the board/founders.",
    },
    {
      clause: "Pro-rata Rights",
      currentRisk:
        "Pro-rata is fine, but it's currently open-ended across all future rounds.",
      betterPosition:
        "Limit pro-rata to 'major investors' threshold and the next equity round only, to avoid cap table clutter.",
      suggestedLanguage:
        "Investor shall have pro-rata rights in the Company's next priced equity round only, provided the Investor continues to hold at least 50% of the securities originally acquired.",
    },
  ],
  investorFriendlyTerms: [
    "10% ESOP pool expansion pre-money",
    "45-day no-shop / exclusivity",
    "Broad 'change in business' protective provision",
    "Open-ended pro-rata rights",
  ],
  founderFriendlyTerms: [
    "SAFE instrument (simple, no interest, no maturity pressure)",
    "$5M valuation cap with 20% discount (standard seed economics)",
    "1x non-participating liquidation preference",
    "Board observer seat (no voting director)",
    "Standard 4-year vesting with 1-year cliff",
    "Light quarterly information rights",
  ],
  missingOrUnclearTerms: [
    "Anti-dilution protection (not mentioned — typical for SAFEs but worth confirming)",
    "Drag-along and tag-along rights (not addressed in this termsheet)",
    "Transfer restrictions / right of first refusal on founder shares",
    "Most Favored Nation (MFN) clause for the SAFE holder",
    "Conversion mechanics on a sale before priced round",
    "Closing conditions / conditions precedent",
  ],
  shareableSummary: {
    tweet:
      "Got a $500K SAFE at $5M cap, 20% discount. Mostly founder-friendly. Main things to push back on: the pre-money 10% ESOP and the 45-day no-shop. Safety score: 72/100.",
    linkedin:
      "Quick read on our seed termsheet: $500K on a SAFE at a $5M cap with a 20% discount, 1x non-participating liquidation preference, and a board observer seat. The economics are fair, but two terms are worth negotiating: a 10% pre-money ESOP expansion (which quietly dilutes founders only) and a 45-day no-shop (too long for a SAFE). Overall: balanced, 72/100.",
    whatsapp:
      "Termsheet quick read: $500K SAFE, $5M cap, 20% discount. Mostly okay. Push back on: 10% pre-money ESOP (founder dilution) and 45-day no-shop. Score 72/100 — balanced.",
  },
  disclaimer:
    "This is an AI-generated business analysis, not legal advice. Please consult a qualified lawyer before signing.",
};
