#!/usr/bin/env node
/**
 * GeminiPulse.com — Automated DOM Bounding-Box, Editorial Integrity & Overflow Audit Bot
 * Connects to headless Google Chrome via native CDP WebSocket across 4 viewports
 * (1440px Desktop, 1120px Split-Screen Laptop, 768px Tablet, 390px Mobile)
 * and fails with exit code 1 if:
 *   1. Any page, drawer, or card overflows horizontally across any of the 4 viewports
 *   2. `#star-hud-card` overlaps `#hero-center-heading` or extends off-screen
 *   3. Any essay headline, standfirst, prose paragraph, Q&A item, builder rule, code block,
 *      HUD summary, or simulator preset contains ellipsis truncation (`…` or `...`)
 *   4. Any essay standfirst duplicates the opening sentence of paragraph 1
 *   5. Any of the 8 Constellation stars fails to render its complete Dual-Lens essay inside `#salon-sheet`
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TARGET_URL = process.argv[2] || 'http://localhost:8080';
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = [
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Split-Screen Laptop (1120x850)', width: 1120, height: 850 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Mobile (390x844)', width: 390, height: 844 },
];

async function launchChrome() {
  const userDataDir = mkdtempSync(join(tmpdir(), 'gp-audit-'));
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

  const wsUrl = await new Promise((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => reject(new Error(`Chrome launch timeout: ${stderr}`)), 10000);
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
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
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}, sessionId = undefined) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

const IN_PAGE_AUDIT_FN = `
(async () => {
  document.querySelectorAll('.m3-deferred-section').forEach(sec => {
    sec.style.contentVisibility = 'visible';
  });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const issues = [];
  const vw = document.documentElement.clientWidth;

  if (!document.title || (document.body?.innerText || '').trim().length < 80) {
    issues.push({
      type: 'EMPTY_OR_404_PAGE',
      title: document.title || '(empty)',
      bodyLen: (document.body?.innerText || '').trim().length
    });
  }

  function rectOverlap(a, b) {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return x * y;
  }

  // 1. Check horizontal document overflow
  if (document.documentElement.scrollWidth > vw + 2) {
    const culprits = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && !el.closest('.fixed')) {
        culprits.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 60),
          text: (el.innerText || '').slice(0, 45).replace(/\\s+/g, ' '),
          right: Math.round(r.right)
        });
      }
    });
    issues.push({
      type: 'PAGE_HORIZONTAL_OVERFLOW',
      detail: 'documentElement.scrollWidth (' + document.documentElement.scrollWidth + ') > clientWidth (' + vw + ')',
      culprits: culprits.slice(0, 5)
    });
  }

  // 2. Check navbar pill buttons/links for multi-line wrapping (Workbench SPA)
  const navPill = document.querySelector('header nav.m3-glass-pill');
  if (navPill) {
    const navRect = navPill.getBoundingClientRect();
    navPill.querySelectorAll(':scope > a, :scope > div > a, :scope > div > button, :scope > div > div > button').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.height > 46) {
        issues.push({
          type: 'NAV_PILL_MULTILINE_WRAP',
          text: (el.innerText || '').trim().replace(/\\s+/g, ' '),
          height: Math.round(r.height),
          width: Math.round(r.width)
        });
      }
      if (r.right > navRect.right + 2 || r.left < navRect.left - 2) {
        issues.push({
          type: 'NAV_CHILD_OUTSIDE_BAR',
          text: (el.innerText || '').trim().replace(/\\s+/g, ' '),
          childRight: Math.round(r.right),
          navRight: Math.round(navRect.right)
        });
      }
    });
  }

  // 3. Check Hero HUD vs Hero Center Heading collision (when in peek state)
  const hudCard = document.querySelector('#star-hud-card:not([data-hidden="true"])');
  const heroHeading = document.getElementById('hero-center-heading');
  if (hudCard && heroHeading) {
    const hudStyle = getComputedStyle(hudCard);
    if (hudStyle.display !== 'none' && parseFloat(hudStyle.opacity || '1') > 0.1) {
      const hR = hudCard.getBoundingClientRect();
      const cR = heroHeading.getBoundingClientRect();
      if (hR.width > 0 && cR.width > 0 && rectOverlap(hR, cR) > 4) {
        issues.push({
          type: 'HUD_OVERLAPS_HERO_HEADING',
          overlapArea: Math.round(rectOverlap(hR, cR))
        });
      }
    }
  }

  // 4. Check visible cards in current state
  const cards = [...document.querySelectorAll('.m3-card, .m3-hero-console, .star-hud-card:not([data-hidden="true"]), .celestial-header, .porcelain-peek-dock')];
  cards.forEach((card, idx) => {
    const cRect = card.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) return;

    if (card.scrollWidth > card.clientWidth + 2) {
      issues.push({
        type: 'CARD_SCROLL_OVERFLOW',
        cardIndex: idx,
        snippet: (card.innerText || '').slice(0, 60).replace(/\\s+/g, ' '),
        scrollWidth: card.scrollWidth,
        clientWidth: card.clientWidth
      });
    }

    card.querySelectorAll('h1, h2, h3, h4, p, span, a, button, div, code').forEach(child => {
      if (child.closest('pre') || child.classList.contains('overflow-x-auto') || child.classList.contains('tpo-drawer')) return;
      const r = child.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > cRect.right + 2 || r.left < cRect.left - 2) {
        issues.push({
          type: 'CHILD_EXTENDS_OUTSIDE_CARD',
          cardIndex: idx,
          tag: child.tagName.toLowerCase(),
          text: (child.innerText || '').slice(0, 60).replace(/\\s+/g, ' '),
          childRight: Math.round(r.right),
          cardRight: Math.round(cRect.right)
        });
      }
    });
  });

  // 5. Check premise-text and peek-live-headline for CSS ellipsis clipping
  document.querySelectorAll('.premise-text, .peek-live-headline').forEach(el => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (el.scrollWidth > el.clientWidth + 2) {
      issues.push({
        type: 'TEXT_ELLIPSIS_TRUNCATION',
        text: (el.innerText || '').slice(0, 60).replace(/\\s+/g, ' '),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      });
    }
  });

  // Helper to audit an active Dual-Lens Essay container (either inside #salon-sheet or standalone /articles/*.html)
  function auditEssayContainer(rootEl, labelContext) {
    if (!rootEl) return;

    // 5a. Standfirst vs Paragraph 1 duplication guard
    const standfirstText = (rootEl.querySelector('.essay-standfirst')?.innerText || '').trim().replace(/\\s+/g, ' ');
    const firstParaText = (rootEl.querySelector('.essay-prose p')?.innerText || '').trim().replace(/\\s+/g, ' ');
    if (!standfirstText || !firstParaText) {
      issues.push({
        type: 'MISSING_ESSAY_PROSE',
        context: labelContext
      });
    } else if (standfirstText.slice(0, 48).toLowerCase() === firstParaText.slice(0, 48).toLowerCase()) {
      issues.push({
        type: 'DUPLICATE_STANDFIRST_AND_BODY',
        context: labelContext,
        prefix: standfirstText.slice(0, 60)
      });
    }

    // 5b. Zero ellipsis ('…' or '...') guard across all editorial elements and code blocks
    const editorialEls = rootEl.querySelectorAll(
      '.essay-h1, .essay-standfirst, .pcl-detail, .essay-h2, .essay-sub, .essay-prose p, .celestial-pullquote p, .qa-question, .qa-answer, .br-label, .br-detail, #chap3-code, .pwc-title, .pwc-sub, .ac-v, .psl-label'
    );
    editorialEls.forEach(el => {
      const txt = el.textContent || '';
      if (txt.includes('…') || txt.includes('...')) {
        issues.push({
          type: 'EDITORIAL_ELLIPSIS_TRUNCATION',
          context: labelContext,
          cls: (el.className || el.id || el.tagName).toString().slice(0, 40),
          snippet: txt.slice(0, 90).replace(/\\s+/g, ' ')
        });
      }
    });

    // 5c. Bounding-box & horizontal overflow inside Sanctuary blocks
    const sanctuaryBlocks = rootEl.querySelectorAll(
      '.essay-hero-block, .pulse-check-ledger, .essay-section, .qa-item, .br-item, .pollux-workbench-card, .primary-sources-ledger'
    );
    sanctuaryBlocks.forEach((blk) => {
      const bRect = blk.getBoundingClientRect();
      if (bRect.width === 0 || bRect.height === 0) return;
      if (bRect.right > vw + 2 || bRect.left < -2) {
        issues.push({
          type: 'SANCTUARY_BLOCK_OUTSIDE_VIEWPORT',
          context: labelContext,
          cls: (blk.className || '').toString().slice(0, 50),
          left: Math.round(bRect.left),
          right: Math.round(bRect.right),
          vw
        });
      }
      if (blk.scrollWidth > blk.clientWidth + 2) {
        issues.push({
          type: 'SANCTUARY_BLOCK_SCROLL_OVERFLOW',
          context: labelContext,
          cls: (blk.className || '').toString().slice(0, 50),
          scrollWidth: blk.scrollWidth,
          clientWidth: blk.clientWidth
        });
      }
    });
  }

  let auditedStars = 0;
  const salonSheet = document.getElementById('salon-sheet');
  const standaloneRoot = document.getElementById('standalone-essay-root');

  if (salonSheet) {
    // Open the Slide-Up Sanctuary and audit all 8 stars!
    const openBtn = document.getElementById('hero-lead-essay-cta') || document.querySelector('[data-open-drawer="castor"]');
    if (openBtn) openBtn.click();
    await new Promise(r => setTimeout(r, 120));

    const starSteps = [...document.querySelectorAll('.cpn-step[data-select-star]')];
    for (const stepBtn of starSteps) {
      const sk = stepBtn.getAttribute('data-select-star');
      stepBtn.click();
      // Wait up to 800ms on first non-Castor star for /articles/essays-data.json to resolve & render
      const waitStart = performance.now();
      while (
        document.getElementById('sanctuary-essay-root')?.getAttribute('data-rendered-star') !== sk &&
        performance.now() - waitStart < 800
      ) {
        await new Promise((r) => setTimeout(r, 20));
      }
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const scrollBody = document.getElementById('drawer-scroll-body');
      if (scrollBody && scrollBody.scrollWidth > scrollBody.clientWidth + 2) {
        issues.push({
          type: 'DRAWER_HORIZONTAL_OVERFLOW',
          star: sk,
          scrollWidth: scrollBody.scrollWidth,
          clientWidth: scrollBody.clientWidth
        });
      }

      const hudSummaryTxt = document.getElementById('hud-summary')?.textContent || '';
      const hudTitleTxt = document.getElementById('hud-title')?.textContent || '';
      if (hudSummaryTxt.includes('…') || hudSummaryTxt.includes('...') || hudTitleTxt.includes('…') || hudTitleTxt.includes('...')) {
        issues.push({
          type: 'HUD_ELLIPSIS_TRUNCATION',
          star: sk,
          snippet: (hudTitleTxt + ' | ' + hudSummaryTxt).slice(0, 90)
        });
      }

      auditEssayContainer(document.getElementById('sanctuary-essay-root'), 'star:' + sk);
      auditedStars++;
    }

    // Restore initial Castor + Peek state cleanly for next viewport
    const castorStep = document.querySelector('.cpn-step[data-select-star="castor"]');
    if (castorStep) castorStep.click();
    const closeBtn = document.getElementById('close-drawer-btn');
    if (closeBtn) closeBtn.click();
    await new Promise(r => setTimeout(r, 120));
  } else if (standaloneRoot) {
    auditEssayContainer(standaloneRoot, 'standalone-article');
    auditedStars = 1;
  }

  return {
    cardCount: cards.length,
    auditedStars,
    issueCount: issues.length,
    issues: issues.slice(0, 20)
  };
})()
`;

async function main() {
  console.log(`🔍 Launching GeminiPulse Automated DOM & Editorial Integrity Audit Bot on ${TARGET_URL}...`);
  const { wsUrl, cleanup } = await launchChrome();
  const cdp = new CDPClient(wsUrl);

  let totalIssues = 0;
  try {
    await cdp.connect();
    const { targetInfos } = await cdp.send('Target.getTargets');
    const pageTarget = targetInfos.find((t) => t.type === 'page');
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId: pageTarget.targetId,
      flatten: true,
    });

    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Page.navigate', { url: TARGET_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 1800));

    for (const vp of VIEWPORTS) {
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: vp.width < 768,
        },
        sessionId
      );
      await new Promise((r) => setTimeout(r, 380));

      const evalRes = await cdp.send(
        'Runtime.evaluate',
        {
          expression: IN_PAGE_AUDIT_FN,
          awaitPromise: true,
          returnByValue: true,
        },
        sessionId
      );

      if (evalRes.exceptionDetails) {
        totalIssues += 1;
        console.error(`  ❌ ${vp.name}: Runtime exception inside audit script:`, evalRes.exceptionDetails.text);
        continue;
      }

      const report = evalRes.result.value;
      if (report.issueCount === 0) {
        const essayMsg = report.auditedStars > 0 ? ` + ${report.auditedStars} Dual-Lens essay(s) verified (0 ellipses, 0 dupes)` : '';
        console.log(`  ✅ ${vp.name}: ${report.cardCount} containers${essayMsg} — 0 overflows!`);
      } else {
        totalIssues += report.issueCount;
        console.error(`  ❌ ${vp.name}: Found ${report.issueCount} layout/editorial issue(s):`);
        for (const issue of report.issues) {
          console.error('     ', JSON.stringify(issue));
        }
      }
    }
  } finally {
    cdp.close();
    cleanup();
  }

  if (totalIssues > 0) {
    process.exit(1);
  }
  console.log('✨ DOM Layout, Bounding-Box & Editorial Integrity Audit Passed across all 4 viewports (0 issues).');
}

main().catch((err) => {
  console.error('Audit bot error:', err);
  process.exit(1);
});
