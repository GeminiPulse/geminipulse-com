#!/usr/bin/env node
/**
 * GeminiPulse.com — Deterministic Sitewide Headless Chrome CDP Crawler (`audit-sitewide.mjs`)
 *
 * Serves `public/dist` via an in-process HTTP server (mirroring `firebase.json` rewrites)
 * and crawls all built HTML pages + key query-parameter states in headless Google Chrome
 * across Desktop (1440x900) and Mobile (390x844) for:
 *   1. P0 Runtime JS exceptions, unhandled promise rejections, or blank #root / body
 *   2. P0 Inquiry modal mount check on `/workbench.html?inquire=true`
 *   3. P1 Broken internal `<a href>`, `<img src>`, `sitemap.xml`, or `feed.xml` URLs
 *   4. P1/P2 Horizontal viewport overflow or sticky header right-edge clipping (1440px & 390px)
 *   5. P2 Content & House Rule hygiene: leaked markdown backticks/`**` in prose, missing
 *      `[SIMULATED DEMO]` labels on `/labs/*.html`, and leftover high-cheese role/tone strings.
 *
 * Writes a structured report to `docs/sitewide-audit-manifest.md`.
 * Zero LLM tokens consumed.
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const distDir = resolve(__dirname, '../dist');
const manifestOutPath = resolve(repoRoot, 'docs/sitewide-audit-manifest.md');
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const STRICT_MODE = process.argv.includes('--strict');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ts': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const REWRITES = new Map([
  ['/status', '/status.html'],
  ['/changelog', '/changelog.html'],
  ['/partners', '/partners.html'],
  ['/workbench', '/workbench.html'],
]);

const REDIRECTS = new Map([
  ['/series/what-changed/dec-1-price-cut.html', '/series/gemini-2-5-migration/part-1-deprecation-and-auto-routing.html'],
  ['/labs/token-economics-workbench.html', '/labs/gemini-cost-per-task-calculator.html'],
]);

function walkHtmlFiles(dir, rootDir = dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkHtmlFiles(full, rootDir, acc);
    } else if (entry.endsWith('.html')) {
      const rel = '/' + relative(rootDir, full).replace(/\\/g, '/');
      acc.push(rel);
    }
  }
  return acc.sort();
}

function resolveDistTarget(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (REDIRECTS.has(clean)) {
    return resolveDistTarget(REDIRECTS.get(clean));
  }
  if (REWRITES.has(clean)) {
    return resolve(distDir, REWRITES.get(clean).slice(1));
  }
  if (clean === '/') {
    return resolve(distDir, 'index.html');
  }
  const candidate = resolve(distDir, clean.slice(1));
  if (!candidate.startsWith(distDir)) return null;
  if (existsSync(candidate)) {
    const st = statSync(candidate);
    if (st.isDirectory()) {
      const idx = join(candidate, 'index.html');
      return existsSync(idx) ? idx : null;
    }
    return candidate;
  }
  const htmlCandidate = `${candidate}.html`;
  if (existsSync(htmlCandidate)) return htmlCandidate;
  return null;
}

function startStaticServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      const urlObj = new URL(req.url || '/', 'http://127.0.0.1');
      const filePath = resolveDistTarget(urlObj.pathname);
      if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      const ext = extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolvePromise({
        baseUrl: `http://127.0.0.1:${addr.port}`,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

async function launchChrome() {
  const userDataDir = mkdtempSync(join(tmpdir(), 'gp-sitewide-'));
  const proc = spawn(
    CHROME_BIN,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${userDataDir}`,
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  const wsUrl = await new Promise((resolvePromise, reject) => {
    let stderr = '';
    const timer = setTimeout(() => reject(new Error(`Chrome launch timeout: ${stderr}`)), 10000);
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolvePromise(match[1]);
      }
    });
    proc.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited early (${code}): ${stderr}`));
    });
  });

  return {
    wsUrl,
    cleanup: () => {
      try {
        proc.kill('SIGKILL');
      } catch {}
      try {
        rmSync(userDataDir, { recursive: true, force: true });
      } catch {}
    },
  };
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    await new Promise((resolvePromise, reject) => {
      this.ws.addEventListener('open', resolvePromise, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject: rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message));
        else res(msg.result);
      } else if (msg.method) {
        const handlers = this.listeners.get(msg.method) || [];
        for (const h of handlers) h(msg.params, msg.sessionId);
      }
    });
  }

  on(method, fn) {
    const arr = this.listeners.get(method) || [];
    arr.push(fn);
    this.listeners.set(method, arr);
  }

  send(method, params = {}, sessionId = undefined) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolvePromise, reject) => {
      this.pending.set(id, { resolve: resolvePromise, reject });
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

const isHistoricalFrozenPrototype = (route) =>
  route.startsWith('/prototypes/') &&
  route !== '/prototypes/index.html' &&
  route !== '/prototypes/look-j-3d-celestial-navigator.html';

const isUntouchedArenaArtifact = (route) => /^\/arena\/exp-\d+-/.test(route);

const IN_PAGE_INSPECT_EXPR = `
(() => {
  const path = location.pathname;
  const search = location.search;
  const isVerificationToken = path.includes('google5049391f94391a64');
  if (isVerificationToken) {
    return {
      isVerificationToken: true,
      bodyLen: document.body ? document.body.innerText.length : 0,
      links: [],
      images: [],
      overflowDesktopOrCurrent: 0,
      headerClipped: [],
      leakedBackticks: [],
      leakedBold: [],
      cheeseHits: [],
      hasSimulatedBadge: true,
      inquiryModalMounted: false,
      rootEmpty: false,
    };
  }

  // Reveal deferred sections for accurate geometry & link scanning
  document.querySelectorAll('.m3-deferred-section').forEach((sec) => {
    sec.style.contentVisibility = 'visible';
  });

  const rootEl = document.getElementById('root');
  const rootEmpty = Boolean(rootEl && rootEl.children.length === 0);
  const bodyText = document.body ? document.body.innerText || '' : '';

  const links = Array.from(document.querySelectorAll('a[href]'))
    .map((a) => a.getAttribute('href'))
    .filter(Boolean);

  const images = Array.from(document.querySelectorAll('img[src]'))
    .map((img) => img.getAttribute('src'))
    .filter(Boolean);

  const vw = window.innerWidth;
  const docScrollW = document.documentElement.scrollWidth;
  const overflowPx = Math.max(0, docScrollW - vw);

  const headerClipped = [];
  const header = document.querySelector('header');
  if (header) {
    header.querySelectorAll('a, button').forEach((el) => {
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1.5 || r.left < -1.5)) {
        headerClipped.push({
          text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          left: Math.round(r.left),
          right: Math.round(r.right),
          vw,
        });
      }
    });
  }

  // Walk visible prose text nodes (excluding code, pre, script, style, svg, textarea)
  const SKIP_TAGS = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'SVG', 'TEXTAREA', 'NOSCRIPT']);
  const leakedBackticks = [];
  const leakedBold = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const val = node.nodeValue || '';
    if (!val.trim()) continue;
    let p = node.parentElement;
    let skip = false;
    while (p) {
      if (SKIP_TAGS.has(p.tagName)) {
        skip = true;
        break;
      }
      p = p.parentElement;
    }
    if (skip) continue;
    if (/\`[^\`\\n]{1,80}\`/.test(val)) {
      leakedBackticks.push(val.trim().slice(0, 110));
    }
    if (/\\*\\*[^*\\n]{2,80}\\*\\*/.test(val)) {
      leakedBold.push(val.trim().slice(0, 110));
    }
  }

  const CHEESE_PHRASES = [
    'Concept Originator',
    'Creative Catalyst',
    'uniquely positioned',
    '4-month agency redesign',
  ];
  const cheeseHits = CHEESE_PHRASES.filter((phrase) =>
    bodyText.toLowerCase().includes(phrase.toLowerCase())
  );

  const hasSimulatedBadge = /\\[SIMULATED DEMO\\]|SIMULATED DEMO/i.test(bodyText);
  const inquiryModalMounted = Boolean(document.getElementById('inquiry-name'));

  return {
    isVerificationToken: false,
    title: document.title,
    bodyLen: bodyText.trim().length,
    rootEmpty,
    links,
    images,
    overflowPx,
    headerClipped,
    leakedBackticks: leakedBackticks.slice(0, 4),
    leakedBold: leakedBold.slice(0, 4),
    cheeseHits,
    hasSimulatedBadge,
    inquiryModalMounted,
  };
})()
`;

function categorizeRoute(route) {
  if (route === '/' || route === '/index.html' || route.startsWith('/?')) return 'Root 3D Constellation';
  if (route.startsWith('/workbench')) return 'Developer Workbench SPA';
  if (route === '/changelog.html') return 'Public Changelog';
  if (route.startsWith('/articles/')) return 'Flagship Essays (/articles/*)';
  if (route.startsWith('/labs/')) return 'Interactive Developer Labs (/labs/*)';
  if (route.startsWith('/arena/')) return 'Tri-Model Arena (/arena/*)';
  if (route.startsWith('/series/')) return 'Deep-Dive Series (/series/*)';
  if (route.startsWith('/prototypes/')) return 'Prototype Archive (/prototypes/*)';
  return 'Static & Brand Pages';
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('[audit-sitewide] Missing public/dist directory. Run `npm run build` first.');
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(distDir);
  const routesToAudit = [
    '/',
    '/workbench.html',
    '/workbench.html?inquire=true',
    '/?star=mebsuta',
    ...htmlFiles.filter((r) => r !== '/index.html' && r !== '/workbench.html'),
  ];

  // Check sitemap.xml & feed.xml static integrity first
  const sitemapBroken = [];
  const sitemapPath = resolve(distDir, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sm = readFileSync(sitemapPath, 'utf8');
    const locs = [...sm.matchAll(/<loc>https:\/\/geminipulse\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
    for (const loc of locs) {
      if (!resolveDistTarget(loc)) {
        sitemapBroken.push(loc);
      }
    }
  }

  const feedBroken = [];
  const feedPath = resolve(distDir, 'feed.xml');
  if (existsSync(feedPath)) {
    const fx = readFileSync(feedPath, 'utf8');
    const hrefs = [...fx.matchAll(/<link href="https:\/\/geminipulse\.com([^"]*)"/g)].map((m) => m[1] || '/');
    for (const h of hrefs) {
      if (!resolveDistTarget(h)) {
        feedBroken.push(h);
      }
    }
  }

  const server = await startStaticServer();
  const chrome = await launchChrome();
  const cdp = new CDPClient(chrome.wsUrl);
  await cdp.connect();

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Log.enable', {}, sessionId);

  let currentPageErrors = [];
  cdp.on('Runtime.exceptionThrown', (params, sid) => {
    if (sid !== sessionId) return;
    const desc =
      params?.exceptionDetails?.exception?.description ||
      params?.exceptionDetails?.text ||
      'Runtime exception';
    // Ignore external third-party font/analytics fetch errors in headless offline runs
    if (/fonts\.googleapis|googletagmanager|firestore\.googleapis/i.test(desc)) return;
    currentPageErrors.push(desc.split('\n')[0].slice(0, 180));
  });

  const p0CrashOrBlank = [];
  const p1BrokenLinks = [];
  const p1LayoutOrHeader = [];
  const p2MissingSimDemo = [];
  const p2MarkdownLeak = [];
  const p2CheeseTone = [];

  console.log(`[audit-sitewide] Crawling ${routesToAudit.length} routes + query states across Desktop (1440px) & Mobile (390px)...`);

  for (const route of routesToAudit) {
    currentPageErrors = [];
    const frozenProto = isHistoricalFrozenPrototype(route);

    await cdp.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
      sessionId
    );

    const loadDone = new Promise((res) => {
      const timer = setTimeout(() => {
        const arr = cdp.listeners.get('Page.loadEventFired') || [];
        cdp.listeners.set('Page.loadEventFired', arr.filter((fn) => fn !== handler));
        res();
      }, 2500);
      function handler(_, sid) {
        if (sid === sessionId) {
          clearTimeout(timer);
          const arr = cdp.listeners.get('Page.loadEventFired') || [];
          cdp.listeners.set('Page.loadEventFired', arr.filter((fn) => fn !== handler));
          res();
        }
      }
      cdp.on('Page.loadEventFired', handler);
    });

    await cdp.send('Page.navigate', { url: `${server.baseUrl}${route}` }, sessionId);
    await loadDone;
    await new Promise((r) => setTimeout(r, route.startsWith('/workbench') ? 320 : 90));

    let evalDesktop = await cdp.send(
      'Runtime.evaluate',
      { expression: IN_PAGE_INSPECT_EXPR, returnByValue: true },
      sessionId
    );
    let d = evalDesktop?.result?.value;
    if (!d) {
      await new Promise((r) => setTimeout(r, 200));
      evalDesktop = await cdp.send(
        'Runtime.evaluate',
        { expression: IN_PAGE_INSPECT_EXPR, returnByValue: true },
        sessionId
      );
      d = evalDesktop?.result?.value;
    }

    if (!d) {
      p0CrashOrBlank.push({ route, reason: 'Failed to evaluate DOM in headless Chrome.' });
      continue;
    }

    if (currentPageErrors.length > 0) {
      p0CrashOrBlank.push({ route, reason: `Runtime JS error: ${currentPageErrors.join(' | ')}` });
    }
    if (!d.isVerificationToken && (d.rootEmpty || d.bodyLen < 30)) {
      p0CrashOrBlank.push({ route, reason: `Blank render (rootEmpty=${d.rootEmpty}, bodyLen=${d.bodyLen})` });
    }
    if (route === '/workbench.html?inquire=true' && !d.inquiryModalMounted) {
      p0CrashOrBlank.push({ route, reason: 'Inquiry modal (#inquiry-name) did not mount on ?inquire=true' });
    }

    // Check internal links & images
    for (const rawHref of [...d.links, ...d.images]) {
      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:') ||
        rawHref.startsWith('data:')
      ) {
        continue;
      }
      let localPath = null;
      if (rawHref.startsWith('/')) {
        localPath = rawHref;
      } else if (rawHref.startsWith('https://geminipulse.com')) {
        localPath = rawHref.replace('https://geminipulse.com', '') || '/';
      } else if (!/^[a-zA-Z]+:\/\//.test(rawHref)) {
        // relative path
        const baseDir = route.endsWith('/') ? route : route.slice(0, route.lastIndexOf('/') + 1);
        localPath = resolve(baseDir, rawHref);
      }
      if (localPath && !frozenProto) {
        const resolved = resolveDistTarget(localPath);
        if (!resolved) {
          p1BrokenLinks.push({ route, target: rawHref });
        }
      }
    }

    if (!frozenProto && !d.isVerificationToken) {
      if (d.overflowPx > 2) {
        p1LayoutOrHeader.push({ route, viewport: '1440px', detail: `Horizontal overflow +${d.overflowPx}px` });
      }
      if (d.headerClipped.length > 0) {
        p1LayoutOrHeader.push({
          route,
          viewport: '1440px',
          detail: `Header item clipped: ${JSON.stringify(d.headerClipped[0])}`,
        });
      }

      // Check Mobile (390x844) overflow on active routes
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
        sessionId
      );
      await new Promise((r) => setTimeout(r, 60));
      const evalMobile = await cdp.send(
        'Runtime.evaluate',
        {
          expression: `Math.max(0, document.documentElement.scrollWidth - window.innerWidth)`,
          returnByValue: true,
        },
        sessionId
      );
      const mobOverflow = evalMobile?.result?.value || 0;
      if (mobOverflow > 2) {
        p1LayoutOrHeader.push({ route, viewport: '390px', detail: `Mobile horizontal overflow +${mobOverflow}px` });
      }

      if (route.startsWith('/labs/') && !d.hasSimulatedBadge) {
        p2MissingSimDemo.push({ route });
      }
      if (!isUntouchedArenaArtifact(route) && (d.leakedBackticks.length > 0 || d.leakedBold.length > 0)) {
        p2MarkdownLeak.push({
          route,
          samples: [...d.leakedBackticks, ...d.leakedBold],
        });
      }
      if (d.cheeseHits.length > 0) {
        p2CheeseTone.push({ route, hits: d.cheeseHits });
      }
    }
  }

  cdp.close();
  chrome.cleanup();
  await server.close();

  // Group route counts
  const groupCounts = new Map();
  for (const r of routesToAudit) {
    const g = categorizeRoute(r);
    groupCounts.set(g, (groupCounts.get(g) || 0) + 1);
  }

  const nowIso = new Date().toISOString();
  const lines = [
    '# GeminiPulse.com — Sitewide Automated Audit Manifest (`docs/sitewide-audit-manifest.md`)',
    '',
    `- **Generated:** \`${nowIso}\``,
    `- **Routes & States Crawled:** **${routesToAudit.length}** (Desktop \`1440x900\` + Mobile \`390x844\`, Headless Chrome CDP)`,
    `- **P0 Runtime Crashes / Blank Screens / Broken Inquiry Modal:** **${p0CrashOrBlank.length}**`,
    `- **P1 Broken Internal Links / Images / Sitemap / Feed URLs:** **${p1BrokenLinks.length + sitemapBroken.length + feedBroken.length}**`,
    `- **P1/P2 Viewport Overflow or Header Clipping (Active Pages):** **${p1LayoutOrHeader.length}**`,
    `- **P2 Labs Missing \`[SIMULATED DEMO]\` Badge:** **${p2MissingSimDemo.length}**`,
    `- **P2 Leaked Raw Markdown (\`\\\`code\\\`\` or \`**bold**\`) in Prose:** **${p2MarkdownLeak.length}**`,
    `- **P2 Leftover High-Cheese / Legacy Role Copy Hits:** **${p2CheeseTone.length}**`,
    '',
    '## 1. Surface Coverage Summary',
    '',
    '| Surface Group | Audited Routes |',
    '| :--- | :---: |',
    ...[...groupCounts.entries()].map(([g, c]) => `| **${g}** | ${c} |`),
    '',
    '## 2. P0 Runtime Crashes, Blank Renders & Critical Flow Checks',
    '',
    ...(p0CrashOrBlank.length === 0
      ? ['- **0 issues.** Every route mounted cleanly, including `/workbench.html` and `/workbench.html?inquire=true` (`#inquiry-name` verified).']
      : p0CrashOrBlank.map((x) => `- \`${x.route}\` — ${x.reason}`)),
    '',
    '## 3. P1 Internal Links, Images, `sitemap.xml` & `feed.xml` Integrity',
    '',
    ...(p1BrokenLinks.length === 0 && sitemapBroken.length === 0 && feedBroken.length === 0
      ? ['- **0 broken internal links, images, sitemap entries, or Atom feed links.**']
      : [
          ...sitemapBroken.map((u) => `- \`sitemap.xml\` broken URL: \`${u}\``),
          ...feedBroken.map((u) => `- \`feed.xml\` broken URL: \`${u}\``),
          ...p1BrokenLinks.map((b) => `- \`${b.route}\` -> missing target \`${b.target}\``),
        ]),
    '',
    '## 4. P1/P2 Active-Page Horizontal Overflow & Sticky Header Geometry (`1440px` & `390px`)',
    '',
    ...(p1LayoutOrHeader.length === 0
      ? ['- **0 active-page horizontal overflows or clipped header controls.**']
      : p1LayoutOrHeader.map((l) => `- \`${l.route}\` (${l.viewport}): ${l.detail}`)),
    '',
    '## 5. P2 Interactive Labs `[SIMULATED DEMO]` Labeling (House Rule #5)',
    '',
    ...(p2MissingSimDemo.length === 0
      ? ['- **All `/labs/*.html` pages display an explicit `[SIMULATED DEMO]` label.**']
      : p2MissingSimDemo.map((m) => `- \`${m.route}\` missing explicit \`[SIMULATED DEMO]\` text`)),
    '',
    '## 6. P2 Leaked Raw Markdown Syntax in Visible Prose',
    '',
    ...(p2MarkdownLeak.length === 0
      ? ['- **0 leaked markdown backticks or `**bold**` tokens in visible prose.**']
      : p2MarkdownLeak.map((m) => `- \`${m.route}\`: ${m.samples.map((s) => `\`${s.replace(/`/g, "'")}\``).join(' · ')}`)),
    '',
    '## 7. P2 Legacy Role Attribution / High-Cheese Copy Locations',
    '',
    ...(p2CheeseTone.length === 0
      ? ['- **0 leftover high-cheese / legacy role title strings across active pages.**']
      : p2CheeseTone.map((c) => `- \`${c.route}\`: matched ${c.hits.map((h) => `\`${h}\``).join(', ')}`)),
    '',
  ];

  writeFileSync(manifestOutPath, lines.join('\n'));

  console.log('\n[audit-sitewide] Summary:');
  console.log(`  Routes audited:       ${routesToAudit.length}`);
  console.log(`  P0 Crashes / Blank:   ${p0CrashOrBlank.length}`);
  console.log(`  P1 Broken Links/XML:  ${p1BrokenLinks.length + sitemapBroken.length + feedBroken.length}`);
  console.log(`  P1/P2 Layout/Header:  ${p1LayoutOrHeader.length}`);
  console.log(`  P2 Missing Sim Demo:  ${p2MissingSimDemo.length}`);
  console.log(`  P2 Markdown Leaks:    ${p2MarkdownLeak.length}`);
  console.log(`  P2 Tone/Role Hits:    ${p2CheeseTone.length}`);
  console.log(`  Manifest written to:  docs/sitewide-audit-manifest.md\n`);

  if (p0CrashOrBlank.length > 0 || (STRICT_MODE && (p1BrokenLinks.length > 0 || p1LayoutOrHeader.length > 0))) {
    process.exit(1);
  }
}

await main();
