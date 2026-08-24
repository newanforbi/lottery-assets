import { useMemo, useState } from "react";
import { CLAIMED_PATHS } from "../data/assets.js";
import {
  topChains, getLegs, chainMultiple, isValidChain, findConflict, solveOptimal, bestSingle,
} from "../engine/solver.js";
import { formatCurrency, formatMultiple, formatDateShort } from "../ui/format.js";
import { MONO, SANS, Eyebrow, Panel, Chip, Button, useMediaQuery } from "../ui/atoms.jsx";

function ChainPills({ chain, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      {chain.map((leg, i) => (
        <span key={leg.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {i > 0 && <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.2)" }}>→</span>}
          <span
            style={{
              fontFamily: MONO, fontSize: compact ? 9 : 10, padding: "2px 7px", borderRadius: 4,
              color: leg.color, background: `${leg.color}14`, border: `1px solid ${leg.color}33`,
              whiteSpace: "nowrap",
            }}
          >
            {leg.ticker}·{leg.index}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Leaderboard({ capital, setChain, setTab }) {
  const compact = useMediaQuery("(max-width: 720px)");
  const [count, setCount] = useState(15);
  const ranked = useMemo(() => topChains(60), []);
  const optimal = useMemo(() => solveOptimal(), []);
  const single = useMemo(() => bestSingle(), []);
  const publishedTop = chainMultiple(getLegs(CLAIMED_PATHS[0].legs));

  const load = (chain) => { setChain(chain); setTab("lottery"); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel accent="#00E5FF" title="What the solver found">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 12px" }}>
          Ranking paths by multiplier alone hides the only rule that matters: two positions that
          overlap in time can never both be held. Searching every chain that actually obeys the
          calendar turns up a winner that the hand-built table missed —{" "}
          <span style={{ color: "#00E5FF", fontFamily: MONO }}>
            {optimal.chain.map((l) => l.id).join(" → ")}
          </span>{" "}
          at <span style={{ color: "#F4B728", fontFamily: MONO }}>{formatMultiple(optimal.value)}</span>, ahead of
          the published best at <span style={{ fontFamily: MONO }}>{formatMultiple(publishedTop)}</span>.
          The difference is one swap: SuperVerse's second leg returns{" "}
          <span style={{ fontFamily: MONO, color: "#FF4FD8" }}>4.91×</span> against Strategy's{" "}
          <span style={{ fontFamily: MONO, color: "#FF7A45" }}>3.53×</span>, and both fit the same
          autumn-2024 window.
        </p>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          For scale: the best single buy-and-hold in the whole set is{" "}
          <span style={{ fontFamily: MONO, color: single.color }}>
            {single.ticker} at {formatMultiple(single.multiple)}
          </span>. Chaining is worth roughly{" "}
          <span style={{ fontFamily: MONO, color: "#fff" }}>{Math.round(optimal.value / single.multiple)}×</span>{" "}
          more than the best thing you could have simply bought and forgotten.
        </p>
      </Panel>

      <Panel title={`Every valid chain, ranked — top ${count}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {ranked.slice(0, count).map((entry, i) => {
            const isOptimal = i === 0;
            return (
              <button
                key={entry.chain.map((l) => l.id).join("|")}
                onClick={() => load(entry.chain)}
                title="Load this chain into the lottery"
                style={{
                  display: "flex", alignItems: "center", gap: compact ? 10 : 14, textAlign: "left",
                  padding: compact ? "10px 10px" : "11px 14px", borderRadius: 7, cursor: "pointer",
                  background: isOptimal ? "rgba(0,229,255,0.07)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isOptimal ? "rgba(0,229,255,0.35)" : "rgba(255,255,255,0.055)"}`,
                  flexWrap: compact ? "wrap" : "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO, fontSize: 11, width: 24, flexShrink: 0,
                    color: isOptimal ? "#00E5FF" : "rgba(255,255,255,0.3)", fontWeight: 600,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <ChainPills chain={entry.chain} compact={compact} />
                </span>
                <span
                  style={{
                    fontFamily: MONO, fontSize: compact ? 12 : 14, fontWeight: 600,
                    color: isOptimal ? "#F4B728" : "rgba(255,255,255,0.8)",
                    minWidth: 88, textAlign: "right", flexShrink: 0,
                  }}
                >
                  {formatCurrency(entry.value * capital)}
                </span>
                <span
                  style={{
                    fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.35)",
                    minWidth: 64, textAlign: "right", flexShrink: 0,
                  }}
                >
                  {formatMultiple(entry.value)}
                </span>
              </button>
            );
          })}
        </div>
        {count < ranked.length && (
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => setCount((c) => c + 15)}>Show more</Button>
          </div>
        )}
      </Panel>

      <Panel title="Checking the original nine paths">
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: "0 0 14px" }}>
          Each path from the source analysis, recomputed from the price pivots and tested against the
          calendar. Every multiplier reproduces — but one of them describes a trade that could not
          have been made.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CLAIMED_PATHS.map((p) => {
            const legs = getLegs(p.legs);
            const value = chainMultiple(legs);
            const valid = isValidChain(legs);
            const clash = valid ? null : findConflict(legs);
            const matches = Math.abs(value - p.claimed) / p.claimed < 0.011;
            return (
              <div
                key={p.label}
                style={{
                  padding: compact ? "11px 12px" : "12px 15px", borderRadius: 7,
                  background: valid ? "rgba(255,255,255,0.025)" : "rgba(255,60,60,0.05)",
                  border: `1px solid ${valid ? "rgba(255,255,255,0.055)" : "rgba(255,60,60,0.25)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>#{p.rank}</span>
                    <span style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>{p.label}</span>
                    {valid ? <Chip color="#4BE04B">EXECUTABLE</Chip> : <Chip color="#FF3C3C">OVERLAPS</Chip>}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: valid ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {formatMultiple(value)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: matches ? "rgba(75,224,75,0.6)" : "#FF3C3C" }}>
                      {matches ? "matches published" : `published ${formatMultiple(p.claimed)}`}
                    </span>
                  </div>
                </div>
                {clash && (
                  <div style={{ marginTop: 9, fontFamily: MONO, fontSize: 10.5, color: "rgba(255,120,120,0.85)", lineHeight: 1.6 }}>
                    {clash[0].ticker} runs {formatDateShort(clash[0].buyDate)} → {formatDateShort(clash[0].sellDate)},
                    which swallows {clash[1].ticker}'s {formatDateShort(clash[1].buyDate)} → {formatDateShort(clash[1].sellDate)}.
                    The arithmetic is right; the trade is impossible. One pool of capital cannot hold both.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
