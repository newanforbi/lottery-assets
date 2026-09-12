import test from "node:test";
import assert from "node:assert/strict";
import {
  afterSpread,
  buildFundedCorridors,
  challengeLines,
  challengeProgress,
  fundedHistoryAssets,
  fundedOptimal,
  fundedPasses,
  fundedPayout,
  fundedScore,
  spotMoveToFail,
  spotMoveToPass,
  walkCorridor,
} from "./funded.js";
import { FUNDED_ASSETS, FUNDED_MODEL, FUNDED_RULES, FUNDED_TIERS } from "../data/krakenFunded.js";

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

test("model spread is labeled separately from the 12/3/80 contract", () => {
  assert.equal(FUNDED_RULES.spreadEachSide, undefined);
  assert.equal(FUNDED_MODEL.spreadEachSide, 0.0004);
  const r = afterSpread(2);
  near(r, 2 * (1 - 0.0004) / (1 + 0.0004));
  assert.ok(r < 2);
});

test("all-in pass / fail spots include the model spread", () => {
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

test("a sparse 38× first print is still a +12% pass, not a lottery multiple", () => {
  const walk = walkCorridor(1, "2023-01-01", [{ date: "2023-06-01", px: 38 }]);
  assert.equal(walk.outcome, "pass");
  near(walk.net, 1.12);
  assert.ok(walk.printNet > 30);
});

test("a +12% print before −3% is a pass; the reverse fails", () => {
  const pass = walkCorridor(100, "2024-01-15", [
    { date: "2024-02-01", px: 105 },
    { date: "2024-03-01", px: 113 },
  ]);
  assert.equal(pass.outcome, "pass");
  const fail = walkCorridor(100, "2024-01-15", [
    { date: "2024-02-01", px: 96 },
    { date: "2024-03-01", px: 130 },
  ]);
  assert.equal(fail.outcome, "fail");
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

test("funded corridors score +12% before −3%, not multi-year compounding", () => {
  const assets = fundedHistoryAssets();
  assert.ok(assets.some((a) => a.id === "INJ"));
  const legs = buildFundedCorridors();
  assert.ok(legs.length >= 10);
  const passes = fundedPasses(legs);
  assert.ok(passes.length >= 1);
  assert.ok(passes.every((l) => l.outcome === "pass"));
  assert.ok(passes.every((l) => l.multiple >= 1.12));
  const opt = fundedOptimal();
  assert.equal(opt.chain.length, 1);
  assert.equal(opt.chain[0].outcome, "pass");
  assert.ok(opt.chain[0].days <= passes[passes.length - 1].days);
  assert.ok(opt.value < 3, "a pass is about +12%, not a lottery multiple");
  near(opt.value, 1.12, 1e-9);
  const keep = fundedScore(opt.chain, 10_000);
  assert.equal(keep.kind, "pass");
  assert.equal(keep.final, 960);
});
