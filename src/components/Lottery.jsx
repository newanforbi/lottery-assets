import { useMemo, useState } from "react";
import { ASSETS, TIMELINE_START, TIMELINE_END } from "../data/assets.js";
import { LEGS, toTime, conflicts, canAdd, sortChain, chainValue } from "../engine/solver.js";
import { formatCurrency, formatMultiple, formatPrice, formatDate, formatDateShort } from "../ui/format.js";
import { MONO, SANS, DISPLAY, Eyebrow, Chip, useMediaQuery } from "../ui/atoms.jsx";
import { useTheme } from "../ui/theme.jsx";

const T0 = toTime(TIMELINE_START);
const T1 = toTime(TIMELINE_END);
const SPAN = T1 - T0;
const pct = (t) => ((t - T0) / SPAN) * 100;

// Quarter ticks across the ~4-year window.
function buildTicks() {
  const ticks = [];
  for (let y = 2022; y <= 2026; y++) {
    for (const m of [1, 4, 7, 10]) {
      const t = Date.UTC(y, m - 1, 1);
      if (t >= T0 && t <= T1) ticks.push({ t, iso: `${y}-${String(m).padStart(2, "0")}-01`, major: m === 1 });
    }
  }
  return ticks;
}
const TICKS = buildTicks();

function LegBar({ leg, state, onClick, onHover, compact }) {
  const { ac, glow, isLight } = useTheme();
  const c = ac(leg.color);
  const left = pct(leg.buyTime);
  const width = pct(leg.sellTime) - left;
  const selected = state === "selected";
  const blocked = state === "blocked";

  return (
    <div
      role="button"
      tabIndex={blocked ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={blocked}
      aria-label={`${leg.assetName} leg ${leg.index}, ${formatDate(leg.buyDate)} to ${formatDate(leg.sellDate)}, ${formatMultiple(leg.multiple)}${blocked ? ", blocked by an overlapping position" : ""}`}
      title={
        blocked
          ? `${leg.ticker} ${formatDate(leg.buyDate)} → ${formatDate(leg.sellDate)} — overlaps a position already in your chain`
          : `${leg.ticker} ${formatPrice(leg.buyPx)} → ${formatPrice(leg.sellPx)}  (${leg.days} days, ${formatMultiple(leg.multiple)})`
      }
      onClick={() => !blocked && onClick(leg)}
      onMouseEnter={() => onHover(leg)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => {
        if (!blocked && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(leg); }
      }}
      style={{
        position: "absolute",
        left: `${left}%`,
        width: `max(${width}%, 26px)`,
        top: 4,
        bottom: 4,
        borderRadius: 999,
        cursor: blocked ? "not-allowed" : "pointer",
        pointerEvents: blocked ? "none" : "auto",
        // Blocked legs fade rather than disappear; on paper the same 0.12 is
        // almost invisible, so light mode holds them a little higher.
        opacity: blocked ? (isLight ? 0.2 : 0.12) : 1,
        background: selected
          ? `linear-gradient(90deg, ${c}55, ${c}30)`
          : `linear-gradient(90deg, ${c}22, ${c}12)`,
        border: `1px solid ${selected ? c : c + "45"}`,
        boxShadow: selected
          ? glow(`0 0 18px ${c}55, inset 0 0 12px ${c}20`)
          : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "opacity 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {leg.open && (
        <span
          aria-hidden
          style={{
            position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
            width: 5, height: 5, borderRadius: "50%", background: c,
            boxShadow: glow(`0 0 8px ${c}`),
          }}
        />
      )}
      <span
        style={{
          fontFamily: MONO,
          fontSize: compact ? 9 : 10,
          fontWeight: 600,
          color: selected ? "var(--ink)" : c,
          textShadow: selected ? glow(`0 0 8px ${c}`) : "none",
          whiteSpace: "nowrap",
          padding: "0 8px",
        }}
      >
        {formatMultiple(leg.multiple)}
      </span>
    </div>
  );
}

/** The cash line: capital idling between two legs. */
function CashSpan({ from, to }) {
  const left = pct(from.sellTime);
  const width = pct(to.buyTime) - left;
  if (width <= 0) return null;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: `${left}%`,
        width: `${width}%`,
        top: "50%",
        height: 1,
        borderTop: "1px dashed var(--line-22)",
      }}
    />
  );
}

export default function Lottery({ chain, setChain, capital, solving }) {
  const { ac, glow } = useTheme();
  const compact = useMediaQuery("(max-width: 720px)");
  const [hovered, setHovered] = useState(null);

  const selectedIds = useMemo(() => new Set(chain.map((l) => l.id)), [chain]);
  const sorted = useMemo(() => sortChain(chain), [chain]);
  const result = useMemo(() => chainValue(chain, capital), [chain, capital]);

  const legState = (leg) => {
    if (selectedIds.has(leg.id)) return "selected";
    if (!canAdd(chain, leg)) return "blocked";
    if (hovered && hovered.id !== leg.id && conflicts(hovered, leg)) return "conflicting";
    return "open";
  };

  const toggle = (leg) => {
    setChain((prev) =>
      prev.some((l) => l.id === leg.id)
        ? prev.filter((l) => l.id !== leg.id)
        : [...prev, leg]
    );
  };

  const blockedCount = LEGS.filter((l) => !selectedIds.has(l.id) && !canAdd(chain, l)).length;

  return (
    <div>
      <div
        style={{
          background: "var(--fill-02)",
          border: "1px solid var(--line-06)",
          borderRadius: 10,
          padding: compact ? "16px 12px" : "20px 18px",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: compact ? 640 : "auto" }}>
          {/* Axis */}
          <div style={{ display: "flex", marginBottom: 8 }}>
            <div style={{ width: compact ? 52 : 74, flexShrink: 0 }} />
            <div style={{ flex: 1, position: "relative", height: 16 }}>
              {/* Quarter labels collide below ~720px, so narrow screens get years only. */}
              {TICKS.filter((tk) => !compact || tk.major).map((tk) => (
                <div
                  key={tk.iso}
                  style={{
                    position: "absolute",
                    left: `${pct(tk.t)}%`,
                    transform: "translateX(-50%)",
                    fontFamily: MONO,
                    fontSize: 9,
                    color: tk.major ? "var(--ink-40)" : "var(--ink-18)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tk.major ? tk.iso.slice(0, 4) : formatDateShort(tk.iso)}
                </div>
              ))}
            </div>
          </div>

          {/* Lanes */}
          {ASSETS.map((asset) => {
            const legs = LEGS.filter((l) => l.assetId === asset.id);
            const anySelected = legs.some((l) => selectedIds.has(l.id));
            return (
              <div key={asset.id} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <div
                  style={{
                    width: compact ? 52 : 74,
                    flexShrink: 0,
                    fontFamily: MONO,
                    fontSize: compact ? 9 : 10,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    color: anySelected ? ac(asset.color) : "var(--ink-35)",
                    textShadow: anySelected ? glow(`0 0 10px ${ac(asset.color)}66`) : "none",
                    textAlign: "right",
                    paddingRight: 10,
                    transition: "color 0.25s ease",
                  }}
                >
                  {asset.ticker}
                </div>
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    height: compact ? 28 : 32,
                    background: anySelected ? `${ac(asset.color)}10` : "var(--fill-02)",
                    border: "1px solid var(--line-045)",
                    borderRadius: 6,
                    transition: "background 0.25s ease",
                  }}
                >
                  {TICKS.filter((t) => t.major).map((tk) => (
                    <div
                      key={tk.iso}
                      aria-hidden
                      style={{ position: "absolute", left: `${pct(tk.t)}%`, top: 0, bottom: 0, width: 1, background: "var(--line-05)" }}
                    />
                  ))}
                  {legs.map((leg) => (
                    <LegBar
                      key={leg.id}
                      leg={leg}
                      state={legState(leg)}
                      onClick={toggle}
                      onHover={setHovered}
                      compact={compact}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cash line between chained legs */}
          {sorted.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <div
                style={{
                  width: compact ? 52 : 74, flexShrink: 0, textAlign: "right", paddingRight: 10,
                  fontFamily: MONO, fontSize: 8, letterSpacing: 1, color: "var(--ink-25)",
                }}
              >
                CASH
              </div>
              <div style={{ flex: 1, position: "relative", height: 14 }}>
                {sorted.slice(0, -1).map((leg, i) => (
                  <CashSpan key={leg.id} from={leg} to={sorted[i + 1]} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chain readout */}
      <div style={{ marginTop: 14 }}>
        {chain.length === 0 ? (
          <div
            style={{
              padding: "18px 20px", borderRadius: 10,
              background: "var(--fill-02)", border: "1px dashed var(--line-10)",
              fontFamily: SANS, fontSize: 13, color: "var(--ink-45)", lineHeight: 1.6,
            }}
          >
            Click any bar to start a chain. Bars that overlap what you already hold will fade out —
            one pool of capital can only be in one position at a time, which is the whole constraint
            Lottery Assets exists to make visible.
          </div>
        ) : (
          <div
            style={{
              padding: "16px 18px", borderRadius: 10,
              background: "var(--fill-02)", border: "1px solid var(--line-06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <Eyebrow size={10}>
                Your chain — {chain.length} {chain.length === 1 ? "position" : "positions"}
                {blockedCount > 0 && `, ${blockedCount} locked out`}
              </Eyebrow>
              <button
                onClick={() => setChain([])}
                style={{
                  fontFamily: MONO, fontSize: 9, letterSpacing: 1.2, background: "none",
                  border: "none", color: "var(--ink-30)", cursor: "pointer", padding: 0,
                }}
              >
                CLEAR ✕
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {sorted.map((leg, i) => (
                <div key={leg.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {i > 0 && <span style={{ fontFamily: MONO, fontSize: 12, color: "var(--ink-20)" }}>→</span>}
                  <button
                    onClick={() => toggle(leg)}
                    title="Remove from chain"
                    style={{
                      display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start",
                      background: `${ac(leg.color)}12`, border: `1px solid ${ac(leg.color)}45`,
                      borderRadius: 6, padding: "7px 11px", cursor: "pointer",
                    }}
                  >
                    <span style={{ fontFamily: MONO, fontSize: 11, color: ac(leg.color), fontWeight: 600 }}>
                      {leg.ticker} {formatMultiple(leg.multiple)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 8.5, color: "var(--ink-35)" }}>
                      {formatDateShort(leg.buyDate)} → {formatDateShort(leg.sellDate)}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 14, alignItems: "baseline" }}>
              <div>
                <Eyebrow size={9} style={{ marginBottom: 2 }}>Ends with</Eyebrow>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: ac("#F4B728") }}>
                  {formatCurrency(result.final)}
                </span>
              </div>
              <div>
                <Eyebrow size={9} style={{ marginBottom: 2 }}>Multiple</Eyebrow>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>
                  {formatMultiple(result.multiple)}
                </span>
              </div>
              <div>
                <Eyebrow size={9} style={{ marginBottom: 2 }}>Days in market</Eyebrow>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: "var(--ink-60)" }}>
                  {chain.reduce((a, l) => a + l.days, 0).toLocaleString("en-US")}
                </span>
              </div>
              {sorted.some((l) => l.open) && (
                <Chip color="#F4B728">ZEC-2 STILL OPEN</Chip>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
