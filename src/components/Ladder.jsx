import { chainValue, sortChain } from "../engine/solver.js";
import { formatCurrency, formatFull, formatMultiple, formatPrice, formatDate } from "../ui/format.js";
import { MONO, SANS, Eyebrow, Panel, Stat, Button, Chip, useMediaQuery } from "../ui/atoms.jsx";
import { useTheme } from "../ui/theme.jsx";

function EmptyState({ onSolve }) {
  return (
    <Panel title="Capital ladder">
      <p style={{ fontFamily: SANS, fontSize: 13, color: "var(--ink-45)", lineHeight: 1.6, margin: "0 0 16px" }}>
        Nothing chained yet. Pick legs in the lottery, or drop in the optimal chain and read the
        progression from here.
      </p>
      <Button onClick={onSolve} color="#00E5FF" filled>Solve and show me</Button>
    </Panel>
  );
}

export default function Ladder({ chain, capital, onSolve }) {
  const { ac, glow } = useTheme();
  const compact = useMediaQuery("(max-width: 720px)");
  if (!chain.length) return <EmptyState onSolve={onSolve} />;

  const { steps, final, multiple } = chainValue(chain, capital);
  const sorted = sortChain(chain);
  const minLog = Math.log10(Math.max(capital, 1));
  const maxLog = Math.log10(Math.max(final, 10));
  const range = maxLog - minLog || 1;
  const barPct = (v) => ((Math.log10(Math.max(v, 1)) - minLog) / range) * 100;

  const daysIn = chain.reduce((a, l) => a + l.days, 0);
  const daysIdle = steps.reduce((a, s) => a + s.idleDays, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <Stat label="Started with" value={formatFull(capital)} color="var(--ink-70)" />
        <Stat label="Ended with" value={formatCurrency(final)} color="#F4B728" sub={formatFull(final)} />
        <Stat label="Multiple" value={formatMultiple(multiple)} color="#00E5FF" />
        <Stat label="Days held / idle" value={`${daysIn.toLocaleString()} / ${daysIdle.toLocaleString()}`} color="var(--ink-60)" size={15} />
      </div>

      <Panel title="Step by step" right={<Eyebrow size={9} color="var(--ink-25)">log scale</Eyebrow>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {steps.map((step, i) => {
            const { leg } = step;
            const c = ac(leg.color);
            return (
              <div key={leg.id}>
                {step.idleDays > 0 && (
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 0 7px 2px", marginLeft: compact ? 0 : 8,
                    }}
                  >
                    <div style={{ width: 1, height: 16, background: "var(--line-12)", marginLeft: 5 }} />
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: "var(--ink-28)", letterSpacing: 0.8 }}>
                      {step.idleDays} days in cash — {formatCurrency(step.capitalIn)} idle
                    </span>
                  </div>
                )}

                <div
                  style={{
                    background: "var(--fill-025)",
                    border: `1px solid ${c}30`,
                    borderLeft: `3px solid ${c}`,
                    borderRadius: 8,
                    padding: compact ? "12px 12px" : "13px 16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--ink-30)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: c }}>
                        {leg.ticker}
                      </span>
                      <span style={{ fontFamily: SANS, fontSize: 11.5, color: "var(--ink-40)" }}>
                        {leg.assetName}
                      </span>
                      {leg.open && <Chip color={c}>OPEN</Chip>}
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, color: c }}>
                      {formatMultiple(leg.multiple)}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: compact ? 12 : 22, flexWrap: "wrap", marginTop: 9 }}>
                    <div>
                      <Eyebrow size={8} color="var(--ink-28)" style={{ marginBottom: 2 }}>Buy</Eyebrow>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--ink-75)" }}>
                        {formatPrice(leg.buyPx)}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "var(--ink-30)" }}>
                        {formatDate(leg.buyDate)}
                      </div>
                    </div>
                    <div>
                      <Eyebrow size={8} color="var(--ink-28)" style={{ marginBottom: 2 }}>Sell</Eyebrow>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--ink-75)" }}>
                        {formatPrice(leg.sellPx)}
                      </div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "var(--ink-30)" }}>
                        {formatDate(leg.sellDate)}
                      </div>
                    </div>
                    <div>
                      <Eyebrow size={8} color="var(--ink-28)" style={{ marginBottom: 2 }}>Held</Eyebrow>
                      <div style={{ fontFamily: MONO, fontSize: 11, color: "var(--ink-75)" }}>
                        {leg.days} days
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 11 }}>
                    <div
                      style={{
                        position: "relative", height: 22, borderRadius: 4,
                        background: "var(--fill-03)", border: "1px solid var(--line-05)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute", top: 0, bottom: 0,
                          left: `${barPct(step.capitalIn)}%`,
                          width: `${Math.max(barPct(step.capitalOut) - barPct(step.capitalIn), 0.6)}%`,
                          background: `linear-gradient(90deg, ${c}22, ${c}55)`,
                          borderRight: `2px solid ${c}`,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--ink-45)" }}>
                        {formatFull(step.capitalIn)}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: c }}>→</span>
                      <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: c }}>
                        {formatFull(step.capitalOut)}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 9.5, color: "var(--ink-25)" }}>
                        (+{formatCurrency(step.gain)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line-07)",
            display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap",
          }}
        >
          <Eyebrow size={10}>Final</Eyebrow>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 13, color: "var(--ink-35)" }}>
              {formatFull(capital)} →
            </span>
            <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 600, color: ac("#F4B728"), textShadow: glow("0 0 20px rgba(244,183,40,0.3)") }}>
              {formatCurrency(final)}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 14, color: "var(--ink-45)" }}>
              {formatMultiple(multiple)}
            </span>
          </div>
        </div>
      </Panel>

      <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--ink-25)", lineHeight: 1.7 }}>
        Idle stretches earn nothing in this model. Real cash in a money-market fund over those
        {" "}{daysIdle.toLocaleString()} days would add a little — immaterial next to the legs, but not zero.
      </div>
    </div>
  );
}
