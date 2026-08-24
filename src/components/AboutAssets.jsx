import { useMemo, useState } from "react";
import { ASSETS } from "../data/assets.js";
import { ASSET_ABOUT } from "../data/assetAbout.js";
import { MONO, SANS, DISPLAY, Eyebrow, Panel, Chip, useMediaQuery } from "../ui/atoms.jsx";
import { GlowDot } from "../ui/Cosmos.jsx";

export default function AboutAssets() {
  const compact = useMediaQuery("(max-width: 720px)");
  const pages = useMemo(
    () =>
      ASSET_ABOUT.map((about) => {
        const meta = ASSETS.find((a) => a.id === about.id);
        return { ...about, meta };
      }),
    []
  );
  const [activeId, setActiveId] = useState(pages[0]?.id ?? "AIOZ");
  const active = pages.find((p) => p.id === activeId) ?? pages[0];

  if (!active?.meta) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel accent="#00E5FF" title="About the Assets">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>
          The Assets tab shows pivots and multipliers. This page is the other half: what each name
          on the chronograph actually is — the product, the market structure, and the story that made
          the price path possible. None of this turns hindsight into a strategy; it only makes the
          lottery tickets legible.
        </p>
      </Panel>

      <div
        role="tablist"
        aria-label="Asset dossiers"
        style={{
          display: "flex", gap: 6, flexWrap: "wrap",
          padding: compact ? "4px 0" : "2px 0",
        }}
      >
        {pages.map((page) => {
          const on = page.id === activeId;
          const color = page.meta.color;
          return (
            <button
              key={page.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(page.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                fontFamily: MONO, fontSize: 10, letterSpacing: 1.2,
                padding: "8px 12px", borderRadius: 6, cursor: "pointer",
                background: on ? `${color}18` : "rgba(255,255,255,0.025)",
                border: `1px solid ${on ? color + "55" : "rgba(255,255,255,0.08)"}`,
                color: on ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: color, boxShadow: on ? `0 0 8px ${color}` : "none",
                }}
              />
              {page.meta.ticker}
            </button>
          );
        })}
      </div>

      <article
        key={active.id}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${active.meta.color}28`,
          borderRadius: 10,
          padding: compact ? "18px 16px" : "24px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${active.meta.color}, transparent)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <GlowDot color={active.meta.color} />
          <Eyebrow size={11} color={active.meta.color} style={{ letterSpacing: 2 }}>
            {active.meta.ticker}
          </Eyebrow>
          <Chip color={active.meta.color}>{active.meta.pivots.length / 2} LEG{active.meta.pivots.length > 2 ? "S" : ""}</Chip>
        </div>

        <h2
          style={{
            fontFamily: DISPLAY, fontSize: compact ? 26 : 32, fontWeight: 700,
            margin: "0 0 10px", color: "#fff", lineHeight: 1.15,
          }}
        >
          {active.meta.name}
        </h2>
        <p
          style={{
            fontFamily: SANS, fontSize: 15, color: "rgba(255,255,255,0.72)",
            lineHeight: 1.65, margin: "0 0 8px", maxWidth: 720,
          }}
        >
          {active.essence}
        </p>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
          {active.meta.note}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 26 }}>
          {active.sections.map((section) => (
            <section key={section.title}>
              <Eyebrow size={10} color={active.meta.color} style={{ marginBottom: 10 }}>
                {section.title}
              </Eyebrow>
              {section.body.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.58)",
                    lineHeight: 1.8, margin: i === section.body.length - 1 ? 0 : "0 0 12px",
                  }}
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <div style={{ fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,0.22)", lineHeight: 1.7 }}>
        These dossiers describe economic design and market context. They are not recommendations to buy,
        hold, or trade any asset on the chronograph.
      </div>
    </div>
  );
}
