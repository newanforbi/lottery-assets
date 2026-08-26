import { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme.jsx";

export const MONO = "'JetBrains Mono', monospace";
export const DISPLAY = "'Space Grotesk', sans-serif";
export const SANS = "'DM Sans', sans-serif";

export const SURFACE = "var(--fill-02)";
export const SURFACE_HI = "var(--fill-03)";
export const HAIRLINE = "1px solid var(--line-06)";
export const HAIRLINE_SOFT = "1px solid var(--line-05)";

export function Eyebrow({ children, color = "var(--ink-40)", size = 11, style }) {
  const { ac } = useTheme();
  return (
    <div style={{ fontFamily: MONO, fontSize: size, color: ac(color), letterSpacing: 1.5, textTransform: "uppercase", ...style }}>
      {children}
    </div>
  );
}

export function Panel({ title, right, children, accent, style }) {
  const { ac } = useTheme();
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
            background: `linear-gradient(90deg, transparent, ${ac(accent)}, transparent)`,
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

export function Stat({ label, value, color = "var(--ink)", sub, size = 18 }) {
  const { ac } = useTheme();
  return (
    <div style={{ background: SURFACE_HI, borderRadius: 6, padding: "12px 14px", border: HAIRLINE_SOFT }}>
      <Eyebrow size={9} color="var(--ink-35)" style={{ marginBottom: 4 }}>{label}</Eyebrow>
      <div style={{ fontFamily: MONO, fontSize: size, color: ac(color), fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: "var(--ink-30)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function Chip({ color, children, dim }) {
  const { ac } = useTheme();
  const c = ac(color);
  return (
    <span
      style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 1, padding: "3px 8px", borderRadius: 4,
        color: dim ? "var(--ink-40)" : c,
        background: dim ? "var(--fill-04)" : `${c}18`,
        border: `1px solid ${dim ? "var(--line-08)" : c + "40"}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Button({ onClick, children, color = "#FFFFFF", filled, disabled, style }) {
  const { ac, glow } = useTheme();
  const [hover, setHover] = useState(false);
  const c = ac(color);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
        padding: "9px 16px", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "var(--fill-03)" : filled ? `${c}20` : hover ? `${c}14` : "var(--fill-03)",
        border: `1px solid ${disabled ? "var(--line-06)" : filled || hover ? c + "60" : "var(--line-10)"}`,
        color: disabled ? "var(--ink-20)" : filled || hover ? c : "var(--ink-60)",
        boxShadow: filled ? glow(`0 0 20px ${c}22`) : "none",
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
 * jump from $10k to $457M spends the whole animation looking like it is still at zero.
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
