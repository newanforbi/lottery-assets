import { useMemo, useState } from "react";
import { FUNDED_ASSETS, FUNDED_AS_OF, FUNDED_RULES, FUNDED_TIERS } from "../data/krakenFunded.js";
import {
  afterSpread,
  challengeLines,
  fundedPayout,
  spotMoveToFail,
  spotMoveToPass,
} from "../engine/funded.js";
import { formatDate, formatFull, formatPrice } from "../ui/format.js";
import { MONO, SANS, Eyebrow, Panel, Stat, Chip, useMediaQuery } from "../ui/atoms.jsx";

const FILTERS = [
  { key: "all", label: "ALL" },
  { key: "book", label: "ALSO 3× BOOK" },
  { key: "lottery", label: "ALSO LOTTERY" },
  { key: "only", label: "FUNDED ONLY" },
];

export default function KrakenFunded() {
  const compact = useMediaQuery("(max-width: 720px)");
  const [filter, setFilter] = useState("all");
  const lines = challengeLines();
  const firstPass = fundedPayout(lines.start, lines.passAt);
  const passSpot = spotMoveToPass();
  const failSpot = spotMoveToFail();
  const cleanTwelve = afterSpread(1 + FUNDED_RULES.passPct);

  const overlapBook = FUNDED_ASSETS.filter((a) => a.inBook).length;
  const overlapLottery = FUNDED_ASSETS.filter((a) => a.inLottery).length;
  const onlyHere = FUNDED_ASSETS.filter((a) => !a.inBook && !a.inLottery).length;

  const shown = useMemo(() => {
    if (filter === "book") return FUNDED_ASSETS.filter((a) => a.inBook);
    if (filter === "lottery") return FUNDED_ASSETS.filter((a) => a.inLottery);
    if (filter === "only") return FUNDED_ASSETS.filter((a) => !a.inBook && !a.inLottery);
    return FUNDED_ASSETS;
  }, [filter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel accent="#5741D9" title="What Kraken Funded is">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 12px" }}>
          A separate tab in the Kraken mobile app. You pay a one-time fee
          ({formatFull(FUNDED_RULES.fee)} on the {formatFull(FUNDED_RULES.start)} tier)
          for a skill challenge. That $10,000 is simulated house capital — not a
          deposit, not a loan, not added to your Kraken cash. You buy and sell
          the listed names in dollars. Officially there is <em>no extra leverage</em>,
          no daily drawdown, no time limit, no minimum number of trades.
        </p>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Evaluation is run by {FUNDED_RULES.evaluator}. After you pass, the
          funded account is with {FUNDED_RULES.operator}. Different entity from
          the Kraken you already have. Unregulated. Kraken&apos;s own FAQ says
          Breakout is paid when people re-buy failed challenges, and that POL
          may keep the trade as an internal book entry instead of sending it to
          the market.
        </p>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat
          label="You pay"
          value={formatFull(lines.fee)}
          color="#FF4FD8"
          sub="non-refundable fee"
        />
        <Stat
          label="Challenge balance"
          value={formatFull(lines.start)}
          color="#fff"
          sub="house capital · not yours"
        />
        <Stat
          label="Pass at"
          value={formatFull(lines.passAt)}
          color="#2EE59D"
          sub={`+${Math.round(FUNDED_RULES.passPct * 100)}% · ${formatFull(lines.needGain)}`}
        />
        <Stat
          label="Fail at"
          value={formatFull(lines.failAt)}
          color="#FF5C5C"
          sub={`−${Math.round(FUNDED_RULES.failPct * 100)}% · ${formatFull(lines.maxLoss)}`}
        />
      </div>

      <Panel title="The bar in your screenshot">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 16px" }}>
          Fail {formatFull(lines.failAt)} · start {formatFull(lines.start)} · pass {formatFull(lines.passAt)}.
          The red/green line does not trail your peak. It is fixed to the
          starting {formatFull(lines.start)}. You can be +11% and still fail if
          you give the {formatFull(lines.needGain)} back and then drop{" "}
          {formatFull(lines.maxLoss)} under start.
        </p>
        <div style={{ position: "relative", height: 12, margin: "4px 0 10px" }}>
          <div
            style={{
              position: "absolute",
              inset: "3px 0",
              borderRadius: 99,
              background:
                "linear-gradient(90deg, #FF5C5C 0%, #FF5C5C 23.08%, #2EE59D 23.08%, #2EE59D 100%)",
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "23.08%",
              top: 0,
              width: 2,
              height: 12,
              background: "#fff",
              boxShadow: "0 0 10px rgba(255,255,255,0.45)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 14,
          }}
        >
          <span>Fail {formatFull(lines.failAt)}</span>
          <span>Pass {formatFull(lines.passAt)}</span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Built-in spread is {FUNDED_RULES.spreadEachSide * 100}% each side, no
          commissions. A clean +12% print nets about{" "}
          <span style={{ fontFamily: MONO }}>{((cleanTwelve - 1) * 100).toFixed(3)}%</span> after
          the round trip, so an all-in name has to do roughly{" "}
          <span style={{ fontFamily: MONO }}>+{((passSpot - 1) * 100).toFixed(2)}%</span> to
          print pass and only{" "}
          <span style={{ fontFamily: MONO }}>−{((1 - failSpot) * 100).toFixed(2)}%</span> to
          print fail. One spot coin that goes a little over −3% after the buy
          spread ends the account.
        </p>
      </Panel>

      <Panel title="Once you beat the challenge">
        <ol
          style={{
            margin: "0 0 14px",
            paddingLeft: 18,
            color: "rgba(255,255,255,0.6)",
            fontFamily: SANS,
            fontSize: 13.5,
            lineHeight: 1.7,
            display: "grid",
            gap: 10,
          }}
        >
          <li>
            Sign the Funded Trader Agreement in the app. It is with POL, not
            with the Kraken that holds your cash. Trading on the funded account
            can still wait on identity checks and a compliance review.
          </li>
          <li>
            A funded account opens with the same {formatFull(lines.start)} of
            proprietary-trading capital. Same book. Still no added leverage.
            Still buy and sell in dollars.
          </li>
          <li>
            Profits split {Math.round(FUNDED_RULES.traderSplit * 100)}/
            {Math.round(FUNDED_RULES.houseSplit * 100)}. On the first{" "}
            {formatFull(lines.needGain)} that would have been the pass, that is{" "}
            {formatFull(firstPass.trader)} to you and {formatFull(firstPass.house)} to
            the house. Official example: {formatFull(lines.start)} → $10,500 is
            $400 to you, $100 to them.
          </li>
          <li>
            Withdraw in USD (sell to dollars first). Minimum payout is{" "}
            {formatFull(FUNDED_RULES.minPayout)}. After a withdrawal the funded
            balance resets to {formatFull(lines.start)}. Already-withdrawn
            profit stays yours even if the account later dies. The $10K itself
            never leaves.
          </li>
          <li>
            Same 3% floor on the funded account. Hit {formatFull(lines.failAt)}{" "}
            and it closes. Buy another challenge if you want back in.
          </li>
        </ol>
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          This is not the 3× Coinbase book. A 26× Solana leg does not apply
          here. Officially you are trading spot with a {formatFull(lines.maxLoss)}{" "}
          drawdown budget and a {formatFull(lines.needGain)} target. The 3× Book
          tab is a different machine.
        </p>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: 10 }}>
        <Panel title="Tiers">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FUNDED_TIERS.map((t) => {
              const tLines = challengeLines(t.start);
              const active = t.start === FUNDED_RULES.start;
              return (
                <div
                  key={t.start}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: active ? "1px solid rgba(87,65,217,0.45)" : "1px solid rgba(255,255,255,0.06)",
                    background: active ? "rgba(87,65,217,0.12)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 13, color: "#fff" }}>{formatFull(t.start)}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                      fail {formatFull(tLines.failAt)} · pass {formatFull(tLines.passAt)}
                    </div>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: "#FF4FD8" }}>
                    {formatFull(t.fee)} fee
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="What the $10K is not">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              color: "rgba(255,255,255,0.6)",
              fontFamily: SANS,
              fontSize: 13.5,
              lineHeight: 1.7,
              display: "grid",
              gap: 8,
            }}
          >
            <li>Not your deposit. The fee is the only money you put in.</li>
            <li>Not a loan. No interest, no credit check, no claim on your other balances.</li>
            <li>Not a demo in the marketing sense — prices track the tape — but you do not own the coins or any stocks on this book.</li>
            <li>Not Kraken Prop. Prop lives on Kraken Pro, with bigger sizes and real leverage.</li>
            <li>Not the 3× Coinbase buying-power list. XLM and PAXG sit on that book; they are not in this screenshot.</li>
          </ul>
        </Panel>
      </div>

      <Panel
        title={`${FUNDED_ASSETS.length} names from your screenshots`}
        right={
          <Eyebrow size={9} color="rgba(255,255,255,0.28)">
            prints {formatDate(FUNDED_AS_OF)}
          </Eyebrow>
        }
      >
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 14px" }}>
          {overlapBook} of these also sit on the Coinbase 3× book. {overlapLottery}{" "}
          are lottery names. {onlyHere} are only here (BNB, ARB, BONK, memecoins,
          new L1s). Last prints are the same 12 Sep 2026 tape the 3× book uses,
          where the name overlaps. Filled hearts in the app are just a
          watchlist — they do not change the rules. Some regions also get a
          stock list; yours did not.
        </p>
        <div
          role="tablist"
          aria-label="Funded book filters"
          style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 14, flexWrap: "wrap" }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, padding: "8px 12px",
                background: "none", border: "none", whiteSpace: "nowrap", cursor: "pointer",
                color: filter === f.key ? "#fff" : "rgba(255,255,255,0.35)",
                borderBottom: filter === f.key ? "2px solid #5741D9" : "2px solid transparent",
              }}
            >
              {f.label}
              {f.key === "all" ? ` ${FUNDED_ASSETS.length}` : ""}
              {f.key === "book" ? ` ${overlapBook}` : ""}
              {f.key === "lottery" ? ` ${overlapLottery}` : ""}
              {f.key === "only" ? ` ${onlyHere}` : ""}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: compact ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
          }}
        >
          {shown.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 6,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 13, color: "#fff", fontWeight: 500 }}>
                  {a.name}
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                  <Chip color={a.color}>{a.id}</Chip>
                  {a.inBook && <Chip color="#F7931A">3×</Chip>}
                  {a.inLottery && <Chip color="#F4B728">lotto</Chip>}
                </div>
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  alignSelf: "center",
                }}
              >
                {a.lastPx != null ? formatPrice(a.lastPx) : "—"}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel accent="#FF3C3C" title="The house edge, stated the way they state it">
        <p style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
          Most people do not pass the first try. The fee is gone either way.
          Breakout earns on re-buys. POL may B-book the funded book and is
          released from future payouts the moment you hit the 3% floor. Payouts
          are a discretionary performance fee, not a share of a live account
          you own. None of that is hidden — it is in Kraken&apos;s own risk
          section. The $90 is the price of seeing whether a $300 hole and a
          $1,200 target is a game you want to play.
        </p>
      </Panel>
    </div>
  );
}
