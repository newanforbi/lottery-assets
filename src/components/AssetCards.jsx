import { ASSETS } from "../data/assets.js";
import { LEGS } from "../engine/solver.js";
import { formatMultiple, formatPrice, formatDate } from "../ui/format.js";
import { MONO, SANS, Eyebrow, Chip, useMediaQuery } from "../ui/atoms.jsx";
import { GlowDot } from "../ui/Cosmos.jsx";
import { useTheme } from "../ui/theme.jsx";

export default function AssetCards({ chain, setChain }) {
  const { ac } = useTheme();
  const compact = useMediaQuery("(max-width: 720px)");
  const selected = new Set(chain.map((l) => l.id));

  const toggle = (leg) =>
    setChain((prev) =>
      prev.some((l) => l.id === leg.id) ? prev.filter((l) => l.id !== leg.id) : [...prev, leg]
    );

  return (
    <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
      {ASSETS.map((asset) => {
        const legs = LEGS.filter((l) => l.assetId === asset.id);
        const anySelected = legs.some((l) => selected.has(l.id));
        const full = legs.reduce((a, l) => a * l.multiple, 1);
        const c = ac(asset.color);

        return (
          <div
            key={asset.id}
            style={{
              background: anySelected ? `${c}1A` : "var(--fill-025)",
              border: `1.5px solid ${anySelected ? c + "50" : "var(--line-06)"}`,
              borderRadius: 10, padding: "18px 18px", position: "relative", overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            {anySelected && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <GlowDot color={c} />
              <Eyebrow size={10} color={c} style={{ letterSpacing: 2 }}>{asset.ticker}</Eyebrow>
            </div>

            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--ink)", lineHeight: 1.1 }}>
              {asset.name}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: "var(--ink-45)", margin: "6px 0 0", lineHeight: 1.55 }}>
              {asset.note}
            </p>

            {/* Pivot path */}
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
              {asset.pivots.map((p, i) => {
                const isLow = i % 2 === 0;
                return (
                  <div key={p.date} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 1, width: 30, color: isLow ? "var(--ink-28)" : c }}>
                      {isLow ? "LOW" : "HIGH"}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--ink-35)", width: 92 }}>
                      {formatDate(p.date)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: isLow ? "var(--ink-70)" : c }}>
                      {formatPrice(p.px)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legs */}
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {legs.map((leg) => {
                const on = selected.has(leg.id);
                return (
                  <button
                    key={leg.id}
                    onClick={() => toggle(leg)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                      padding: "9px 11px", borderRadius: 6, cursor: "pointer", textAlign: "left",
                      background: on ? `${c}20` : "var(--fill-03)",
                      border: `1px solid ${on ? c + "60" : "var(--line-06)"}`,
                    }}
                  >
                    <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: on ? "var(--ink)" : "var(--ink-50)" }}>
                        Leg {leg.index} · {leg.days} days
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--ink-30)" }}>
                        {formatPrice(leg.buyPx)} → {formatPrice(leg.sellPx)}
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {leg.open && <Chip color={c}>OPEN</Chip>}
                      <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 600, color: c }}>
                        {formatMultiple(leg.multiple)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {legs.length > 1 && (
              <div style={{ marginTop: 11, paddingTop: 10, borderTop: "1px solid var(--line-06)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Eyebrow size={9} color="var(--ink-30)">Both legs chained</Eyebrow>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: c }}>
                  {formatMultiple(full)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
