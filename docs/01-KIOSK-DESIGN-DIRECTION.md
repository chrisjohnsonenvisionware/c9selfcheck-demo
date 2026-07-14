# Cloud9 RFID SelfCheck — Kiosk Design Direction

**Author:** Fable (chief designer) · July 2026
**Status:** Design-final. Applies to both artifacts (real station source + workbench kiosk surface).
**Baseline:** the existing station code (`source/station/`). This is finishing work, not a rebuild — the flow, screen inventory, and services stay; the changes below are exactly what stakeholder feedback and WCAG 2.2 require.

---

## 1. Design principles (the four, in priority order)

1. **Readable from a distance.** A patron walking toward the kiosk should know what it is
   and what to do before arriving. Rule of thumb: text legible at distance D meters needs
   ~7 mm cap height per meter → at 3 m on a 27" 1080p portrait kiosk that is ≥ 56 px text.
   Everything on the attract screen is sized to this; everything after first touch is sized
   for arm's length (≥ 18 px body, ≥ 20 px on actionable text).
2. **One decision per screen.** The flow already achieves this (scan card → scan items →
   receipt → done); the redesign must not add steps. Copy: plain language, sentence case,
   ≤ 5 words on any button.
3. **Big targets.** Kiosk touch scale (§4): no interactive target under 48×48 CSS px
   anywhere; primary actions ≥ 72 px tall; main-menu tiles ≥ 200 px.
4. **WCAG 2.2 AA is a floor, not a feature.** §5 is the compliance work list; axe-core in
   CI per the engineering standard, plus the manual items axe can't see.

Themes remain **attract-only** (PRD addendum #2). Sub-pages keep the shared theme-agnostic
palette. This is correct and is retained.

---

## 2. What stakeholder feedback (John) maps to

| Feedback | Design response |
|---|---|
| Aquatic theme must go; bubbles look like marbles | Remove ocean/oceanRealistic/bubble machinery entirely; new flagship `horizon` theme. Full spec: `02-ATTRACT-THEMES.md` |
| Buttons too small | Kiosk touch scale (§4): main-menu tiles +45%, global 48 px floor, type scale up one-to-two steps across every flow screen |
| Keep the attract screen | Structure kept (logo, library name, clock, carousel, begin CTA) — hierarchy inverted so the begin CTA dominates (§3) |

---

## 3. Attract screen (`AttractScreen.jsx`) — keep the bones, invert the hierarchy

Today the promo carousel is the biggest element and "Touch anywhere to begin" is a
translucent glass pill (`bg: accent55→33`, `text-xl`) — the least readable thing on the
screen. Invert it:

- **Begin CTA becomes the dominant element.**
  - Solid fill (theme `subPageAccent`-family solid, not translucent), white text at
    ≥ 4.5:1 against the fill, fill ≥ 3:1 against the backdrop.
  - `min-height: 112px`, full-width up to 720 px, `text-5xl` (≈48 px) when carousel content
    exists; `text-6xl` and taller when the carousel is empty (keep the existing
    grow-on-empty behavior).
  - Keep `animate-pulse-gentle` but pulse **scale only, never opacity** (opacity pulsing
    drops it below contrast minimums half the time). Suppressed under reduced motion.
  - Label stays `t('beginPrompt')` ("Touch anywhere to begin").
- **Library name:** `text-6xl`–`text-7xl` (from 4xl/5xl). Date/time `text-2xl`.
- **Carousel:** demoted below the CTA visually (CTA above the fold-center, carousel under
  it). Slide title `text-4xl`, body `text-2xl`. Keep: 10 s minimum per slide
  (`MIN_DISPLAY_SECONDS`), 8-slide cap, pause/play control (grow it to 48×48), auto-pause
  on reduced-motion/high-contrast. Slide indicators grow to 14 px dots / 44 px active bar.
- **Remove the floating decorative icons** (`BookOpen/Sparkles/Library` at 3–5% opacity,
  `AttractScreen.jsx:334-344`) — invisible from distance, noise up close, one more thing to
  contrast-QA per theme. The `THEME_COLORS` scrim entry and `oceanRealistic` fallback go
  with the ocean themes.
- Grid-pattern overlay: keep (3% opacity, harmless texture).

## 4. The kiosk touch scale (global sizing system)

Add as design tokens (CSS vars + Tailwind theme extension) so sizes are systemic, not
per-file magic numbers:

| Token | Value | Used by |
|---|---|---|
| `--touch-min` | 48 px | every interactive target (hard floor, both axes) |
| `--touch-standard` | 56 px | list buttons, inputs, nav rows |
| `--touch-primary` | 72 px | Finish, Login, Send/skip receipt, Done, Place hold |
| `--touch-tile` | 200 px (portrait) / scaled by `useLandscapeScale` | main-menu primary tiles |
| Body text | 18 px min | all flow copy |
| Actionable text | 20 px min (`text-xl`) | any button/tab/toggle label |

Concrete fixes (from the code inventory; file:line refs are the current baseline):

- **Main menu (`HomeScreen.jsx`)** — the headline change:
  - Grid container `max-w-xl` → `max-w-3xl`; gap 5 → 6.
  - Primary tiles `min-h-[140px]/[160px]` → **`min-h-[200px]/[220px]`**, label
    `text-xl/2xl` → **`text-3xl`**, icon 40 → **56**, keep 2×2 grid (4 primary actions max).
  - Secondary tiles `min-h-[90px]` → **`min-h-[120px]`**, label `text-xs/sm` →
    **`text-lg`**, icon 24 → 32, icon chip 48 → 56.
  - Welcome heading `text-3xl/4xl` → `text-5xl`; subtitle `text-lg` → `text-2xl`.
  - Landscape (`useLandscapeScale`) variants scale proportionally (tiles min ~140 px).
- **BottomNav** (`BottomNav.jsx:245`): items `min-h-[48px]` → 64 px, labels `text-xs`
  (12 px!) → **`text-base`**, icons 24 → 28. Help-modal buttons get explicit `text-xl`.
- **Receipt step** (`CheckOutScreen.jsx:1046,1054` + checkin twins): Skip/Send `text-sm` →
  `text-xl`, `min-h-[48px]` → 72 px. Method-row sub-text 12–14 px → 16 px minimum.
- **Success step** (`CheckOutScreen.jsx:1145` + twin): Done → 72 px / `text-xl`.
- **Modal close X buttons** (`AccountScreen.jsx:869`, `ScannedItemDetailModal.jsx:61`,
  `AccountSummaryModal.jsx:137`): 40 px → **48 px**.
- **Account screen**: tabs/renew/cancel-hold/get-summary `text-sm` → `text-lg`+,
  `min-h` 44–48 → 56.
- **Search screen**: alpha keys `w-10` (40 px) → `w-12` min; utility keys `text-sm` →
  `text-lg`; FilterGroup `min-h-[32px] text-xs` → 48 px / `text-lg`. Room-slot buttons
  (`PlaceholderScreens.jsx:121`) 40 px → 56 px.
- **OnScreenKeyboard bug (`OnScreenKeyboard.jsx:47-48`):** key sizes are divided by
  `devicePixelRatio`, so on a 2× kiosk display keys render ~33×36 CSS px. **Remove the DPR
  division** — size in CSS px: alpha keys ≥ 56×64, PIN pad ≥ 80×80. This is a bug fix, not
  a style choice.
- Spacing: ≥ 8 px between adjacent targets everywhere (2.5.8 spacing exception must never
  be needed — we meet the size outright).

## 5. WCAG 2.2 AA work list (gaps found in code, each must close)

Already strong (keep, don't regress): AccessibilityPanel with staged Apply (high contrast /
large text / reduced motion), full HC palette override, `data-largetext` scaling,
reduced-motion double-gating (media query + toggle), 16-language support with RTL,
role/aria on dialogs and status regions, idle warning with countdown + "I'm still here",
ghost-tap guard, min 10 s slides with pause (2.2.2).

To close:

1. **Focus management (2.4.3/2.4.7):** add a focus trap to every modal/panel
   (BlockingAlert, ErrorSummary, AccountSummary, holds, cancel-hold, help, Accessibility,
   Language, StaffLogin) — focus moves in on open, cycles within, restores to the invoker
   on close. One shared `useFocusTrap` hook.
2. **Keyboard/SR operability (2.1.1, 4.1.2):** clickable `<div>` list rows
   (`CheckOutScreen.jsx:688`, `CheckInScreen.jsx:455`, `AccountScreen.jsx:565,662`) become
   `<button>`s with accessible names summarizing the row ("Dune, checked out, due July 28").
3. **Status colors under high contrast (1.4.3):** replace hardcoded Tailwind `-50/-600`
   status pills and banners in flow screens with tokenized status colors that have HC
   variants (white-on-black + border, matching BottomNav's existing HC treatment).
4. **Consistent help (3.2.6):** Help stays in the same BottomNav slot on every screen.
   When `enableHelpRequest` is false, the button shows static help content (library-set
   text from settings) instead of disappearing. Help modal gains configurable contact line.
5. **Surface the hidden accessibility features:** add Screen Reader toggle (state and
   native call exist — no UI) and Text Size (the `textScale` 1/1.25/1.5 state exists — no
   UI) as rows in AccessibilityPanel. Large Text vs Text Size: merge into one three-step
   "Text size" control to avoid two overlapping mechanisms (Large Text = step 3).
6. **Reduced-motion gating for all canvas work:** the loading transition (new
   `LoadingTransition`, replacing `BubbleTransition` which ignores reduced motion) and
   every attract theme freeze under reduced motion.
7. **Accessible authentication (3.3.8):** add "show PIN" toggle to the masked PIN input.
   Card scan / RFID already provide the no-transcription path.
8. **Focus appearance (2.4.13 target, AA-adjacent):** keep the 3 px outline; ensure 3:1
   against adjacent colors in all themes + HC.
9. **Check-in accent unification:** `CheckInScreen.jsx` hardcodes a sky-blue accent set
   (`#0ea5e9/#0284c7/#38bdf8` at :93-113, :513, :670-821) that bypasses the shared
   sub-page system and reads aquatic. Replace with the shared
   `SUB_PAGE_BUTTON_HIGHLIGHT` teal. If flow differentiation is wanted later it becomes a
   proper token, not hex literals.
10. **Verification:** axe-core in CI (engineering standard) + manual pass per release:
    keyboard-only walk of both flows, 200% zoom, HC + large text + reduced motion
    combined, one NVDA session.

## 6. Flow (unchanged, with two confirmations)

The current flow is already minimal and correct — RFID card = 0-tap auth, item scan is
passive, Finish → receipt → auto-return. Two confirmations, not changes:

- Keep the `AppContext` behavior where an authenticated patron entering checkout skips
  scan-card, and live check-in auto-advances past its intro (0 taps to start scanning).
- Keep receipt as one screen with three toggles + Skip; with the new 72 px buttons it is
  the simplest compliant form of that decision.

Happy path tap count (checkout, RFID card, no PIN, print receipt): **3 taps** — Check out
→ Finish → Print. That is the number to protect in review.
