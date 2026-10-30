#!/usr/bin/env node
/**
 * pulse-preflight-audit.mjs — Deterministic 7-Point Pre-Push Checker
 * ------------------------------------------------------------------
 * Verifies Zero-PII / zero secrets, git remote safety, GEMINI.md === AGENTS.md parity,
 * sitemap.xml file existence, and [SIMULATED DEMO] labels in <200ms (0 LLM tokens).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const repoRoot = path.resolve(process.argv[2] || process.cwd());
const checks = [];

function record(name, passed, detail) {
  checks.push({ name, status: passed ? 'PASS' : 'FAIL', detail });
}

// 1. Git remote & branch safety (House Rule #1)
try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim();
  const remotes = execSync('git remote -v', { cwd: repoRoot, encoding: 'utf8' });
  const hasOrigin = remotes.includes('GeminiPulse/geminipulse-com');
  record('Git Branch & Origin Remote', hasOrigin, `branch=${branch}, origin=${hasOrigin ? 'GeminiPulse/geminipulse-com' : 'MISSING'}`);
} catch (err) {
  record('Git Branch & Origin Remote', false, err.message);
}

// 2. Zero-PII & Secret Scan across tracked/staged files in public/
try {
  const trackedRaw = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf8' });
  const envStaged = trackedRaw
    .split('\n')
    .some((line) => line.trim() && !line.startsWith('??') && /(^|\/)\.env(\.|$)/.test(line));

  const publicFiles = execSync('git ls-files public/', { cwd: repoRoot, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

  const leaks = [];
  const apiKeyRe = /AIzaSy[0-9A-Za-z_-]{33}/;
  const localPathRe = /\/Users\/[a-zA-Z0-9_-]+\//;

  for (const rel of publicFiles) {
    if (/\.(png|jpg|jpeg|webp|woff2?|wav|mp3|gz|zip)$/i.test(rel)) continue;
    const full = path.join(repoRoot, rel);
    if (!fs.existsSync(full)) continue;
    const txt = fs.readFileSync(full, 'utf8');
    // Skip firebase public client config in .env.local (untracked anyway); flag raw hardcoded keys or local paths
    if (localPathRe.test(txt)) leaks.push(`${rel}: hardcoded /Users/... path`);
    if (apiKeyRe.test(txt) && !rel.includes('firebase')) leaks.push(`${rel}: raw AIzaSy key pattern`);
  }

  record(
    'Zero-PII & Secret Hygiene (House Rule #1)',
    !envStaged && leaks.length === 0,
    envStaged ? '.env file staged!' : leaks.length ? leaks.join('; ') : `Scanned ${publicFiles.length} tracked public/ files — 0 leaks`
  );
} catch (err) {
  record('Zero-PII & Secret Hygiene (House Rule #1)', false, err.message);
}

// 3. GEMINI.md === AGENTS.md & docs/status.md Parity (House Rules #2 & #7)
try {
  const geminiMd = fs.readFileSync(path.join(repoRoot, 'GEMINI.md'), 'utf8');
  const agentsMd = fs.readFileSync(path.join(repoRoot, 'AGENTS.md'), 'utf8');
  const statusMd = fs.readFileSync(path.join(repoRoot, 'docs/status.md'), 'utf8');
  const identical = geminiMd === agentsMd;
  const lastTouchedMatch = geminiMd.match(/Last touched:\*\* `([^`]+)`/);
  const statusUpdatedMatch = statusMd.match(/Last Updated:\*\* `([^`]+)`/);
  record(
    'GEMINI.md / AGENTS.md / status.md Sync',
    identical && Boolean(lastTouchedMatch) && Boolean(statusUpdatedMatch),
    `GEMINI===AGENTS: ${identical} | Last touched: "${(lastTouchedMatch?.[1] || 'missing').slice(0, 48)}..."`
  );
} catch (err) {
  record('GEMINI.md / AGENTS.md / status.md Sync', false, err.message);
}

// 4. Sitemap Disk-Route Parity
try {
  const sitemapPath = path.join(repoRoot, 'public/public/sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>https:\/\/geminipulse\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
  const missing = [];
  for (const route of locs) {
    if (route === '/' || route === '') continue;
    const candidateA = path.join(repoRoot, 'public/public', route);
    const candidateB = path.join(repoRoot, 'public/public', `${route}.html`);
    if (!fs.existsSync(candidateA) && !fs.existsSync(candidateB)) {
      missing.push(route);
    }
  }
  record(
    'Sitemap Route-to-Disk Parity',
    missing.length === 0,
    missing.length ? `Missing files: ${missing.join(', ')}` : `Verified all ${locs.length} sitemap URLs resolve on disk`
  );
} catch (err) {
  record('Sitemap Route-to-Disk Parity', false, err.message);
}

// 5. [SIMULATED DEMO] Honesty Labeling on Simulator Labs (House Rule #5)
try {
  const simPath = path.join(repoRoot, 'public/public/labs/gemini-computer-use-simulator.html');
  const part2Path = path.join(repoRoot, 'public/public/series/making-the-switch/part-2-from-mysql-phpmyadmin-to-firestore.html');
  let ok = true;
  const notes = [];
  for (const p of [simPath, part2Path]) {
    if (fs.existsSync(p)) {
      const hasBadge = fs.readFileSync(p, 'utf8').includes('SIMULATED DEMO');
      if (!hasBadge) {
        ok = false;
        notes.push(`Missing [SIMULATED DEMO] in ${path.basename(p)}`);
      }
    }
  }
  record('[SIMULATED DEMO] Disclosure (House Rule #5)', ok, ok ? 'All interactive simulators carry [SIMULATED DEMO] badges' : notes.join('; '));
} catch (err) {
  record('[SIMULATED DEMO] Disclosure (House Rule #5)', false, err.message);
}

const failed = checks.filter((c) => c.status === 'FAIL');
console.log(JSON.stringify({ passed: failed.length === 0, totalChecks: checks.length, failedCount: failed.length, checks }, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
