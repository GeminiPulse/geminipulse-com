#!/usr/bin/env node
/**
 * GeminiPulse.com — Automated DOM Bounding-Box & Visual Overflow Audit Bot
 * Connects to headless Google Chrome via native CDP WebSocket across 4 viewports
 * (1440px Desktop, 1120px Split-Screen Laptop, 768px Tablet, 390px Mobile)
 * and fails with exit code 1 if any text, badge, heading, or child element
 * extends outside its parent card container or if any navbar pill wraps onto multiple lines.
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
  // Force-render all deferred sections so every card is measured
  document.querySelectorAll('.m3-deferred-section').forEach(sec => {
    sec.style.contentVisibility = 'visible';
  });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const issues = [];
  const vw = document.documentElement.clientWidth;

  // 1. Check horizontal document overflow
  if (document.documentElement.scrollWidth > vw + 2) {
    const culprits = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && !el.closest('.fixed')) {
        culprits.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 60),
          text: (el.innerText || '').slice(0, 45).replace(/\s+/g, ' '),
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

  // 2. Check navbar pill buttons/links for multi-line wrapping (height > 46px)
  const navPill = document.querySelector('header nav.m3-glass-pill');
  if (navPill) {
    const navRect = navPill.getBoundingClientRect();
    navPill.querySelectorAll(':scope > a, :scope > div > a, :scope > div > button, :scope > div > div > button').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // hidden on this breakpoint
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

  // 3. Check every .m3-card and .m3-hero-console for child text/box overflow
  const cards = [...document.querySelectorAll('.m3-card, .m3-hero-console')];
  cards.forEach((card, idx) => {
    const cRect = card.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) return; // hidden dropdown

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
      // Skip intentionally scrollable code pre blocks
      if (child.closest('pre') || child.classList.contains('overflow-x-auto')) return;
      const r = child.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      if (r.right > cRect.right + 2 || r.left < cRect.left - 2) {
        issues.push({
          type: 'CHILD_EXTENDS_OUTSIDE_CARD',
          cardIndex: idx,
          tag: child.tagName.toLowerCase(),
          text: (child.innerText || '').slice(0, 60).replace(/\\s+/g, ' '),
          childRight: Math.round(r.right),
          cardRight: Math.round(cRect.right),
          overflowPx: Math.round(r.right - cRect.right)
        });
      }
    });
  });

  return {
    cardCount: cards.length,
    issueCount: issues.length,
    issues: issues.slice(0, 15)
  };
})()
`;

async function main() {
  console.log(`🔍 Launching GeminiPulse Automated DOM Layout & Overflow Audit Bot on ${TARGET_URL}...`);
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
      await new Promise((r) => setTimeout(r, 350));

      const evalRes = await cdp.send(
        'Runtime.evaluate',
        {
          expression: IN_PAGE_AUDIT_FN,
          awaitPromise: true,
          returnByValue: true,
        },
        sessionId
      );

      const report = evalRes.result.value;
      if (report.issueCount === 0) {
        console.log(`  ✅ ${vp.name}: ${report.cardCount} cards & containers audited — 0 overflows, 0 wrapped pills!`);
      } else {
        totalIssues += report.issueCount;
        console.error(`  ❌ ${vp.name}: Found ${report.issueCount} layout issue(s):`);
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
  console.log('✨ DOM Layout & Bounding-Box Audit Passed across all 4 viewports (0 issues).');
}

main().catch((err) => {
  console.error('Audit bot error:', err);
  process.exit(1);
});
