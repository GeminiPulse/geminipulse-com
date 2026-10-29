#!/usr/bin/env node
/**
 * GeminiPulse Automated Google Lighthouse Audit Bot (Desktop & Mobile)
 * Runs official Google Lighthouse audits against https://geminipulse.com (or a provided URL)
 * across both Desktop and Mobile presets, verifying Core Web Vitals (FCP, LCP, TBT, CLS)
 * and Category Scores (Performance, Accessibility, Best Practices, SEO).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const targetUrl = process.argv[2] || 'https://geminipulse.com';
const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chromePath = chromeCandidates.find((p) => fs.existsSync(p));
if (!chromePath) {
  console.error('❌ Google Chrome binary not found. Set CHROME_PATH environment variable.');
  process.exit(1);
}

const presets = [
  { name: 'Desktop', extraArgs: ['--preset=desktop'], outPath: '/tmp/geminipulse-lh-desktop.json', minPerf: 95, minA11y: 95 },
  { name: 'Mobile', extraArgs: [], outPath: '/tmp/geminipulse-lh-mobile.json', minPerf: 90, minA11y: 95 },
];

let failed = false;
console.log(`\n🔬 Running Google Lighthouse Audits on ${targetUrl}...\n`);

for (const preset of presets) {
  execFileSync(
    'npx',
    [
      '-y',
      'lighthouse@latest',
      targetUrl,
      ...preset.extraArgs,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${preset.outPath}`,
      '--chrome-flags=--headless=new --no-sandbox',
      '--quiet',
    ],
    {
      env: { ...process.env, CHROME_PATH: chromePath },
      stdio: 'inherit',
    }
  );

  const report = JSON.parse(fs.readFileSync(preset.outPath, 'utf8'));
  const scores = {
    performance: Math.round((report.categories.performance?.score || 0) * 100),
    accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
    seo: Math.round((report.categories.seo?.score || 0) * 100),
  };

  const vitals = {
    fcp: report.audits['first-contentful-paint']?.displayValue,
    lcp: report.audits['largest-contentful-paint']?.displayValue,
    tbt: report.audits['total-blocking-time']?.displayValue,
    cls: report.audits['cumulative-layout-shift']?.displayValue,
    speedIndex: report.audits['speed-index']?.displayValue,
  };

  console.log(
    `✅ [${preset.name}] Perf: ${scores.performance} | A11y: ${scores.accessibility} | Best Practices: ${scores.bestPractices} | SEO: ${scores.seo}`
  );
  console.log(
    `   Core Web Vitals -> FCP: ${vitals.fcp} | LCP: ${vitals.lcp} | TBT: ${vitals.tbt} | CLS: ${vitals.cls} | SI: ${vitals.speedIndex}\n`
  );

  if (scores.performance < preset.minPerf || scores.accessibility < preset.minA11y || scores.bestPractices < 95 || scores.seo < 95) {
    console.error(`❌ [${preset.name}] Threshold check failed!`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log('🏆 All Google Lighthouse Desktop & Mobile audit thresholds passed!');
