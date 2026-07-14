# Builder Handoff — Opus 4.8

**From:** Fable (chief designer) · July 2026
**You are building:** the Cloud9 RFID SelfCheck redesign + workbench, exactly per the
design docs in `docs/`. Design decisions are final (`docs/00-DESIGN-BRIEF.md` lists the
closed ones). If you hit a genuine conflict between a design doc and reality, stop and
flag it in your report rather than improvising a different design.

## Read first, in order

1. `README-PRODUCT-DEMO-PLAYBOOK.md` (EnvisionWare root) — the whole thing. Environment
   quirks, GitHub publishing without `gh`, Pages, Celsus `apps/<product>/` push-to-deploy,
   lowercase-kebab rule, two-method verification, security rules.
2. `docs/00` → `01` → `02` → `03` → `04` in this folder.
3. The baseline source: `source/station/` (unzipped from `Downloads/SelfCheckCode.zip`).

## Scope — what you build

### A. The static workbench (public artifact — the deliverable stakeholders click)

Per `docs/04-WORKBENCH-SPEC.md`: landing + kiosk + admin + backend surfaces, client-only,
no build step, no CDNs, `localStorage` state, `theme-engine.js` shared module,
`workbench-data/c9selfcheck-data.js` single data file, pooled Copy-for-Claude notes,
bundled `docs/`, `robots.txt`. The kiosk surface implements the redesigned experience from
`docs/01` + `docs/02`; the consoles implement the config story from `docs/03` §4.
Syntax-check every script block (playbook §2) before any deploy.

### B. The real station finishing touches (private artifact — engineering handoff)

Work on a copy of `source/` as the repo root (keep the pnpm-workspace + `station/` +
`pom.xml` structure; do not touch the Maven wiring beyond what file deletions require):

1. Aquatic removal + new themes per `docs/02` (horizon canvas theme, kids rework,
   LoadingTransition, registry updates, alias map, delete video assets and
   BubbleOverlay/VideoCrossfade/BubbleTransition, DEFAULT_THEME_ID = horizon).
2. Kiosk touch scale + every sizing fix per `docs/01` §4 (including the
   OnScreenKeyboard DPR bug fix).
3. WCAG 2.2 work list per `docs/01` §5 (focus trap hook, div→button rows, HC status
   tokens, consistent help, surfaced screen-reader/text-size controls, show-PIN,
   check-in accent unification).
4. Promote the theme setting per `docs/03` §3 (`attractTheme` key registration, station
   override in the resolution chain, keep `?theme=` dev-only).
5. Add Vitest + React Testing Library; tests for: theme resolution order (station >
   branch > root > default, legacy aliases), `normalizeThemeId`, focus-trap hook,
   keyboard operability of the converted rows, and a jsdom axe pass (`vitest-axe`) on
   Home/CheckOut/Receipt. `pnpm lint` clean.
6. Update/author `README.md` for engineering (run, build, test, the theme setting
   contract, what changed and why — link the design docs, which you copy into the repo's
   `docs/`).

### C. Repos + deploy (playbook, exactly)

- **New private repo** `c9selfcheck` — the station source tree (B) + docs + the workbench
  bundle. New repo, do not reuse an existing one.
- **New public repo** `c9selfcheck-demo` — the workbench bundle only, Pages enabled
  (main/root), noindex robots.txt.
- **Celsus:** bundle → `Celsus/apps/c9selfcheck/` (lowercase-kebab), push main, runner
  deploys. URL: `https://celsus.envisionware.com/c9selfcheck`.
- **Verify both hosts** with a fresh marker string per the playbook §7 (node-fetch for
  Pages, `curl -sk` for Celsus; poll — both can lag 1–2 min). Also `healthz` = 200.
- Security: token in memory only; no secrets in either repo; nothing sensitive in the
  public bundle.

## Definition of done

- [ ] Both repos exist and are pushed (private: source + docs + bundle; public: bundle).
- [ ] `https://celsus.envisionware.com/c9selfcheck` and the Pages URL both serve the new
      bundle, verified via marker string by both methods.
- [ ] Workbench: all four surfaces work offline/self-contained; the §6 demo narrative in
      `docs/04` plays end-to-end (root → branch override → station override → revert);
      themes render identically on kiosk surface and console thumbnails; notes pool and
      copy; every HTML/JS file passes the vm syntax check.
- [ ] Station: `pnpm --filter station dev` runs; attract shows horizon by default; no
      bubble/ocean/video code or assets remain (`grep -ri "bubble\|ocean" src/` clean,
      excluding CHANGELOG/docs); all `docs/01` §4 sizes verified in the running app;
      Vitest suite green; `pnpm lint` clean; `pnpm --filter station build` succeeds.
- [ ] A short build report back to Chris: URLs (both hosts + both repos), what shipped,
      any flagged conflicts, and suggested next review step for John.

## Known environment traps (don't rediscover)

Node zip-install PATH export every shell · `NODE_EXTRA_CA_CERTS` corp CA · no `gh` CLI —
token via `git credential fill`, repos via REST from Node · slow proxy pushes — background
them · case-insensitive box FS — lowercase folder names · Pages/Celsus cache — marker
strings, not 200s · venvs/node_modules outside OneDrive when possible (`source/` currently
sits in OneDrive; run `pnpm install` with the store outside OneDrive or expect slowness).
