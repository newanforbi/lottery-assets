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
          "Solana contributes two legs: the post-FTX rebound into March 2024, then a pullback and a second push into January 2025. Both are large, liquid, and heavily overlapped with other openers (INJ, MSTR-1, XRP's long hold). In the lottery, SOL is rarely \"wrong\" as a story — it is often just busy at the same time as something that compounds better in a multi-leg chain.",
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
        title: "The lawsuit that defined a cycle",
        body: [
          "In December 2020 the U.S. Securities and Exchange Commission sued Ripple, alleging that XRP sales were unregistered securities offerings. For years afterward, U.S. exchanges delisted or restricted XRP, institutional desks treated it as radioactive, and the token traded under a legal overhang that had little to do with ledger software and everything to do with distribution risk.",
          "Court developments in 2023 — notably a ruling that certain programmatic exchange sales of XRP were not investment contracts — triggered a violent repricing as the market reassessed U.S. access and headline risk. That legal saga is the fundamental story behind the long, suppressed base and the sharp leg higher in this dataset.",
        ],
      },
      {
        title: "Why it shows up here",
        body: [
          "XRP's single lottery leg runs from early November 2022 into early January 2025 — about $0.33 to $3.14. The multiple is large, but the occupancy is enormous: holding XRP for that entire window locks you out of most of the violent 2023–2024 openers. It is a classic \"one big correct trade\" that loses to sequenced shorter legs in a capital-constrained model.",
        ],
      },
      {
        title: "What you are actually holding",
        body: [
          "XRP is a transferable ledger token used for fees and bridging narratives on the XRP Ledger; it is not equity in Ripple the company (though the market often conflates the two). Regulatory treatment still varies by jurisdiction. The pivots here encode a litigation-and-sentiment cycle as much as a payments-adoption cycle.",
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
          "Strategy contributes two legs: the bounce from the December 2022 low into March 2024, then a summer dip and a ferocious second leg into November 2024 as Bitcoin and the corporate-treasury narrative went parabolic together. MSTR-2 is the famous also-ran in the lottery — strong, but beaten in the same autumn window by SuperVerse's second leg, which is the swap that creates the true optimum.",
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
    essence: "A gaming and metaverse ecosystem token — formerly SuperFarm — whose second leg quietly unlocks the optimal chain.",
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
          "Two legs appear in the data. The first is a classic 2023–early-2024 run. The second — summer 2024 low into early December — is the sleeper. At roughly 4.91× it beats Strategy's overlapping second leg (~3.53×) while fitting the same calendar gap between AIOZ's exit and Zcash's entry. That single comparison is why the solver's optimum is AIOZ-1 → SUPER-2 → ZEC-1 → ZEC-2 rather than the hand-built path that preferred MSTR-2.",
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
          "ZEC provides the closing engine of the optimal chain. After earlier capital has compounded through AIOZ and SUPER-2, both ZEC legs fit sequentially at the end of the calendar and multiply the stack again. Without Zcash's late window, the headline 39,307× does not exist. That is also why ZEC-2's \"still open\" flag matters: part of the fairy tale is marked to a live print rather than a settled exit.",
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
