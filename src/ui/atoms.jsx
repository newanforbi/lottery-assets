import { useEffect, useRef, useState } from "react";

export const MONO = "'JetBrains Mono', monospace";
export const DISPLAY = "'Space Grotesk', sans-serif";
export const SANS = "'DM Sans', sans-serif";

export const SURFACE = "rgba(255,255,255,0.02)";
export const SURFACE_HI = "rgba(255,255,255,0.03)";
export const HAIRLINE = "1px solid rgba(255,255,255,0.06)";
export const HAIRLINE_SOFT = "1px solid rgba(255,255,255,0.05)";

export function Eyebrow({ children, color = "rgba(255,255,255,0.4)", size = 11, style }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: size, color, letterSpacing: 1.5, textTransform: "uppercase", ...style }}>
      {children}
    </div>
  );
}

export function Panel({ title, right, children, accent, style }) {
  return (
    <div
      style={{
        background: SURFACE,
        border: HAIRLINE,
        borderRadius: 10,
        padding: "22px 22px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      )}
      {(title || right) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          {title && <Eyebrow>{title}</Eyebrow>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({ label, value, color = "#fff", sub, size = 18 }) {
  return (
    <div style={{ background: SURFACE_HI, borderRadius: 6, padding: "12px 14px", border: HAIRLINE_SOFT }}>
      <Eyebrow size={9} color="rgba(255,255,255,0.35)" style={{ marginBottom: 4 }}>{label}</Eyebrow>
      <div style={{ fontFamily: MONO, fontSize: size, color, fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function Chip({ color, children, dim }) {
  return (
    <span
      style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 1, padding: "3px 8px", borderRadius: 4,
        color: dim ? "rgba(255,255,255,0.4)" : color,
        background: dim ? "rgba(255,255,255,0.04)" : `${color}18`,
        border: `1px solid ${dim ? "rgba(255,255,255,0.08)" : color + "40"}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Button({ onClick, children, color = "#fff", filled, disabled, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
        padding: "9px 16px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "rgba(255,255,255,0.03)" : filled ? `${color}20` : hover ? `${color}14` : "rgba(255,255,255,0.03)",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : filled || hover ? color + "60" : "rgba(255,255,255,0.1)"}`,
        color: disabled ? "rgba(255,255,255,0.2)" : filled || hover ? color : "rgba(255,255,255,0.6)",
        boxShadow: filled ? `0 0 20px ${color}22` : "none",
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/**
 * Counts from its previous value to the next one. The numbers on this site swing
 * across six orders of magnitude, so the roll is eased in log space — otherwise a
 * jump from $10k to $393M spends the whole animation looking like it is still at zero.
 */
export function Odometer({ value, format, duration = 700, style }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const logFrom = Math.log10(Math.max(from, 1));
    const logTo = Math.log10(Math.max(to, 1));

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(t >= 1 ? to : Math.pow(10, logFrom + (logTo - logFrom) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  useEffect(() => { fromRef.current = display; });

  return <span style={style}>{format(display)}</span>;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
