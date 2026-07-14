# Cloud9 RFID SelfCheck — Workbench Spec (the hosted review artifact)

**Author:** Fable (chief designer) · July 2026
**Pattern:** PatronIQ Model Workbench (see `README-PRODUCT-DEMO-PLAYBOOK.md` §12).
**Deploy target:** `celsus.envisionware.com/c9selfcheck` (folder `apps/c9selfcheck/`,
lowercase-kebab) + GitHub Pages `chrisjohnsonenvisionware.github.io/c9selfcheck-demo/`.

Fully static, client-only, no build step, no CDNs, state in `localStorage`. It fakes the
Cloud9 backend the real station talks to. Same bundle serves both hosts.

---

## 1. Bundle structure

```
c9selfcheck-demo/
  index.html                 landing hub
  kiosk/index.html           the star — redesigned patron experience
  admin/index.html           library-facing console
  backend/index.html         pro-services console (SelfCheck Settings imitation)
  workbench-data/
    c9selfcheck-data.js      window.C9DATA = {...}  — ALL sample data, one file
    notes-sync.js            pooled Copy-for-Claude notes (shared across surfaces)
    theme-engine.js          shared theme registry + resolution + attract renderers
  docs/                      the four design docs from this folder, plus index
  robots.txt                 User-agent: * / Disallow: /
```

`theme-engine.js` is the one deliberate shared module: the theme registry (ids, swatches,
colors), the three-level `localStorage` resolution (`03-CONFIG-MODEL.md` §4), and the
canvas attract renderers (horizon/aurora/ink/kids) as plain classes — so the kiosk renders
themes and both consoles render identical thumbnail previews from a single source of truth.

Sample data in `c9selfcheck-data.js`: one org tree (EnvisionWare ROOT → "Pioneer Library
System" → 2 branches → 3 stations), ~14 catalog items with title/author/format/cover
gradient (no external images), 2 patron accounts (one clean, one with a fine + a hold ready
for pickup), the SelfCheck Settings catalog for the backend console (§5), and the demo seed
overrides.

---

## 2. Landing page (`index.html`)

Same skeleton as the PatronIQ hub:

- **Header:** "Cloud9 RFID SelfCheck — Model Workbench", "powered by EnvisionWare"
  framing, one-paragraph purpose statement ("a review artifact, not the product").
- **Four surface cards** (kiosk first and visually dominant — it's the star): title, one-line
  description, "who this view is for" chip (Patron / Library staff / EnvisionWare PS),
  and a thumbnail strip. Kiosk card links with `?station=st-101` so it opens as a concrete
  station.
- **The config story strip:** a three-node diagram (ROOT default → Library override →
  Station override) with the *live* resolved values read from `localStorage`, and a
  "Reset demo data" button restoring the seed. This makes the inheritance story the first
  thing a reviewer sees.
- **Copy-for-Claude notes:** the PatronIQ mechanism — floating notes button on every
  surface (via `notes-sync.js`), notes pooled in `localStorage` under one key with
  surface+context stamped, and a "Copy all notes for Claude" button on the landing page
  that copies a structured markdown block for pasting back into chat. Best-effort POST to
  `/api/c9selfcheck/notes` if the Celsus sink exists; silent no-op on Pages.
- **`docs/` pointer** linking the bundled design docs.

## 3. Kiosk surface (`kiosk/index.html`) — the star

A faithful, static re-implementation of the **redesigned** patron experience per
`01-KIOSK-DESIGN-DIRECTION.md` — visually honest to the real station (same layout bones:
TopBar, main menu tiles, bottom action bar, accessibility panel), not a generic demo skin.

- **Attract:** resolved theme renders via `theme-engine.js`; library name, date/time, promo
  carousel (≥10 s per slide, pause control), giant begin CTA. Touch anywhere starts.
- **Main menu:** the enlarged tile grid (Check Out / Return / My Account / Search primary;
  secondary row per widget config in sample data).
- **Check-out flow (fully interactive):** card-scan step (tap a demo patron card, or type
  barcode on the on-screen keyboard) → "place items on the pad" step with a **"Simulate
  placing an item" tray** (tap covers to add; this stands in for RFID) → item list grows
  with success ticks / one blocking-alert item (hold-for-another-patron) to show the alert
  pattern → Finish → receipt choice (print / email / none) → thank-you → back to attract.
- **Check-in flow:** same pattern minus auth.
- **My Account:** loans, holds (one ready), fines on the demo patron.
- **Chrome affordances (workbench-only, kept off the patron canvas):** a slim demo bar
  pinned outside the 16:10 kiosk frame with: station picker (the 3 sample stations —
  switching stations demonstrates per-station theme override), theme-resolution readout
  ("aurora — station override"), reset, and orientation toggle (portrait/landscape).
- Accessibility: this surface is itself built to WCAG 2.2 AA (it *demonstrates* the
  compliance story — reviewers will tab through it).

## 4. Admin console (`admin/index.html`) — the library's view

Library-staff framing (clean, friendly, less dense than the backend console):

- **Scope picker:** Library → Branch → Station breadcrumb.
- **Attract Screen card:** current effective theme with big thumbnail, "Inherited from
  EnvisionWare default" / "Overridden here" badge, `Change theme` opens the thumbnail-card
  picker (§4 of `02-ATTRACT-THEMES.md`), plus `Revert to inherited`.
- **Stations list:** each station row shows name, its resolved theme + source badge, and an
  optional per-station override control — the "a station can override again" beat.
- **Preview:** "Open kiosk with this theme" deep-links `kiosk/index.html?station=…`.
- A read-only glimpse of neighboring library-side settings (receipt header text, sounds
  on/off) to seat the theme control among familiar company — non-functional rows are
  visibly labeled "display only".

## 5. Backend console (`backend/index.html`) — pro services / the settings model

Imitates the **real Cloud9 SelfCheck Settings page** so the demo reads as the product:

- **Left tree:** ROOT > Consortia > Libraries > Branch (sample org), selectable scope.
- **"Find a Setting" search** box filtering setting rows live.
- **Collapsible sections** in the real page's style, seeded from the settings catalog in
  the data file: Receipt Content, Image Path for Alert Type, Sounds, RFID Options,
  History Retention — each with 3–6 plausible read-only rows — and the new **Attract
  Screen** section (fully functional) slotted alphabetically among them, not bolted on top.
- **Scope chevron on every setting row:** shows inherit ⌄ vs overridden ● at the selected
  scope; clicking the chevron on `attractTheme` offers "Override at this level" /
  "Revert to inherited", writing the `localStorage` keys from `03-CONFIG-MODEL.md` §4.
- **Stations tab:** group membership, install token, naming (read-only, as today) **plus**
  the new single "Attract theme" override row per station — visibly the one genuine
  addition, annotated with a small "NEW" tag.

## 6. Interaction between surfaces (the demo narrative)

Scripted walkthrough the landing page prints as "Try this":
1. Open **backend**, set ROOT default to `horizon` — open **kiosk** (station st-101): horizon.
2. Open **admin** as Pioneer / Main Street, override to `lavender` — kiosk (same station): lavender.
3. In admin's station list, override station st-103 to `aurora` — kiosk switched to st-103:
   aurora, while st-101 stays lavender.
4. Revert the branch override — st-101 falls back to horizon; st-103 keeps aurora.

Surfaces react live via the `storage` event when open in parallel tabs.

## 7. Build rules (playbook, restated as hard constraints)

- No CDNs/fonts/scripts; inline everything; images as gradients/data URIs.
- Syntax-check every HTML script block with the playbook `vm.Script` snippet + `node --check`
  on the `.js` files before every deploy.
- Marker string per deploy for two-method verification (node-fetch for Pages,
  `curl -sk` for Celsus).
- Nothing sensitive in the bundle — the Pages repo is world-readable.
