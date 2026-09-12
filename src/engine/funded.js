import { ASSETS } from "../data/assets.js";
import { BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { FUNDED_ASSETS, FUNDED_RULES, FUNDED_TIERS } from "../data/krakenFunded.js";
import { solveOptimal, randomChain } from "./solver.js";
import { buildBookLegs } from "./leverage.js";

const cents = (n) => Math.round(n * 100) / 100;

export function challengeLines(start = FUNDED_RULES.start, rules = FUNDED_RULES) {
  const passAt = cents(start * (1 + rules.passPct));
  const failAt = cents(start * (1 - rules.failPct));
  return {
    start,
    passAt,
    failAt,
    needGain: cents(passAt - start),
    maxLoss: cents(start - failAt),
    fee: FUNDED_TIERS.find((t) => t.start === start)?.fee ?? rules.fee,
  };
}

/** Round-trip spread haircut: 0.04% in and 0.04% out. */
export function afterSpread(multiple, rules = FUNDED_RULES) {
  return multiple * Math.pow(1 - rules.spreadEachSide, 2);
}

/**
 * Spot move required on a single all-in buy to hit the +12% line,
 * after paying the built-in spread on both sides.
 */
export function spotMoveToPass(rules = FUNDED_RULES) {
  const net = 1 + rules.passPct;
  return net / Math.pow(1 - rules.spreadEachSide, 2);
}

export function spotMoveToFail(rules = FUNDED_RULES) {
  const net = 1 - rules.failPct;
  return net / Math.pow(1 - rules.spreadEachSide, 2);
}

/** What a funded withdrawal pays you, and what the account resets to. */
export function fundedPayout(start, equity, rules = FUNDED_RULES) {
  const profit = equity - start;
  if (profit <= 0) return { profit: 0, trader: 0, house: 0, resetTo: start, eligible: false };
  const trader = profit * rules.traderSplit;
  const house = profit * rules.houseSplit;
  return {
    profit,
    trader,
    house,
    resetTo: start,
    eligible: trader >= rules.minPayout,
  };
}

export function challengeProgress(equity, start = FUNDED_RULES.start, rules = FUNDED_RULES) {
  const { passAt, failAt } = challengeLines(start, rules);
  if (equity >= passAt) return "pass";
  if (equity <= failAt) return "fail";
  return "open";
}

/**
 * Funded names that already have a mapped pivot history — the 3× book
 * overlap, plus lottery-only names (Injective). No added leverage: the
 * official Funded book is spot in dollars.
 */
export function fundedHistoryAssets() {
  const history = new Map();
  for (const asset of BOOK_TRADEABLE) history.set(asset.id, asset);
  for (const asset of ASSETS) {
    if (!history.has(asset.id)) history.set(asset.id, asset);
  }
  return FUNDED_ASSETS
    .map((row) => {
      const asset = history.get(row.id);
      if (!asset || (asset.pivots || []).length < 2) return null;
      return {
        ...asset,
        name: row.name,
        ticker: row.id,
        color: row.color,
        colorDim: asset.colorDim || `${row.color}1f`,
      };
    })
    .filter(Boolean);
}

export function buildFundedLegs() {
  return buildBookLegs(1, fundedHistoryAssets());
}

export function fundedOptimal() {
  return solveOptimal(buildFundedLegs());
}

export function fundedRandom() {
  return randomChain(buildFundedLegs());
}
