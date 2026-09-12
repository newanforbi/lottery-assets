import { useMemo } from "react";
import { FUNDED_ASSETS, FUNDED_RULES } from "../data/krakenFunded.js";
import { buildFundedLegs, challengeLines, fundedHistoryAssets } from "../engine/funded.js";
import { formatFull } from "../ui/format.js";
import { MONO, SANS } from "../ui/atoms.jsx";
import Timeline from "./Timeline.jsx";

export default function KrakenFunded({ chain, setChain, capital }) {
  const assets = useMemo(() => fundedHistoryAssets(), []);
  const legs = useMemo(() => buildFundedLegs(), []);
  const mapped = assets.length;
  const leftover = FUNDED_ASSETS.length - mapped;
  const lines = challengeLines();

  return (
    <div>
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          background: "rgba(87,65,217,0.08)",
          border: "1px solid rgba(87,65,217,0.22)",
          marginBottom: 14,
          fontFamily: SANS,
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.65,
        }}
      >
        Official game: {formatFull(FUNDED_RULES.fee)} fee, {formatFull(lines.start)} house
        capital, pass {formatFull(lines.passAt)}, fail {formatFull(lines.failAt)}, no added
        leverage, keep 80% after a pass. The bars below are the other machine — hindsight
        rotation on the {mapped} names that already have a mapped history. {leftover} names
        in the app book (BNB, memecoins, new L1s) do not have pivots here yet.
        <span style={{ fontFamily: MONO, color: "rgba(255,255,255,0.35)" }}>
          {" "}
          +12% / −3% · 80/20 · $10K never leaves
        </span>
      </div>
      <Timeline
        assets={assets}
        legs={legs}
        chain={chain}
        setChain={setChain}
        capital={capital}
        emptyHint="Click any bar to start a chain. Same mutual-exclusion rule as the lottery. Officially this book has no extra leverage — every multiple is spot. The real challenge is +12% before −3%; these bars are what the names did with hindsight."
      />
    </div>
  );
}
