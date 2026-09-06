import { MONO, SANS, Eyebrow, Panel, useMediaQuery } from "../ui/atoms.jsx";

function Section({ icon, title, children, color = "rgba(255,255,255,0.55)" }) {
  return (
    <Panel title={title} accent={color}>
      <div style={{ fontFamily: SANS, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
        {children}
      </div>
    </Panel>
  );
}

function Exchange({ name, url, note, color }) {
  return (
    <div
      style={{
        flex: "1 1 220px",
        padding: "18px 20px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        borderTop: `2px solid ${color}`,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color, marginBottom: 8 }}>
        {name}
      </div>
      <p style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 10px" }}>
        {note}
      </p>
      <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
        {url}
      </span>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        background: "rgba(244,183,40,0.06)",
        border: "1px solid rgba(244,183,40,0.15)",
        borderRadius: 8,
        marginTop: 14,
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(244,183,40,0.85)", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

export default function Learn() {
  const compact = useMediaQuery("(max-width: 720px)");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      <Section title="What is cryptocurrency?" color="#00E5FF">
        <p style={{ margin: "0 0 14px" }}>
          A cryptocurrency is digital money that runs on a distributed ledger — usually a blockchain.
          Instead of a bank keeping the books, thousands of independent nodes verify every transaction
          and reach agreement through a consensus mechanism (proof of work, proof of stake, or a
          variant). No single entity can freeze your funds, reverse a payment, or inflate the supply
          beyond the protocol's rules.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          <strong style={{ color: "rgba(255,255,255,0.75)" }}>Bitcoin</strong> was the first,
          launched in 2009 as a peer-to-peer electronic cash system. <strong style={{ color: "rgba(255,255,255,0.75)" }}>Ethereum</strong> followed
          in 2015 and added programmable smart contracts — code that executes automatically when
          conditions are met, enabling decentralised finance (DeFi), NFTs, and thousands of
          application-layer tokens.
        </p>
        <p style={{ margin: 0 }}>
          The assets on this site — Solana, XRP, Injective, and others — are all tokens
          built on their own blockchains or on top of an existing one. Their prices are driven by
          speculation, adoption curves, and narrative cycles, which is why they can move 10× or
          90× in a year and then give most of it back.
        </p>
      </Section>

      <Section title="Where do I buy it?" color="#FF4FD8">
        <p style={{ margin: "0 0 16px" }}>
          Most people start on a centralised exchange (CEX). You create an account, verify your
          identity (KYC), link a bank account or card, and trade. The exchange holds your coins in
          its own wallets until you withdraw them.
        </p>

        <div style={{ display: "flex", gap: compact ? 12 : 16, flexWrap: "wrap", marginBottom: 16 }}>
          <Exchange
            name="Coinbase"
            url="coinbase.com"
            color="#0052FF"
            note="US-based, publicly traded (COIN). Clean interface, strong regulatory compliance. Higher fees on the basic app — use Coinbase Advanced for limit orders."
          />
          <Exchange
            name="Kraken"
            url="kraken.com"
            color="#7B61FF"
            note="Founded 2011. Known for security track record and proof-of-reserves audits. Supports staking for several assets. Lower fees than Coinbase basic."
          />
          <Exchange
            name="Binance"
            url="binance.com"
            color="#F0B90B"
            note="Largest exchange globally by volume. Widest token selection. US users must use Binance.US, which has a more limited offering."
          />
        </div>

        <Eyebrow size={9} style={{ marginBottom: 8, color: "rgba(255,255,255,0.35)" }}>Things to know before your first trade</Eyebrow>
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Limit orders over market orders.</strong> A market order fills instantly at whatever price is available; a limit order lets you set the price and avoid slippage.</li>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Maker vs. taker fees.</strong> Placing an order that sits on the book (maker) is cheaper than filling an existing one (taker). The difference adds up fast on active trading.</li>
          <li><strong style={{ color: "rgba(255,255,255,0.7)" }}>Withdrawal fees vary by network.</strong> Sending ETH on Ethereum mainnet costs more than sending it on Arbitrum or Base. Choose the cheapest network your destination supports.</li>
        </ul>
      </Section>

      <Section title="How do I self-custody?" color="#F4B728">
        <p style={{ margin: "0 0 14px" }}>
          Self-custody means <em>you</em> hold the private keys, not an exchange. If the exchange
          gets hacked, frozen by a regulator, or goes bankrupt (Mt. Gox 2014, FTX 2022), your
          funds go with it — unless they are already in a wallet you control.
        </p>

        <Eyebrow size={9} style={{ marginBottom: 10, color: "rgba(255,255,255,0.35)" }}>Wallet types</Eyebrow>
        <div style={{ display: "flex", gap: compact ? 12 : 16, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: "1 1 200px", padding: "14px 16px", background: "rgba(244,183,40,0.04)", border: "1px solid rgba(244,183,40,0.12)", borderRadius: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "#F4B728", marginBottom: 6 }}>Hardware wallets</div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
              A dedicated device (Ledger, Trezor, Keystone) that keeps your private key offline.
              Transactions are signed on the device itself, so even if your computer is compromised
              the key never leaves the hardware. The gold standard for long-term storage.
            </p>
          </div>
          <div style={{ flex: "1 1 200px", padding: "14px 16px", background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.12)", borderRadius: 8 }}>
            <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "#00E5FF", marginBottom: 6 }}>Software wallets</div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
              Browser extensions (MetaMask, Phantom, Rabby) or mobile apps. More convenient for
              daily use and DeFi interaction, but the key lives on your device — if it is malware-infected,
              the key can be extracted.
            </p>
          </div>
        </div>

        <Eyebrow size={9} style={{ marginBottom: 10, color: "rgba(255,255,255,0.35)" }}>Seed phrase — the master key</Eyebrow>
        <p style={{ margin: "0 0 10px" }}>
          When you create a wallet you get a 12- or 24-word seed phrase (BIP-39 mnemonic). This phrase
          <em> is</em> your wallet. Anyone who has it can reconstruct every private key and drain every
          asset. Lose it and there is no recovery — no customer-support line, no password reset.
        </p>
        <ul style={{ margin: "0 0 10px", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
          <li>Write it on paper or stamp it in metal. Never store it digitally — no photos, no cloud notes, no password managers.</li>
          <li>Store copies in at least two physically separate locations.</li>
          <li>Consider a passphrase (25th word) for an additional layer, but understand that losing the passphrase is equivalent to losing the seed.</li>
        </ul>
        <Tip>
          Test your backup before sending real funds. Create the wallet, write down the seed, delete
          the wallet, and restore from the seed. If everything comes back, the backup works.
        </Tip>
      </Section>

      <Section title="Security basics" color="#FF3C3C">
        <p style={{ margin: "0 0 14px" }}>
          Most crypto losses are not protocol exploits — they are social-engineering attacks that trick
          you into handing over your keys or signing a malicious transaction.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Phishing.</strong> Fake sites that look identical to a real exchange or wallet.
            Always type the URL directly or use a bookmark — never follow a link from email, DM, or search ads.
          </li>
          <li>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Approval scams.</strong> A malicious dApp asks you to "approve" a token spend with an unlimited
            allowance, then drains your wallet. Read what you are signing. Revoke stale approvals periodically.
          </li>
          <li>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>SIM swaps.</strong> An attacker ports your phone number to their SIM and intercepts SMS 2FA codes.
            Use an authenticator app (Authy, Google Authenticator) or a hardware key (YubiKey) instead of SMS.
          </li>
          <li>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Clipboard malware.</strong> Malware that replaces a copied wallet address with the attacker's.
            Always verify the first and last several characters of a pasted address before sending.
          </li>
        </ul>
      </Section>

      <Section title="Tax and record-keeping" color="#FF7A45">
        <p style={{ margin: "0 0 10px" }}>
          In most jurisdictions every disposal — selling, swapping one token for another, or
          spending crypto — is a taxable event. The gain or loss is calculated from your cost
          basis (what you paid) to the disposal price.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 5 }}>
          <li>Track every trade from day one. Retroactively reconstructing years of DeFi swaps is painful.</li>
          <li>Tools like Koinly, CoinTracker, or TokenTax can import exchange and on-chain history automatically.</li>
          <li>Short-term gains (held &lt; 1 year in the US) are taxed as ordinary income; long-term gains get a lower rate.</li>
          <li>Losses can offset gains — known as tax-loss harvesting. The wash-sale rule does not currently apply to crypto in the US, though this may change.</li>
        </ul>
      </Section>

      <Section title="Key concepts" color="#00E5FF">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { term: "DeFi", def: "Decentralised finance — lending, borrowing, and trading through smart contracts instead of banks. Protocols like Aave, Uniswap, and Jupiter remove the middleman but introduce smart-contract risk." },
            { term: "Staking", def: "Locking tokens to help validate transactions on a proof-of-stake chain. In return you earn yield — typically 3–8% annually — but your tokens may be subject to a lock-up period and slashing penalties." },
            { term: "Gas fees", def: "The cost of executing a transaction on-chain, paid to validators. Ethereum fees vary with congestion; Layer 2s (Arbitrum, Base, Optimism) and alt-L1s (Solana) are cheaper for everyday use." },
            { term: "Market cap", def: "Price × circulating supply. A $1 token with 10 billion supply has the same market cap as a $10,000 token with 1 million supply. Always compare market caps, not prices." },
            { term: "Liquidity", def: "How easily you can buy or sell without moving the price. High-cap tokens on major exchanges are liquid; small-cap tokens on niche DEXs can slip 5–10% on a modest order." },
            { term: "Dollar-cost averaging", def: "Investing a fixed dollar amount on a schedule (weekly, monthly) regardless of price. It removes the timing decision and smooths out volatility — the opposite of trying to buy the bottom." },
          ].map((item) => (
            <div key={item.term} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: "#00E5FF", marginBottom: 6 }}>{item.term}</div>
              <p style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{item.def}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
