import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "la-theme";

/**
 * Brand accents are tuned for a black page: at 90% lightness they read as neon
 * on #0A0B0F and as invisible highlighter on paper. Light mode swaps each one
 * for a darkened twin of the same hue, so a leg keeps its identity while
 * clearing text contrast against white.
 *
 * Keys are the dark values. Anything not listed — including every value in this
 * table — passes through untouched, which makes `accent()` safe to apply twice.
 */
const LIGHT_ACCENTS = {
  "#00E5FF": "#0089A8", // AIOZ / cyan
  "#F5426C": "#C8264F", // RENDER
  "#22A3F0": "#0F6CAE", // INJ
  "#9D4EDD": "#6C2BB4", // SOL
  "#23F0C6": "#0B8F74", // XRP
  "#FF7A45": "#C04A16", // MSTR
  "#FF4FD8": "#B81FA0", // SUPER
  "#4BE04B": "#1D9430", // HOOD
  "#F4B728": "#9C6E06", // ZEC / money amber
  "#FF3C3C": "#C2211F", // risk red
  "#FF7878": "#B02B2B", // soft risk red
  "#7B61FF": "#5533D8", // Kraken
  "#0052FF": "#0044D1", // Coinbase
  "#F0B90B": "#8F6B04", // Binance
  "#FFFFFF": "#1F2430", // neutral control accent
};

const PAGE_BG = { dark: "#0A0B0F", light: "#F7F7F4" };

/** The visitor's explicit choice, or null if they have never picked one. */
function storedChoice() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch (e) {
    return null;
  }
}

function initialMode() {
  if (typeof document === "undefined") return "dark";
  // The pre-paint script in index.html has already resolved this; read it back
  // rather than re-deriving, so the two can never disagree.
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(initialMode);

  // Reflect the mode onto the document. Deliberately NOT persisted here: writing
  // on mount would turn the OS-derived default into a stored choice, and the
  // site would stop following the OS after a single visit.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", PAGE_BG[mode]);
  }, [mode]);

  // Track the OS live, but only for visitors who have not picked a side — once
  // someone has, flipping the system theme must not override them.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => {
      if (!storedChoice()) setMode(e.matches ? "light" : "dark");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const choose = (next) => {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* private mode — the choice just won't outlive the tab */
    }
  };

  const value = useMemo(
    () => ({
      mode,
      isLight: mode === "light",
      toggle: () => choose(mode === "dark" ? "light" : "dark"),
      setMode: choose,
      /** Map a brand hex to the current theme. Hex-alpha suffixes still apply. */
      ac: (hex) => (mode === "light" ? LIGHT_ACCENTS[String(hex).toUpperCase()] ?? hex : hex),
      /**
       * Neon bloom is what sells the dark theme and what cheapens the light one —
       * a glow needs a dark field to bloom into. Light mode drops them entirely.
       */
      glow: (shadow) => (mode === "dark" ? shadow : "none"),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function ThemeToggle({ compact }) {
  const { mode, toggle } = useTheme();
  const [hover, setHover] = useState(false);
  const next = mode === "dark" ? "light" : "dark";

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9.5,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        padding: compact ? "6px 9px" : "7px 12px",
        borderRadius: 6,
        cursor: "pointer",
        background: hover ? "var(--fill-10)" : "var(--fill-03)",
        border: `1px solid ${hover ? "var(--line-25)" : "var(--line-10)"}`,
        color: hover ? "var(--ink)" : "var(--ink-45)",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden style={{ fontSize: 11, lineHeight: 1 }}>{mode === "dark" ? "☾" : "☀"}</span>
      {!compact && (mode === "dark" ? "Dark" : "Light")}
    </button>
  );
}
