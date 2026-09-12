import { useMemo, useState } from "react";
import { BOOK_ASSETS, BOOK_AS_OF, BOOK_CASH, BOOK_LEVERAGE, BOOK_TRADEABLE } from "../data/exchangeBook.js";
import {
  bookBestSingle, bookOptimal, bookTopChains, buildBookLegs,
  leveredMultiple, liquidationPrice, recoveryMultiple,
} from "../engine/leverage.js";
import { chainValue } from "../engine/solver.js";
import { formatCurrency, formatDate, formatDateShort, formatMultiple, formatPrice } from "../ui/format.js";
import { MONO, SANS, DISPLAY, Eyebrow, Panel, Stat, Chip, Button, useMediaQuery } from "../ui/atoms.jsx";
import { GlowDot } from "../ui/Cosmos.jsx";

const VIEWS = [
  { key: "map", label: "HISTORY" },
  { key: "rank", label: "RANKED 3×" },
  { key: "fromhere", label: "FROM HERE" },
];

function monthlyPoints(monthly) {
  return (monthly || []).map((row) =>
    Array.isArray(row) ? { date: `${row[0]}-01`, px: row[1] } : row
  );
}

function Sparkline({ monthly, color, lastPx }) {
  const pts = monthlyPoints(monthly);
  if (pts.length < 2) {
    return (
      <div style={{ height: 44, display: "flex", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
          {pts.length === 0 ? "No price path — cash rail" : "Short listing window"}
        </span>
      </div>
    );
  }
  const ys = pts.map((p) => Math.log10(Math.max(p.px, 1e-12)));
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const w = 220;
  const h = 44;
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((Math.log10(Math.max(p.px, 1e-12)) - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastY = h - ((Math.log10(Math.max(lastPx || pts[pts.length - 1].px, 1e-12)) - min) / span) * (h - 4) - 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} aria-hidden style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx={w} cy={lastY} r="2.4" fill={color} />
    </svg>
  );
}

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

export default function ExchangeBook({ capital }) {
  const compact = useMediaQuery("(max-width: 720px)");
  const [view, setView] = useState("map");
  const [leverage, setLeverage] = useState(BOOK_LEVERAGE);
  const [selectedId, setSelectedId] = useState("SOL");

  const legs = useMemo(() => buildBookLegs(leverage), [leverage]);
  const optimal = useMemo(() => bookOptimal(leverage), [leverage]);
  const ranked = useMemo(() => bookTopChains(20, leverage), [leverage]);
  const single = useMemo(() => bookBestSingle(leverage), [leverage]);
  const spotOpt = useMemo(() => bookOptimal(1), []);
  const result = chainValue(optimal.chain, capital);
  const buyingPower = capital * BOOK_LEVERAGE;
  const borrowed = capital * (BOOK_LEVERAGE - 1);

  const selected = BOOK_ASSETS.find((a) => a.id === selectedId) ?? BOOK_TRADEABLE[0];
  const selectedLegs = legs.filter((l) => l.assetId === selected.id);

  const fromHere = useMemo(() => {
    return BOOK_TRADEABLE.map((asset) => {
      const spot = recoveryMultiple(asset.lastPx, asset.windowHigh);
      return {
        asset,
        spot,
        levered: leveredMultiple(spot, BOOK_LEVERAGE),
        liq: liquidationPrice(asset.lastPx, BOOK_LEVERAGE),
        gap: asset.lastPx > 0 ? (asset.windowHigh - asset.lastPx) / asset.windowHigh : 0,
      };
    }).sort((a, b) => b.levered - a.levered);
  }, []);

  const rankedLegs = useMemo(
    () => [...legs].sort((a, b) => b.multiple - a.multiple),
    [legs]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel accent="#F7931A" title="The 3× book">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 12px" }}>
          These are the names Coinbase will let you buy with borrowed cash — spend the dollars
          first, then borrow the rest, about {BOOK_LEVERAGE}× buying power. That is a different universe from
          the lottery's thirteen hindsight rockets: no AIOZ, no Kaspa, no ZIGChain. Twenty-eight
          tradeable prints plus {BOOK_CASH.ticker} as the cash rail, same calendar rule, same
          solver, with every leg run at {BOOK_LEVERAGE}× isolated leverage.
        </p>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Isolated {BOOK_LEVERAGE}× turns a spot multiple <span style={{ fontFamily: MONO }}>m</span> into{" "}
          <span style={{ fontFamily: MONO }}>{BOOK_LEVERAGE}m − {BOOK_LEVERAGE - 1}</span>. A 2× coin is 4× on cash; a
          one-third drop from entry wipes the equity. Borrow interest is not in these headlines —
          Coinbase charges it on the borrowed slice, and it compounds against you the longer a
          leg runs. Prints through {formatDate(BOOK_AS_OF)}.
        </p>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat
          label="Cash → buying power"
          value={`${formatCurrency(capital)} → ${formatCurrency(buyingPower)}`}
          color="#F7931A"
          sub={`Borrow ${formatCurrency(borrowed)} at ${BOOK_LEVERAGE}×`}
        />
        <Stat
          label={`Best ${leverage}× chain`}
          value={formatMultiple(optimal.value)}
          color="#F4B728"
          sub={`${formatCurrency(result.final)} on ${formatCurrency(capital)}`}
        />
        <Stat
          label="Same path, unlevered"
          value={formatMultiple(spotOpt.value)}
          color="#00E5FF"
          sub={`${Math.round(optimal.value / spotOpt.value)}× more at ${BOOK_LEVERAGE}×`}
        />
        <Stat
          label="Best single 3× leg"
          value={formatMultiple(single.multiple)}
          color={single.color}
          sub={`${single.ticker}·${single.index} · ${formatMultiple(single.spotMultiple)} spot`}
        />
      </div>

      <Panel title="What the 3× solver found">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 12px" }}>
          Without AIOZ the opener is Solana from the FTX low —{" "}
          <span style={{ fontFamily: MONO, color: "#9D4EDD" }}>SOL-1 at {formatMultiple(legs.find((l) => l.id === "SOL-1")?.spotMultiple)} spot</span>,{" "}
          <span style={{ fontFamily: MONO }}>{formatMultiple(legs.find((l) => l.id === "SOL-1")?.multiple)}</span> at {BOOK_LEVERAGE}×.
          The autumn-2024 slot is not Zcash's first bounce. Curve from the Aug 5 flush
          ({formatMultiple(legs.find((l) => l.id === "CRV-1")?.spotMultiple)} spot) outruns ZEC-1
          ({formatMultiple(legs.find((l) => l.id === "ZEC-1")?.spotMultiple)}), then the two later
          Zcash legs finish. The path is{" "}
          <span style={{ fontFamily: MONO, color: "#F4B728" }}>
            {optimal.chain.map((l) => l.id).join(" → ")}
          </span>{" "}
          at <span style={{ fontFamily: MONO, color: "#F4B728" }}>{formatMultiple(optimal.value)}</span>.
        </p>
        <ChainPills chain={optimal.chain} compact={compact} />
      </Panel>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div
          role="tablist"
          aria-label="3× book views"
          style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {VIEWS.map((v) => (
            <button
              key={v.key}
              role="tab"
              aria-selected={view === v.key}
              onClick={() => setView(v.key)}
              style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, padding: "8px 12px",
                background: "none", border: "none", whiteSpace: "nowrap", cursor: "pointer",
                color: view === v.key ? "#fff" : "rgba(255,255,255,0.35)",
                borderBottom: view === v.key ? "2px solid #F7931A" : "2px solid transparent",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        {view !== "fromhere" && (
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 3].map((n) => (
              <Button key={n} onClick={() => setLeverage(n)} color="#F7931A" filled={leverage === n}>
                {n}×
              </Button>
            ))}
          </div>
        )}
      </div>

      {view === "map" && (
        <HistoryMap
          compact={compact}
          selected={selected}
          selectedLegs={selectedLegs}
          leverage={leverage}
          onSelect={setSelectedId}
        />
      )}
      {view === "rank" && (
        <RankedView
          compact={compact}
          ranked={ranked}
          rankedLegs={rankedLegs}
          capital={capital}
          leverage={leverage}
        />
      )}
      {view === "fromhere" && <FromHereView compact={compact} rows={fromHere} />}
    </div>
  );
}

function HistoryMap({ compact, selected, selectedLegs, leverage, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        role="tablist"
        aria-label="Book assets"
        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
      >
        {BOOK_ASSETS.map((asset) => {
          const on = asset.id === selected.id;
          return (
            <button
              key={asset.id}
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(asset.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: MONO, fontSize: 10, letterSpacing: 1.1,
                padding: "6px 10px", borderRadius: 6, cursor: "pointer",
                background: on ? `${asset.color}18` : "rgba(255,255,255,0.025)",
                border: `1px solid ${on ? asset.color + "55" : "rgba(255,255,255,0.08)"}`,
                color: on ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: asset.color }} />
              {asset.ticker}
            </button>
          );
        })}
      </div>

      <article
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${selected.color}28`,
          borderRadius: 10,
          padding: compact ? "16px 14px" : "22px 22px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${selected.color}, transparent)` }} />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <GlowDot color={selected.color} />
              <Eyebrow size={11} color={selected.color} style={{ letterSpacing: 2 }}>{selected.ticker}</Eyebrow>
              {selected.cash && <Chip color={selected.color}>CASH RAIL</Chip>}
              {selected.inLottery && <Chip color="#00E5FF">IN LOTTERY</Chip>}
              {selected.openLast && <Chip color={selected.color}>OPEN</Chip>}
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: compact ? 24 : 30, fontWeight: 700, margin: "0 0 8px", color: "#fff", lineHeight: 1.15 }}>
              {selected.name}
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
              {selected.note}
            </p>
          </div>
          <div style={{ flex: "1 1 220px", minWidth: 180 }}>
            <Eyebrow size={9} style={{ marginBottom: 6 }}>Monthly close · log scale</Eyebrow>
            <Sparkline monthly={selected.monthly} color={selected.color} lastPx={selected.lastPx} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                {monthlyPoints(selected.monthly)[0] ? formatDateShort(monthlyPoints(selected.monthly)[0].date) : "—"}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 9, color: selected.color }}>
                {selected.lastPx ? formatPrice(selected.lastPx) : "—"} · {formatDateShort(selected.lastDate || BOOK_AS_OF)}
              </span>
            </div>
          </div>
        </div>

        {!selected.cash && (
          <>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {selected.pivots.map((p, i) => {
                const isLow = i % 2 === 0;
                return (
                  <div key={`${p.date}-${i}`} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: 1, width: 30, color: isLow ? "rgba(255,255,255,0.28)" : selected.color }}>
                      {isLow ? "LOW" : "HIGH"}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.35)", width: 92 }}>
                      {formatDate(p.date)}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: isLow ? "rgba(255,255,255,0.7)" : selected.color }}>
                      {formatPrice(p.px)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {selectedLegs.map((leg) => (
                <div
                  key={leg.id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                    padding: "9px 11px", borderRadius: 6,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
                      {leg.id} · {leg.days} days
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                      {formatPrice(leg.buyPx)} → {formatPrice(leg.sellPx)} · liq {formatPrice(liquidationPrice(leg.buyPx, leverage))}
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                      {formatMultiple(leg.spotMultiple)} spot
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 600, color: selected.color }}>
                      {formatMultiple(leg.multiple)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </article>
    </div>
  );
}

function RankedView({ compact, ranked, rankedLegs, capital, leverage }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel title={`Every valid ${leverage}× chain, ranked — top ${Math.min(15, ranked.length)}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {ranked.slice(0, 15).map((entry, i) => (
            <div
              key={entry.chain.map((l) => l.id).join("-")}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                padding: "8px 10px", borderRadius: 6,
                background: i === 0 ? "rgba(244,183,40,0.08)" : "transparent",
                border: i === 0 ? "1px solid rgba(244,183,40,0.2)" : "1px solid transparent",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 220px" }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", width: 18 }}>
                  {i + 1}
                </span>
                <ChainPills chain={entry.chain} compact={compact} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: i === 0 ? "#F4B728" : "#fff" }}>
                  {formatMultiple(entry.value)}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                  {formatCurrency(capital * entry.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`Single legs at ${leverage}×, largest first`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {rankedLegs.map((leg, i) => (
            <div
              key={leg.id}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                padding: "7px 8px", borderRadius: 5, flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", width: 18 }}>{i + 1}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: leg.color }} />
                <span style={{ fontFamily: MONO, fontSize: 11, color: "#fff" }}>{leg.id}</span>
                {leg.open && <Chip color={leg.color}>OPEN</Chip>}
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.32)" }}>
                {formatDateShort(leg.buyDate)} → {formatDateShort(leg.sellDate)}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {formatMultiple(leg.spotMultiple)} spot
              </span>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: leg.color }}>
                {formatMultiple(leg.multiple)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function FromHereView({ compact, rows }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel accent="#FF4FD8" title="If each name returned to its window high">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          This is the forward-looking half: from the {formatDate(BOOK_AS_OF)} print, what {BOOK_LEVERAGE}×
          would pay if the coin only went back to the high already on this page. Distance from a
          high is not a thesis — DOT and ADA rank here because they collapsed, not because they
          are cheap. A further one-third drop from today's print liquidates the 3× long, so the
          names with the fattest recovery multiple are also the ones most likely to wipe you
          before they ever get there.
        </p>
      </Panel>

      <Panel title="Ranked by 3× recovery to the window high">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {rows.map((row, i) => {
            const nearHigh = row.gap < 0.15;
            return (
              <div
                key={row.asset.id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                  padding: compact ? "8px 6px" : "8px 10px", borderRadius: 6, flexWrap: "wrap",
                  background: i === 0 ? `${row.asset.color}10` : "transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", width: 18 }}>{i + 1}</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.asset.color }} />
                  <span style={{ fontFamily: MONO, fontSize: 12, color: "#fff" }}>{row.asset.ticker}</span>
                  {nearHigh && <Chip color={row.asset.color}>NEAR HIGH</Chip>}
                </div>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.32)" }}>
                  {formatPrice(row.asset.lastPx)} → {formatPrice(row.asset.windowHigh)}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.28)" }}>
                  liq {formatPrice(row.liq)}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  {formatMultiple(row.spot)} spot
                </span>
                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: row.asset.color }}>
                  {formatMultiple(row.levered)}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
