import test from "node:test";
import assert from "node:assert/strict";
import { CLAIMED_PATHS } from "../data/assets.js";
import {
  LEGS, getLegs, chainMultiple, chainValue, solveOptimal,
  topChains, isValidChain, allChains, randomChain, effectiveMultiple, conflicts,
} from "./solver.js";

const near = (actual, expected, tol = 0.01) =>
  assert.ok(Math.abs(actual - expected) / expected < tol,
    `expected ~${expected}, got ${actual}`);

test("builds 18 legs from 12 assets", () => {
  assert.equal(LEGS.length, 18);
  assert.equal(new Set(LEGS.map((l) => l.id)).size, 18);
});

test("leg multipliers derive from pivots", () => {
  const by = Object.fromEntries(LEGS.map((l) => [l.id, l.multiple]));
  near(by["AIOZ-1"], 90.0);
  near(by["KAS-1"], 88.396);
  near(by["SUPER-2"], 4.905);
  near(by["MSTR-2"], 3.528);
  near(by["ZEC-1"], 21.623);
  near(by["ZEC-2"], 5.861);
  near(by["PEPE-1"], 23.213);   // survives the 1e-7 price scale
  near(by["SUI-1"], 7.903);
  near(by["XRP-1"], 5.709);
  near(by["XLM-1"], 5.444);
  near(by["ZIG-1"], 34.694);
});

test("Kaspa is the runner-up opening leg, just behind AIOZ", () => {
  const firsts = LEGS.filter((l) => l.index === 1).sort((a, b) => b.multiple - a.multiple);
  assert.equal(firsts[0].id, "AIOZ-1");
  assert.equal(firsts[1].id, "KAS-1");
});

test("KAS-1 conflicts with the other 2023-era openers but not with SUI or ZEC", () => {
  const kas = LEGS.find((l) => l.id === "KAS-1");
  for (const id of ["INJ-1", "SOL-1", "MSTR-1", "ZIG-1", "AIOZ-1", "SUPER-1", "PEPE-1"]) {
    assert.ok(conflicts(kas, LEGS.find((l) => l.id === id)), `KAS-1 should conflict with ${id}`);
  }
  for (const id of ["SUI-1", "XRP-1", "XLM-1", "ZEC-1", "ZEC-2"]) {
    assert.ok(!conflicts(kas, LEGS.find((l) => l.id === id)), `KAS-1 should not conflict with ${id}`);
  }
});

test("best KAS-inclusive chain is a near-miss, short of the AIOZ optimum", () => {
  const kasChains = allChains().filter((c) => c.chain.some((l) => l.assetId === "KAS"));
  const best = kasChains[0];
  assert.deepEqual(best.chain.map((l) => l.id), ["KAS-1", "SUI-1", "ZEC-1", "ZEC-2"]);
  near(best.value, 88540, 0.01);
  assert.ok(best.value < solveOptimal().value);
});

// Every figure from the original hand-built analysis must reproduce exactly.
// If a pivot is ever edited, these are what catch the drift.
test("reproduces all eight published path figures", () => {
  for (const p of CLAIMED_PATHS) {
    near(chainMultiple(getLegs(p.legs)), p.claimed, 0.011);
  }
});

test("all eight published paths are executable", () => {
  for (const p of CLAIMED_PATHS) {
    assert.ok(isValidChain(getLegs(p.legs)), `${p.label} should be valid`);
  }
});

test("optimum is AIOZ-1 -> SUI-1 -> ZEC-1 -> ZEC-2 at ~90,147x", () => {
  const { chain, value } = solveOptimal();
  assert.deepEqual(chain.map((l) => l.id), ["AIOZ-1", "SUI-1", "ZEC-1", "ZEC-2"]);
  near(value, 90147);
  near(chainValue(chain, 10000).final, 901471854);
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
  near(final, 901471854);
  near(multiple, 90147);
});

test("friction degrades returns as modelled", () => {
  const chain = solveOptimal().chain;
  near(chainValue(chain, 10000, { capture: 1, slippage: 0.015, taxRate: 0 }).final, 798807283);
  near(chainValue(chain, 10000, { capture: 1, slippage: 0.015, taxRate: 0.3 }).final, 223315077);
  near(chainValue(chain, 10000, { capture: 0.8, slippage: 0.015, taxRate: 0.3 }).final, 24698648);
  near(chainValue(chain, 10000, { capture: 0.65, slippage: 0.015, taxRate: 0.3 }).final, 4878580);
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
