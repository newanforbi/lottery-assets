import { useEffect, useRef, useState } from "react";
import { GalaxyBackground } from "./ui/Cosmos.jsx";
import { MONO, DISPLAY, SANS, Eyebrow, Button, Odometer, useMediaQuery } from "./ui/atoms.jsx";
import { formatCurrency, formatFull, formatMultiple } from "./ui/format.js";
import { BOOK_LEVERAGE } from "./data/exchangeBook.js";
import { solveOptimal, randomChain, chainValue, sortChain } from "./engine/solver.js";
import { bookOptimal, buildBookLegs } from "./engine/leverage.js";
import { fundedOptimal, fundedRandom } from "./engine/funded.js";
import Lottery from "./components/Lottery.jsx";
import Ladder from "./components/Ladder.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import AssetCards from "./components/AssetCards.jsx";
import AboutAssets from "./components/AboutAssets.jsx";
import RealityCheck from "./components/RealityCheck.jsx";
import Learn from "./components/Learn.jsx";
import ExchangeBook from "./components/ExchangeBook.jsx";
import KrakenFunded from "./components/KrakenFunded.jsx";

const NAV = [
  { key: "lottery", label: "LOTTERY" },
  { key: "leverage", label: "3× BOOK" },
  { key: "funded", label: "FUNDED" },
  { key: "ladder", label: "LADDER" },
  { key: "leaderboard", label: "LEADERBOARD" },
  { key: "assets", label: "ASSETS" },
  { key: "about", label: "ABOUT THE ASSETS" },
  { key: "reality", label: "REALITY CHECK" },
  { key: "learn", label: "LEARN" },
];

const PRESETS = [1000, 5000, 10000, 50000, 100000];

const COPY = {
  lottery: {
    eyebrow: "Thirteen assets · 19 tradeable legs · Oct 2022 → Sep 2026",
    blurb:
      "Lottery Assets is a chronological rotation lottery: thirteen names that went vertical, one pool of capital, and a hard rule that overlapping trades can never both be yours. Chain the legs that fit and see where a starting stake lands.",
  },
  leverage: {
    eyebrow: "Twenty-eight Coinbase names · 3× buying power · Oct 2022 → Sep 2026",
    blurb:
      "The Coinbase borrow book as a rotation lottery. $3,000 cash is $9,000 on the tape — isolated 3×, so a spot multiple m becomes 3m − 2 on your cash. Same calendar rule: one pool of cash, overlapping legs mutually exclusive. A one-third drop from entry wipes the equity.",
  },
  funded: {
    eyebrow: "Kraken Funded · $10K challenge · +12% pass · −3% fail",
    blurb:
      "The Kraken Funded book as a rotation lottery. Officially no extra leverage — buy and sell in dollars. The real challenge is +12% before −3% from a $10,000 start. The bars are hindsight on the names that already have a mapped history.",
  },
};

export default function App() {
  const [tab, setTab] = useState("lottery");
  const [capital, setCapital] = useState(10000);
  const [capitalText, setCapitalText] = useState("10,000");
  const [chain, setChain] = useState([]);
  const [bookChain, setBookChain] = useState([]);
  const [fundedChain, setFundedChain] = useState([]);
  const [solving, setSolving] = useState(false);
  const timersRef = useRef([]);
  const compact = useMediaQuery("(max-width: 720px)");

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const onCapitalChange = (raw) => {
    const digits = raw.replace(/[^\d.]/g, "");
    setCapitalText(digits === "" ? "" : Number(digits).toLocaleString("en-US"));
    const n = Number(digits);
    if (isFinite(n) && n > 0) setCapital(n);
  };

  const setPreset = (n) => {
    setCapital(n);
    setCapitalText(n.toLocaleString("en-US"));
  };

  const activeChain =
    tab === "leverage" ? bookChain : tab === "funded" ? fundedChain : chain;

  const reveal = (legs, setter) => {
    clearTimers();
    setter([]);
    setSolving(true);
    const sorted = sortChain(legs);
    sorted.forEach((leg, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setter((prev) => [...prev, leg]);
          if (i === sorted.length - 1) setSolving(false);
        }, 260 * (i + 1))
      );
    });
  };

  // Reveal the optimal chain one leg at a time, so the shape of the answer
  // registers before the final number lands.
  const solve = () => {
    if (tab === "leverage") reveal(bookOptimal().chain, setBookChain);
    else if (tab === "funded") reveal(fundedOptimal().chain, setFundedChain);
    else reveal(solveOptimal().chain, setChain);
  };

  const deal = () => {
    clearTimers();
    setSolving(false);
    if (tab === "leverage") setBookChain(randomChain(buildBookLegs(3)));
    else if (tab === "funded") setFundedChain(fundedRandom());
    else setChain(randomChain());
  };

  const result = chainValue(activeChain, capital);
  const copy = COPY[tab] ?? COPY.lottery;

  return (
    <>
      <GalaxyBackground />
      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          color: "#fff",
          fontFamily: SANS,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ padding: compact ? "26px 16px 0" : "32px 28px 0", maxWidth: 1080, margin: "0 auto" }}>
          <Eyebrow size={10} color="rgba(255,255,255,0.25)" style={{ letterSpacing: 2, marginBottom: 8 }}>
            {copy.eyebrow}
          </Eyebrow>
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: compact ? 30 : 38,
              fontWeight: 700,
              margin: "0 0 8px",
              lineHeight: 1.1,
              // background-clip:text sizes the gradient to the ELEMENT box. As a
              // full-width block the text covered only ~26% of it, so the glyphs
              // sampled just the cold cyan end and never reached the amber.
              width: "fit-content",
              background: "linear-gradient(135deg, #00E5FF, #FF4FD8, #F4B728)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Lottery Assets
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 22px", maxWidth: 660, lineHeight: 1.6 }}>
            {copy.blurb}
          </p>

          {/* Capital + actions — shared lottery chrome */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "flex-end",
              padding: compact ? "14px 14px" : "16px 18px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <div style={{ flex: "0 1 auto" }}>
              <Eyebrow size={9} style={{ marginBottom: 6 }}>
                {tab === "leverage" ? `Cash · ${BOOK_LEVERAGE}× buying power` : "Starting capital"}
              </Eyebrow>
              {/* Wraps so the preset row drops to its own line rather than
                  pushing the page sideways on ~320px phones. */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 2,
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 6, padding: "8px 12px",
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 18, color: "rgba(255,255,255,0.4)" }}>$</span>
                  <input
                    value={capitalText}
                    onChange={(e) => onCapitalChange(e.target.value)}
                    onBlur={() => capitalText === "" && setPreset(10000)}
                    inputMode="numeric"
                    aria-label={tab === "leverage" ? "Cash in dollars" : "Starting capital in dollars"}
                    style={{
                      width: compact ? 110 : 140, background: "transparent", border: "none", outline: "none",
                      fontFamily: MONO, fontSize: 18, color: "#fff", fontWeight: 600,
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                  {(tab === "leverage" ? [1000, 3000, 5000, 10000, 50000] : PRESETS).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreset(p)}
                      style={{
                        fontFamily: MONO, fontSize: 9, padding: "6px 8px", borderRadius: 4, cursor: "pointer",
                        background: capital === p ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${capital === p ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
                        color: capital === p ? "#fff" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {formatCurrency(p).replace(".0", "")}
                    </button>
                  ))}
                  {tab === "leverage" && (
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#F7931A", whiteSpace: "nowrap" }}>
                      → {formatFull(capital * BOOK_LEVERAGE)} on the tape
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ flex: "1 1 auto", minWidth: 150 }}>
              <Eyebrow size={9} style={{ marginBottom: 6 }}>
                {activeChain.length ? "Ends with" : "Pick legs to begin"}
              </Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <Odometer
                  value={result.final}
                  format={formatCurrency}
                  style={{
                    fontFamily: MONO, fontSize: compact ? 26 : 32, fontWeight: 600,
                    color: activeChain.length ? "#F4B728" : "rgba(255,255,255,0.25)",
                    textShadow: activeChain.length ? "0 0 24px rgba(244,183,40,0.35)" : "none",
                    transition: "color 0.3s ease",
                  }}
                />
                {activeChain.length > 0 && (
                  <span style={{ fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                    {formatMultiple(result.multiple)}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button onClick={solve} color="#00E5FF" filled disabled={solving}>
                {solving ? "Solving…" : "Solve"}
              </Button>
              <Button onClick={deal} color="#FF4FD8">Deal me a hand</Button>
            </div>
          </div>

          <nav aria-label="Sections">
            <div
              role="tablist"
              style={{
                display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)",
                overflowX: "auto", scrollbarWidth: "none",
              }}
            >
              {NAV.map((n) => (
                <button
                  key={n.key}
                  role="tab"
                  aria-selected={tab === n.key}
                  aria-controls={`panel-${n.key}`}
                  id={`tab-${n.key}`}
                  onClick={() => setTab(n.key)}
                  style={{
                    fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, padding: "10px 14px",
                    background: "none", border: "none", whiteSpace: "nowrap",
                    color: tab === n.key ? "#fff" : "rgba(255,255,255,0.3)",
                    borderBottom: tab === n.key ? "2px solid #fff" : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <main
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          style={{ padding: compact ? "18px 16px 60px" : "22px 28px 70px", maxWidth: 1080, margin: "0 auto" }}
        >
          {tab === "lottery" && <Lottery chain={chain} setChain={setChain} capital={capital} solving={solving} />}
          {tab === "ladder" && <Ladder chain={chain} capital={capital} onSolve={solve} />}
          {tab === "leaderboard" && <Leaderboard capital={capital} setChain={setChain} setTab={setTab} />}
          {tab === "assets" && <AssetCards chain={chain} setChain={setChain} />}
          {tab === "leverage" && <ExchangeBook chain={bookChain} setChain={setBookChain} capital={capital} />}
          {tab === "funded" && <KrakenFunded chain={fundedChain} setChain={setFundedChain} capital={capital} />}
          {tab === "about" && <AboutAssets />}
          {tab === "reality" && <RealityCheck chain={chain} capital={capital} onSolve={solve} />}
          {tab === "learn" && <Learn />}

          <div
            style={{
              marginTop: 30, padding: "14px 16px",
              background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,60,60,0.12)", borderRadius: 8,
            }}
          >
            <Eyebrow size={9} color="rgba(255,60,60,0.6)" style={{ marginBottom: 4 }}>Risk disclosure</Eyebrow>
            <p style={{ fontFamily: SANS, fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>
              Every number here is retrospective. The prices are historical pivots chosen with hindsight,
              and the returns assume you bought each bottom and sold each top on the exact day — which
              nobody did, and nobody could have. Real execution carries slippage, taxes, and the near
              certainty of mistiming; the Reality Check tab exists to quantify how quickly those erase
              the headline. Cryptocurrency and single-stock positions carry extreme risk including total
              loss of capital. Past performance does not guarantee future results. This is not financial advice.
            </p>
          </div>

          <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 9.5, color: "rgba(255,255,255,0.2)", lineHeight: 1.7 }}>
            Multipliers are derived from the price pivots, never hardcoded. Chain validity requires a
            strict gap: a position must close before the next one opens.
          </div>
        </main>
      </div>
    </>
  );
}
