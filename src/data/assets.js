// Price pivots as supplied, alternating low → high → low → high.
// Multipliers are NEVER stored here — they are derived in the engine from these
// numbers, so a corrected pivot propagates everywhere instead of drifting out of
// sync with a hardcoded multiple.
//
// Notes on the source data:
//  - Solana's second pivot was given as "$1.91.90" and its trough as "Sep 4, 2025"
//    listed out of chronological order. Resolved to $191.90 / 2024-09-04, matching
//    the low/high/low/high shape every other asset in the set follows.
//  - Zcash's final pivot (2026-08-23) is one day old at time of writing, so ZEC-2
//    is flagged `open` — a live position, not a settled trade.

export const ASSETS = [
  {
    id: "AIOZ",
    name: "AIOZ Network",
    ticker: "AIOZ",
    color: "#00E5FF",
    colorDim: "rgba(0,229,255,0.12)",
    note: "The single most violent leg in the set — 90× in six months.",
    pivots: [
      { date: "2023-09-13", px: 0.01 },
      { date: "2024-03-23", px: 0.9 },
      { date: "2024-09-07", px: 0.37 },
      { date: "2024-12-06", px: 1.22 },
    ],
  },
  {
    id: "RNDR",
    name: "Render",
    ticker: "RENDER",
    color: "#F5426C",
    colorDim: "rgba(245,66,108,0.12)",
    note: "A 31× move, but it occupies 29 months — the costliest real estate in the lottery.",
    pivots: [
      { date: "2022-10-12", px: 0.42 },
      { date: "2025-03-17", px: 13.12 },
    ],
  },
  {
    id: "INJ",
    name: "Injective",
    ticker: "INJ",
    color: "#22A3F0",
    colorDim: "rgba(34,163,240,0.12)",
    note: "The best opening leg that isn't AIOZ.",
    pivots: [
      { date: "2022-12-21", px: 1.25 },
      { date: "2024-03-06", px: 48.28 },
    ],
  },
  {
    id: "SOL",
    name: "Solana",
    ticker: "SOL",
    color: "#9D4EDD",
    colorDim: "rgba(157,78,221,0.12)",
    note: "Emerged from the FTX collapse at a generational low.",
    pivots: [
      { date: "2022-12-21", px: 9.76 },
      { date: "2024-03-13", px: 191.9 },
      { date: "2024-09-04", px: 132.49 },
      { date: "2025-01-15", px: 257.5 },
    ],
  },
  {
    id: "XRP",
    name: "XRP",
    ticker: "XRP",
    color: "#23F0C6",
    colorDim: "rgba(35,240,198,0.12)",
    note: "Repriced off the October 2024 trough — a shorter hold, still a sharp leg.",
    pivots: [
      { date: "2024-10-09", px: 0.55 },
      { date: "2025-01-08", px: 3.14 },
    ],
  },
  {
    id: "MSTR",
    name: "Strategy",
    ticker: "MSTR",
    color: "#FF7A45",
    colorDim: "rgba(255,122,69,0.12)",
    note: "The only equity in the set — leveraged bitcoin exposure in a brokerage account.",
    pivots: [
      { date: "2022-12-21", px: 14.5 },
      { date: "2024-03-17", px: 187.7 },
      { date: "2024-08-26", px: 119.57 },
      { date: "2024-11-13", px: 421.88 },
    ],
  },
  {
    id: "SUPER",
    name: "SuperVerse",
    ticker: "SUPER",
    color: "#FF4FD8",
    colorDim: "rgba(255,79,216,0.12)",
    note: "Its second leg beats Strategy's in the same window — outrun now by XRP's autumn leg.",
    pivots: [
      { date: "2023-10-11", px: 0.07 },
      { date: "2024-03-06", px: 1.43 },
      { date: "2024-07-31", px: 0.42 },
      { date: "2024-12-04", px: 2.06 },
    ],
  },
  {
    id: "PEPE",
    name: "Pepe",
    ticker: "PEPE",
    color: "#4BE04B",
    colorDim: "rgba(75,224,75,0.12)",
    note: "The best opening leg available to anyone who missed AIOZ.",
    pivots: [
      { date: "2023-10-11", px: 0.000000635 },
      { date: "2024-05-22", px: 0.00001474 },
      { date: "2024-09-04", px: 0.000007246 },
      { date: "2024-12-04", px: 0.00002513 },
    ],
  },
  {
    id: "ZEC",
    name: "Zcash",
    ticker: "ZEC",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    note: "Two legs at the far end of the lottery — and the only ones still running.",
    pivots: [
      { date: "2025-04-09", px: 31.17 },
      { date: "2025-11-12", px: 674.0 },
      { date: "2026-03-04", px: 212.95 },
      { date: "2026-08-23", px: 876.93 },
    ],
  },
];

// The nine paths from the original analysis, kept verbatim so the site can check
// its own solver against them and show where the hand-built table went wrong.
export const CLAIMED_PATHS = [
  { rank: 1, label: "AIOZ 1st → Strategy 2nd → Zcash full", legs: ["AIOZ-1", "MSTR-2", "ZEC-1", "ZEC-2"], claimed: 28276 },
  { rank: 2, label: "AIOZ 1st → Zcash full", legs: ["AIOZ-1", "ZEC-1", "ZEC-2"], claimed: 8014 },
  { rank: 3, label: "AIOZ 1st → Render", legs: ["AIOZ-1", "RNDR-1"], claimed: 2811 },
  { rank: 4, label: "Pepe 1st → Strategy 2nd → Zcash full", legs: ["PEPE-1", "MSTR-2", "ZEC-1", "ZEC-2"], claimed: 7293 },
  { rank: 5, label: "AIOZ 1st → SuperVerse 2nd", legs: ["AIOZ-1", "SUPER-2"], claimed: 441 },
  { rank: 6, label: "AIOZ 1st → Strategy 2nd", legs: ["AIOZ-1", "MSTR-2"], claimed: 318 },
  { rank: 7, label: "AIOZ 1st → Pepe 2nd", legs: ["AIOZ-1", "PEPE-2"], claimed: 312 },
  { rank: 8, label: "Pepe full sequential", legs: ["PEPE-1", "PEPE-2"], claimed: 80.5 },
  { rank: 9, label: "SuperVerse full sequential", legs: ["SUPER-1", "SUPER-2"], claimed: 100 },
];

export const TIMELINE_START = "2022-09-01";
export const TIMELINE_END = "2026-10-01";
