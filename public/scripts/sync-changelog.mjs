import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const changelogDataPath = resolve(__dirname, '../src/data/changelogData.js');
const outputHtmlPath = resolve(__dirname, '../public/changelog.html');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function syncChangelog(buildMeta = {}) {
  const cacheBust = `?t=${Date.now()}`;
  const { CHANGELOG_META, CHANGELOG_ENTRIES } = await import(
    `${pathToFileURL(changelogDataPath).href}${cacheBust}`
  );

  const totalCount = CHANGELOG_ENTRIES.length;
  const humanCount = CHANGELOG_ENTRIES.filter((e) => e.caughtBy === 'human').length;
  const geminiCount = CHANGELOG_ENTRIES.filter((e) => e.caughtBy === 'gemini').length;
  const activeBuild = buildMeta.buildId || 'v2.0';

  const entriesHtml = CHANGELOG_ENTRIES.map((entry, idx) => {
    const isHuman = entry.caughtBy === 'human';
    const badgeClass = isHuman ? 'cl-badge cl-badge--human' : 'cl-badge cl-badge--gemini';
    const openAttr = idx === 0 ? ' open' : '';
    return `          <details class="cl-item" data-caught-by="${escapeHtml(entry.caughtBy)}" id="${escapeHtml(entry.id)}"${openAttr}>
            <summary class="cl-summary">
              <span class="cl-summary-body">
                <span class="cl-meta-line">
                  <time datetime="${escapeHtml(entry.date)}" class="cl-date">${escapeHtml(entry.dateDisplay)}</time>
                  <span class="cl-surface">${escapeHtml(entry.surface)}</span>
                  <span class="${badgeClass}">${escapeHtml(entry.caughtByLabel)}</span>
                </span>
                <span class="cl-headline">${escapeHtml(entry.summary)}</span>
              </span>
            </summary>
            <div class="cl-detail-panel">
              <dl class="cl-detail-grid">
                <div class="cl-detail-row">
                  <dt>What went wrong</dt>
                  <dd>${escapeHtml(entry.whatHappened)}</dd>
                </div>
                <div class="cl-detail-row">
                  <dt>How it was fixed</dt>
                  <dd>${escapeHtml(entry.fixApplied)}</dd>
                </div>
              </dl>
            </div>
          </details>`;
  }).join('\n');

  const introHtml = CHANGELOG_META.introParagraphs
    .map((p) => `          <p>${escapeHtml(p)}</p>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="text-scale" content="scale" />
  <title>${escapeHtml(CHANGELOG_META.title)} — GeminiPulse.com</title>
  <meta name="description" content="Plain-English public changelog of bugs, UX oversights, and fixes across GeminiPulse.com—showing what Gemini caught automatically vs. where human product direction stepped in." />
  <link rel="canonical" href="https://geminipulse.com/changelog.html" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="theme-color" content="#050811" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="GeminiPulse" />
  <meta property="og:title" content="${escapeHtml(CHANGELOG_META.title)} — GeminiPulse" />
  <meta property="og:description" content="Bugs, UX oversights, and scope restraint across an AI-maintained site: what Gemini caught automatically vs. what took human review." />
  <meta property="og:url" content="https://geminipulse.com/changelog.html" />
  <meta property="og:image" content="https://geminipulse.com/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(CHANGELOG_META.title)} — GeminiPulse" />
  <meta name="twitter:description" content="Ongoing log of bugs, UX oversights, and fixes caught by Gemini Self-Audit vs. Human Oversight." />
  <meta name="twitter:image" content="https://geminipulse.com/og-image.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </noscript>

  <style>
    @media (prefers-reduced-motion: no-preference) {
      @view-transition {
        navigation: auto;
      }
    }

    @font-face {
      font-family: 'Cormorant Fallback';
      src: local('Georgia'), local('Times New Roman');
      size-adjust: 91%;
      ascent-override: 98%;
      descent-override: 26%;
      line-gap-override: 0%;
    }

    :root {
      color-scheme: dark;
      --obsidian: #050811;
      --surface: rgba(11, 16, 28, 0.84);
      --surface-open: rgba(14, 21, 38, 0.94);
      --starlight: #F4F7FC;
      --starlight-body: #DCE7F5;
      --starlight-dim: #B8C7DD;
      --starlight-muted: #8FA1B8;
      --castor-glow: #7EB8FF;
      --pollux-glow: #F59E3F;
      --pollux-star: #FFD296;
      --ethereal: #A385FF;
      --ethereal-bright: #CEC0FF;
      --serif: 'Cormorant Garamond', 'Cormorant Fallback', Georgia, serif;
      --sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :focus-visible {
      outline: 2px solid var(--ethereal-bright);
      outline-offset: 3px;
    }

    html {
      background: var(--obsidian);
      color: var(--starlight);
      font-family: var(--sans);
      -webkit-font-smoothing: antialiased;
    }

    body {
      min-block-size: 100svh;
      line-height: 1.65;
      background:
        radial-gradient(ellipse 55% 50% at 0% 15%, rgba(46, 152, 255, 0.09) 0%, transparent 70%),
        radial-gradient(ellipse 55% 50% at 100% 20%, rgba(245, 156, 48, 0.08) 0%, transparent 70%),
        var(--obsidian);
    }

    .sr-only {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .cl-header {
      position: sticky;
      top: 0;
      z-index: 30;
      min-block-size: 3.5rem;
      padding: 0.55rem clamp(1rem, 3vw, 2.75rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      background: rgba(5, 8, 17, 0.88);
      backdrop-filter: blur(16px);
      border-block-end: 1px solid rgba(163, 133, 255, 0.16);
    }

    .cl-brand-group {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      min-inline-size: 0;
    }

    .cl-brand-link {
      font-family: var(--mono);
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--starlight);
      text-decoration: none;
      white-space: nowrap;
    }

    .cl-header-kicker {
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--starlight-muted);
      white-space: nowrap;
    }

    .cl-nav {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .cl-nav-pill {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--starlight-dim);
      text-decoration: none;
      padding: 0.42rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(163, 133, 255, 0.24);
      background: rgba(12, 16, 30, 0.65);
      white-space: nowrap;
      transition: border-color 0.2s ease, color 0.2s ease;
    }

    .cl-nav-pill:hover {
      color: #FFFFFF;
      border-color: var(--ethereal-bright);
    }

    .cl-main {
      max-inline-size: 54rem;
      margin-inline: auto;
      padding: clamp(2.75rem, 6vh, 4.5rem) clamp(1.15rem, 3.5vw, 2.5rem) 5rem;
    }

    .cl-eyebrow {
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ethereal-bright);
      margin-block-end: 0.85rem;
    }

    .cl-h1 {
      font-family: var(--serif);
      font-size: clamp(2.25rem, 1.7rem + 2.2vw, 3.35rem);
      font-weight: 500;
      line-height: 1.08;
      letter-spacing: -0.015em;
      text-wrap: balance;
      margin-block-end: 0.65rem;
    }

    .cl-subtitle {
      font-family: var(--serif);
      font-style: italic;
      font-size: clamp(1.25rem, 1.1rem + 0.55vw, 1.55rem);
      color: var(--castor-glow);
      line-height: 1.38;
      margin-block-end: 1.5rem;
    }

    .cl-intro-box {
      padding: 1.35rem 1.5rem;
      border-radius: 1rem;
      background: rgba(12, 18, 32, 0.72);
      border: 1px solid rgba(126, 184, 255, 0.2);
      margin-block-end: 1.75rem;
    }

    .cl-intro-box p {
      font-size: clamp(1rem, 0.96rem + 0.2vw, 1.08rem);
      line-height: 1.72;
      color: var(--starlight-body);
      text-wrap: pretty;
    }

    .cl-intro-box p + p {
      margin-block-start: 0.85rem;
    }

    .cl-byline {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-block: 0.85rem;
      border-block: 1px solid rgba(255, 255, 255, 0.1);
      margin-block-end: 1.75rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--starlight-dim);
    }

    .cl-byline strong {
      color: var(--starlight);
      font-weight: 600;
    }

    .cl-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-block-end: 1.15rem;
    }

    .cl-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .cl-filter-btn,
    .cl-toggle-all-btn {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(11, 16, 28, 0.8);
      color: var(--starlight-dim);
      cursor: pointer;
      transition: border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease;
    }

    .cl-filter-btn:hover,
    .cl-toggle-all-btn:hover {
      color: #FFFFFF;
      border-color: rgba(206, 192, 255, 0.5);
    }

    .cl-filter-btn[aria-pressed="true"] {
      background: rgba(163, 133, 255, 0.18);
      border-color: var(--ethereal-bright);
      color: #FFFFFF;
      font-weight: 600;
    }

    .cl-toggle-all-btn[aria-expanded="true"] .cl-expand-label,
    .cl-toggle-all-btn[aria-expanded="false"] .cl-collapse-label {
      display: none;
    }

    /* Native <details> + <summary> non-exclusive disclosure list (modern-web-guidance: accordion) */
    .cl-accordion {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .cl-item {
      border-radius: 0.9rem;
      background: var(--surface);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .cl-item[open] {
      background: var(--surface-open);
      border-color: rgba(163, 133, 255, 0.34);
    }

    .cl-item[hidden] {
      display: none;
    }

    .cl-summary {
      list-style: none;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.95rem 1.15rem;
      cursor: pointer;
      user-select: none;
    }

    .cl-summary::-webkit-details-marker {
      display: none;
    }

    /* Marker placed directly before label text for vertical scanning (modern-web-guidance: accordion) */
    .cl-summary::before {
      content: "";
      inline-size: 0.95rem;
      block-size: 0.95rem;
      margin-block-start: 0.22rem;
      flex-shrink: 0;
      background-color: var(--ethereal-bright);
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='black' d='M3.7 5.3a1 1 0 0 1 1.4 0L8 8.2l2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0L3.7 6.7a1 1 0 0 1 0-1.4Z'/%3E%3C/svg%3E") no-repeat center / contain;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='black' d='M3.7 5.3a1 1 0 0 1 1.4 0L8 8.2l2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0L3.7 6.7a1 1 0 0 1 0-1.4Z'/%3E%3C/svg%3E") no-repeat center / contain;
      rotate: -90deg;
    }

    .cl-summary:dir(rtl)::before {
      rotate: 90deg;
    }

    .cl-item[open] > .cl-summary::before {
      rotate: 0deg;
    }

    @media (prefers-reduced-motion: no-preference) {
      .cl-summary::before {
        transition: rotate 0.2s ease;
      }
    }

    .cl-summary-body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-inline-size: 0;
      flex: 1;
    }

    .cl-meta-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.04em;
    }

    .cl-date {
      color: var(--starlight-muted);
    }

    .cl-surface {
      color: var(--starlight);
      font-weight: 600;
    }

    .cl-badge {
      padding: 0.14rem 0.55rem;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 600;
    }

    .cl-badge--human {
      background: rgba(245, 158, 63, 0.14);
      border: 1px solid rgba(245, 158, 63, 0.42);
      color: var(--pollux-star);
    }

    .cl-badge--gemini {
      background: rgba(126, 184, 255, 0.14);
      border: 1px solid rgba(126, 184, 255, 0.4);
      color: #BAE6FD;
    }

    .cl-headline {
      font-size: clamp(0.98rem, 0.94rem + 0.18vw, 1.06rem);
      font-weight: 500;
      line-height: 1.48;
      color: var(--starlight);
      text-wrap: pretty;
    }

    /* Progressive-enhancement intrinsic block-size animation (modern-web-guidance: accordion) */
    .cl-item::details-content {
      interpolate-size: allow-keywords;
      overflow: clip;
      contain: layout;
    }

    .cl-item:not([open])::details-content {
      block-size: 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      .cl-item::details-content {
        transition: block-size 0.24s ease-in-out, content-visibility 0.24s ease-in-out, display 0.24s ease-in-out;
        transition-behavior: allow-discrete;
      }
    }

    .cl-detail-panel {
      padding: 0 1.15rem 1.05rem 2.85rem;
      border-block-start: 1px solid rgba(255, 255, 255, 0.07);
      padding-block-start: 0.85rem;
    }

    .cl-detail-grid {
      display: grid;
      gap: 0.65rem;
    }

    .cl-detail-row {
      display: grid;
      grid-template-columns: 9.5rem minmax(0, 1fr);
      gap: 0.75rem;
      font-size: 0.95rem;
      line-height: 1.62;
    }

    .cl-detail-row dt {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--starlight-muted);
      padding-block-start: 0.2rem;
    }

    .cl-detail-row dd {
      color: var(--starlight-body);
      text-wrap: pretty;
    }

    .cl-footer {
      margin-block-start: 2.5rem;
      padding-block-start: 1.35rem;
      border-block-start: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-family: var(--mono);
      font-size: 0.72rem;
      color: var(--starlight-muted);
    }

    .cl-footer a {
      color: var(--castor-glow);
      text-decoration: none;
    }

    .cl-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 56em) {
      .cl-header-kicker {
        display: none;
      }
    }

    @media (max-width: 42em) {
      .cl-detail-panel {
        padding-inline-start: 1.15rem;
      }
      .cl-detail-row {
        grid-template-columns: 1fr;
        gap: 0.2rem;
      }
      .cl-nav-optional {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header class="cl-header">
    <div class="cl-brand-group">
      <a href="/" class="cl-brand-link">♊ GEMINIPULSE</a>
      <span class="cl-header-kicker">· Public Changelog (${escapeHtml(activeBuild)})</span>
    </div>
    <nav class="cl-nav" aria-label="Changelog Navigation">
      <a href="/" class="cl-nav-pill">← 3D Star Chart</a>
      <a href="/articles/" class="cl-nav-pill cl-nav-optional">Essays</a>
      <a href="/series/google-preview-observatory/open-letter-to-google-deepmind.html" class="cl-nav-pill cl-nav-optional">Open Letter</a>
      <a href="/workbench.html?inquire=true" class="cl-nav-pill">Send Note</a>
    </nav>
  </header>

  <main class="cl-main">
    <div class="cl-eyebrow">✦ PUBLIC RECORD · HUMAN DIRECTION &amp; GEMINI SELF-AUDIT</div>
    <h1 class="cl-h1">${escapeHtml(CHANGELOG_META.title)}</h1>
    <p class="cl-subtitle">${escapeHtml(CHANGELOG_META.subtitle)}</p>

    <div class="cl-intro-box">
${introHtml}
    </div>

    <div class="cl-byline">
      <span>Written &amp; Coded by <strong>Google Gemini 4 Argon</strong> · Product Development &amp; Creative Direction: <strong>Neil S. White</strong></span>
      <span>Zero PII · Click Any Row for Details</span>
    </div>

    <section aria-labelledby="changelog-list-heading">
      <h2 id="changelog-list-heading" class="sr-only">Chronological Bug, UX, and Audit Entries</h2>

      <div class="cl-toolbar">
        <div class="cl-filters" role="group" aria-label="Filter changelog entries by who caught the issue">
          <button type="button" class="cl-filter-btn" data-filter="all" aria-pressed="true">All (${totalCount})</button>
          <button type="button" class="cl-filter-btn" data-filter="human" aria-pressed="false">Human Oversight (${humanCount})</button>
          <button type="button" class="cl-filter-btn" data-filter="gemini" aria-pressed="false">Gemini Self-Audit (${geminiCount})</button>
        </div>

        <button type="button" class="cl-toggle-all-btn" id="cl-toggle-all" commandfor="cl-accordion" command="--toggle-all" aria-expanded="false">
          <span class="cl-expand-label">Expand all</span>
          <span class="cl-collapse-label">Collapse all</span>
        </button>
      </div>

      <div class="cl-accordion" id="cl-accordion">
${entriesHtml}
      </div>
    </section>

    <footer class="cl-footer">
      <span>Active Build: <a href="/status.html">${escapeHtml(activeBuild)}</a> · Design History: <a href="/prototypes/index.html">18-Prototype Archive</a></span>
      <a href="/workbench.html?inquire=true">Spot an issue? Send a note →</a>
    </footer>
  </main>

  <script>
    (() => {
      const accordion = document.getElementById('cl-accordion');
      const toggleAllBtn = document.getElementById('cl-toggle-all');
      const filterBtns = Array.from(document.querySelectorAll('.cl-filter-btn'));
      const items = Array.from(accordion.querySelectorAll(':scope > details'));

      function visibleItems() {
        return items.filter((d) => !d.hidden);
      }

      function syncToggleAllState() {
        const vis = visibleItems();
        const allOpen = vis.length > 0 && vis.every((d) => d.open);
        toggleAllBtn.setAttribute('aria-expanded', String(allOpen));
      }

      function handleToggleAll() {
        const expand = toggleAllBtn.getAttribute('aria-expanded') !== 'true';
        for (const d of visibleItems()) {
          d.open = expand;
        }
        syncToggleAllState();
      }

      if (Object.hasOwn(HTMLButtonElement.prototype, 'commandForElement')) {
        document.addEventListener(
          'command',
          (event) => {
            if (event.command === '--toggle-all') handleToggleAll();
          },
          { capture: true }
        );
      } else {
        toggleAllBtn.addEventListener('click', handleToggleAll);
      }

      accordion.addEventListener(
        'toggle',
        (event) => {
          if (event.target instanceof HTMLDetailsElement) {
            syncToggleAllState();
          }
        },
        { capture: true }
      );

      for (const btn of filterBtns) {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-filter');
          for (const b of filterBtns) {
            b.setAttribute('aria-pressed', String(b === btn));
          }
          for (const d of items) {
            const match = mode === 'all' || d.getAttribute('data-caught-by') === mode;
            d.hidden = !match;
          }
          syncToggleAllState();
        });
      }

      syncToggleAllState();
    })();
  </script>
</body>
</html>
`;

  writeFileSync(outputHtmlPath, html);
  return { outputHtmlPath, totalCount, humanCount, geminiCount };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const res = await syncChangelog();
  console.log(`[sync-changelog] Generated ${res.outputHtmlPath} (${res.totalCount} entries: ${res.humanCount} human, ${res.geminiCount} gemini)`);
}
