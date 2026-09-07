import { ASSETS } from "../data/assets.js";

const DAY = 86400000;

export function toTime(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Turn each asset's alternating low/high pivots into tradeable legs.
 *
 * Pivots alternate low, high, low, high — so legs are the (even, odd) pairs.
 * A pivot pair like (high -> next low) is the trough you sit through in cash,
 * which is why it never contributes a multiplier.
 */
export function buildLegs(assets = ASSETS) {
  const legs = [];
  for (const asset of assets) {
    for (let i = 0; i + 1 < asset.pivots.length; i += 2) {
      const buy = asset.pivots[i];
      const sell = asset.pivots[i + 1];
      legs.push({
        id: `${asset.id}-${i / 2 + 1}`,
        assetId: asset.id,
        assetName: asset.name,
        ticker: asset.ticker,
        color: asset.color,
        colorDim: asset.colorDim,
        index: i / 2 + 1,
        buyDate: buy.date,
        buyPx: buy.px,
        sellDate: sell.date,
        sellPx: sell.px,
        buyTime: toTime(buy.date),
        sellTime: toTime(sell.date),
        multiple: sell.px / buy.px,
        days: Math.round((toTime(sell.date) - toTime(buy.date)) / DAY),
        // The last Zcash pivot is essentially today's price: the trade is still open.
        open: asset.id === "ZEC" && i + 1 === asset.pivots.length - 1,
      });
    }
  }
  return legs.sort((a, b) => a.buyTime - b.buyTime || a.sellTime - b.sellTime);
}

export const LEGS = buildLegs();
export const LEG_BY_ID = Object.fromEntries(LEGS.map((l) => [l.id, l]));

export function getLegs(ids) {
  return ids.map((id) => LEG_BY_ID[id]).filter(Boolean);
}

/**
 * Two legs conflict when their holding periods overlap in time. One pool of
 * capital cannot be in two positions at once, so overlapping legs can never
 * appear in the same chain. Touching endpoints conflict too: you cannot sell
 * and buy the same day at two different closing prices.
 */
export function conflicts(a, b) {
  if (!a || !b || a.id === b.id) return a?.id === b?.id;
  return a.buyTime <= b.sellTime && b.buyTime <= a.sellTime;
}

/** Can this leg be added to a chain without colliding with anything already in it? */
export function canAdd(chain, leg) {
  return !chain.some((l) => conflicts(l, leg));
}

export function sortChain(chain) {
  return [...chain].sort((a, b) => a.buyTime - b.buyTime);
}

export function isValidChain(chain) {
  const s = sortChain(chain);
  for (let i = 0; i + 1 < s.length; i++) {
    if (s[i].sellTime >= s[i + 1].buyTime) return false;
  }
  return true;
}

/** Name the first colliding pair in an invalid chain, for explaining *why*. */
export function findConflict(chain) {
  const s = sortChain(chain);
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      if (conflicts(s[i], s[j])) return [s[i], s[j]];
    }
  }
  return null;
}

export function chainMultiple(chain) {
  return chain.reduce((acc, l) => acc * l.multiple, 1);
}

/**
 * Walk a chain and produce the step-by-step capital progression, including the
 * idle stretches where capital sits in cash between legs.
 */
export function chainValue(chain, capital, friction = null) {
  const s = sortChain(chain);
  const steps = [];
  let cash = capital;
  let prevSell = null;

  for (const leg of s) {
    const idleDays = prevSell === null ? 0 : Math.round((leg.buyTime - prevSell) / DAY);
    const effective = friction ? effectiveMultiple(leg, friction) : leg.multiple;
    const gross = cash * effective;
    const gain = gross - cash;
    const tax = friction && gain > 0 ? gain * friction.taxRate : 0;
    const out = gross - tax;
    steps.push({
      leg,
      idleDays,
      capitalIn: cash,
      effective,
      gross,
      gain,
      tax,
      capitalOut: out,
    });
    cash = out;
    prevSell = leg.sellTime;
  }

  return { steps, final: cash, multiple: capital > 0 ? cash / capital : 0 };
}

/**
 * Friction model.
 *  capture  — the share of each move you actually catch, applied in log space,
 *             so 65% capture turns a 90× leg into 90^0.65 ≈ 19.3×. Modelling it
 *             this way keeps a partial miss proportional to the size of the move.
 *  slippage — spread paid on both entry and exit, hence squared.
 *  taxRate  — applied to realised gains at each exit, in chainValue above.
 */
export function effectiveMultiple(leg, { capture = 1, slippage = 0 }) {
  return Math.pow(leg.multiple, capture) * Math.pow(1 - slippage, 2);
}

/**
 * Maximum-product chain of non-overlapping legs.
 *
 * This is weighted interval scheduling: sort by sell date, then for each leg take
 * the best chain that finished strictly before this one opens. Products of
 * multipliers, so it maximises the product rather than a sum, but the recurrence
 * is identical.
 */
export function solveOptimal(legs = LEGS) {
  const s = [...legs].sort((a, b) => a.sellTime - b.sellTime);
  const best = s.map((leg) => ({ value: leg.multiple, chain: [leg] }));

  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (s[j].sellTime < s[i].buyTime) {
        const candidate = best[j].value * s[i].multiple;
        if (candidate > best[i].value) {
          best[i] = { value: candidate, chain: [...best[j].chain, s[i]] };
        }
      }
    }
  }

  return best.reduce((a, b) => (b.value > a.value ? b : a), { value: 0, chain: [] });
}

/**
 * Every valid chain, ranked. 18 legs with heavy overlap in the 2024 window keeps
 * the search space small enough to enumerate exhaustively in well under a
 * millisecond, so there is no need to approximate.
 */
export function allChains(legs = LEGS) {
  const s = [...legs].sort((a, b) => a.sellTime - b.sellTime);
  const out = [];
  const walk = (start, lastSell, value, chain) => {
    if (chain.length) out.push({ value, chain: [...chain] });
    for (let i = start; i < s.length; i++) {
      if (s[i].buyTime > lastSell) {
        chain.push(s[i]);
        walk(i + 1, s[i].sellTime, value * s[i].multiple, chain);
        chain.pop();
      }
    }
  };
  walk(0, -Infinity, 1, []);
  return out.sort((a, b) => b.value - a.value);
}

export function topChains(n = 25, legs = LEGS) {
  return allChains(legs).slice(0, n);
}

/** A random valid chain, biased toward longer ones so a draw feels worth watching. */
export function randomChain(legs = LEGS) {
  const s = [...legs].sort((a, b) => a.sellTime - b.sellTime);
  const chain = [];
  let lastSell = -Infinity;
  let pool = s.filter((l) => l.buyTime > lastSell);
  while (pool.length) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    chain.push(pick);
    lastSell = pick.sellTime;
    pool = s.filter((l) => l.buyTime > lastSell);
    if (pool.length && Math.random() < 0.12) break;
  }
  return chain;
}

/** Best single-leg buy-and-hold, as the do-nothing baseline. */
export function bestSingle(legs = LEGS) {
  return legs.reduce((a, b) => (b.multiple > a.multiple ? b : a));
}
