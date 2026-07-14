# Cloud9 RFID SelfCheck — Attract Theme Set (Design Spec)

**Author:** Fable (chief designer) · July 2026
**Status:** Design-final. Builder: implement exactly as specified; flag conflicts rather than improvising.

This spec replaces the aquatic attract look and defines the selectable theme set that ships
as a configurable Cloud9 setting (see `03-CONFIG-MODEL.md`). It is grounded in the existing
station code: themes stay **Attract-only** (PRD addendum #2 — sub-pages keep the shared
theme-agnostic palette in `src/index.css`), and every theme keeps the existing registry
shape in `src/themes/themeRegistry.js` (`motion`/`static`, `attractBackground`, `swatches`,
`attractMainMenuBg`, `subPageAccent`).

---

## 1. What is removed (John's feedback: aquatic + "marble" bubbles go)

| Item | Where | Action |
|---|---|---|
| `ocean` theme (animated waves + bubbles) | `src/themes/ocean.js`, registry entry | **Delete** |
| `oceanRealistic` theme (ocean video + bubble overlay) | registry entry, `VideoCrossfade` + `BubbleOverlay` in `src/components/shared/AnimatedBackground.jsx` | **Delete** (the white highlight-dot bubbles in `BubbleOverlay` are exactly the "marbles") |
| Ocean video assets | `public/oceanBackground*.webm/.mp4`, `public/klingWaterBackground*.webm`, `src/assets/*WaterBG*.webm`, `src/assets/klingWaterBackground.webm` | **Delete** (multi-MB payload win; no video themes remain, so `VIDEO_THEME_IDS` machinery can go too) |
| `BubbleTransition` loading screen | `src/components/shared/BubbleTransition.jsx`, used by `AccountScreen.jsx:381` | **Delete**; replace with `LoadingTransition` (below) |
| Bubbles in `kids` theme | `src/themes/kids.js` | **Rework** — same palette, bubbles become confetti shapes (below) |
| "bubbles/foam" copy in registry descriptions | `themeRegistry.js` | Reword |

**Legacy migration:** stations already configured with `ocean` or `oceanRealistic` must not
break. Add an alias map inside `normalizeThemeId()`:
`{ ocean: 'horizon', oceanRealistic: 'horizon' }` → normalize returns the alias target.
`DEFAULT_THEME_ID` changes from `'lavender'` to `'horizon'`.

---

## 2. The theme set (9 selectable attracts)

Design intent: a small, clean, distance-legible set. One flagship motion theme that is
**on-brand for Cloud9 — a calm sky with drifting clouds** — plus the surviving non-aquatic
motion themes, a reworked kids option, and the five static palettes. Every theme must keep
the attract's primary text at ≥ 7:1 contrast against its background region, and the
"Touch anywhere to begin" CTA at ≥ 4.5:1 (it sits on a solid fill — see kiosk spec
`01-KIOSK-DESIGN-DIRECTION.md` §3).

### 2.1 `horizon` — **NEW. Flagship + factory default**

- **Concept:** "Cloud9." A serene daytime sky: soft cumulus clouds drifting slowly across a
  vertical gradient (azure at top → pale warm white at the horizon line ~85% height).
  Light background, dark text — reads like a bright poster from across a room.
- **Type:** `motion` / `canvas` (class file `src/themes/horizon.js`, same contract as
  `aurora.js`: `resize/update/draw/destroy`, optional pointer hooks; use the existing
  `simplex-noise` dependency).
- **Rendering spec:**
  - Sky gradient: `#7ec3ec` (top) → `#c7e5f7` (55%) → `#f2f9fe` (horizon).
  - 6–9 cloud clusters; each cluster = 5–8 overlapping ellipses whose radii/offsets are
    modulated by 2D simplex noise so edges look soft, filled `rgba(255,255,255,0.55–0.9)`
    with a faint `#dce9f4` under-shadow. Two depth layers: far layer smaller/slower
    (~4 px/s), near layer larger/faster (~9 px/s), wrapping at edges.
  - Optional sun glow: radial highlight `rgba(255,250,235,0.5)` upper-right, static.
  - **No rain, no birds, no motion gimmicks.** Calm is the product statement.
- **Interaction:** pointer drag imparts a gentle local drift to the near cloud layer
  (breeze), decaying over ~2 s. No ripples, no bursts.
- **Reduced motion / high contrast:** clouds freeze in place (existing
  `AnimatedBackground` already gates `theme.update(dt)` on reduced-motion; high contrast
  already suppresses motion themes entirely).
- **Registry entry:**
  `swatches: ['#2b6cb0', '#7ec3ec', '#f59e0b']`, `attractMainMenuBg: '#e6f2fb'`,
  `subPageAccent: '#2b6cb0'`, description `'Calm daytime sky with drifting clouds'`.
- **Attract text colors** (in `AttractScreen.jsx` `THEME_COLORS`): light background →
  `textPrimary: '#123a5c'` (deep slate blue, ~10:1 on the gradient), secondary
  `rgba(18,58,92,0.65)`, slide text stays white on the slide-card gradients,
  indicators `#123a5c`.

### 2.2 `aurora` — keep (canvas)

The dark motion option: flowing noise ribbons + twinkling starfield. Non-aquatic; already
distance-legible (white text on near-black). No changes beyond QA.

### 2.3 `ink` — keep (canvas)

Flowing indigo ink on warm parchment — the "literary" option. Keep.

### 2.4 `kids` — rework (canvas): bubbles → confetti

Same warm amber palette and playful energy, new motif: rounded confetti shapes — stars,
triangles, squares, squiggles in the theme's existing accent colors (`#fbbf24`, `#ef4444`,
`#22c55e`, plus `#ec4899`) — gently bobbing/rotating as they fall and respawn.
Tap interaction: a small confetti burst at the touch point (replaces bubble pop).
Description: `'Playful confetti shapes and color'`. **No circles with highlight dots** —
that is the marble look that was rejected.

### 2.5–2.9 Static palettes — keep as-is

`lavender`, `default` (label **Teal**), `warm`, `blue`, `dark2` (relabel **Graphite**).
These already meet the PRD's complementary main-menu-tint rule and cost nothing. `lavender`
loses factory-default status to `horizon` but remains selectable.

### Resulting registry order (order = display order in every picker)

`horizon` (default) · `lavender` · `default` · `warm` · `blue` · `dark2` · `aurora` · `ink` · `kids`

---

## 3. `LoadingTransition` (replaces `BubbleTransition`)

Theme-agnostic, used anywhere a blocking load occurs (currently `AccountScreen.jsx:381`):
centered indeterminate ring spinner (3px stroke, `--theme-button-highlight` color) above the
message text (`text-2xl`, `--theme-text-primary`) on `--theme-surface`. Honors reduced
motion (spinner becomes a static "Loading…" with animated ellipsis suppressed). Announce via
`role="status"` + `aria-live="polite"`.

---

## 4. Theme picker UI contract (used by Staff Tools, admin + backend consoles)

Wherever a theme is picked, render each option as a **live thumbnail card**: 16:10 mini
preview (static snapshot of the attract composition — gradient + swatch motifs, not a live
canvas), theme label at ≥ 16px, and the three `swatches` dots. Selected card gets a 3px
`--theme-button-highlight` ring + checkmark. Cards are ≥ 96px tall touch targets. Include a
**"Preview on kiosk"** affordance in the workbench (admin/backend consoles deep-link the
kiosk surface with the candidate theme applied).

---

## 5. QA checklist per theme (builder runs before ship)

- [ ] Attract `textPrimary` ≥ 7:1 against its actual background region (measure over the
      busiest animation frame, not the average).
- [ ] Begin-prompt CTA ≥ 4.5:1 text-on-fill and fill ≥ 3:1 against the surrounding backdrop.
- [ ] `attractMainMenuBg` gives black text ≥ 4.5:1 (PRD addendum #2 rule, existing).
- [ ] 60 fps on kiosk-class hardware; canvas work capped at DPR 2 (existing pattern).
- [ ] Reduced-motion freezes all movement; high-contrast suppresses the theme entirely.
- [ ] No bubbles, no water, no marble-look circles anywhere.
