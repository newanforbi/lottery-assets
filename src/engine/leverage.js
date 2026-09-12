import { BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { buildLegs, solveOptimal, allChains, topChains, bestSingle } from "./solver.js";

/**
 * Isolated N× long: $1 cash + $(N-1) borrowed buys $N of the asset.
 * After a spot multiple m the position is worth N·m, the loan is still N-1,
 * so equity is N·m − (N−1). A 2× spot move at 3× leverage is 4× on cash.
 */
export function leveredMultiple(spotMultiple, leverage = BOOK_LEVERAGE) {
  return leverage * spotMultiple - (leverage - 1);
}

/** Price that wipes the cash equity on an isolated N× long, ignoring fees. */
export function liquidationPrice(entry, leverage = BOOK_LEVERAGE) {
  return entry * (1 - 1 / leverage);
}

/** Fractional drop from entry that liquidates an isolated N× long. */
export function liquidationDrop(leverage = BOOK_LEVERAGE) {
  return 1 / leverage;
}

/**
 * Haircut the levered multiple for simple interest on the borrowed slice.
 * $1 cash, $(L-1) borrowed: equity = L·m − (L-1)·(1 + apr·years).
 */
export function leveredMultipleAfterInterest(spotMultiple, years, apr, leverage = BOOK_LEVERAGE) {
  const borrowed = leverage - 1;
  return leverage * spotMultiple - borrowed * (1 + apr * years);
}

export function recoveryMultiple(lastPx, windowHigh) {
  if (!(lastPx > 0) || !(windowHigh > 0)) return 0;
  return windowHigh / lastPx;
}

/** Turn book assets into solver legs, with `multiple` set to the levered figure. */
export function buildBookLegs(leverage = BOOK_LEVERAGE, assets = BOOK_TRADEABLE) {
  const tradeable = assets.filter((a) => !a.cash && a.pivots.length >= 2);
  const legs = buildLegs(tradeable);
  return legs.map((leg) => {
    const asset = tradeable.find((a) => a.id === leg.assetId);
    const lastIndex = Math.floor((asset.pivots.length - 1) / 2);
    return {
      ...leg,
      spotMultiple: leg.multiple,
      multiple: leveredMultiple(leg.multiple, leverage),
      leverage,
      open: Boolean(asset.openLast && leg.index === lastIndex + 1),
    };
  });
}

export function bookOptimal(leverage = BOOK_LEVERAGE) {
  return solveOptimal(buildBookLegs(leverage));
}

export function bookTopChains(n = 15, leverage = BOOK_LEVERAGE) {
  return topChains(n, buildBookLegs(leverage));
}

export function bookAllChains(leverage = BOOK_LEVERAGE) {
  return allChains(buildBookLegs(leverage));
}

export function bookBestSingle(leverage = BOOK_LEVERAGE) {
  return bestSingle(buildBookLegs(leverage));
}

export function bookBestSpotSingle() {
  const legs = buildLegs(BOOK_TRADEABLE);
  return legs.reduce((a, b) => (b.multiple > a.multiple ? b : a));
}
