# Cloud9 RFID SelfCheck — Redesign & Workbench: Design Brief

**Author:** Fable (chief designer) · July 2026
**Read order:** this file → `01-KIOSK-DESIGN-DIRECTION.md` → `02-ATTRACT-THEMES.md` →
`03-CONFIG-MODEL.md` → `04-WORKBENCH-SPEC.md` → `../HANDOFF-OPUS.md` (builder brief).

## What this project is

Finishing touches on the Cloud9 RFID SelfCheck patron kiosk (not a rebuild), plus a
PatronIQ-style **workbench** — a static, hosted review artifact at
`celsus.envisionware.com/c9selfcheck` — so stakeholders can click the redesign before
engineering picks it up. Two artifacts per the product demo playbook
(`README-PRODUCT-DEMO-PLAYBOOK.md`): private real-source repo + public static `-demo` repo.

## Stakeholder feedback driving it (John)

- Keep the attract screen; the aquatic theme and the bubbles ("marbles") go.
- Buttons are too small — noticeably bigger.
- Hard requirements: WCAG 2.2, readable from a distance, very simple, configurable by both
  EnvisionWare professional services and the library inside Cloud9.

## The stack (confirmed — do not deviate)

**Engineering standard** (from the product-handoff project,
`Product Requirements/Department Handoff Samples/Engineering/ENG_Recommendation_Cloud9_SAMPLE.md`):
.NET Core 10+ / React / PostgreSQL going forward; unit tests plus integration tests across
the SIP2/ILS touchpoints (Staff Link and RFID Link surfaces); **axe-core in CI**.

**The station as it exists** (and stays): React 19 function components + hooks/context,
Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`), lucide-react icons, simplex-noise (attract
canvases), ESLint 9 flat config (react-hooks + react-refresh), pnpm workspace
(`pnpm --filter station`). It is a real module of the EwCloud engineering monorepo:
`station/pom.xml` (parent `com.envisionware.ewcloud.webapps:react-webapps`) runs the pnpm
build via `frontend-maven-plugin` and packages **StationWebApp WAR** — so the private repo
must preserve `pom.xml` and the workspace layout for a clean engineering handoff.
Testing gap to fill during the build: **Vitest + React Testing Library** (Vite-native, fits
the standard's unit-test requirement) and axe-core (`vitest-axe` locally, axe CI gate).

**Run it:** `pnpm install` then `pnpm --filter station dev`; standalone:
`pnpm --filter station dev:standalone`. URL params: `?standalone=`, `?location=`,
`?cloudNineUrl=`, dev-only `?theme=`. Needs Node + pnpm on PATH (Node is a zip install —
see playbook §1).

## The four design deliverables (all design-final in this folder)

| Doc | Contents |
|---|---|
| `01-KIOSK-DESIGN-DIRECTION.md` | Attract hierarchy inversion, the kiosk touch scale (global sizing tokens + every undersized target with file:line), WCAG 2.2 work list incl. the OnScreenKeyboard DPR bug, flow confirmation (3-tap happy path) |
| `02-ATTRACT-THEMES.md` | Aquatic removal inventory; the 9-theme selectable set with new flagship `horizon` (Cloud9 sky/clouds); kids rework (confetti, no bubbles); `LoadingTransition`; picker UI contract; per-theme QA |
| `03-CONFIG-MODEL.md` | `attractTheme` as a real SelfCheck > Settings setting; ROOT → library/branch → station resolution (station level is the one genuine backend addition); real-source contract; localStorage fake for the mock |
| `04-WORKBENCH-SPEC.md` | The four hosted surfaces (landing / kiosk / admin / backend), shared `theme-engine.js`, sample data, the scripted inheritance demo narrative, playbook build rules |

## Decisions already made (do not reopen in build)

1. Themes stay attract-only; sub-pages keep the shared theme-agnostic palette (PRD
   addendum #2 — reaffirmed).
2. Factory default theme: `horizon`. Legacy `ocean`/`oceanRealistic` alias to it.
3. Theme setting lives in SelfCheck > Settings (not platform Appearance), key
   `attractTheme`; `?theme=` remains dev-only.
4. Flow is unchanged — the redesign is presentation, sizing, and accessibility.
5. No video assets remain in the station (payload + the rejected look).
