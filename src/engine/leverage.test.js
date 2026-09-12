import test from "node:test";
import assert from "node:assert/strict";
import { BOOK_TRADEABLE, BOOK_ASSETS, BOOK_CASH } from "../data/exchangeBook.js";
import {
  leveredMultiple, liquidationPrice, liquidationDrop,
  leveredMultipleAfterInterest, recoveryMultiple,
  buildBookLegs, bookOptimal, bookAllChains, bookBestSpotSingle,
} from "./leverage.js";
import { isValidChain } from "./solver.js";

const near = (actual, expected, tol = 0.01) =>
  assert.ok(Math.abs(actual - expected) / expected < tol,
    `expected ~${expected}, got ${actual}`);

test("3× leverage turns a 2× spot move into 4× on cash", () => {
  assert.equal(leveredMultiple(2, 3), 4);
  assert.equal(leveredMultiple(1, 3), 1);
  near(leveredMultiple(90, 3), 268);
});

test("isolated 3× long liquidates at a one-third drop from entry", () => {
  assert.equal(liquidationDrop(3), 1 / 3);
  near(liquidationPrice(90, 3), 60, 1e-9);
});

test("borrow interest haircuts the levered multiple", () => {
  // 2× spot, 3× leverage, 1 year at 10% on the $2 borrowed: 3*2 - 2*1.10 = 3.8
  near(leveredMultipleAfterInterest(2, 1, 0.10, 3), 3.8);
  near(leveredMultipleAfterInterest(2, 0, 0.10, 3), 4);
});

test("recovery-to-high is windowHigh / last print", () => {
  near(recoveryMultiple(100, 295), 2.95);
  assert.equal(recoveryMultiple(0, 10), 0);
});

test("the book is the 28 Coinbase names plus USDC as the cash rail", () => {
  assert.equal(BOOK_TRADEABLE.length, 28);
  assert.equal(BOOK_ASSETS.length, 29);
  assert.equal(BOOK_CASH.ticker, "USDC");
  assert.ok(BOOK_TRADEABLE.every((a) => a.pivots.length >= 2 && a.pivots.length % 2 === 0));
});

test("book leg multipliers derive from pivots, then 3× is applied", () => {
  const by = Object.fromEntries(buildBookLegs(3).map((l) => [l.id, l]));
  near(by["SOL-1"].spotMultiple, 26.2375);
  near(by["SOL-1"].multiple, 76.7125);
  near(by["ZEC-1"].spotMultiple, 5.0265);
  near(by["ZEC-2"].spotMultiple, 29.56);
  near(by["ZEC-3"].spotMultiple, 6.7536);
  near(by["PEPE-1"].spotMultiple, 24.608);
  near(by["HYPE-1"].spotMultiple, 15.213);
  near(by["SUI-1"].spotMultiple, 14.793);
  assert.equal(by["ZEC-3"].open, true);
  assert.equal(by["HYPE-2"].open, true);
  assert.equal(by["SOL-1"].open, false);
});

test("3× book optimum is SOL-1 → CRV-1 → ZEC-2 → ZEC-3", () => {
  const { chain, value } = bookOptimal(3);
  // Curve's Aug–Dec 2024 flush-to-rip (7.44×) outruns ZEC-1 (5.03×) in the
  // same autumn slot, then the two later Zcash legs finish the chain.
  assert.deepEqual(chain.map((l) => l.id), ["SOL-1", "CRV-1", "ZEC-2", "ZEC-3"]);
  near(value, 2465715, 0.01);
});

test("spot-equivalent book optimum is the same path, ~63× smaller", () => {
  const spot = bookOptimal(1);
  assert.deepEqual(spot.chain.map((l) => l.id), ["SOL-1", "CRV-1", "ZEC-2", "ZEC-3"]);
  near(spot.value, 38947, 0.01);
  near(bookOptimal(3).value / spot.value, 63.3, 0.02);
});

test("every enumerated 3× chain is calendar-valid", () => {
  for (const { chain } of bookAllChains(3)) assert.ok(isValidChain(chain));
});

test("Zcash's three-leg product beats buying the Jul-2024 low and holding", () => {
  const zec = BOOK_TRADEABLE.find((a) => a.id === "ZEC");
  const hold = zec.pivots[5].px / zec.pivots[0].px;
  const split = bookBestSpotSingle();
  // Best single *spot* leg is ZEC-2 (~29.6×), not the 81× hold — but the
  // three-leg product is the thing that beats a single hold.
  const zecLegs = buildBookLegs(1).filter((l) => l.assetId === "ZEC");
  const product = zecLegs.reduce((a, l) => a * l.spotMultiple, 1);
  assert.ok(product > hold);
  assert.ok(split.multiple > 20);
});
