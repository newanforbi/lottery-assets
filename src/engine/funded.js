import { ASSETS } from "../data/assets.js";
import { BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { FUNDED_ASSETS, FUNDED_MODEL, FUNDED_RULES, FUNDED_TIERS } from "../data/krakenFunded.js";
import { toTime } from "./solver.js";
import { seasonedMonthly } from "./leverage.js";

const cents = (n) => Math.round(n * 100) / 100;
const DAY = 86400000;

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

function spread(model = FUNDED_MODEL) {
  return model.spreadEachSide;
}

/** Mark-to-market after model buy and sell spreads. */
export function afterSpread(multiple, model = FUNDED_MODEL) {
  const s = spread(model);
  return (multiple * (1 - s)) / (1 + s);
}

export function spotMoveToPass(rules = FUNDED_RULES, model = FUNDED_MODEL) {
  return (1 + rules.passPct) * (1 + spread(model)) / (1 - spread(model));
}

export function spotMoveToFail(rules = FUNDED_RULES, model = FUNDED_MODEL) {
  return (1 - rules.failPct) * (1 + spread(model)) / (1 - spread(model));
}

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

function monthCloseDate(iso) {
  const [y, m] = iso.slice(0, 7).split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

/**
 * Walk prints after an all-in entry. First touch of +12% after model spread
 * is a pass; first touch of −3% is a fail. The challenge ends at either.
 */
export function walkCorridor(entryPx, entryDate, points, rules = FUNDED_RULES, model = FUNDED_MODEL) {
  const passNet = 1 + rules.passPct;
  const failNet = 1 - rules.failPct;
  const dated = (points || [])
    .map((p) => ({ ...p, close: p.close || monthCloseDate(p.date) }))
    .filter((p) => p.close > entryDate && p.px > 0)
    .sort((a, b) => (a.close < b.close ? -1 : 1));

  for (const p of dated) {
    const net = afterSpread(p.px / entryPx, model);
    if (net <= failNet) return { outcome: "fail", at: p.close, px: p.px, net };
    // The challenge ends at +12%. A sparse first print that overshoots
    // (a 38× high with no monthly path) is still a pass, not a lottery multiple.
    if (net >= passNet) return { outcome: "pass", at: p.close, px: p.px, net: passNet, printNet: net };
  }
  const last = dated[dated.length - 1];
  return {
    outcome: "open",
    at: last?.close ?? null,
    px: last?.px ?? entryPx,
    net: last ? afterSpread(last.px / entryPx, model) : 1,
  };
}

function corridorPoints(asset) {
  const monthly = seasonedMonthly(asset);
  if (monthly.length >= 2) return { points: monthly, sparse: false };
  const highs = (asset.pivots || []).filter((_, i) => i % 2 === 1).map((p) => ({ date: p.date, px: p.px, close: p.date }));
  return { points: highs, sparse: true };
}

/** One corridor attempt per pivot low: +12% before −3%, then the account stops. */
export function buildFundedCorridors(assets = fundedHistoryAssets(), rules = FUNDED_RULES) {
  const out = [];
  for (const asset of assets) {
    const { points, sparse } = corridorPoints(asset);
    const lows = (asset.pivots || []).filter((_, i) => i % 2 === 0);
    lows.forEach((buy, i) => {
      const walk = walkCorridor(buy.px, buy.date, points, rules);
      const endDate = walk.at || buy.date;
      const days = Math.max(0, Math.round((toTime(endDate) - toTime(buy.date)) / DAY));
      out.push({
        id: `${asset.id}-${i + 1}`,
        assetId: asset.id,
        assetName: asset.name,
        ticker: asset.id,
        color: asset.color,
        colorDim: asset.colorDim,
        index: i + 1,
        buyDate: buy.date,
        buyPx: buy.px,
        sellDate: endDate,
        sellPx: walk.px,
        buyTime: toTime(buy.date),
        sellTime: toTime(endDate),
        multiple: walk.net,
        days,
        outcome: walk.outcome,
        sparse,
        leverage: 1,
      });
    });
  }
  return out.sort((a, b) => a.buyTime - b.buyTime);
}

export function fundedPasses(legs = buildFundedCorridors()) {
  return legs.filter((l) => l.outcome === "pass").sort((a, b) => a.days - b.days || b.multiple - a.multiple);
}

/** Fastest clean +12% before −3%. The challenge ends there — no compounding. */
export function fundedOptimal() {
  const [best] = fundedPasses();
  return { chain: best ? [best] : [], value: best?.multiple ?? 0 };
}

export function fundedRandom() {
  const passes = fundedPasses();
  if (!passes.length) return [];
  return [passes[Math.floor(Math.random() * passes.length)]];
}

/** What the odometer should show: you keep a pass, not the house $10K. */
export function fundedScore(chain, start = FUNDED_RULES.start, rules = FUNDED_RULES) {
  const lines = challengeLines(start, rules);
  const leg = chain[0];
  if (!leg) {
    return { kind: "idle", final: 0, multiple: 0, equity: start, fee: lines.fee, caption: "You keep" };
  }
  if (leg.outcome === "pass") {
    const payout = fundedPayout(start, lines.passAt, rules);
    return {
      kind: "pass",
      final: payout.trader,
      multiple: 1 + rules.passPct,
      equity: lines.passAt,
      fee: lines.fee,
      caption: "You keep",
    };
  }
  if (leg.outcome === "fail") {
    return {
      kind: "fail",
      final: 0,
      multiple: 1 - rules.failPct,
      equity: lines.failAt,
      fee: lines.fee,
      caption: "Wiped",
    };
  }
  return {
    kind: "open",
    final: start * leg.multiple,
    multiple: leg.multiple,
    equity: start * leg.multiple,
    fee: lines.fee,
    caption: "Marked",
  };
}
