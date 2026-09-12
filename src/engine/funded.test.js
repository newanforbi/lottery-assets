import test from "node:test";
import assert from "node:assert/strict";
import {
  afterSpread,
  buildFundedLegs,
  challengeLines,
  challengeProgress,
  fundedHistoryAssets,
  fundedOptimal,
  fundedPayout,
  spotMoveToFail,
  spotMoveToPass,
} from "./funded.js";
import { FUNDED_RULES, FUNDED_ASSETS, FUNDED_TIERS } from "../data/krakenFunded.js";
import { isValidChain } from "./solver.js";

const near = (actual, expected, tol = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < tol, `expected ~${expected}, got ${actual}`);

test("challenge lines: +12% pass, −3% fail, $90 fee on the $10K tier", () => {
  const { start, passAt, failAt, needGain, maxLoss, fee } = challengeLines();
  assert.equal(start, 10_000);
  assert.equal(passAt, 11_200);
  assert.equal(failAt, 9_700);
  assert.equal(needGain, 1_200);
  assert.equal(maxLoss, 300);
  assert.equal(fee, 90);
});

test("smaller tiers keep the same percentages", () => {
  const k = challengeLines(1_000);
  assert.equal(k.passAt, 1_120);
  assert.equal(k.failAt, 970);
  assert.equal(k.fee, 20);
});

test("published tiers are $1K/$20, $5K/$50, $10K/$90", () => {
  assert.deepEqual(
    FUNDED_TIERS.map((t) => [t.start, t.fee]),
    [[1000, 20], [5000, 50], [10000, 90]]
  );
});

test("round-trip 0.04% × 2 haircuts a multiple by (1 − spread)²", () => {
  const r = afterSpread(2);
  near(r, 2 * (1 - FUNDED_RULES.spreadEachSide) ** 2);
  assert.ok(r < 2);
});

test("all-in pass / fail spots include the spread", () => {
  const pass = spotMoveToPass();
  const fail = spotMoveToFail();
  near(afterSpread(pass), 1 + FUNDED_RULES.passPct);
  near(afterSpread(fail), 1 - FUNDED_RULES.failPct);
  assert.ok(pass > 1.12);
  assert.ok(fail > 0.97);
});

test("funded payout: 80% of profit, $10K itself never leaves", () => {
  const p = fundedPayout(10_000, 11_200);
  assert.equal(p.profit, 1_200);
  assert.equal(p.trader, 960);
  assert.equal(p.house, 240);
  assert.equal(p.resetTo, 10_000);
  assert.equal(p.eligible, true);
});

test("official $10,500 example pays $400 / $100 and resets", () => {
  const p = fundedPayout(10_000, 10_500);
  assert.equal(p.trader, 400);
  assert.equal(p.house, 100);
  assert.equal(p.resetTo, 10_000);
});

test("payouts under $20 are marked ineligible", () => {
  const p = fundedPayout(10_000, 10_020);
  assert.equal(p.trader, 16);
  assert.equal(p.eligible, false);
});

test("challenge progress is pass / fail / open against fixed lines", () => {
  assert.equal(challengeProgress(FUNDED_RULES.start), "open");
  assert.equal(challengeProgress(11_200), "pass");
  assert.equal(challengeProgress(9_700), "fail");
  assert.equal(challengeProgress(11_199), "open");
  assert.equal(challengeProgress(9_701), "open");
});

test("funded book has the 58 names from the screenshots", () => {
  assert.equal(FUNDED_ASSETS.length, 58);
  const ids = new Set(FUNDED_ASSETS.map((a) => a.id));
  for (const id of [
    "BTC", "ETH", "HYPE", "ZEC", "PEPE", "XPL", "PUMP", "FARTCOIN",
    "ASTER", "WIF", "TRUMP", "MOODENG", "GRASS", "KAITO", "BNB", "S",
  ]) {
    assert.ok(ids.has(id), `missing ${id}`);
  }
  assert.ok(!ids.has("XLM"), "XLM is 3× book, not this Funded screenshot");
  assert.ok(!ids.has("PAXG"), "PAXG is 3× book, not this Funded screenshot");
});

test("lottery overlap is the seven names that actually sit on both books", () => {
  const lotto = FUNDED_ASSETS.filter((a) => a.inLottery).map((a) => a.id).sort();
  assert.deepEqual(lotto, ["INJ", "PEPE", "SOL", "SUI", "WLD", "XRP", "ZEC"]);
});

test("funded history lanes are the mapped names, including Injective, no leverage", () => {
  const assets = fundedHistoryAssets();
  const ids = assets.map((a) => a.id);
  assert.ok(ids.includes("INJ"));
  assert.ok(ids.includes("SOL"));
  assert.ok(ids.includes("HYPE"));
  assert.ok(!ids.includes("BNB"));
  assert.ok(!ids.includes("XLM"));
  const legs = buildFundedLegs();
  assert.ok(legs.length >= 20);
  for (const leg of legs) {
    assert.equal(leg.leverage, 1);
    near(leg.multiple, leg.spotMultiple, 1e-12);
  }
  const opt = fundedOptimal();
  assert.ok(opt.chain.length >= 3);
  assert.ok(isValidChain(opt.chain));
});
