import { useState } from "react";
import { chainValue, solveOptimal } from "../engine/solver.js";
import { formatCurrency, formatFull, formatMultiple } from "../ui/format.js";
import { MONO, SANS, Eyebrow, Panel, Stat, Button, useMediaQuery } from "../ui/atoms.jsx";

function Slider({ label, hint, value, min, max, step, onChange, color, display }) {
  return (
    <div style={{ flex: "1 1 220px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
        <label style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{label}</label>
        <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color }}>{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{ width: "100%", accentColor: color }}
      />
      <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,0.28)", marginTop: 5, lineHeight: 1.5 }}>
        {hint}
      </div>
    </div>
  );
}

export default function RealityCheck({ chain, capital, onSolve }) {
  const compact = useMediaQuery("(max-width: 720px)");
  const [capture, setCapture] = useState(80);
  const [slippage, setSlippage] = useState(1.5);
  const [taxRate, setTaxRate] = useState(30);

  const active = chain.length ? chain : solveOptimal().chain;
  const usingFallback = chain.length === 0;

  const friction = { capture: capture / 100, slippage: slippage / 100, taxRate: taxRate / 100 };
  const perfect = chainValue(active, capital);
  const real = chainValue(active, capital, friction);
  const kept = perfect.final > 0 ? (real.final / perfect.final) * 100 : 0;

  const ladder = [
    { label: "Perfect hindsight", f: null },
    { label: `Slippage only (${slippage}% per side)`, f: { capture: 1, slippage: friction.slippage, taxRate: 0 } },
    { label: `+ tax on every rotation (${taxRate}%)`, f: { capture: 1, slippage: friction.slippage, taxRate: friction.taxRate } },
    { label: `+ you catch ${capture}% of each move`, f: friction },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel accent="#FF3C3C" title="What perfect hindsight is worth">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Every figure on this site assumes you bought each bottom and sold each top on the exact day.
          Nobody did that. The sliders below put a price on being human: a spread on both sides of every
          trade, tax on each realised gain, and — the one that really bites — catching only part of each
          move. Miss a little on an 90× leg and you miss a lot.
        </p>
      </Panel>

      {usingFallback && (
        <div
          style={{
            padding: "12px 15px", borderRadius: 8,
            background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}
        >
          <span style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.6)" }}>
            No chain selected — showing the optimal one.
          </span>
          <Button onClick={onSolve} color="#00E5FF">Put it in the lottery</Button>
        </div>
      )}

      <Panel title="Friction">
        <div style={{ display: "flex", gap: compact ? 18 : 26, flexWrap: "wrap" }}>
          <Slider
            label="Move capture" hint="How much of each leg you actually catch, in log terms."
            value={capture} min={40} max={100} step={1} onChange={setCapture}
            color="#FF4FD8" display={`${capture}%`}
          />
          <Slider
            label="Slippage per side" hint="Spread and impact paid on entry and again on exit."
            value={slippage} min={0} max={5} step={0.1} onChange={setSlippage}
            color="#FF7A45" display={`${slippage.toFixed(1)}%`}
          />
          <Slider
            label="Tax per rotation" hint="Short-term rate on each realised gain, paid as you go."
            value={taxRate} min={0} max={55} step={1} onChange={setTaxRate}
            color="#00E5FF" display={`${taxRate}%`}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 22 }}>
          <Stat label="Perfect hindsight" value={formatCurrency(perfect.final)} color="rgba(255,255,255,0.55)" sub={formatMultiple(perfect.multiple)} />
          <Stat label="After friction" value={formatCurrency(real.final)} color="#FF4FD8" sub={formatMultiple(real.multiple)} />
          <Stat label="Share of the dream kept" value={`${kept < 0.1 ? kept.toFixed(3) : kept.toFixed(1)}%`} color="#FF7A45" />
          <Stat label="Given up" value={formatCurrency(perfect.final - real.final)} color="rgba(255,60,60,0.75)" />
        </div>
      </Panel>

      <Panel title="Where it goes">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {ladder.map((row, i) => {
            const v = chainValue(active, capital, row.f).final;
            const width = perfect.final > 0
              ? Math.max((Math.log10(Math.max(v, 1)) / Math.log10(Math.max(perfect.final, 10))) * 100, 2)
              : 0;
            const last = i === ladder.length - 1;
            return (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: SANS, fontSize: 12, color: i === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.45)" }}>
                    {row.label}
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: last ? "#FF4FD8" : i === 0 ? "#F4B728" : "rgba(255,255,255,0.7)" }}>
                      {formatCurrency(v)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,0.28)", minWidth: 54, textAlign: "right" }}>
                      {formatMultiple(v / capital)}
                    </span>
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", width: `${width}%`, borderRadius: 4,
                      background: last
                        ? "linear-gradient(90deg, rgba(255,79,216,0.3), #FF4FD8)"
                        : i === 0
                        ? "linear-gradient(90deg, rgba(244,183,40,0.25), #F4B728)"
                        : "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.35))",
                      transition: "width 0.35s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,0.25)", marginTop: 14, lineHeight: 1.7 }}>
          Bars are log-scaled — on a linear axis every row but the first would be invisible, which is
          itself the point. Starting capital {formatFull(capital)}.
        </div>
      </Panel>

      <Panel title="The honest reading">
        <p style={{ fontFamily: SANS, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
          These assets are in Lottery Assets because they went up. The ones that went to zero over the same
          four years aren't here, and there were far more of them. Picking the ten winners in advance,
          then timing eight turning points across them, is not a strategy — it's the definition of
          survivorship bias with a calculator attached. The number this tab produces at realistic
          settings is the interesting one, and it is still built on knowing the answers first.
        </p>
      </Panel>
    </div>
  );
}
