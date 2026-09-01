import test from "node:test";
import assert from "node:assert/strict";
import { CLAIMED_PATHS } from "../data/assets.js";
import {
  LEGS, getLegs, chainMultiple, chainValue, solveOptimal,
  topChains, isValidChain, findConflict, allChains, randomChain, effectiveMultiple,
} from "./solver.js";

const near = (actual, expected, tol = 0.01) =>
  assert.ok(Math.abs(actual - expected) / expected < tol,
    `expected ~${expected}, got ${actual}`);

test("builds 16 legs from 10 assets", () => {
  assert.equal(LEGS.length, 16);
  assert.equal(new Set(LEGS.map((l) => l.id)).size, 16);
});

test("leg multipliers derive from pivots", () => {
  const by = Object.fromEntries(LEGS.map((l) => [l.id, l.multiple]));
  near(by["AIOZ-1"], 90.0);
  near(by["SUPER-2"], 4.905);
  near(by["MSTR-2"], 3.528);
  near(by["ZEC-1"], 21.623);
  near(by["ZEC-2"], 4.118);
  near(by["PEPE-1"], 23.213);   // survives the 1e-7 price scale
  near(by["RNDR-1"], 31.238);
  near(by["SUI-1"], 7.903);
  near(by["XRP-1"], 5.709);
});

// Every figure from the original hand-built analysis must reproduce exactly.
// If a pivot is ever edited, these are what catch the drift.
test("reproduces all nine published path figures", () => {
  for (const p of CLAIMED_PATHS) {
    near(chainMultiple(getLegs(p.legs)), p.claimed, 0.011);
  }
});

test("AIOZ 1st -> Render is not executable", () => {
  const chain = getLegs(["AIOZ-1", "RNDR-1"]);
  assert.equal(isValidChain(chain), false);
  const [a, b] = findConflict(chain);
  assert.deepEqual([a.id, b.id].sort(), ["AIOZ-1", "RNDR-1"]);
});

test("the other eight published paths are executable", () => {
  for (const p of CLAIMED_PATHS.filter((p) => p.rank !== 3)) {
    assert.ok(isValidChain(getLegs(p.legs)), `${p.label} should be valid`);
  }
});

test("optimum is AIOZ-1 -> SUI-1 -> ZEC-1 -> ZEC-2 at ~63,337x", () => {
  const { chain, value } = solveOptimal();
  assert.deepEqual(chain.map((l) => l.id), ["AIOZ-1", "SUI-1", "ZEC-1", "ZEC-2"]);
  near(value, 63337);
  near(chainValue(chain, 10000).final, 633369692);
});

test("optimum beats the prior XRP middle-leg path", () => {
  const xrpPath = chainMultiple(getLegs(["AIOZ-1", "XRP-1", "ZEC-1", "ZEC-2"]));
  assert.ok(solveOptimal().value > xrpPath);
});

test("optimum beats the published #1 path", () => {
  const published = chainMultiple(getLegs(CLAIMED_PATHS[0].legs));
  assert.ok(solveOptimal().value > published);
});

test("exhaustive enumeration agrees with the DP", () => {
  near(topChains(1)[0].value, solveOptimal().value, 1e-9);
});

test("every enumerated chain is valid", () => {
  for (const { chain } of allChains()) assert.ok(isValidChain(chain));
});

test("random draws are always valid", () => {
  for (let i = 0; i < 200; i++) {
    const c = randomChain();
    assert.ok(c.length > 0 && isValidChain(c));
  }
});

test("capital progression compounds through the chain", () => {
  const { steps, final, multiple } = chainValue(solveOptimal().chain, 10000);
  assert.equal(steps.length, 4);
  assert.equal(steps[0].capitalIn, 10000);
  for (let i = 1; i < steps.length; i++) {
    assert.equal(steps[i].capitalIn, steps[i - 1].capitalOut);
    assert.ok(steps[i].idleDays > 0, "capital sits in cash between legs");
  }
  near(final, 633369692);
  near(multiple, 63337);
});

test("friction degrades returns as modelled", () => {
  const chain = solveOptimal().chain;
  near(chainValue(chain, 10000, { capture: 1, slippage: 0.015, taxRate: 0 }).final, 561238069);
  near(chainValue(chain, 10000, { capture: 1, slippage: 0.015, taxRate: 0.3 }).final, 161554638);
  near(chainValue(chain, 10000, { capture: 0.8, slippage: 0.015, taxRate: 0.3 }).final, 19211468);
  near(chainValue(chain, 10000, { capture: 0.65, slippage: 0.015, taxRate: 0.3 }).final, 4001181);
});

test("zero friction is a no-op", () => {
  const chain = solveOptimal().chain;
  near(chainValue(chain, 10000, { capture: 1, slippage: 0, taxRate: 0 }).final,
       chainValue(chain, 10000).final, 1e-9);
});

test("capture applies in log space", () => {
  const aioz = LEGS.find((l) => l.id === "AIOZ-1");
  near(effectiveMultiple(aioz, { capture: 0.65, slippage: 0 }), Math.pow(90, 0.65));
});

test("ZEC-2 is flagged as an open position", () => {
  assert.equal(LEGS.find((l) => l.id === "ZEC-2").open, true);
  assert.equal(LEGS.find((l) => l.id === "ZEC-1").open, false);
});
