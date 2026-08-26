# Lottery Assets

**[lotteryassets.com](https://lotteryassets.com)**

**Lottery Assets** is a chronological rotation lottery: nine assets that went
vertical, fifteen tradeable buy-low / sell-high legs, and one pool of capital
that can only be in one position at a time. Overlapping legs are mutually
exclusive — chain the ones that fit the calendar (Oct 2022 &ndash; Aug 2026) and
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

- **The optimum is `AIOZ-1 → XRP-1 → ZEC-1 → ZEC-2` at 45,753&times;** &mdash;
  $457.5M on $10K. Ahead of the published best of 28,276&times;, and ahead of the
  previous calendar optimum that used SuperVerse's second leg (39,307&times;).
  With XRP's buy moved to Oct 9 2024 at $0.55, its ~5.71&times; autumn leg fits
  between AIOZ's exit and Zcash's entry and outruns both SuperVerse (4.91&times;)
  and Strategy (3.53&times;) in that window.
- **`AIOZ 1st → Render` is not executable.** Render's leg runs Oct 12 2022 &ndash;
  Mar 17 2025, which entirely contains AIOZ's Sep 2023 &ndash; Mar 2024 leg. The
  arithmetic behind the published 2,811&times; is right; the trade is impossible.

Every other figure from the original analysis reproduces exactly.

## Assets

| Ticker | Name | Legs | Notes |
|--------|------|------|-------|
| AIOZ | AIOZ Network | 2 | The single most violent leg in the set &mdash; 90&times; in six months |
| RENDER | Render | 1 | A 31&times; move, but it occupies 29 months &mdash; the costliest real estate in the lottery |
| INJ | Injective | 1 | The best opening leg that isn't AIOZ |
| SOL | Solana | 2 | Emerged from the FTX collapse at a generational low |
| XRP | XRP | 1 | Oct 9 2024 trough at $0.55 into early 2025 &mdash; the middle leg of the current optimum |
| MSTR | Strategy | 2 | The only equity &mdash; leveraged bitcoin exposure in a brokerage account |
| SUPER | SuperVerse | 2 | Its second leg beats Strategy's in the same window; XRP's shorter autumn leg now outruns both |
| PEPE | Pepe | 2 | The best opening leg available to anyone who missed AIOZ |
| ZEC | Zcash | 2 | Two legs at the far end of the lottery; ZEC-2 is still open |

Multipliers are derived from the price pivots at runtime, never hardcoded. A
corrected pivot propagates everywhere instead of drifting out of sync.

## Tabs

| Tab | What it does |
|-----|-------------|
| **Lottery** | The timeline. Click legs to chain them; conflicts dim out. *Solve* animates the optimum, *Deal me a hand* draws a random valid chain. Starting-capital presets: $1K, $5K, $10K, $50K, $100K. |
| **Ladder** | Step-by-step capital progression for the selected chain, including the idle stretches in cash. |
| **Leaderboard** | Every valid chain ranked, plus the original nine paths checked against the calendar. |
| **Assets** | Per-asset pivots and legs with individual multipliers. |
| **About the Assets** | Deep dossiers on what each of the nine assets actually is — product, market structure, and why it appears in Lottery Assets. |
| **Reality Check** | Sliders for move capture, slippage, and per-rotation tax. At 65% capture the $457.5M becomes $3.3M. |
| **Learn** | Educational guide covering what cryptocurrency is, where to buy it (Coinbase, Kraken, Binance), how to self-custody, security basics, taxes, and key concepts. |

## Tech stack

| | |
|---|---|
| **Framework** | Vite + React 18 |
| **Styling** | Inline styles &mdash; carried over from [`alpha-hybrid`](https://github.com/newanforbi/alpha-hybrid)'s `LiquidityCascade.jsx`, with theme tokens as CSS variables |
| **Theming** | Dark and light, following the OS until toggled in the header; the choice is remembered in `localStorage` |
| **Visuals** | Galaxy canvas with shooting-star particles (`src/ui/Cosmos.jsx`) |
| **Type system** | JetBrains Mono, Space Grotesk, DM Sans via Google Fonts |
| **Solver** | Weighted interval scheduling via DP, plus exhaustive enumeration for the leaderboard |
| **Tests** | Node.js built-in test runner, 15 assertions covering solver correctness and claimed-path validation |

## Project structure

```
src/
  App.jsx                  # Root component, tab nav, capital input, solve/deal
  main.jsx                 # React entry point
  data/
    assets.js              # Price pivots for all 9 assets + claimed paths
    assetAbout.js          # Long-form copy for About the Assets
  engine/
    solver.js              # buildLegs, conflicts, chainValue, solveOptimal, allChains
    solver.test.js         # 15 tests: multipliers, chain validity, friction model
  components/
    Lottery.jsx            # Interactive lottery timeline with conflict dimming
    Ladder.jsx             # Step-by-step capital walk
    Leaderboard.jsx        # Ranked valid chains + original 9 paths
    AssetCards.jsx         # Per-asset breakdown
    AboutAssets.jsx        # Deep-dive dossiers for each asset
    RealityCheck.jsx       # Friction sliders (capture, slippage, tax)
    Learn.jsx              # Educational crypto content
  ui/
    Cosmos.jsx             # Galaxy background + shooting stars
    atoms.jsx              # Shared components (Panel, Stat, Eyebrow, Button, Odometer)
    theme.jsx              # Theme provider, accent remapping, header toggle
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
index.html                 # Entry HTML with OG/Twitter meta tags + theme tokens
```

## Theming

The site follows the operating system's `prefers-color-scheme` until a visitor picks a
side with the toggle in the header. Only an explicit choice is written to `la-theme`, so
someone who never touches the toggle keeps tracking the OS &mdash; including live, if they
flip their system theme with the tab open &mdash; rather than being pinned to whatever it
said on their first visit. A stored choice always wins, and is restored before first paint
by a small inline script in `index.html`, so switching never flashes.

Two mechanisms carry the swap:

- **Surfaces, hairlines and text** are CSS variables declared in `index.html` (`--ink-*`,
  `--fill-*`, `--line-*`). The suffix is the original dark alpha, so `--ink-45` is exactly
  the old `rgba(255,255,255,0.45)` and dark mode renders identically to before. Light mode
  re-points the same names at dark ink over paper, and low fills flip to white because
  panels sit *above* the page there rather than below it.
- **Brand accents** cannot be variables: they are concatenated with hex alpha at render
  time (`` `${leg.color}45` ``). `useTheme().ac(hex)` maps each of the nine asset colours
  and the UI accents to a darkened twin of the same hue, since neon tuned for `#0A0B0F`
  is illegible on white. `ac()` passes through anything it does not recognise, so applying
  it twice is safe. `glow()` alongside it returns `"none"` in light mode &mdash; bloom needs a
  dark field to bloom into.

Adding a colour means adding a token, not an `rgba()` literal.

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # 15 solver tests
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

The tab icons are the emblem's **filled silhouette**: transparent outside its
outer boundary, with the interior kept opaque so a light tab bar cannot bleed
through the gaps between the ring, the ball, and the stand. No shape crop &mdash;
the alpha follows the mark itself.

For small sizes (16&ndash;64px), visibility is improved on top of that pipeline:

- **Tighter crop + slight scale-up** so the mark fills more of the tab tile
- **Gold-ring thickening** before downscale so the metal rim survives LANCZOS
- **Dual exterior rim** &mdash; a pale-gold halo (reads on dark chrome) outside a
  near-black stroke (reads on light tabs)
- **Contrast / saturation / unsharp** on the 16&ndash;48px frames only

Cut square from the wordmark-free artwork and downsample with LANCZOS for edge
antialiasing. Source artwork lives at `public/emblem-source.png`. Regenerate with:

```bash
python3 scripts/generate-favicons.py --src public/emblem-source.png
```

That refreshes `favicon-32.png`, multi-size `favicon.ico`, `apple-touch-icon.png`,
and the PWA icons together so the rim treatment stays consistent.

### Sealing the interior

Two different kinds of gap leak through the silhouette, each fixed differently:

**Enclosed gaps** &mdash; where the ring passes behind the ball and its dark
lower edge meets the dark ground &mdash; are bridged by a disk closing of radius
22 before `binary_fill_holes`.

**The open concavity** between the stand and the bar chart is not a hole at all;
it connects to the exterior, so no hole fill can reach it. It is covered by
filling the **gold ring's disc**, fitted from the artwork at centre (624.5,
510.5), radius 316.5, **clipped at y=786** (the emblem's bottom). The ring's
lower arc is occluded by the stand, so an unclipped disc would paint 41px of
black below the artwork.

### The exterior rim

A **14px black rim** around the entire mark. The arrow's tip extends ~89px past
the ring where it is white on bare tab colour and vanishes on light themes; the
gold ring dissolves into tan or amber tabs. The rim is dilated from the opaque
mask and intersected with currently-transparent pixels, so it only grows into
empty space.

### Regeneration traps

- **Erode the brightness mask before measuring.** A single stray JPEG pixel one
  level above threshold can inflate an enclosing radius from 381 to 598.
- **Keep every connected component, not just the largest.** The outer gold ring
  is a separate component from the ball; taking only the largest silently drops it.
- `ImageDraw.floodfill` is a no-op in Pillow 12.3. Use `scipy.ndimage`
  (`label` / `binary_fill_holes`) for connectivity work.

## The solver

The engine (`src/engine/solver.js`) implements:

- **`buildLegs`** &mdash; Turns alternating low/high pivots into tradeable legs
  with derived multipliers and conflict detection.
- **`conflicts`** &mdash; Two legs overlap when their holding periods share any
  time, including touching endpoints.
- **`solveOptimal`** &mdash; Maximum-product chain via weighted interval
  scheduling DP. Sorts by sell date, then for each leg takes the best chain that
  finished strictly before it opens.
- **`allChains`** &mdash; Exhaustive enumeration of every valid chain. 15 legs
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

These nine assets are here because they went up. The ones that went to zero
over the same four years aren't in the lottery, and there were many more of them.
Picking these winners in advance and then timing eight turning points across them
isn't a strategy &mdash; it's the definition of survivorship bias with a
calculator attached. The Reality Check tab exists to put a number on the
difference between the headline and anything a person could have actually done.

Past performance does not guarantee future results. This is not financial advice.
