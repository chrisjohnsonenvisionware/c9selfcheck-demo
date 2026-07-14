/*
 * Cloud9 SelfCheck Workbench — pooled "Copy for Claude" notes.
 * Self-mounts a floating notes button + panel on any surface that loads it.
 * Notes pool in localStorage under one key (stamped with surface + context)
 * so they can be copied as one markdown block and pasted back into chat.
 * Best-effort POST to the Celsus sink; silent no-op on Pages/offline.
 * MARKER: C9SC_NOTES_V1
 */
(function () {
  'use strict';
  var KEY = 'c9sc.notes';
  var SINK = '/api/c9selfcheck/notes';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(n) { try { localStorage.setItem(KEY, JSON.stringify(n)); } catch (e) {} }

  function surfaceName() {
    return (document.body && document.body.getAttribute('data-surface')) || window.C9_SURFACE || 'unknown';
  }

  function add(text, context) {
    if (!text || !text.trim()) return;
    var notes = load();
    notes.push({ surface: surfaceName(), context: context || '', text: text.trim(), at: new Date().toISOString() });
    save(notes);
    render();
    // best-effort remote sink; degrade silently
    try {
      fetch(SINK, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(notes[notes.length - 1]) }).catch(function () {});
    } catch (e) {}
  }
  function clear() { save([]); render(); }

  function toMarkdown() {
    var notes = load();
    if (!notes.length) return '(no notes yet)';
    var out = ['# Cloud9 SelfCheck workbench — review notes', ''];
    var bySurface = {};
    notes.forEach(function (n) { (bySurface[n.surface] = bySurface[n.surface] || []).push(n); });
    Object.keys(bySurface).forEach(function (s) {
      out.push('## ' + s);
      bySurface[s].forEach(function (n) {
        out.push('- ' + (n.context ? '**' + n.context + '** — ' : '') + n.text);
      });
      out.push('');
    });
    return out.join('\n');
  }

  function copy() {
    var md = toMarkdown();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(md).then(function () { return md; });
    }
    var ta = document.createElement('textarea');
    ta.value = md; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return Promise.resolve(md);
  }

  /* ---------- floating UI ---------- */
  var CSS = '' +
    '.c9n-fab{position:fixed;right:18px;bottom:18px;z-index:9998;width:auto;min-height:48px;padding:0 18px;' +
    'display:flex;align-items:center;gap:8px;border:0;border-radius:999px;background:#123a5c;color:#fff;' +
    'font:600 15px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25)}' +
    '.c9n-fab:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}' +
    '.c9n-badge{background:#f59e0b;color:#1a1a1a;border-radius:999px;min-width:22px;height:22px;padding:0 6px;' +
    'display:inline-flex;align-items:center;justify-content:center;font-size:13px}' +
    '.c9n-panel{position:fixed;right:18px;bottom:78px;z-index:9999;width:340px;max-width:calc(100vw - 36px);' +
    'background:#fff;color:#1a1a2e;border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,.3);overflow:hidden;display:none}' +
    '.c9n-panel.open{display:block}' +
    '.c9n-hd{padding:14px 16px;background:#f1f5f9;font:700 15px system-ui;border-bottom:1px solid #e2e8f0}' +
    '.c9n-bd{padding:14px 16px;max-height:min(46vh,360px);overflow:auto}' +
    '.c9n-item{font:14px/1.4 system-ui;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#334155}' +
    '.c9n-item b{color:#123a5c}' +
    '.c9n-ft{padding:12px 16px;display:flex;gap:8px;border-top:1px solid #e2e8f0}' +
    '.c9n-ta{width:100%;box-sizing:border-box;min-height:64px;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:14px system-ui;resize:vertical}' +
    '.c9n-btn{flex:1;min-height:44px;border:0;border-radius:8px;background:#123a5c;color:#fff;font:600 14px system-ui;cursor:pointer}' +
    '.c9n-btn.ghost{background:#e2e8f0;color:#334155}' +
    '.c9n-btn:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}';

  var mounted = false, panel, fab, list, badge;
  function mount() {
    if (mounted) return; mounted = true;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

    fab = document.createElement('button');
    fab.className = 'c9n-fab'; fab.type = 'button';
    fab.setAttribute('aria-label', 'Review notes for Claude');
    fab.innerHTML = '📝 Notes <span class="c9n-badge" data-count>0</span>';
    badge = fab.querySelector('[data-count]');

    panel = document.createElement('div');
    panel.className = 'c9n-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Review notes');
    panel.innerHTML =
      '<div class="c9n-hd">Notes for Claude — pooled across surfaces</div>' +
      '<div class="c9n-bd" data-list></div>' +
      '<div class="c9n-ft" style="display:block"><textarea class="c9n-ta" data-input placeholder="Add a note about this surface…"></textarea>' +
      '<div style="display:flex;gap:8px;margin-top:8px"><button class="c9n-btn" data-add>Add note</button>' +
      '<button class="c9n-btn ghost" data-copy>Copy all</button></div>' +
      '<button class="c9n-btn ghost" data-clear style="width:100%;margin-top:8px">Clear all</button></div>';
    list = panel.querySelector('[data-list]');

    document.body.appendChild(fab); document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.querySelector('[data-add]').addEventListener('click', function () {
      var ta = panel.querySelector('[data-input]'); add(ta.value, ''); ta.value = '';
    });
    panel.querySelector('[data-copy]').addEventListener('click', function () {
      copy().then(function () {
        var b = panel.querySelector('[data-copy]'); var o = b.textContent;
        b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = o; }, 1400);
      });
    });
    panel.querySelector('[data-clear]').addEventListener('click', function () {
      if (confirm('Clear all review notes?')) clear();
    });
    render();
  }

  function render() {
    if (!mounted) return;
    var notes = load();
    badge.textContent = String(notes.length);
    if (!notes.length) { list.innerHTML = '<div class="c9n-item" style="color:#94a3b8">No notes yet. Jot observations here as you review — they pool across all four surfaces.</div>'; return; }
    list.innerHTML = notes.map(function (n) {
      return '<div class="c9n-item"><b>' + n.surface + '</b>' + (n.context ? ' · ' + n.context : '') + '<br>' + escapeHtml(n.text) + '</div>';
    }).join('');
  }
  function escapeHtml(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  window.C9Notes = { add: add, clear: clear, toMarkdown: toMarkdown, copy: copy, count: function () { return load().length; }, render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });
})();
