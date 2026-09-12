import { BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import { buildLegs, solveOptimal, allChains, topChains, bestSingle, randomChain } from "./solver.js";

/** Model APR on the borrowed slice — not Coinbase's live rate. */
export const BOOK_BORROW_APR = 0.10;

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

/**
 * Isolated N× dies if a monthly close between entry and exit prints at or
 * under the liq line. These are closes, not lows — an intra-month wick can
 * still have killed a leg this function calls survived.
 */
/** Monthly rows are stored as YYYY-MM-01; the print is the month's close. */
function monthCloseDate(iso) {
  const [y, m] = iso.slice(0, 7).split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}

export function pathHitsLiquidation(buyDate, buyPx, sellDate, monthly, leverage = BOOK_LEVERAGE) {
  if (!(leverage > 1) || !(buyPx > 0)) return false;
  const liq = liquidationPrice(buyPx, leverage);
  return (monthly || []).some((p) => {
    const close = monthCloseDate(p.date);
    return close > buyDate && close < sellDate && p.px > 0 && p.px <= liq;
  });
}

function decorateBookLeg(leg, asset, leverage, apr) {
  const lastIndex = Math.floor((asset.pivots.length - 1) / 2);
  const liquidated = pathHitsLiquidation(
    leg.buyDate, leg.buyPx, leg.sellDate, asset.monthly, leverage
  );
  const years = leg.days / 365.25;
  const endpoint = leveredMultiple(leg.multiple, leverage);
  const afterInterest = apr > 0
    ? leveredMultipleAfterInterest(leg.multiple, years, apr, leverage)
    : endpoint;
  return {
    ...leg,
    spotMultiple: leg.multiple,
    endpointMultiple: endpoint,
    multiple: liquidated ? 0 : Math.max(afterInterest, 0),
    leverage,
    apr,
    liquidated,
    survived: !liquidated,
    liq: liquidationPrice(leg.buyPx, leverage),
    open: Boolean(asset.openLast && leg.index === lastIndex + 1),
  };
}

/** Every book leg, including ones that would have liquidated mid-hold. */
export function buildBookLegs(leverage = BOOK_LEVERAGE, assets = BOOK_TRADEABLE, opts = {}) {
  const apr = opts.apr ?? (leverage > 1 ? BOOK_BORROW_APR : 0);
  const tradeable = assets
    .filter((a) => !a.cash && (a.pivots || []).length >= 2)
    .map(seasonedAsset)
    .filter((a) => a.pivots.length >= 2);
  const byId = Object.fromEntries(tradeable.map((a) => [a.id, a]));
  return buildLegs(tradeable).map((leg) => decorateBookLeg(leg, byId[leg.assetId], leverage, apr));
}

/** Legs the 3× solver is allowed to use: survived the monthly path. */
export function survivingBookLegs(leverage = BOOK_LEVERAGE, assets = BOOK_TRADEABLE, opts = {}) {
  return buildBookLegs(leverage, assets, opts).filter((leg) => leg.survived && leg.multiple > 0);
}

export function bookOptimal(leverage = BOOK_LEVERAGE) {
  return solveOptimal(survivingBookLegs(leverage));
}

export function bookTopChains(n = 15, leverage = BOOK_LEVERAGE) {
  return topChains(n, survivingBookLegs(leverage));
}

export function bookAllChains(leverage = BOOK_LEVERAGE) {
  return allChains(survivingBookLegs(leverage));
}

export function bookBestSingle(leverage = BOOK_LEVERAGE) {
  return bestSingle(survivingBookLegs(leverage));
}

export function bookRandom(leverage = BOOK_LEVERAGE) {
  return randomChain(survivingBookLegs(leverage));
}

export function bookBestSpotSingle() {
  const legs = buildLegs(BOOK_TRADEABLE);
  return legs.reduce((a, b) => (b.multiple > a.multiple ? b : a));
}
