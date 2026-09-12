import { useMemo } from "react";
import { FUNDED_ASSETS, FUNDED_MODEL } from "../data/krakenFunded.js";
import { buildFundedCorridors, challengeLines, fundedHistoryAssets, fundedPayout, fundedScore } from "../engine/funded.js";
import { formatFull } from "../ui/format.js";
import { SANS } from "../ui/atoms.jsx";
import Timeline from "./Timeline.jsx";

export default function KrakenFunded({ chain, setChain, capital }) {
  const assets = useMemo(() => fundedHistoryAssets(), []);
  const legs = useMemo(() => buildFundedCorridors(), []);
  const lines = challengeLines(capital);
  const passes = legs.filter((l) => l.outcome === "pass").length;
  const fails = legs.filter((l) => l.outcome === "fail").length;
  const leftover = FUNDED_ASSETS.length - assets.length;
  const selected = chain[0];
  const payout = selected?.outcome === "pass"
    ? fundedPayout(lines.start, lines.passAt)
    : null;

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
        Corridor, not a lottery. All-in from each mapped low: first +12% after a{" "}
        {FUNDED_MODEL.spreadEachSide * 10000} bp model spread is a pass; first −3%
        from start is a fail. The challenge ends at either. {passes} passes, {fails}{" "}
        fails on the {assets.length} names that have history. {leftover} app-book
        names have no pivots. Fee {formatFull(lines.fee)} on this tier
        is gone either way. A pass on {formatFull(lines.start)} pays you{" "}
        {formatFull(payout?.trader ?? fundedPayout(lines.start, lines.passAt).trader)};
        the {formatFull(lines.start)} never leaves.
        {fails === 0 && " Zero fails on this tape: the mapped lows are hindsight troughs, and no monthly close printed −3% first. Intra-month wicks are not in the tape."}
      </div>
      <Timeline
        assets={assets}
        legs={legs}
        chain={chain}
        setChain={setChain}
        capital={capital}
        mode="inspect"
        score={fundedScore}
        endsLabel={selected?.outcome === "pass" ? "You keep" : selected?.outcome === "fail" ? "Wiped" : "Marked"}
        emptyHint="Click a bar to inspect one attempt. Find a pass is the fastest clean +12% before −3%. This is not a four-year compound."
      />
    </div>
  );
}
