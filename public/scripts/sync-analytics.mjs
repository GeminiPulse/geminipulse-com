#!/usr/bin/env node
/**
 * GeminiPulse.com — Build-Enforced Sitewide GA4 & Model-Provenance Injector (`scripts/sync-analytics.mjs`)
 *
 * Scans `public/index.html` and all static `.html` routes under `public/public/` — strictly skipping:
 *   - Untouched single-shot Arena benchmark artifacts (`public/public/arena/exp-\d+-*.html`) to preserve SHA-256 hashes
 *   - Google Search Console verification stub (`google5049391f94391a64.html`)
 *   - `public/workbench.html` (instrumented via `src/firebase.js` to prevent duplicate `G-1BWMQWZJQ5` `page_view` hits)
 *
 * Idempotently injects `<!-- GP-ANALYTICS-START --> ... <!-- GP-ANALYTICS-END -->` right before `</head>`
 * with accurate `gp:model`, `gp:effort`, `gp:surface`, and `gp:slug` metadata + `/assets/pulse-analytics.js`.
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = resolve(__dirname, '..');
const staticPublicDir = resolve(publicRoot, 'public');
const rootIndexHtml = resolve(publicRoot, 'index.html');

const UNTOUCHED_ARENA_RE = /(?:^|\/)arena\/exp-\d+-[^/]+\.html$/i;
const GSC_VERIFICATION_RE = /(?:^|\/)google[0-9a-f]{10,}\.html$/i;
const EXISTING_BLOCK_RE = /^[ \t]*<!-- GP-ANALYTICS-START -->[\s\S]*?<!-- GP-ANALYTICS-END -->\r?\n?/gm;

function escapeAttr(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function normalizeModelSlug(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const cleaned = raw
    .trim()
    .replace(/\(.*?\)/g, ' ')
    .replace(/^(?:authored\s+by|written\s+by)\s+/i, '')
    .replace(/^google\s+/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!cleaned) return '';
  if (cleaned.includes('gemini-4-carbon')) return 'gemini-4-carbon';
  if (cleaned.includes('gemini-4-neon')) return 'gemini-4-neon';
  if (cleaned.includes('gemini-4-hydrogen')) return 'gemini-4-hydrogen';
  if (cleaned.includes('gemini-4-argon')) return 'gemini-4-argon';
  if (cleaned.includes('gemini-3-8-flash')) return 'gemini-3-8-flash';
  if (cleaned.includes('claude-opus-5-5')) return 'claude-opus-5-5';
  return cleaned;
}

export function normalizeEffort(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const effortMatch = raw.match(/(?:thinking\s+)?effort\s*[:=]\s*([a-z0-9_-]+)/i);
  const candidate = (effortMatch ? effortMatch[1] : raw).trim().toLowerCase();
  if (['low', 'medium', 'high', 'xhigh', 'minimal', 'none'].includes(candidate)) {
    return candidate;
  }
  if (candidate === 'med') return 'medium';
  return '';
}

function inspectHtmlProvenance(html) {
  const ldMatches = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1]);
      const items = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [parsed];
      for (const item of items) {
        const authorName =
          typeof item?.author === 'string'
            ? item.author
            : typeof item?.author?.name === 'string'
              ? item.author.name
              : '';
        if (authorName) {
          const model = normalizeModelSlug(authorName);
          const effort = normalizeEffort(authorName);
          if (model) {
            return { model, effort: effort || 'high' };
          }
        }
      }
    } catch {
      // Ignore non-standard JSON-LD blocks
    }
  }

  const bylineMatch = html.match(
    /WRITTEN FIRST-PERSON BY\s*<strong>([^<]+)<\/strong>(?:\s*\(EFFORT:\s*<strong>([^<]+)<\/strong>\))?/i
  );
  if (bylineMatch) {
    const model = normalizeModelSlug(bylineMatch[1]);
    const effort = normalizeEffort(bylineMatch[2] || bylineMatch[1]) || 'high';
    if (model) return { model, effort };
  }

  return { model: '', effort: '' };
}

function walkHtmlFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkHtmlFiles(full, acc);
    } else if (entry.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc.sort();
}

function buildAnalyticsSnippet(meta, childIndent) {
  return [
    `${childIndent}<!-- GP-ANALYTICS-START -->`,
    `${childIndent}<meta name="gp:model" content="${escapeAttr(meta.model)}" />`,
    `${childIndent}<meta name="gp:effort" content="${escapeAttr(meta.effort)}" />`,
    `${childIndent}<meta name="gp:surface" content="${escapeAttr(meta.surface)}" />`,
    `${childIndent}<meta name="gp:slug" content="${escapeAttr(meta.slug)}" />`,
    `${childIndent}<script src="/assets/pulse-analytics.js" defer></script>`,
    `${childIndent}<!-- GP-ANALYTICS-END -->`,
  ].join('\n');
}

function injectIntoHead(rawHtml, meta) {
  const stripped = rawHtml.replace(EXISTING_BLOCK_RE, '');
  const lineHeadMatch = stripped.match(/^([ \t]*)<\/head>/im);
  if (lineHeadMatch) {
    const headIndent = lineHeadMatch[1] || '';
    const childIndent = `${headIndent}  `;
    const snippet = buildAnalyticsSnippet(meta, childIndent);
    return stripped.replace(/^([ \t]*)<\/head>/im, `${snippet}\n$1</head>`);
  }
  if (/<\/head>/i.test(stripped)) {
    const snippet = buildAnalyticsSnippet(meta, '  ');
    return stripped.replace(/<\/head>/i, `\n${snippet}\n</head>`);
  }
  return null;
}

export async function syncAnalytics() {
  const cacheBust = `?t=${Date.now()}`;
  const essaysMod = await import(
    `${pathToFileURL(resolve(publicRoot, 'src/data/constellationEssays.js')).href}${cacheBust}`
  );
  const ecoMod = await import(
    `${pathToFileURL(resolve(publicRoot, 'src/data/geminiEcosystemData.js')).href}${cacheBust}`
  );

  const essaysObj = essaysMod.CONSTELLATION_ESSAYS || {};
  const essaysBySlug = new Map();
  for (const essay of Object.values(essaysObj)) {
    if (essay?.slug) {
      essaysBySlug.set(essay.slug, essay);
    }
  }

  const feed = ecoMod.PULSE_INTELLIGENCE_FEED || [];
  const leadEssay =
    (feed[0]?.id && essaysObj[feed[0].id]) || Object.values(essaysObj)[0] || null;
  const leadModel = normalizeModelSlug(leadEssay?.authoredByModel) || 'gemini-4-carbon';
  const leadEffort = normalizeEffort(leadEssay?.thinkingEffort) || 'high';

  const candidates = [rootIndexHtml, ...walkHtmlFiles(staticPublicDir)];

  let instrumentedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const filePath of candidates) {
    const isRootIndex = filePath === rootIndexHtml;
    const relFromStatic = isRootIndex
      ? 'index.html'
      : relative(staticPublicDir, filePath).replace(/\\/g, '/');
    const webRoute = isRootIndex ? '/index.html' : `/${relFromStatic}`;

    if (UNTOUCHED_ARENA_RE.test(relFromStatic) || GSC_VERIFICATION_RE.test(relFromStatic)) {
      skippedCount += 1;
      continue;
    }

    const rawHtml = readFileSync(filePath, 'utf8');
    const fileStem = basename(filePath, '.html');
    const detected = inspectHtmlProvenance(rawHtml);

    let model = 'gemini-4-argon';
    let effort = 'high';
    let surface = 'static_page';
    let slug = fileStem;

    if (isRootIndex) {
      model = leadModel;
      effort = leadEffort;
      surface = 'constellation_home';
      slug = 'constellation-home';
    } else if (webRoute === '/prototypes/look-j-3d-celestial-navigator.html') {
      model = leadModel;
      effort = leadEffort;
      surface = 'constellation_home';
      slug = 'look-j-3d-celestial-navigator';
    } else if (webRoute === '/articles/index.html') {
      model = 'gemini-4-argon';
      effort = 'high';
      surface = 'essays_index';
      slug = 'articles-index';
    } else if (webRoute.startsWith('/articles/')) {
      const matchedEssay = essaysBySlug.get(fileStem);
      if (matchedEssay) {
        model = normalizeModelSlug(matchedEssay.authoredByModel) || 'gemini-4-argon';
        effort = normalizeEffort(matchedEssay.thinkingEffort) || 'high';
      } else if (detected.model) {
        model = detected.model;
        effort = detected.effort || 'high';
      }
      surface = 'flagship_essay';
      slug = fileStem;
    } else if (webRoute.startsWith('/arena/')) {
      model = detected.model || 'gemini-4-carbon';
      effort = detected.effort || 'high';
      surface = 'empirical_arena';
      slug = fileStem;
    } else if (webRoute.startsWith('/labs/')) {
      model = detected.model || 'gemini-4-argon';
      effort = detected.effort || 'high';
      surface = 'interactive_lab';
      slug = fileStem;
    } else if (webRoute.startsWith('/series/')) {
      model = detected.model || 'gemini-4-argon';
      effort = detected.effort || 'high';
      if (fileStem === 'open-letter-to-google-deepmind') {
        surface = 'open_letter';
        slug = 'open-letter-to-google-deepmind';
      } else {
        surface = 'release_series';
        slug = relFromStatic.replace(/^series\//, '').replace(/\.html$/i, '');
      }
    } else if (webRoute === '/changelog.html') {
      model = 'gemini-4-argon';
      effort = 'high';
      surface = 'public_changelog';
      slug = 'changelog';
    } else if (webRoute === '/status.html') {
      model = 'gemini-4-argon';
      effort = 'high';
      surface = 'system_status';
      slug = 'status';
    } else if (webRoute === '/partners.html') {
      model = 'gemini-4-argon';
      effort = 'high';
      surface = 'partners_info';
      slug = 'partners';
    } else if (webRoute.startsWith('/brand/')) {
      model = 'gemini-4-argon';
      effort = 'high';
      surface = 'brand_assets';
      slug = fileStem === 'index' ? 'brand' : `brand-${fileStem}`;
    } else if (webRoute.startsWith('/prototypes/')) {
      model = detected.model || 'gemini-4-argon';
      effort = detected.effort || 'high';
      surface = 'prototype_archive';
      slug = fileStem === 'index' ? 'prototypes-index' : fileStem;
    } else if (webRoute.startsWith('/shorts/')) {
      model = detected.model || 'gemini-4-argon';
      effort = detected.effort || 'high';
      surface = 'youtube_short';
      slug = fileStem;
    } else if (detected.model) {
      model = detected.model;
      effort = detected.effort || 'high';
    }

    const nextHtml = injectIntoHead(rawHtml, { model, effort, surface, slug });
    if (!nextHtml) {
      skippedCount += 1;
      continue;
    }

    instrumentedCount += 1;
    if (nextHtml !== rawHtml) {
      writeFileSync(filePath, nextHtml);
      updatedCount += 1;
    }
  }

  console.log(
    `[sync-analytics] ✅ Verified ${instrumentedCount} HTML routes (${updatedCount} updated, ${skippedCount} untouched arena/GSC files skipped).`
  );
  return { instrumentedCount, updatedCount, skippedCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await syncAnalytics();
}
