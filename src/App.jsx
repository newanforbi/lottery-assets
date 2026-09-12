import { useEffect, useRef, useState } from "react";
import { GalaxyBackground } from "./ui/Cosmos.jsx";
import { MONO, DISPLAY, SANS, Eyebrow, Button, Odometer, useMediaQuery } from "./ui/atoms.jsx";
import { formatCurrency, formatDate, formatFull, formatMultiple } from "./ui/format.js";
import { BOOK_LEVERAGE } from "./data/exchangeBook.js";
import { FUNDED_RULES, FUNDED_TIERS } from "./data/krakenFunded.js";
import { solveOptimal, randomChain, chainValue, sortChain } from "./engine/solver.js";
import { bookOptimal, bookRandom } from "./engine/leverage.js";
import { fundedOptimal, fundedRandom, fundedScore } from "./engine/funded.js";
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
const BOOK_TABS = new Set(["lottery", "leverage", "funded"]);
const HIDE_ON_FUNDED = new Set(["ladder", "leaderboard", "assets", "reality"]);
const HIDE_ON_LEVERAGE = new Set(["leaderboard", "assets"]);

const COPY = {
  lottery: {
    eyebrow: "Thirteen assets · 19 tradeable legs · Oct 2022 → Sep 2026",
    blurb:
      "Lottery Assets is a chronological rotation lottery: thirteen names that went vertical, one pool of capital, and a hard rule that overlapping trades can never both be yours. Chain the legs that fit and see where a starting stake lands.",
  },
  leverage: {
    eyebrow: "Twenty-eight Coinbase names · 3× buying power · path-checked · model 10% APR",
    blurb:
      "The Coinbase borrow book as a rotation lottery. Isolated 3×: cash × 3 on the tape, 3m − 2 on equity, after model borrow interest. A monthly close through entry × ⅔ zeros the leg and drops it from Solve. Intra-month wicks are not in the tape.",
  },
  funded: {
    eyebrow: "Kraken Funded · +12% before −3% · no extra leverage",
    blurb:
      "A corridor, not a compound. Official tiers only. All-in from each mapped low: first +12% after the model spread is a pass; first −3% from start is a fail. The challenge ends. You keep 80% of the +12%; the house capital never leaves.",
  },
};

function regimeOf(tab, lens) {
  return BOOK_TABS.has(tab) ? tab : lens;
}

function visibleNav(regime) {
  return NAV.filter((n) => {
    if (regime === "funded" && HIDE_ON_FUNDED.has(n.key)) return false;
    if (regime === "leverage" && HIDE_ON_LEVERAGE.has(n.key)) return false;
    return true;
  });
}

export default function App() {
  const [tab, setTab] = useState("lottery");
  const [lens, setLens] = useState("lottery");
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

  const selectTab = (key) => {
    setTab(key);
    if (BOOK_TABS.has(key)) {
      setLens(key);
      if (key === "funded" && !FUNDED_TIERS.some((t) => t.start === capital)) {
        setPreset(FUNDED_RULES.start);
      }
    }
  };

  const regime = regimeOf(tab, lens);
  const activeChain =
    regime === "leverage" ? bookChain : regime === "funded" ? fundedChain : chain;

  const reveal = (legs, setter) => {
    clearTimers();
    setter([]);
    setSolving(true);
    const sorted = sortChain(legs);
    if (!sorted.length) {
      setSolving(false);
      return;
    }
    sorted.forEach((leg, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setter((prev) => [...prev, leg]);
          if (i === sorted.length - 1) setSolving(false);
        }, 260 * (i + 1))
      );
    });
  };

  const solve = () => {
    if (regime === "leverage") reveal(bookOptimal().chain, setBookChain);
    else if (regime === "funded") reveal(fundedOptimal().chain, setFundedChain);
    else reveal(solveOptimal().chain, setChain);
  };

  const deal = () => {
    clearTimers();
    setSolving(false);
    if (regime === "leverage") setBookChain(bookRandom());
    else if (regime === "funded") setFundedChain(fundedRandom());
    else setChain(randomChain());
  };

  const lotteryResult = chainValue(activeChain, capital);
  const captureGhost = chainValue(activeChain, capital, { capture: 0.65, slippage: 0, taxRate: 0 });
  const corridor = fundedScore(fundedChain, capital);
  const result = regime === "funded" ? corridor : lotteryResult;
  const copy = COPY[tab] || COPY[regime] || COPY.lottery;
  const openLeg = activeChain.find((l) => l.open);
  const fundedTier = FUNDED_TIERS.find((t) => t.start === capital) || FUNDED_TIERS[2];

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
                {regime === "funded"
                  ? "Official tier"
                  : regime === "leverage"
                    ? `Cash · ${BOOK_LEVERAGE}× buying power`
                    : "Starting capital"}
              </Eyebrow>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {regime !== "funded" && (
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
                      aria-label={regime === "leverage" ? "Cash in dollars" : "Starting capital in dollars"}
                      style={{
                        width: compact ? 110 : 140, background: "transparent", border: "none", outline: "none",
                        fontFamily: MONO, fontSize: 18, color: "#fff", fontWeight: 600,
                      }}
                    />
                  </div>
                )}
                <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                  {(regime === "funded" ? FUNDED_TIERS.map((t) => t.start) : PRESETS).map((p) => (
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
                      {regime === "funded" && (
                        <span style={{ display: "block", fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                          fee {formatFull(FUNDED_TIERS.find((t) => t.start === p).fee)}
                        </span>
                      )}
                    </button>
                  ))}
                  {regime === "leverage" && (
                    <span style={{ fontFamily: MONO, fontSize: 12, color: "#F7931A", whiteSpace: "nowrap" }}>
                      → {formatFull(capital * BOOK_LEVERAGE)}
                    </span>
                  )}
                </div>
              </div>
              {regime === "funded" && (
                <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 6 }}>
                  {formatFull(fundedTier.start)} never leaves · fee {formatFull(fundedTier.fee)} gone either way
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 auto", minWidth: 150 }}>
              <Eyebrow size={9} style={{ marginBottom: 6 }}>
                {regime === "funded"
                  ? (fundedChain.length ? corridor.caption : "You keep")
                  : activeChain.length ? "Ends with" : "Pick legs to begin"}
              </Eyebrow>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <Odometer
                  value={result.final}
                  format={formatCurrency}
                  style={{
                    fontFamily: MONO, fontSize: compact ? 26 : 32, fontWeight: 600,
                    color: (regime === "funded" ? fundedChain.length : activeChain.length)
                      ? (corridor.kind === "fail" && regime === "funded" ? "#FF5C5C" : "#F4B728")
                      : "rgba(255,255,255,0.25)",
                    textShadow: (regime === "funded" ? fundedChain.length : activeChain.length)
                      ? "0 0 24px rgba(244,183,40,0.35)" : "none",
                    transition: "color 0.3s ease",
                  }}
                />
                {(regime === "funded" ? fundedChain.length : activeChain.length) > 0 && (
                  <span style={{ fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
                    {regime === "funded" && corridor.kind === "pass"
                      ? "+12%"
                      : regime === "funded" && corridor.kind === "fail"
                        ? "−3%"
                        : formatMultiple(result.multiple)}
                  </span>
                )}
              </div>
              {regime === "lottery" && activeChain.length > 0 && (
                <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.32)", marginTop: 4, lineHeight: 1.5 }}>
                  at 65% capture → {formatCurrency(captureGhost.final)}
                  {openLeg ? ` · ${openLeg.id} marked to ${formatDate(openLeg.sellDate)}` : ""}
                </div>
              )}
              {regime === "funded" && fundedChain.length > 0 && corridor.kind === "pass" && (
                <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.32)", marginTop: 4 }}>
                  80% of {formatFull(corridor.equity - capital)} · house resets to {formatFull(capital)}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button onClick={solve} color="#00E5FF" filled disabled={solving}>
                {solving
                  ? (regime === "funded" ? "Searching…" : "Solving…")
                  : regime === "funded" ? "Find a pass" : "Solve"}
              </Button>
              <Button onClick={deal} color="#FF4FD8">
                {regime === "funded" ? "Deal a pass" : "Deal me a hand"}
              </Button>
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
              {visibleNav(regime).map((n) => (
                <button
                  key={n.key}
                  role="tab"
                  aria-selected={tab === n.key}
                  aria-controls={`panel-${n.key}`}
                  id={`tab-${n.key}`}
                  onClick={() => selectTab(n.key)}
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
          {tab === "ladder" && (
            <Ladder
              chain={regime === "leverage" ? bookChain : chain}
              capital={capital}
              onSolve={solve}
              source={regime === "leverage" ? "book" : "lottery"}
            />
          )}
          {tab === "leaderboard" && <Leaderboard capital={capital} setChain={setChain} setTab={setTab} />}
          {tab === "assets" && <AssetCards chain={chain} setChain={setChain} />}
          {tab === "leverage" && <ExchangeBook chain={bookChain} setChain={setBookChain} capital={capital} />}
          {tab === "funded" && <KrakenFunded chain={fundedChain} setChain={setFundedChain} capital={capital} />}
          {tab === "about" && <AboutAssets />}
          {tab === "reality" && (
            <RealityCheck
              chain={regime === "leverage" ? bookChain : chain}
              capital={capital}
              onSolve={solve}
              fallbackChain={regime === "leverage" ? bookOptimal().chain : undefined}
              solveLabel={regime === "leverage" ? "Put it on the book" : "Put it in the lottery"}
              variant={regime === "leverage" ? "book" : "lottery"}
            />
          )}
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
              {regime === "leverage" && " Isolated 3× can liquidate on a one-third drop; monthly closes are in the engine, intra-month wicks are not."}
              {regime === "funded" && " Kraken Funded is a +12% / −3% evaluation corridor. The house capital never leaves the account."}
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
