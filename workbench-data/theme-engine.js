/*
 * Cloud9 SelfCheck Workbench — shared theme engine.
 * ONE source of truth for: the attract theme registry, three-level scope
 * resolution (ROOT > library/branch > station), and the attract-screen
 * renderers used by both the kiosk surface and the console thumbnail previews.
 *
 * No build step, no external deps. Exposed as window.C9Theme.
 * Design ref: docs/02-ATTRACT-THEMES.md, docs/03-CONFIG-MODEL.md.
 * MARKER: C9SC_THEME_ENGINE_V1
 */
(function () {
  'use strict';

  var DEFAULT_THEME_ID = 'horizon';

  // Legacy ids alias to the flagship so stale configured values never blank out.
  var LEGACY_ALIASES = { ocean: 'horizon', oceanRealistic: 'horizon' };

  // Display order == picker order (docs/02 §2 final order).
  var THEMES = [
    {
      id: 'horizon', label: 'Horizon', motion: true,
      description: 'Calm daytime sky with drifting clouds',
      swatches: ['#2b6cb0', '#7ec3ec', '#f59e0b'],
      attractMainMenuBg: '#e6f2fb', subPageAccent: '#2b6cb0',
      attract: { kind: 'horizon', textPrimary: '#123a5c', textSecondary: 'rgba(18,58,92,0.66)',
        stops: ['#7ec3ec', '#c7e5f7', '#f2f9fe'] },
    },
    {
      id: 'lavender', label: 'Lavender', motion: false,
      description: 'Soft lavender with frosted glass',
      swatches: ['#5364ae', '#dcddea', '#ef3954'],
      attractMainMenuBg: '#ecedf4', subPageAccent: '#5364ae',
      attract: { kind: 'gradient', textPrimary: '#3a4580', textSecondary: 'rgba(58,69,128,0.66)',
        stops: ['#dcddea', '#ccd0e2', '#abb4d5'], glow: '#5364ae' },
    },
    {
      id: 'teal', label: 'Teal', motion: false,
      description: 'Modern teal and deep navy',
      swatches: ['#0d9488', '#134e4a', '#fb923c'],
      attractMainMenuBg: '#dff5f1', subPageAccent: '#0d9488',
      attract: { kind: 'gradient', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.72)',
        stops: ['#0c2d3f', '#0a1f2e', '#061520'], glow: '#0d9488' },
    },
    {
      id: 'warm', label: 'Warm', motion: false,
      description: 'Earth tones and soft copper',
      swatches: ['#a0643a', '#3d231a', '#e87e5a'],
      attractMainMenuBg: '#faf0e3', subPageAccent: '#a0643a',
      attract: { kind: 'gradient', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.72)',
        stops: ['#3d231a', '#2c1810', '#1a0f0a'], glow: '#e87e5a' },
    },
    {
      id: 'blue', label: 'Blue', motion: false,
      description: 'Calm static blue gradient',
      swatches: ['#1e3a8a', '#1d4ed8', '#60a5fa'],
      attractMainMenuBg: '#dbe7f5', subPageAccent: '#1d4ed8',
      attract: { kind: 'gradient', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.72)',
        stops: ['#1e40af', '#1e3a8a', '#172554'], glow: '#60a5fa' },
    },
    {
      id: 'graphite', label: 'Graphite', motion: false,
      description: 'Deep graphite static theme',
      swatches: ['#18181b', '#3f3f46', '#a1a1aa'],
      attractMainMenuBg: '#d9d9dc', subPageAccent: '#52525b',
      attract: { kind: 'gradient', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.72)',
        stops: ['#27272a', '#18181b', '#0a0a0a'], glow: '#a1a1aa' },
    },
    {
      id: 'aurora', label: 'Aurora', motion: true,
      description: 'Flowing ribbons and starlight',
      swatches: ['#10b981', '#a855f7', '#22d3ee'],
      attractMainMenuBg: '#dff6ec', subPageAccent: '#10b981',
      attract: { kind: 'aurora', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.72)',
        stops: ['#0a0a1e', '#0f0a2e', '#0a0a1e'] },
    },
    {
      id: 'ink', label: 'Ink', motion: true,
      description: 'Flowing indigo ink on warm parchment',
      swatches: ['#4338ca', '#1a1a2e', '#f59e0b'],
      attractMainMenuBg: '#e8e4f5', subPageAccent: '#4338ca',
      attract: { kind: 'ink', textPrimary: '#1a1a2e', textSecondary: 'rgba(26,26,46,0.6)',
        stops: ['#faf6f0', '#f5efe6', '#e8dcc8'] },
    },
    {
      id: 'kids', label: 'Kids', motion: true,
      description: 'Playful confetti shapes and color',
      swatches: ['#fbbf24', '#ef4444', '#22c55e'],
      attractMainMenuBg: '#fff5d6', subPageAccent: '#f59e0b',
      attract: { kind: 'kids', textPrimary: '#451a03', textSecondary: 'rgba(69,26,3,0.6)',
        stops: ['#fef3c7', '#fde68a', '#fcd34d'] },
    },
  ];

  var BY_ID = {};
  THEMES.forEach(function (t) { BY_ID[t.id] = t; });

  function normalizeThemeId(v) {
    if (typeof v !== 'string') return null;
    var s = v.trim();
    if (LEGACY_ALIASES[s]) s = LEGACY_ALIASES[s];
    return BY_ID[s] ? s : null;
  }

  function getTheme(id) { return BY_ID[normalizeThemeId(id) || DEFAULT_THEME_ID]; }

  /* ---- three-level resolution via localStorage (docs/03 §4) ---- */
  var K = {
    root: 'c9sc.theme.root',
    library: function (libId) { return 'c9sc.theme.library.' + libId; },
    station: function (stId) { return 'c9sc.theme.station.' + stId; },
  };

  function readKey(k) {
    try { return normalizeThemeId(window.localStorage.getItem(k)); } catch (e) { return null; }
  }
  function writeKey(k, v) {
    try {
      if (v === null || v === undefined) window.localStorage.removeItem(k);
      else window.localStorage.setItem(k, v);
    } catch (e) { /* private mode */ }
  }

  /*
   * Resolve the effective theme for a station.
   * station override -> library/branch override -> ROOT default -> hardcoded default.
   * Returns { id, source, sourceLabel, chain:[{level,value,active}] }.
   */
  function resolve(libId, stationId) {
    var root = readKey(K.root) || DEFAULT_THEME_ID;
    var rootOverridden = !!readKey(K.root);
    var lib = libId ? readKey(K.library(libId)) : null;
    var st = stationId ? readKey(K.station(stationId)) : null;

    var id, source, sourceLabel;
    if (st) { id = st; source = 'station'; sourceLabel = 'Station override'; }
    else if (lib) { id = lib; source = 'library'; sourceLabel = 'Library / branch override'; }
    else { id = root; source = rootOverridden ? 'root' : 'default';
      sourceLabel = rootOverridden ? 'EnvisionWare default (ROOT)' : 'Built-in default'; }

    return {
      id: id, source: source, sourceLabel: sourceLabel,
      chain: [
        { level: 'ROOT default', value: root, set: rootOverridden, active: source === 'root' || source === 'default' },
        { level: 'Library / branch', value: lib, set: !!lib, active: source === 'library' },
        { level: 'Station', value: st, set: !!st, active: source === 'station' },
      ],
    };
  }

  /* Seed the demo overrides once (guarded), so the inheritance story shows
   * regardless of which surface the reviewer opens first. force=true re-applies
   * (the Reset button). */
  function ensureSeed(seed, force) {
    var seeded = false;
    try { seeded = !!window.localStorage.getItem('c9sc.seeded'); } catch (e) {}
    if (seeded && !force) return;
    Object.keys(seed || {}).forEach(function (k) { try { window.localStorage.setItem(k, seed[k]); } catch (e) {} });
    try { window.localStorage.setItem('c9sc.seeded', '1'); } catch (e) {}
  }

  function setRoot(id) { writeKey(K.root, normalizeThemeId(id)); }
  function setLibrary(libId, id) { writeKey(K.library(libId), id ? normalizeThemeId(id) : null); }
  function setStation(stId, id) { writeKey(K.station(stId), id ? normalizeThemeId(id) : null); }
  function getRoot() { return readKey(K.root) || DEFAULT_THEME_ID; }
  function getLibrary(libId) { return readKey(K.library(libId)); }
  function getStation(stId) { return readKey(K.station(stId)); }

  /* =====================================================================
   * Attract renderers. One AttractRenderer drives a <canvas>; dispatches on
   * theme.attract.kind. Dependency-free value noise for clouds/ink/ribbons.
   * Honors reduced motion (freezes) and pauses when not visible.
   * ===================================================================== */

  // Tiny hash-based 2D value noise (smootherstep interpolation).
  function makeNoise(seed) {
    seed = seed || 1;
    function hash(x, y) {
      var h = x * 374761393 + y * 668265263 + seed * 1442695040;
      h = (h ^ (h >> 13)) * 1274126177;
      return ((h ^ (h >> 16)) >>> 0) / 4294967295;
    }
    function smooth(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    return function (x, y) {
      var xi = Math.floor(x), yi = Math.floor(y);
      var xf = x - xi, yf = y - yi;
      var u = smooth(xf), v = smooth(yf);
      var a = hash(xi, yi), b = hash(xi + 1, yi);
      var c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
      return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    };
  }

  function AttractRenderer(canvas, themeId, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = opts || {};
    this.theme = getTheme(themeId);
    this.t = 0;
    this.raf = null;
    this.running = false;
    this.reduced = !!this.opts.reducedMotion;
    this.noise = makeNoise(7);
    this._init();
  }
  AttractRenderer.prototype._init = function () {
    var a = this.theme.attract;
    this.clouds = [];
    this.confetti = [];
    this.stars = [];
    this.ribbons = [];
    this.blobs = [];
    if (a.kind === 'horizon') {
      for (var i = 0; i < 8; i++) {
        this.clouds.push({
          x: Math.random(), y: 0.12 + Math.random() * 0.5,
          s: 0.5 + Math.random() * 1.1, layer: i % 2,
          speed: (i % 2 ? 0.010 : 0.005) * (0.8 + Math.random() * 0.5),
          puffs: 5 + ((Math.random() * 4) | 0),
        });
      }
    } else if (a.kind === 'kids') {
      for (var k = 0; k < 46; k++) this.confetti.push(this._newConfetti(true));
    } else if (a.kind === 'aurora') {
      for (var s = 0; s < 90; s++) this.stars.push({ x: Math.random(), y: Math.random() * 0.8,
        r: 0.4 + Math.random() * 1.4, o: 0.25 + Math.random() * 0.7, tw: 0.4 + Math.random() * 1.8, ph: Math.random() * 6.28 });
      var cols = [[34,211,238],[16,185,129],[168,85,247],[236,72,153],[251,191,36]];
      for (var r = 0; r < 5; r++) this.ribbons.push({ yBase: 0.18 + (r / 5) * 0.5, off: r * 90,
        amp: 55 + Math.random() * 40, thick: 26 + Math.random() * 40, col: cols[r % cols.length], o: 0.12 + Math.random() * 0.1, sp: 0.12 + Math.random() * 0.09 });
    } else if (a.kind === 'ink') {
      var icols = ['#4338ca', '#3730a3', '#5b21b6', '#1e3a8a'];
      for (var b = 0; b < 7; b++) this.blobs.push({ x: Math.random(), y: Math.random(),
        r: 0.06 + Math.random() * 0.12, off: b * 40, sp: 0.05 + Math.random() * 0.07, col: icols[b % icols.length], o: 0.10 + Math.random() * 0.10 });
    }
  };
  AttractRenderer.prototype._newConfetti = function (anyY) {
    var cols = ['#fbbf24', '#ef4444', '#22c55e', '#ec4899', '#3b82f6'];
    var shapes = ['rect', 'tri', 'circle', 'squiggle'];
    return { x: Math.random(), y: anyY ? Math.random() : -0.05,
      r: 6 + Math.random() * 10, col: cols[(Math.random() * cols.length) | 0],
      shape: shapes[(Math.random() * shapes.length) | 0],
      rot: Math.random() * 6.28, rotSp: (Math.random() - 0.5) * 2,
      fall: 0.03 + Math.random() * 0.05, sway: Math.random() * 6.28, swaySp: 0.6 + Math.random() * 1.2 };
  };
  AttractRenderer.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this.canvas.clientWidth || this.canvas.width;
    var h = this.canvas.clientHeight || this.canvas.height;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w; this.h = h;
  };
  AttractRenderer.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.resize();
    var self = this, last = performance.now();
    function loop(now) {
      if (!self.running) return;
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (!self.reduced) self.t += dt;
      self._draw();
      self.raf = requestAnimationFrame(loop);
    }
    this.raf = requestAnimationFrame(loop);
  };
  AttractRenderer.prototype.stop = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  };
  AttractRenderer.prototype.setTheme = function (id) {
    this.theme = getTheme(id); this._init(); this._draw();
  };
  AttractRenderer.prototype._bg = function () {
    var ctx = this.ctx, a = this.theme.attract, g = ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, a.stops[0]); g.addColorStop(0.55, a.stops[1]); g.addColorStop(1, a.stops[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, this.w, this.h);
  };
  AttractRenderer.prototype._draw = function () {
    var ctx = this.ctx, w = this.w, h = this.h, a = this.theme.attract;
    if (!w || !h) { this.resize(); w = this.w; h = this.h; }
    ctx.clearRect(0, 0, w, h);
    this._bg();
    if (a.kind === 'horizon') this._drawHorizon();
    else if (a.kind === 'kids') this._drawKids();
    else if (a.kind === 'aurora') this._drawAurora();
    else if (a.kind === 'ink') this._drawInk();
    else this._drawGlow();
  };
  AttractRenderer.prototype._drawGlow = function () {
    var ctx = this.ctx, w = this.w, h = this.h, glow = this.theme.attract.glow;
    if (!glow) return;
    var rg = ctx.createRadialGradient(w * 0.3, h * 0.35, 0, w * 0.3, h * 0.35, Math.max(w, h) * 0.7);
    rg.addColorStop(0, this._rgba(glow, 0.28)); rg.addColorStop(1, this._rgba(glow, 0));
    ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  };
  AttractRenderer.prototype._drawHorizon = function () {
    var ctx = this.ctx, w = this.w, h = this.h;
    // soft sun glow upper-right
    var sg = ctx.createRadialGradient(w * 0.78, h * 0.2, 0, w * 0.78, h * 0.2, w * 0.5);
    sg.addColorStop(0, 'rgba(255,250,235,0.5)'); sg.addColorStop(1, 'rgba(255,250,235,0)');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < this.clouds.length; i++) {
      var c = this.clouds[i];
      c.x += c.speed * (this.reduced ? 0 : 0.016);
      if (c.x > 1.2) c.x = -0.2;
      var cx = c.x * w, cy = c.y * h, base = (c.layer ? 60 : 42) * c.s;
      ctx.save();
      var alpha = c.layer ? 0.9 : 0.6;
      // under-shadow
      this._puffs(cx, cy + base * 0.28, base, c.puffs, 'rgba(220,233,244,' + (alpha * 0.5) + ')', c.x);
      this._puffs(cx, cy, base, c.puffs, 'rgba(255,255,255,' + alpha + ')', c.x);
      ctx.restore();
    }
  };
  AttractRenderer.prototype._puffs = function (cx, cy, base, n, fill, seedx) {
    var ctx = this.ctx; ctx.fillStyle = fill;
    for (var p = 0; p < n; p++) {
      var nx = this.noise(p * 1.3 + seedx * 10, p * 0.7);
      var ny = this.noise(p * 0.9, p * 1.7 + seedx * 10);
      var ox = (p - n / 2) * base * 0.62 + (nx - 0.5) * base * 0.5;
      var oy = (ny - 0.5) * base * 0.5;
      var r = base * (0.55 + nx * 0.6);
      ctx.beginPath(); ctx.arc(cx + ox, cy + oy, r, 0, 6.2832); ctx.fill();
    }
  };
  AttractRenderer.prototype._drawKids = function () {
    var ctx = this.ctx, w = this.w, h = this.h;
    for (var i = 0; i < this.confetti.length; i++) {
      var c = this.confetti[i];
      if (!this.reduced) { c.y += c.fall * 0.016; c.sway += c.swaySp * 0.016; c.rot += c.rotSp * 0.016; }
      if (c.y > 1.08) Object.assign(c, this._newConfetti(false));
      var x = c.x * w + Math.sin(c.sway) * 14, y = c.y * h;
      ctx.save(); ctx.translate(x, y); ctx.rotate(c.rot); ctx.fillStyle = c.col; ctx.strokeStyle = c.col;
      if (c.shape === 'rect') ctx.fillRect(-c.r / 2, -c.r / 3, c.r, c.r * 0.66);
      else if (c.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, c.r / 2, 0, 6.2832); ctx.fill(); }
      else if (c.shape === 'tri') { ctx.beginPath(); ctx.moveTo(0, -c.r / 2); ctx.lineTo(c.r / 2, c.r / 2); ctx.lineTo(-c.r / 2, c.r / 2); ctx.closePath(); ctx.fill(); }
      else { ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-c.r / 2, 0); ctx.quadraticCurveTo(0, -c.r / 2, c.r / 2, 0); ctx.stroke(); }
      ctx.restore();
    }
  };
  AttractRenderer.prototype._drawAurora = function () {
    var ctx = this.ctx, w = this.w, h = this.h, i;
    for (i = 0; i < this.stars.length; i++) {
      var s = this.stars[i], tw = 0.5 + 0.5 * Math.sin(this.t * s.tw + s.ph);
      ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(255,255,255,' + (s.o * tw) + ')'; ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (i = 0; i < this.ribbons.length; i++) {
      var rb = this.ribbons[i];
      ctx.beginPath();
      for (var x = 0; x <= w; x += 8) {
        var n = this.noise(x * 0.004 + rb.off, this.t * rb.sp + rb.off);
        var y = rb.yBase * h + (n - 0.5) * rb.amp * 2;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineWidth = rb.thick; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(' + rb.col[0] + ',' + rb.col[1] + ',' + rb.col[2] + ',' + rb.o + ')';
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  };
  AttractRenderer.prototype._drawInk = function () {
    var ctx = this.ctx, w = this.w, h = this.h;
    for (var i = 0; i < this.blobs.length; i++) {
      var b = this.blobs[i];
      var nx = this.noise(b.off, this.t * b.sp), ny = this.noise(this.t * b.sp, b.off);
      var cx = (b.x + (nx - 0.5) * 0.3) * w, cy = (b.y + (ny - 0.5) * 0.3) * h;
      var r = b.r * Math.min(w, h);
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, this._rgba(b.col, b.o)); g.addColorStop(1, this._rgba(b.col, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
    }
  };
  AttractRenderer.prototype._rgba = function (hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };

  /* Draw a static thumbnail snapshot (picker cards). Renders one frame. */
  function drawThumbnail(canvas, themeId, reducedMotion) {
    var r = new AttractRenderer(canvas, themeId, { reducedMotion: true });
    r.t = 12; // advance to a representative frame
    r.resize(); r._draw();
    return r;
  }

  window.C9Theme = {
    DEFAULT_THEME_ID: DEFAULT_THEME_ID,
    THEMES: THEMES,
    getTheme: getTheme,
    normalizeThemeId: normalizeThemeId,
    resolve: resolve, ensureSeed: ensureSeed,
    setRoot: setRoot, setLibrary: setLibrary, setStation: setStation,
    getRoot: getRoot, getLibrary: getLibrary, getStation: getStation,
    AttractRenderer: AttractRenderer,
    drawThumbnail: drawThumbnail,
    keys: K,
  };
})();
