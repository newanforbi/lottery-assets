# Lottery Assets

**[lotteryassets.com](https://lotteryassets.com)**

**Lottery Assets** is a chronological rotation lottery: thirteen assets that went
vertical, nineteen tradeable buy-low / sell-high legs, and one pool of capital
that can only be in one position at a time. Overlapping legs are mutually
exclusive — chain the ones that fit the calendar (Oct 2022 &ndash; Sep 2026) and
see where a starting stake lands.

---

## The idea

Each asset is a series of alternating lows and highs drawn from historical price
pivots. A **leg** is one buy-low / sell-high pair worth `sellPrice / buyPrice`;
between legs, capital sits in cash. A **chain** is the product of legs &mdash;
the compounded return of rotating through them sequentially.

The constraint that makes this interesting: **one pool of capital** means
overlapping legs are mutually exclusive. That turns "which assets returned the
most" into [weighted interval scheduling](https://en.wikipedia.org/wiki/Weighted_job_scheduling),
and a simple leaderboard of raw multipliers can't express it because it has no
way to say *these two trades cannot coexist*.

The lottery makes it visible instead. Click a leg and everything colliding with it
fades out.

## What the solver found

Running the search over chains that actually obey the calendar turned up a result
the original hand-built analysis missed, and one row it got wrong:

- **The optimum is `AIOZ-1 → SUI-1 → ZEC-1 → ZEC-2` at 90,147&times;** &mdash;
  $901.5M on $10K, after ZEC-2's live print moved to Sep 6 2026 at $1,248.13
  (~5.86&times;). Ahead of the XRP middle-leg path (65,120&times;), the older
  SuperVerse path (55,946&times;), and the published best of 28,276&times;.
  Sui's July 31 2024 → Jan 1 2025 leg returns ~7.90&times; and fits between
  AIOZ's exit and Zcash's entry, outrunning XRP (5.71&times;), Stellar/XLM
  (5.44&times;), SuperVerse (4.91&times;), and Strategy (3.53&times;) in that
  autumn window. XLM's eight-week pop is real but fully inside SUI's hold, so
  it does not change the optimum.
- **Kaspa is the closest AIOZ has ever come to losing the opener slot.** Its
  Oct 31 2022 → Feb 28 2024 leg (~88.4&times;) is the second-largest single
  leg in the set — bigger than Injective, ZIGChain, or anything else — and it
  opens earlier than every other asset here, so it collides with almost the
  entire 2023 cohort (INJ, SOL, MSTR, ZIG, SUPER-1, PEPE-1). Chained into Sui
  and Zcash it reaches ~88,540&times;, a genuine near-miss that still falls
  short of the AIOZ-led 90,147&times; record.
- **ZIGChain's exit is corrected, and it matters more than the headline number.**
  The original Dec 4 2024 top ($0.17, ~34.7&times;) is a bigger raw multiple, but
  it sells four and a half months too late to catch Sui's Jul 31 2024 buy, so
  that version of ZIG tops out around 4,397&times; chained straight into Zcash.
  Selling instead at the Jul 19 2024 high ($0.1373, ~28.0&times;) frees the same
  Sui → Zcash finish AIOZ and Kaspa use, reaching roughly 28,066&times; — about
  6.4&times; more capital despite the smaller single-leg number. Corrected,
  ZIG-1 is the fourth-largest opening leg in the set.
- **Worldcoin is a hypothetical, not a historical trade.** Its Sep 7 2022 entry
  predates WLD's actual public launch (Jul 2023) by about ten months, so this
  pivot pair is a numbers exercise — "if a token had followed this price path,
  where would it rank?" — rather than a real recorded pivot. At ~21.2&times; it
  lands seventh of thirteen opening legs, and its best chain
  (`WLD-1 → SUI-1 → ZEC-1 → ZEC-2`, ~21,235&times;) is solidly mid-pack, nowhere
  near the optimum.

Every other figure from the original analysis reproduces exactly.

## Assets

| Ticker | Name | Legs | Notes |
|--------|------|------|-------|
| AIOZ | AIOZ Network | 2 | The single most violent leg in the set &mdash; 90&times; in six months |
| KAS | Kaspa | 1 | Oct 31 2022 → Feb 28 2024, $0.001982 → $0.1752 &mdash; ~88.4&times;, the runner-up opener |
| INJ | Injective | 1 | The best opening leg that isn't AIOZ or Kaspa |
| SOL | Solana | 2 | Emerged from the FTX collapse at a generational low |
| XRP | XRP | 1 | Oct 9 2024 trough at $0.55 into early 2025 &mdash; strong autumn also-ran behind SUI |
| MSTR | Strategy | 2 | The only equity &mdash; leveraged bitcoin exposure in a brokerage account |
| SUPER | SuperVerse | 2 | Its second leg beats Strategy's in the same window; outrun by SUI and XRP |
| PEPE | Pepe | 2 | The best opening leg available to anyone who missed AIOZ |
| WLD | Worldcoin | 1 | **Hypothetical** — Sep 7 2022 → Mar 13 2024, $0.45 → $9.54 (~21.2&times;); WLD didn't trade publicly until Jul 2023, so this is a numbers exercise, not a real pivot |
| SUI | Sui | 1 | July 31 2024 at $0.62 to Jan 1 2025 at $4.90 &mdash; ~7.90&times; and the current autumn optimum |
| XLM | Stellar | 1 | Oct 2 → Nov 27 2024, $0.09 → $0.49 (~5.44&times;) &mdash; clean pop inside SUI's window |
| ZIG | ZIGChain | 1 | Aug 24 2023 → Jul 19 2024, $0.0049 → $0.1373 (~28.0&times;) &mdash; corrected exit; sells early enough to chain into SUI and Zcash |
| ZEC | Zcash | 2 | Two legs at the far end of the lottery; ZEC-2 is still open |

Multipliers are derived from the price pivots at runtime, never hardcoded. A
corrected pivot propagates everywhere instead of drifting out of sync.

## Tabs

| Tab | What it does |
|-----|-------------|
| **Lottery** | The timeline. Click legs to chain them; conflicts dim out. *Solve* animates the optimum, *Deal me a hand* draws a random valid chain. Starting-capital presets: $1K, $5K, $10K, $50K, $100K. |
| **Ladder** | Step-by-step capital progression for the selected chain, including the idle stretches in cash. |
| **Leaderboard** | Every valid chain ranked, plus the original eight paths checked against the calendar. |
| **Assets** | Per-asset pivots and legs with individual multipliers. |
| **3× Book** | The twenty-eight names Coinbase will let you buy with borrowed cash (~3× buying power), plus USDC as the cash rail. Monthly history, spot vs 3× legs, a ranked rotation solver, and a from-here recovery-to-high table. Isolated 3× turns a spot multiple `m` into `3m − 2`; a one-third drop from entry liquidates. The 3× optimum is `SOL-1 → CRV-1 → ZEC-2 → ZEC-3` at ~2.47 million× — Curve's Aug 2024 flush outruns ZEC's first bounce in the autumn slot. |
| **About the Assets** | Deep dossiers on what each of the thirteen assets actually is — product, market structure, and why it appears in Lottery Assets. |
| **Reality Check** | Sliders for move capture, slippage, and per-rotation tax. At 65% capture the $901.5M becomes $4.9M. |
| **Learn** | Educational guide covering what cryptocurrency is, where to buy it (Coinbase, Kraken, Binance), how to self-custody, security basics, taxes, and key concepts. |

## Tech stack

| | |
|---|---|
| **Framework** | Vite + React 18 |
| **Styling** | Inline styles &mdash; carried over from [`alpha-hybrid`](https://github.com/newanforbi/alpha-hybrid)'s `LiquidityCascade.jsx` |
| **Visuals** | Galaxy canvas with shooting-star particles (`src/ui/Cosmos.jsx`) |
| **Type system** | JetBrains Mono, Space Grotesk, DM Sans via Google Fonts |
| **Solver** | Weighted interval scheduling via DP, plus exhaustive enumeration for the leaderboard |
| **Tests** | Node.js built-in test runner, covering solver correctness, claimed-path validation, and the 3× book |

## Project structure

```
src/
  App.jsx                  # Root component, tab nav, capital input, solve/deal
  main.jsx                 # React entry point
  data/
    assets.js              # Price pivots for all 13 assets + claimed paths
    assetAbout.js          # Long-form copy for About the Assets
    exchangeBook.js        # Coinbase 3× book: 28 tradeable names + USDC, monthly closes, pivots
  engine/
    solver.js              # buildLegs, conflicts, chainValue, solveOptimal, allChains
    solver.test.js         # 20 tests: multipliers, chain validity, friction model
    leverage.js            # 3× isolated-long math + book legs / solver wrappers
    leverage.test.js       # Book size, 3× formula, SOL→CRV→ZEC optimum
  components/
    Lottery.jsx            # Interactive lottery timeline with conflict dimming
    Ladder.jsx             # Step-by-step capital walk
    Leaderboard.jsx        # Ranked valid chains + original 8 paths
    AssetCards.jsx         # Per-asset breakdown
    ExchangeBook.jsx       # Coinbase 3× book: history, ranked 3× chains, from-here recovery
    AboutAssets.jsx        # Deep-dive dossiers for each asset
    RealityCheck.jsx       # Friction sliders (capture, slippage, tax)
    Learn.jsx              # Educational crypto content
  ui/
    Cosmos.jsx             # Galaxy background + shooting stars
    atoms.jsx              # Shared components (Panel, Stat, Eyebrow, Button, Odometer)
    format.js              # Currency + multiplier formatting
public/
  favicon.ico              # 16/32/48/64 multi-resolution
  favicon-32.png           # Modern tab icon
  emblem-source.png        # Unrimmed master for favicon regeneration
  icon-192.png             # PWA icon
  icon-512.png             # PWA icon (large)
  apple-touch-icon.png     # 180x180 iOS home screen
  site.webmanifest         # PWA metadata
  og-image.png             # 1200x630 link preview
  robots.txt               # Allows everything, points at sitemap
  sitemap.xml              # Single-page sitemap
index.html                 # Entry HTML with OG/Twitter meta tags
```

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # solver + 3× book tests
npm run build        # production build → dist/
```

## Deploying

Hosted on **Vercel** at [lotteryassets.com](https://lotteryassets.com).

Vercel auto-detects Vite &mdash; framework preset **Vite**, build command
`npm run build`, output directory `dist`. No configuration file needed; the app
is a single page with tab state managed in React, so there are no routes to
rewrite.

### Domain setup

1. Add `lotteryassets.com` under the project's **Settings &rarr; Domains** in
   Vercel.
2. Follow the DNS records Vercel shows &mdash; an `A` record for the apex, or
   its nameservers if you move DNS across.
3. Adding `www.lotteryassets.com` alongside it gives you a redirect to the apex
   for free.
4. Certificates are issued automatically once DNS resolves.

### Domain-dependent files

All in `public/`. The absolute URLs in `index.html` (`canonical`, `og:url`,
`og:image`) are hardcoded to `https://lotteryassets.com/` &mdash; they must be
absolute for link unfurling to work, so they need editing if the domain ever
changes.

| File | Purpose |
|------|---------|
| `favicon.ico` | Multi-resolution (16/32/48/64) for older browsers and pinned tabs |
| `favicon-32.png` | Modern tab icon |
| `icon-192.png`, `icon-512.png` | PWA icons |
| `apple-touch-icon.png` | 180&times;180 for iOS home screens |
| `site.webmanifest` | PWA metadata &mdash; name, theme colour, icon set |
| `og-image.png` | 1200&times;630 link preview; regenerate if the optimal chain or headline number changes |
| `robots.txt` | Allows everything, points at the sitemap |
| `sitemap.xml` | Single-page sitemap |

## Icon generation notes

The current mark is a finished navy-tile icon: gold lottery drum, gold/white
balls, rising gold arrow. Source artwork lives at `public/emblem-source.png`.
Regenerate the derived set with:

```bash
python3 scripts/generate-favicons.py --src public/emblem-source.png
```

That refreshes `favicon-32.png`, multi-size `favicon.ico` (16/32/48/64),
`apple-touch-icon.png`, and the PWA icons. The generator tight-crops the mark,
recenters it on a square of the source navy, and LANCZOS-downsamples. Small
sizes (16&ndash;64px) get a light contrast / saturation / unsharp pass so the
arrow and drum still read in a tab.

## The solver

The engine (`src/engine/solver.js`) implements:

- **`buildLegs`** &mdash; Turns alternating low/high pivots into tradeable legs
  with derived multipliers and conflict detection.
- **`conflicts`** &mdash; Two legs overlap when their holding periods share any
  time, including touching endpoints.
- **`solveOptimal`** &mdash; Maximum-product chain via weighted interval
  scheduling DP. Sorts by sell date, then for each leg takes the best chain that
  finished strictly before it opens.
- **`allChains`** &mdash; Exhaustive enumeration of every valid chain. 19 legs
  with heavy overlap keeps the search space small enough to enumerate in under a
  millisecond.
- **`chainValue`** &mdash; Walks a chain step by step, applying optional
  friction (capture in log space, slippage on both sides, tax per rotation).
- **`randomChain`** &mdash; Greedy random walk biased toward longer chains.

### Friction model

| Parameter | Effect |
|-----------|--------|
| **Move capture** | Share of each move you catch, applied in log space: 65% capture turns a 90&times; leg into 90<sup>0.65</sup> &asymp; 19.3&times; |
| **Slippage** | Spread paid on entry and exit, hence squared: `(1 - slip)^2` |
| **Tax per rotation** | Applied to realised gains at each exit |

## A caveat worth stating plainly

These thirteen assets are here because they went up (Worldcoin's pivot pair is a
hypothetical numbers exercise, not a settled trade — see the Assets table above).
The ones that went to zero
over the same four years aren't in the lottery, and there were many more of them.
Picking these winners in advance and then timing eight turning points across them
isn't a strategy &mdash; it's the definition of survivorship bias with a
calculator attached. The Reality Check tab exists to put a number on the
difference between the headline and anything a person could have actually done.

Past performance does not guarantee future results. This is not financial advice.
