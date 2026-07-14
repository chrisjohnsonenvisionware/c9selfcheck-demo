# Cloud9 RFID SelfCheck — Theme Configuration Model

**Author:** Fable (chief designer) · July 2026
**Status:** Design-final for both artifacts (real product source + static workbench).

Theme/attract selection is promoted from the dev-only `?theme=` URL param to a real Cloud9
setting. This doc defines where it lives, how it inherits, how the station resolves it, and
how the static workbench fakes the same story.

---

## 1. Where the setting lives

**Home: SelfCheck > Settings**, in a new collapsible section **"Attract Screen"**, slotted
alongside the existing sections (receipt content, per-alert-type image paths, sounds, RFID
options, history retention). It behaves like the existing "Image Path for Alert Type"
settings: configuration that points the UI at named visual assets.

Settings in the new section:

| Setting | Key | Type | Default |
|---|---|---|---|
| Attract screen theme | `attractTheme` | enum of theme ids (see `02-ATTRACT-THEMES.md`) | `horizon` |

(The attract's slide/panel content already exists on the station entity as
`idleScreenSlides` / menu widgets — it is **not** moved. This section governs the look;
content stays where it is.)

Note for engineering: the platform also has an Appearance settings group
(`/settings/appearance`, `themeName`) used for staff-web look. We deliberately do **not**
reuse it — the attract theme is a SelfCheck display behavior, scoped and overridden like
its SelfCheck siblings, and `resolveConfiguredTheme()` in `themeRegistry.js` already
accepts multiple keyed sources (`selfCheckDefaultTheme`, `defaultTheme`, `theme`,
`kioskDefaultTheme`) so the wiring is additive, not a migration.

---

## 2. Scope and inheritance — three levels, resolved last-wins

```
ROOT default            set by EnvisionWare professional services
  └─ Consortia / Library / Branch override     set by the library (inherit/override
     chevron, identical to every neighboring SelfCheck setting)
       └─ Station override (optional, NEW)     set per physical kiosk; wins when present
```

**Resolution order (station boot):** station override → effective library/branch value →
ROOT default → hardcoded `DEFAULT_THEME_ID` (`horizon`).

- Levels 1–2 are the existing mechanism for free: the station already calls
  `GET {treePath}/settings/selfcheck?settingsView=EFFECTIVE`
  (`src/services/settings.js → loadSelfCheckSettings`), and the backend resolves the
  ROOT > Consortia > Libraries > Branch tree server-side. Adding `attractTheme` to the
  selfcheck settings group inherits all of that, including the scope chevron in the
  SelfCheck Settings page.
- Level 3 (per-station) is a **genuine addition**: the backend Stations tab today only
  covers group membership, install tokens, and naming — no per-station display config.
  Design: an optional `attractTheme` value stored on the station node and returned in the
  station-scoped settings call; unset means "inherit". The Stations tab gains a single
  "Attract theme: Inherit (default) / <picker>" row. Do not invent a whole per-station
  settings tree — one override field, resolved last.

---

## 3. Real product source — implementation contract

1. `AppContext` boot sequence resolves theme as:
   `resolveConfiguredTheme(stationOverrideSource, selfCheckEffectiveSettings)` — the
   function already exists and takes ordered sources; register `attractTheme` in its
   `THEME_SETTING_KEYS` list (first position).
2. Legacy ids `ocean`/`oceanRealistic` normalize to `horizon` (alias map in
   `normalizeThemeId`), so stale configured values never blank the attract.
3. `?theme=` stays exactly what it is today: a **dev-only** override
   (`import.meta.env.DEV` gate in `loadLocalSettings`), applied after config resolution,
   never shipped as the selection mechanism.
4. Staff Tools' in-session theme panel keeps working as a transient local override
   (diagnostic), reverting to the configured theme on session end / reload.
5. Live update: when the WebSocket pushes a settings-changed event for the station's scope,
   re-run resolution and apply without restart (attract-only repaint).

---

## 4. Static workbench — how the mock fakes it

All state in `localStorage`, one namespace, readable by every surface:

```
c9sc.theme.root                     = 'horizon'          (pro services / backend console)
c9sc.theme.library.<libId>          = 'lavender' | null  (admin console; null = inherit)
c9sc.theme.station.<stationId>      = 'aurora'  | null   (either console; null = inherit)
```

- **Backend console** (pro services) edits the ROOT value and can drill to any node;
  every setting row shows the scope chevron (inherit ⌄ / overridden ●) exactly like the
  real SelfCheck Settings page.
- **Admin console** (library) shows the effective value with "Inherited from ROOT" badge,
  and lets the library override at library/branch and per-station.
- **Kiosk surface** resolves station → library → root on load (and on `storage` events, so
  a change made in another open tab restyles the attract live — that's the demo moment).
- Each surface displays the resolved chain ("horizon — overridden at Branch: Main Street")
  so the "pro services sets a default, library overrides, station wins" story is visible,
  not implied.

Demo seed: ROOT = `horizon`; one branch overridden to `lavender`; one station at that
branch overridden to `aurora`. Reset button on the landing page restores the seed.
