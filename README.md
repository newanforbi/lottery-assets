# Lottery Assets

A chronological rotation puzzle. Nine assets, 15 tradeable legs, Oct 2022 → Aug 2026.
Enter a starting capital, chain the legs that fit the calendar, and see where it lands.

Built with Vite + React 18. Styling is carried over from
[`alpha-hybrid`](https://github.com/newanforbi/alpha-hybrid)'s `LiquidityCascade.jsx` —
the galaxy canvas, the shooting stars, and the mono/display type system.

## The idea

Each asset is a series of alternating lows and highs. A **leg** is one buy-low/sell-high
pair worth `sellPrice / buyPrice`; between legs, capital sits in cash. A **chain** is a
product of legs.

The constraint that makes this interesting: **you only have one pool of capital**, so two
legs that overlap in time can never both be yours. That turns "which assets returned the
most" into weighted interval scheduling — and a leaderboard of raw multipliers can't
express it, because it has no way to say *these two trades cannot coexist*.

The board makes it visible instead. Click a leg and everything colliding with it fades out.

## Two things the solver found

Running the search over chains that actually obey the calendar turned up a result the
original hand-built analysis missed, and one row it got wrong:

- **The optimum is `AIOZ-1 → SUPER-2 → ZEC-1 → ZEC-2` at 39,307×** ($393.1M on $10k) —
  ahead of the published best of 28,276×. One swap does it: SuperVerse's second leg
  returns 4.91× against Strategy's 3.53×, and both fit the same autumn-2024 window.
- **`AIOZ 1st → Render` is not executable.** Render's leg runs Oct 12 2022 → Mar 17 2025,
  which entirely contains AIOZ's Sep 2023 → Mar 2024 leg. The arithmetic behind the
  published 2,811× is right; the trade is impossible.

Every other figure from the original analysis reproduces exactly, and
`src/engine/solver.test.js` asserts all of them so a future edit to the price data can't
quietly break them.

## Tabs

| | |
|---|---|
| **Board** | The timeline. Click legs to chain them; conflicts dim out. `Solve` animates the optimum, `Deal me a hand` draws a random valid chain. |
| **Ladder** | Step-by-step capital progression for the selected chain, including the idle stretches in cash. |
| **Leaderboard** | Every valid chain ranked, plus the original nine paths checked against the calendar. |
| **Assets** | Per-asset pivots and legs. |
| **Reality Check** | Sliders for move capture, slippage, and per-rotation tax. At 65% capture the $393M becomes $3.0M. |

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # solver assertions
npm run build
```

## Deploying

Live at **[lotteryassets.com](https://lotteryassets.com)**.

Vercel auto-detects Vite — framework preset **Vite**, build `npm run build`, output `dist`.
No configuration file needed; the app is a single page with tab state, so there are no
routes to rewrite.

To point the domain at it: add `lotteryassets.com` under the project's **Settings → Domains**,
then follow the DNS records Vercel shows (an `A` record for the apex, or its nameservers if
you move DNS across). Adding `www.lotteryassets.com` alongside it gives you a redirect to the
apex for free. Certificates are issued automatically once DNS resolves.

Domain-dependent files, all in `public/`:

| file | what it does |
|---|---|
| `favicon.ico` | 16/32/48/64 multi-resolution, for older browsers and pinned tabs. |
| `favicon-32.png`, `icon-192.png`, `icon-512.png` | Modern tab and PWA icons. |
| `apple-touch-icon.png` | 180×180 for iOS home screens. |
| `site.webmanifest` | PWA metadata — name, theme colour, icon set. |
| `og-image.png` | 1200×630 link preview, generated to match the site. Regenerate it if the optimal chain or the headline number changes. |
| `robots.txt` | Allows everything, points at the sitemap. |
| `sitemap.xml` | The single page. |

The tab icons are the emblem's **filled silhouette**: transparent outside its outer
boundary, with the interior kept opaque so a light tab bar cannot bleed through the gaps
between the ring, the ball and the stand. No shape crop — the alpha follows the mark
itself. Cut square (686px, centred on the emblem at 643, 490) and downsampled with LANCZOS,
which supplies the edge antialiasing.

Sealing the interior takes two steps, because two different kinds of gap leak.

**Enclosed gaps** — where the ring passes behind the ball and its dark lower edge meets the
dark ground — are bridged by a **disk closing of radius 22** before `binary_fill_holes`.
Below that the ring interior stays unsealed; above it the fill grows by under 2% while the
outer silhouette starts to bloat.

**The open concavity** between the stand and the bar chart, around the ball-and-stick
handle, is not a hole at all — it connects to the exterior, so no hole fill can reach it and
closing barely dents it (radius 70 only took it from 49k to 44k transparent pixels, and cost
minutes of compute). It is instead covered by filling the **gold ring's disc**, fitted from
the artwork at **centre (624.5, 510.5), radius 316.5**. The fit is taken from the ring's
own extremes — the left edge and top of the emblem are ring, nothing else reaches them —
and verified against 8 angles.

That disc is **clipped at the emblem's bottom (y=786)**. The ring's lower arc is occluded by
the stand, so an unclipped disc would reach y=827 and paint 41px of black below the artwork.

Finally the whole mark gets a **14px black rim** around its exterior. Two problems it
solves: the arrow's tip extends ~89px past the ring, where it is white on bare tab colour
and vanishes on a light theme; and the gold ring dissolves into a tan or amber tab. The rim
is dilated from the opaque mask and intersected with currently-transparent pixels, so it
only ever grows into empty space — it cannot paint over the ring, the bars or the arrow.

Measured at 32px as the share of painted area clearing 1.6:1 contrast, across twelve tab
colours: light, mid and saturated grounds gain +1.5 to +4.4 points (gold +4.4, white +4.1).
Dark grounds *appear* to lose ~7 points, but that is a measurement artifact — a black rim on
dark chrome is invisible, so it adds low-contrast area without removing anything. The 316,882
pixels that were opaque before the rim are byte-identical after it: max RGB change 0, zero
alpha change.

The rim needs headroom, so the crop grew from 686px to **730px** (centred on 646, 490). At
686 the right margin was 1px and the rim would have been clipped.

Final alpha is the filled silhouette, unioned with the clipped ring disc, unioned with the
exterior rim.

Filling the interior also brings the arrow back. It is near-white, so on a transparent
icon over a light tab bar it vanishes into the background — but against the restored black
interior it reads normally at every size.

Two traps if you regenerate from source art:

- **Erode the brightness mask before measuring.** A single stray JPEG pixel one level above
  the threshold sits far enough from the emblem to inflate an enclosing radius from 381 to
  598 on its own.
- **Keep every connected component, not just the largest.** The outer gold ring is a
  separate component from the ball; taking only the largest silently drops it and shrinks
  the bbox from x 308–978 to x 364–978.

`ImageDraw.floodfill` is a no-op in Pillow 12.3 — it fills zero pixels even on a trivial
all-one-value image. Use `scipy.ndimage` (`label` / `binary_fill_holes`) for any
connectivity work here.

The absolute URLs in `index.html` (`canonical`, `og:url`, `og:image`) are hardcoded to
`https://lotteryassets.com/` — they must be absolute for link unfurling to work, so they need
editing if the domain ever changes.

## A caveat worth stating plainly

These nine assets are here because they went up. The ones that went to zero over the same
four years aren't on the board, and there were many more of them. Picking these winners in
advance and then timing eight turning points across them isn't a strategy — the Reality
Check tab exists to put a number on the difference between the headline and anything a
person could have actually done.
