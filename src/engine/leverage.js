import { BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { buildLegs, solveOptimal, allChains, topChains, bestSingle } from "./solver.js";

/** First-month / genesis prints are listing artifacts, not tradeable levels. */
export const LISTING_SEASON_DAYS = 30;

export function monthlyPoints(monthly) {
  return (monthly || []).map((row) =>
    Array.isArray(row) ? { date: `${row[0]}-01`, px: row[1] } : row
  );
}

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Drop the opening print when it is a launch wick vs the next few closes. */
export function dropLaunchOutlier(points) {
  if (points.length < 4) return points;
  const rest = points.slice(1, 7).map((p) => p.px).filter((px) => px > 0);
  if (!rest.length || !(points[0].px > 0)) return points;
  const med = median(rest);
  const first = points[0].px;
  if (first > med * 2.5 || first < med * 0.4) return points.slice(1);
  return points;
}

export function isSeasoned(iso, asset) {
  if (!asset?.listed) return true;
  // The calendar month the coin (or venue listing) started is the left-hand
  // tail on the chart — drop it. Later months are real market.
  return iso.slice(0, 7) > asset.listed.slice(0, 7);
}

/**
 * History after the coin (or venue listing) has been alive for a month.
 * Genesis / listing-open ticks are stripped so they cannot set the scale
 * or the window high/low.
 */
export function seasonedMonthly(asset) {
  const pts = monthlyPoints(asset.monthly).filter((p) => isSeasoned(p.date, asset));
  return dropLaunchOutlier(pts);
}

export function seasonedPivots(asset) {
  return (asset.pivots || []).filter((p) => isSeasoned(p.date, asset));
}

export function seasonedAsset(asset) {
  if (asset.cash) return asset;
  const pivots = seasonedPivots(asset);
  const monthly = seasonedMonthly(asset);
  const px = [...monthly.map((p) => p.px), ...pivots.map((p) => p.px)].filter((n) => n > 0);
  return {
    ...asset,
    pivots,
    monthly,
    windowLow: px.length ? Math.min(...px) : asset.windowLow,
    windowHigh: px.length ? Math.max(...px) : asset.windowHigh,
  };
}

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
  const tradeable = assets
    .filter((a) => !a.cash && a.pivots.length >= 2)
    .map(seasonedAsset)
    .filter((a) => a.pivots.length >= 2);
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
