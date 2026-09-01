// Deep-dive copy for the About the Assets tab. Kept separate from the pivot
// table so narrative edits never risk drifting the solver's source numbers.

export const ASSET_ABOUT = [
  {
    id: "AIOZ",
    essence: "A decentralised content-delivery network that pays ordinary machines to act like a CDN edge.",
    sections: [
      {
        title: "What it is",
        body: [
          "AIOZ Network is trying to rebuild the content delivery stack — the invisible pipes that stream video, deliver game assets, and host media — as a peer-to-peer marketplace. Instead of renting capacity from Akamai, Cloudflare, or AWS CloudFront, a publisher can push files into AIOZ's network and have them cached and served by thousands of independent nodes run by people who leave an app open on a home desktop, a NAS box, or a spare GPU machine.",
          "The company sits at the intersection of Web3 infrastructure and ordinary internet plumbing. Its pitch is economic rather than cryptographic: global CDN spend is enormous, utilisation of consumer bandwidth and storage is low, and a token can be the settlement layer that pays node operators for bytes delivered, storage reserved, and compute contributed.",
        ],
      },
      {
        title: "How the network works",
        body: [
          "Node operators install software, stake or register capacity, and earn AIOZ for fulfilling delivery and storage tasks. Content is chunked, addressed, and served from the nearest willing peers rather than from a corporate PoP. On top of the dCDN, AIOZ has shipped adjacent products — a media streaming stack, AI inference / storage hooks, and developer tooling — so the token is meant to settle more than one kind of workload.",
          "Technically the chain is dual-homed in spirit: AIOZ originated with Ethereum compatibility and later emphasised Cosmos-style interoperability so assets and messages could move across ecosystems. For a rotation calculator that only cares about price pivots, that architecture matters less than the narrative it enabled: \"decentralised Netflix pipes\" during a cycle that loved anything with real-world bandwidth demand.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "AIOZ's first leg — roughly a penny to ninety cents across six months — is the single most violent move in this entire set. That is not a product review; it is a statement about how thinly traded infrastructure tokens behave when a narrative catches and liquidity is still scarce. The second leg is calmer but still large. In Lottery Assets, AIOZ is the opener that makes almost every high-ranking chain possible: start elsewhere and you usually never catch up.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "AIOZ is a speculative claim on whether a tokenised CDN can take meaningful share from incumbents, keep node supply reliable, and convert usage into sustained token demand. It is not a claim on a mature cash-flow business. Price discovery is dominated by crypto beta, listing events, and narrative cycles far more than by measured gigabytes delivered.",
        ],
      },
    ],
  },
  {
    id: "RNDR",
    essence: "A marketplace that turns idle GPUs into a render farm — and later into an AI compute story.",
    sections: [
      {
        title: "What it is",
        body: [
          "Render Network (ticker RENDER; formerly RNDR on Ethereum) is a decentralised GPU marketplace founded around OTOY, the company behind OctaneRender. The original job was cinematic and motion-graphics rendering: studios and artists submit frames, node operators with powerful GPUs bid to process them, and the network coordinates distribution, verification, and payment.",
          "In plain terms, Render is trying to be a global render farm without owning the farm. That matters because professional rendering and, later, machine-learning inference are both bottlenecked by the same scarce resource — high-end GPU hours — and traditional cloud GPUs are expensive and often sold out.",
        ],
      },
      {
        title: "How value is supposed to accrue",
        body: [
          "Creators pay in the network's token (or in stable flows that ultimately touch it); operators earn for completed, verified work. The token is the metering and incentive layer for that marketplace. Over time the narrative widened from \"Hollywood frames\" to \"any GPU job,\" especially AI, which is why Render often trades as a compute-infrastructure proxy rather than a pure media tool.",
          "A major structural event in its history was the migration from Ethereum (RNDR) to Solana (RENDER), including a token swap. That move was about throughput, fees, and aligning with Solana's consumer-crypto audience as much as about rendering technology itself.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "Render contributes only one leg in this dataset, but it is a monster: from well under a dollar after the 2022 crypto winter into the low teens by early 2025 — roughly 31×. The catch in the lottery is duration. That leg occupies nearly twenty-nine months, which is the costliest real estate in the set: while you are holding Render, you cannot hold almost anything else that mattered in 2023–2024.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "RENDER is a claim on decentralised GPU utilisation and on whether token burn / demand mechanics track real job volume. It is highly correlated with broader crypto risk appetite and with AI hype cycles. The pivots here assume perfect entry at the post-crash low and perfect exit near a multi-year high — a path that was obvious only afterward.",
        ],
      },
    ],
  },
  {
    id: "INJ",
    essence: "A Cosmos-based Layer 1 purpose-built for on-chain finance: order books, derivatives, and DeFi plumbing.",
    sections: [
      {
        title: "What it is",
        body: [
          "Injective is a Layer-1 blockchain in the Cosmos ecosystem designed specifically for financial applications. Where general-purpose chains host everything from NFTs to meme coins, Injective's product surface is exchanges, derivatives, prediction markets, and the shared infrastructure (oracles, matching, settlement) those apps need.",
          "It uses Cosmos SDK / Tendermint-style consensus and Inter-Blockchain Communication (IBC) so liquidity and messages can move across the Cosmos world. The design goal is exchange-grade performance with on-chain transparency: frequent batch auctions and MEV-aware mechanics are part of the pitch, aiming to reduce the toxic ordering games that plague public mempools on other chains.",
        ],
      },
      {
        title: "What the token does",
        body: [
          "INJ is the native asset: staking for security, governance over protocol parameters, and a deflationary narrative through fee burns / auction mechanisms that have been central to how the community talks about the token. Builders launch markets and dApps on Injective; traders interact with those markets; a slice of economic activity is supposed to route back into INJ demand or supply reduction.",
          "In practice, INJ also trades as a high-beta \"DeFi L1\" coin — meaning price often moves with crypto risk-on waves and with whatever exchange or derivatives narrative is hot, not solely with measured open interest on Injective venues.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "Injective's single leg in this set runs from the late-2022 bear-market trough into early 2024 — roughly $1.25 to the high forties, on the order of 38×. It is one of the best opening moves available if you did not catch AIOZ, and it overlaps heavily with Solana's and Strategy's first legs, which is why the lottery forces a choice among them.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "INJ is a leveraged bet on on-chain trading activity concentrating on a Cosmos finance chain, plus whatever multiple the market assigns to that story. It is not a share of a centralised exchange's equity; protocol revenue, burns, and narrative can diverge for long stretches.",
        ],
      },
    ],
  },
  {
    id: "SOL",
    essence: "A high-throughput Layer 1 that survived near-death after FTX and became the cycle's consumer-crypto hub.",
    sections: [
      {
        title: "What it is",
        body: [
          "Solana is a Layer-1 blockchain founded by Anatoly Yakovenko and others, famous for pushing very high transaction throughput and low fees via a design that combines Proof of History (a cryptographic clock that orders events before consensus) with a Proof-of-Stake validator set. The ambition was always to feel like a consumer internet platform: snappy apps, cheap interactions, room for millions of users.",
          "That ambition attracted a huge developer and retail footprint — DeFi, NFTs, memecoins, DePIN, payments experiments — and also attracted outages and growing pains in earlier years as the network learned to operate under load. Solana's identity in markets is dual: a serious scaling bet and a casino rail for speculative culture.",
        ],
      },
      {
        title: "The FTX scar and the rebirth",
        body: [
          "FTX and Alameda were among Solana's most visible early backers and liquidity providers. When FTX collapsed in November 2022, SOL cratered — not only because of crypto beta, but because the market feared contagion, forced selling of SOL-related holdings, and a crisis of confidence in the ecosystem. The December 2022 low in this dataset sits inside that wreckage.",
          "What followed was one of the defining recoveries of the cycle: client software matured, Firedancer and other validator clients entered the conversation, institutional interest returned, and Solana became the default home for a new memecoin and consumer-crypto wave. Price followed — into the $190s in early 2024 and later higher still on the second leg.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "Solana contributes two legs: the post-FTX rebound into March 2024, then a pullback and a second push into January 2025. Both are large, liquid, and heavily overlapped with other openers (INJ, MSTR-1) and with later autumn legs. In the lottery, SOL is rarely \"wrong\" as a story — it is often just busy at the same time as something that compounds better in a multi-leg chain.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "SOL is the native asset used for fees and staking on Solana. Holding it is a bet on continued usage, staking economics, and Solana remaining a primary venue for crypto application activity. It is among the most liquid assets in this set, which makes the historical pivots easier to imagine trading — and still does not make timing them easy.",
        ],
      },
    ],
  },
  {
    id: "XRP",
    essence: "A payments-oriented token whose price was suppressed by a years-long SEC lawsuit, then repriced when the legal fog lifted.",
    sections: [
      {
        title: "What it is",
        body: [
          "XRP is the native digital asset of the XRP Ledger, originally developed by the team associated with Ripple. The ledger is optimised for fast, low-cost transfers and has long been marketed toward cross-border payments: the idea that XRP can act as a bridge asset so financial institutions need not pre-fund nostro/vostro accounts in every corridor.",
          "Whether banks ultimately need a public bridge token is a long-running debate. What is not debated is that XRP became one of the largest, most recognisable crypto assets by market cap and retail mindshare, with deep liquidity and a community that often trades the token as much on legal and macro headlines as on payment-volume metrics.",
        ],
      },
      {
        title: "The lawsuit that framed the cycle",
        body: [
          "In December 2020 the U.S. Securities and Exchange Commission sued Ripple, alleging that XRP sales were unregistered securities offerings. For years afterward, U.S. exchanges delisted or restricted XRP, institutional desks treated it as radioactive, and the token traded under a legal overhang that had little to do with ledger software and everything to do with distribution risk.",
          "Court developments in 2023 — notably a ruling that certain programmatic exchange sales of XRP were not investment contracts — triggered a violent repricing as the market reassessed U.S. access and headline risk. That legal saga still frames how the market talks about XRP; the pivots in this dataset pick up the move from the October 2024 trough rather than the multi-year suppressed base.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "XRP's single lottery leg now runs from Oct 9 2024 at $0.55 into early January 2025 at $3.14 — roughly 5.71× over about three months. Shortening the entry frees the 2023–early-2024 calendar for openers like AIOZ, which is why XRP briefly held the autumn middle-leg slot. Sui's overlapping July–New Year run (~7.90×) now outranks it in the current optimum.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "XRP is a transferable ledger token used for fees and bridging narratives on the XRP Ledger; it is not equity in Ripple the company (though the market often conflates the two). Regulatory treatment still varies by jurisdiction. The pivots here encode a post-litigation sentiment and liquidity cycle as much as a payments-adoption cycle.",
        ],
      },
    ],
  },
  {
    id: "MSTR",
    essence: "A listed software company that reinvented itself as a leveraged Bitcoin treasury vehicle.",
    sections: [
      {
        title: "What it is",
        body: [
          "Strategy (NASDAQ: MSTR), formerly MicroStrategy, began as an enterprise analytics / business-intelligence software company. Under executive chairman Michael Saylor it became something else entirely: one of the most aggressive corporate buyers of Bitcoin on Earth, financed through equity issuance, convertible notes, and a public markets machine that treats BTC accumulation as the core product.",
          "That makes MSTR unique in this set. Every other asset is a crypto token. MSTR is a regulated equity you can hold in a brokerage account, with equity volatility layered on top of Bitcoin's volatility — sometimes amplifying BTC's moves, sometimes diverging when convertible-arbitrage flows, issuance, or equity sentiment dominate.",
        ],
      },
      {
        title: "How the leverage works",
        body: [
          "When Strategy issues converts or stock and buys Bitcoin, shareholders get leveraged exposure to BTC without touching a crypto exchange — plus credit risk, dilution risk, and equity-market beta. The market capitalisation can trade at a premium or discount to the net asset value of the Bitcoin on the balance sheet, depending on how excited investors are about the flywheel.",
          "For a rotation puzzle, that structure matters because MSTR can move more than Bitcoin itself over the same window, and it can be traded with traditional market hours, margin, and tax lot accounting that differ from on-chain tokens.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "Strategy contributes two legs: the bounce from the December 2022 low into March 2024, then a summer dip and a ferocious second leg into November 2024 as Bitcoin and the corporate-treasury narrative went parabolic together. MSTR-2 is a strong autumn also-ran — beaten by SuperVerse, then XRP, and now by Sui's ~7.90× July–New Year leg in the current optimum.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "You are holding common stock of a Bitcoin-treasury company with a legacy software business attached — not Bitcoin itself. Custody, brokerage protections, and corporate actions differ completely from holding BTC or an ETF. The pivots assume trading the equity with perfect timing around those highs and lows.",
        ],
      },
    ],
  },
  {
    id: "SUPER",
    essence: "A gaming and metaverse ecosystem token — formerly SuperFarm — whose second leg once unlocked the calendar optimum.",
    sections: [
      {
        title: "What it is",
        body: [
          "SuperVerse (SUPER) is the rebranded evolution of SuperFarm, a project that began in the NFT and yield-farming era and repositioned toward a broader gaming / metaverse ecosystem. The umbrella includes games, NFT infrastructure, and community products meant to give the token a home beyond pure speculation.",
          "Like many gaming tokens, SUPER lives or dies on attention: new title launches, partnership announcements, exchange listings, and whether crypto-native gamers are in a risk-on mood. The fundamental product story is \"Web3 gaming rails and entertainment IP\"; the traded reality is often closer to a mid-cap narrative coin with gaming branding.",
        ],
      },
      {
        title: "How to think about the token",
        body: [
          "SUPER is used across the SuperVerse ecosystem for participation, incentives, and governance-flavoured mechanics depending on the product surface at the time. That utility is real to users inside the apps and still secondary to speculative flows for price. Gaming tokens as a sector are famous for boom-bust cycles tied to user acquisition costs and the difficulty of retaining players when rewards fade.",
          "The rebrand from SuperFarm to SuperVerse was itself a signal: leave the 2021 farm-token stigma, lean into entertainment and gaming where retail crypto attention periodically returns.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "Two legs appear in the data. The first is a classic 2023–early-2024 run. The second — summer 2024 low into early December — quietly beats Strategy's overlapping second leg (~3.53× vs ~4.91×). It was an earlier calendar optimum's middle leg (AIOZ-1 → SUPER-2 → ZEC full). XRP's Oct trough and then Sui's July–New Year leg (~7.90×) successively took that autumn slot.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "A mid-liquidity gaming/metaverse token whose returns in this set came from speculative repricing, not from a claim on mature studio cash flows. It is exactly the kind of asset that looks genius in a hindsight lottery and brutal if the narrative season ends while you are still in it.",
        ],
      },
    ],
  },
  {
    id: "PEPE",
    essence: "A pure memecoin — cultural velocity with no protocol ambition, and enormous lottery-ticket convexity.",
    sections: [
      {
        title: "What it is",
        body: [
          "Pepe (PEPE) is an Ethereum-based memecoin launched in April 2023, named after the Pepe the Frog internet character. It does not pretend to be a payments network, a compute marketplace, or a DeFi primitive. Its product is the meme: community, virality, exchange listings, and the willingness of traders to treat a joke as a liquid lottery ticket.",
          "That honesty is useful. Many tokens wrap speculation in infrastructure language. PEPE mostly does not. Understanding it means understanding attention markets: how crypto Twitter, Telegram, and exchange market-makers turn a cultural object into a multi-billion-dollar fully diluted valuation — and how quickly that attention can leave.",
        ],
      },
      {
        title: "Market structure quirks",
        body: [
          "PEPE trades at a tiny unit price by design (many zeros after the decimal), which psychologically encourages huge nominal token counts. Liquidity on major venues became deep enough that large traders could enter and exit, but slippage and copycat spoof tokens remain endemic to the meme sector. There is no meaningful \"fundamentals dashboard\" — holders watch social volume, listings, whale wallets, and broader ETH-meme beta.",
          "As with other memecoins, smart-contract ownership, liquidity-lock status, and tax-on-transfer gimmicks (PEPE itself aimed for a relatively clean ERC-20 profile compared with some scam forks) are part of due diligence — none of which turns it into a productive asset.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "PEPE's first leg is the consolation opener: if you missed AIOZ, this was still a path to a huge multiple from mid-October 2023 into May 2024. The second leg adds another dose of convexity into December 2024. Both overlap other names, so PEPE shows up constantly in \"good but not optimal\" chains — including several of the original hand-ranked paths.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "You are holding a bearer instrument whose value is almost entirely reflexive. There is no cash flow, no protocol fee switch that must flip, and no legal claim on frog-related IP. Lottery Assets includes PEPE because it did, in fact, go vertical — which is the entire methodological warning of this site in a single ticker.",
        ],
      },
    ],
  },
  {
    id: "SUI",
    essence: "A Move-based Layer 1 from Mysten Labs — object-centric design, parallel execution, and a summer-2024-to-New-Year price run that currently owns the autumn slot.",
    sections: [
      {
        title: "What it is",
        body: [
          "Sui is a Layer-1 blockchain launched by Mysten Labs, a team with deep roots in Meta's Diem / Move ecosystem. It uses the Move programming language and an object-centric data model: on-chain state is organised as objects that transactions can access in parallel when they do not conflict, aiming for high throughput without forcing every transaction through a single global queue.",
          "In market narrative terms Sui sits with the post-Solana cohort of consumer-facing L1s — gaming, social experiments, DeFi, and meme liquidity — while selling a more formal systems story around Move's resource safety and horizontal scaling. SUI is the native asset for fees, staking, and governance-flavoured participation.",
        ],
      },
      {
        title: "How the token fits the story",
        body: [
          "Validators stake SUI to secure the network; users pay gas in SUI; ecosystem incentives and unlock schedules have been central to how traders talk about float and overhang. Like other L1 tokens, price discovery is dominated by crypto beta, listing events, unlock calendars, and whether the chain is winning attention share — not by a neat discounted-cash-flow of protocol fees.",
          "The July 2024 to January 2025 window in this dataset is exactly that kind of narrative season: a trough near $0.62, a push into the New Year near $4.90, and enough liquidity that the leg is imaginable as a rotation vehicle even if perfect timing was not.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "SUI contributes one leg: Jul 31 2024 at $0.62 to Jan 1 2025 at $4.90 — about 7.90× over 154 days. It starts the same day as SuperVerse's second leg and overlaps XRP's autumn run, so the lottery forces a choice. At ~7.90× it beats XRP (~5.71×), SUPER-2 (~4.91×), and MSTR-2 (~3.53×), which is why the current optimum is AIOZ-1 → SUI-1 → ZEC-1 → ZEC-2 at roughly 63,337×.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "You are holding the native gas/staking token of a Move-based L1 — a leveraged claim on whether Sui keeps developer and retail attention, not equity in Mysten Labs. Unlock schedules, validator economics, and sector rotation can dominate fundamentals for long stretches. The pivots here assume buying the July trough and selling into the New Year print with perfect hindsight.",
        ],
      },
    ],
  },
  {
    id: "XLM",
    essence: "Stellar's native lumen — a payments-network token with a sharp eight-week autumn pop that still loses the calendar fight to Sui.",
    sections: [
      {
        title: "What it is",
        body: [
          "Stellar is a payment-focused blockchain launched in 2014 by Jed McCaleb and Joyce Kim, with the Stellar Development Foundation as its long-running steward. Its native unit is the lumen (XLM): used for fees, anti-spam minimum balances, and as a bridge asset in Stellar's pathfinding model for cross-currency transfers.",
          "The product pitch has always been remittances and cheap multi-currency settlement — closer to XRP's narrative lane than to smart-contract L1s. In market practice XLM also trades as a liquid large-cap beta name: deep books, long history, and headline sensitivity around partnerships, ETF chatter, and risk-on waves.",
        ],
      },
      {
        title: "How the token works",
        body: [
          "Stellar's consensus is Stellar Consensus Protocol (SCP), a federated Byzantine agreement design rather than proof-of-work or bonded proof-of-stake. Lumens pay tiny fees and sit in accounts as reserve; inflation mechanics have changed over the project's life, so older \"inflation coupon\" mental models no longer apply.",
          "For this lottery, none of that plumbing matters as much as the price path: a compressed Oct–Nov 2024 run from nine cents to forty-nine cents that looks great in isolation and awkward once you notice it sits entirely inside Sui's longer autumn hold.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "XLM contributes one leg: Oct 2 2024 at $0.09 to Nov 27 2024 at $0.49 — about 5.44× in 56 days. That beats SUPER-2 and MSTR-2 on multiple, but it overlaps SUI-1 and XRP-1, and there is no follow-on leg in the set between late November and Zcash's April open. Best XLM chain is AIOZ-1 → XLM-1 → ZEC full at roughly 43,632× — real, ranked, and still behind the Sui optimum at 63,337×.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "You are holding lumens — the fee/reserve asset of the Stellar network — not equity in the Stellar Development Foundation. Liquidity is usually excellent relative to mid-cap alts; the trade-off is that XLM often moves as a crowded beta instrument. The pivots here assume buying the early-October trough and selling the late-November spike with perfect hindsight.",
        ],
      },
    ],
  },
  {
    id: "ZIG",
    essence: "A long DeFi / RWA-adjacent token grind — ~35× over fifteen months that locks out the openers the lottery actually needs.",
    sections: [
      {
        title: "What it is",
        body: [
          "ZIGChain (ticker ZIG; historically associated with the Zignaly / ZIG ecosystem) sits in the crowded lane of crypto projects pitching portfolio tooling, copy-trading roots, and later chain / RWA ambitions. Like many mid-cap names, the marketed product surface has shifted with the cycle; what the lottery cares about is the price path, not the pitch deck.",
          "In this set it plays the role of a multi-season hold: bought in the late-2023 trough and carried deep into the 2024 risk-on year. That is a very different animal from the short autumn middles (SUI, XRP, XLM) that fit between AIOZ and Zcash.",
        ],
      },
      {
        title: "Why the multiple misleads",
        body: [
          "From $0.0049 on Aug 24 2023 to $0.17 on Dec 4 2024 is roughly 34.7× — larger than SUI's autumn leg and in the same ballpark as Render. The catch is occupancy: 468 days that overlap AIOZ-1, INJ, SOL-1, PEPE, SUI, XRP, SUPER, and almost every other tradeable bar before Zcash.",
          "Alone, ZIG loses to AIOZ-1's 90× opener. Chained into Zcash full it reaches about 3,089× — real, and still an order of magnitude behind AIOZ → SUI → ZEC at 63,337×. Same exit day as SUPER-2 and PEPE-2 (Dec 4), so it is competing for a crowded sell print after blocking the board.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "ZIG is in the set as a cautionary lane: survivorship bias loves a 35× coin, and the lottery exists to show why you still would not pick it if capital can only be in one place. Best ZIG chain is ZIG-1 → ZEC-1 → ZEC-2. It never enters the optimum.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "A mid-liquidity ecosystem token whose returns in this window came from a long speculative repricing, not from a claim on mature protocol cash flows. Holding it through this pivot pair means sitting out AIOZ, Sui, and the rest of the 2023–2024 rotation puzzle — which is exactly why the solver leaves it on the bench.",
        ],
      },
    ],
  },
  {
    id: "ZEC",
    essence: "A privacy coin built on zero-knowledge proofs — old cypherpunk tech that suddenly traded like a new narrative.",
    sections: [
      {
        title: "What it is",
        body: [
          "Zcash (ZEC) is a privacy-focused cryptocurrency launched in 2016 by a team associated with the Electric Coin Company, with deep roots in academic cryptography. It builds on Bitcoin's UTXO model but adds zk-SNARKs (zero-knowledge succinct non-interactive arguments of knowledge) so users can shield transaction sender, recipient, and amount while still allowing the network to verify that no coins were created illegally.",
          "Zcash supports both transparent addresses (t-addresses) and shielded addresses (z-addresses). That optional privacy model was a political and regulatory compromise: it made exchange listings easier than forced-private coins, while still offering strong confidentiality when users opt in. Over the years the project iterated proving systems (including Halo and other upgrades) to reduce trusted-setup concerns and improve usability.",
        ],
      },
      {
        title: "Why privacy returned as a trade",
        body: [
          "For long stretches ZEC traded as a neglected \"old coin\" — cypherpunk heritage without Solana-style retail heat. Privacy narratives periodically revive when markets refocus on surveillance, exchange KYC fatigue, or the idea that confidential settlement is under-owned financial infrastructure. When that happens, the free float of attention-sensitive privacy coins can reprice violently because the prior base was so depressed.",
          "Zcash's appearance at the far right of the lottery is exactly that shape: a multi-month explosion, a sharp drawdown, and another violent leg higher into August 2026 — with the final pivot marked open because it was still live when the dataset was captured.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "ZEC provides the closing engine of the optimal chain. After earlier capital has compounded through AIOZ and Sui, both ZEC legs fit sequentially at the end of the calendar and multiply the stack again. Without Zcash's late window, the headline 63,337× does not exist. That is also why ZEC-2's \"still open\" flag matters: part of the fairy tale is marked to a live print rather than a settled exit.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "ZEC is a monetary token with a fixed-ish issuance schedule and a fee/mining (or staking, depending on network era) security model — plus optional cryptographic privacy. Regulatory pressure on privacy coins is a persistent risk: exchanges can delist, and shielded liquidity can fragment. Holding ZEC for the pivots in this set meant embracing both the technology's ideals and the speculative thinness of a narrative revival.",
        ],
      },
    ],
  },
];
