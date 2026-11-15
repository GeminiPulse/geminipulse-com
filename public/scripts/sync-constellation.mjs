#!/usr/bin/env node
/**
 * GeminiPulse.com — Autonomous 3D Constellation, Dual-Lens Flagship Essay & Sanctuary Sync Engine
 * (`public/scripts/sync-constellation.mjs`)
 *
 * Runs automatically during `npm run prebuild` (via `stamp-build.mjs`) and on demand.
 * Reads:
 *   - `CONSTELLATION_ESSAYS` from `public/src/data/constellationEssays.js`
 *   - `PULSE_INTELLIGENCE_FEED` and `STUDIO_LAB_BLUEPRINTS` from `public/src/data/geminiEcosystemData.js`
 *
 * Deterministically updates:
 *   1. `public/index.html` (8 3D stars, instant HUD briefs, untruncated Dual-Lens Flagship Essay SSR,
 *      `ESSAY_DATA`, Dynamic SEO/GEO Schema.org `TechArticle` + `FAQPage`, and ⌘K Search Palette)
 *   2. `public/public/prototypes/look-j-3d-celestial-navigator.html`
 *   3. `public/public/articles/<slug>.html` + `public/public/articles/index.html` (standalone shareable essays)
 *   4. `public/public/sitemap.xml` & `public/public/feed.xml`
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..');
const staticPublicDir = resolve(publicDir, 'public');
const articlesDir = resolve(staticPublicDir, 'articles');
const indexHtmlPath = resolve(publicDir, 'index.html');
const lookJPrototypePath = resolve(staticPublicDir, 'prototypes/look-j-3d-celestial-navigator.html');
const sitemapPath = resolve(staticPublicDir, 'sitemap.xml');
const feedXmlPath = resolve(staticPublicDir, 'feed.xml');
const dataModulePath = resolve(publicDir, 'src/data/geminiEcosystemData.js');
const essaysModulePath = resolve(publicDir, 'src/data/constellationEssays.js');

const STAR_META = [
  {
    key: 'castor',
    idx: '01',
    twin: 'castor',
    side: 'left',
    greek: 'α',
    starName: 'Castor',
    ariaStar: 'Alpha Castor',
    x: -95,
    y: -178,
    z: -115,
    ly: 51,
    lyDisplay: '51',
    spec: 'BLUE-WHITE SEXTUPLE (A1V)',
    shortSpec: 'A1V',
    astroDepth: '51 Light-Years (6 Stars)',
    pivotYaw: -11,
    pivotPitch: 9,
    haloR: 11,
    reticleR: 15.5,
    coreR: 4.6,
    depthChipX: 15,
    depthChipY: -6,
    pairedPolluxBadge: 'β GEM · K0III · 34 LY',
  },
  {
    key: 'mebsuta',
    idx: '02',
    twin: 'castor',
    side: 'left',
    greek: 'ε',
    starName: 'Mebsuta',
    ariaStar: 'Epsilon Mebsuta',
    x: -162,
    y: -8,
    z: 135,
    ly: 840,
    lyDisplay: '840',
    spec: 'LUMINOUS SUPERGIANT (G8Ib)',
    shortSpec: 'G8IB',
    astroDepth: '840 Light-Years (G8Ib)',
    pivotYaw: -15,
    pivotPitch: 3,
    haloR: 10.5,
    reticleR: 15,
    coreR: 4.2,
    depthChipX: 18,
    depthChipY: -9,
    pairedPolluxBadge: 'δ GEM · F0IV · 60 LY',
  },
  {
    key: 'tejat',
    idx: '03',
    twin: 'castor',
    side: 'left',
    greek: 'μ',
    starName: 'Tejat',
    ariaStar: 'Mu Tejat',
    x: -238,
    y: 78,
    z: 35,
    ly: 230,
    lyDisplay: '230',
    spec: 'RED GIANT (M3III)',
    shortSpec: 'M3III',
    astroDepth: '230 Light-Years (M3III)',
    pivotYaw: -11,
    pivotPitch: -5,
    panX: 62,
    panY: -10,
    haloR: 10.5,
    reticleR: 15,
    coreR: 4.1,
    depthChipX: 18,
    depthChipY: -9,
    pairedPolluxBadge: 'ζ GEM · F7IB · 1,200 LY',
  },
  {
    key: 'propus',
    idx: '04',
    twin: 'castor',
    side: 'left',
    greek: 'η',
    starName: 'Propus',
    ariaStar: 'Eta Propus',
    x: -292,
    y: 152,
    z: 75,
    ly: 350,
    lyDisplay: '350',
    spec: 'TRIPLE SYSTEM & M35',
    shortSpec: 'M35',
    astroDepth: '350 Light-Years (η Gem + M35)',
    pivotYaw: -10,
    pivotPitch: -8,
    panX: 132,
    panY: -24,
    haloR: 10.5,
    reticleR: 15,
    coreR: 4.0,
    depthChipX: 15,
    depthChipY: -6,
    pairedPolluxBadge: 'γ GEM · A1IV · 109 LY',
  },
  {
    key: 'pollux',
    idx: '05',
    twin: 'pollux',
    side: 'right',
    greek: 'β',
    starName: 'Pollux',
    ariaStar: 'Beta Pollux',
    x: 82,
    y: -158,
    z: -155,
    ly: 34,
    lyDisplay: '34',
    spec: 'GOLDEN-ORANGE GIANT (K0III)',
    shortSpec: 'K0III',
    astroDepth: '34 Light-Years (K0III)',
    pivotYaw: 11,
    pivotPitch: 8,
    haloR: 11.5,
    reticleR: 16,
    coreR: 4.8,
    depthChipX: -38,
    depthChipY: -6,
    pairedPolluxBadge: 'β GEM · K0III · 34 LY',
  },
  {
    key: 'wasat',
    idx: '06',
    twin: 'pollux',
    side: 'right',
    greek: 'δ',
    starName: 'Wasat',
    ariaStar: 'Delta Wasat',
    x: 56,
    y: 12,
    z: -85,
    ly: 60,
    lyDisplay: '60',
    spec: 'ECLIPTIC BINARY (F0IV)',
    shortSpec: 'F0IV',
    astroDepth: '60 Light-Years (F0IV)',
    pivotYaw: 12,
    pivotPitch: -2,
    haloR: 10.5,
    reticleR: 15,
    coreR: 4.2,
    depthChipX: -38,
    depthChipY: -6,
    pairedPolluxBadge: 'δ GEM · F0IV · 60 LY',
  },
  {
    key: 'mekbuda',
    idx: '07',
    twin: 'pollux',
    side: 'right',
    greek: 'ζ',
    starName: 'Mekbuda',
    ariaStar: 'Zeta Mekbuda',
    x: 10,
    y: 88,
    z: 175,
    ly: 1200,
    lyDisplay: '1,200',
    spec: 'CEPHEID SUPERGIANT (F7Ib)',
    shortSpec: 'F7IB',
    astroDepth: '1,200 Light-Years (Cepheid)',
    pivotYaw: 12,
    pivotPitch: -6,
    haloR: 10.5,
    reticleR: 15,
    coreR: 4.1,
    depthChipX: -48,
    depthChipY: -6,
    pairedPolluxBadge: 'ζ GEM · F7IB · 1,200 LY',
  },
  {
    key: 'alhena',
    idx: '08',
    twin: 'pollux',
    side: 'right',
    greek: 'γ',
    starName: 'Alhena',
    ariaStar: 'Gamma Alhena',
    x: -72,
    y: 174,
    z: -30,
    ly: 109,
    lyDisplay: '109',
    spec: 'SUBGIANT FOOT (A1IV)',
    shortSpec: 'A1IV',
    astroDepth: '109 Light-Years (A1IV)',
    pivotYaw: 9,
    pivotPitch: -10,
    haloR: 11,
    reticleR: 15.5,
    coreR: 4.5,
    depthChipX: -44,
    depthChipY: -6,
    pairedPolluxBadge: 'γ GEM · A1IV · 109 LY',
  },
];

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(str) {
  return escapeHtml(str).replace(/'/g, '&apos;');
}

function decodeHtmlEntities(str) {
  return String(str || '')
    .replace(/&rarr;/gi, '→')
    .replace(/&larr;/gi, '←')
    .replace(/&bull;/gi, '·')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&times;/gi, '×')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

function stripTags(html) {
  return decodeHtmlEntities(String(html || '').replace(/<[^>]+>/g, ' '))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapGreekLetters(htmlFragment) {
  return String(htmlFragment || '').replace(/([αβγδεζημ])/g, '<span class="greek">$1</span>');
}

/**
 * Safely formats rich editorial strings containing `inline code`, <strong>, <em>,
 * and raw ampersands without introducing unescaped HTML or ellipses.
 */
function formatRichHtml(raw, wrapGreek = true) {
  const input = String(raw || '');
  const parts = input.split(/(`[^`]+`)/g);
  return parts
    .map((segment) => {
      if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
        const inner = decodeHtmlEntities(segment.slice(1, -1));
        return `<code class="essay-inline-code">${escapeHtml(inner)}</code>`;
      }
      // Temporarily protect intentional <strong> and <em> tags
      let safe = segment
        .replace(/<strong>/gi, '\u0001STRONG_OPEN\u0002')
        .replace(/<\/strong>/gi, '\u0001STRONG_CLOSE\u0002')
        .replace(/<em>/gi, '\u0001EM_OPEN\u0002')
        .replace(/<\/em>/gi, '\u0001EM_CLOSE\u0002');
      safe = decodeHtmlEntities(safe);
      safe = escapeHtml(safe);
      if (wrapGreek) {
        safe = wrapGreekLetters(safe);
      }
      return safe
        .replace(/\u0001STRONG_OPEN\u0002/g, '<strong>')
        .replace(/\u0001STRONG_CLOSE\u0002/g, '</strong>')
        .replace(/\u0001EM_OPEN\u0002/g, '<em>')
        .replace(/\u0001EM_CLOSE\u0002/g, '</em>');
    })
    .join('');
}

function truncateWordsNoEllipsis(str, maxLen) {
  const clean = String(str || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const words = clean.split(' ');
  let out = '';
  for (const w of words) {
    const cand = out ? `${out} ${w}` : w;
    if (cand.length > maxLen) break;
    out = cand;
  }
  return (out || clean.slice(0, maxLen)).replace(/[,:;.\-–—&/+]+$/, '').trim();
}

function firstCompleteSentence(str, maxChars = 240) {
  const clean = stripTags(str)
    .replace(/^(Released|Published)\s+[A-Za-z]+\s+\d+(?:–\d+)?,\s+\d{4}(?:\s*\([^)]*\))?\s*:\s*/i, '')
    .trim();
  if (clean.length <= maxChars) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]/g);
  if (sentences && sentences[0] && sentences[0].trim().length <= maxChars) {
    return sentences[0].trim();
  }
  return `${truncateWordsNoEllipsis(clean, maxChars - 1)}.`;
}

function slugifyId(str) {
  return String(str || 'gemini-essay')
    .toLowerCase()
    .replace(/^pulse-/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatReleaseDates(dateStr) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return {
      upperShort: 'NOV 15, 2026',
      titleShort: 'Nov 15, 2026',
      isoDate: '2026-11-15',
      isoFull: '2026-11-15T12:00:00Z',
    };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).formatToParts(parsed);
  const month = parts.find((p) => p.type === 'month')?.value || 'Nov';
  const day = parts.find((p) => p.type === 'day')?.value || '15';
  const year = parts.find((p) => p.type === 'year')?.value || '2026';

  const isoParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);

  return {
    upperShort: `${month.toUpperCase()} ${day}, ${year}`,
    titleShort: `${month} ${day}, ${year}`,
    isoDate: isoParts,
    isoFull: parsed.toISOString(),
  };
}

/**
 * Selects the 8 freshest flagship stories from PULSE_INTELLIGENCE_FEED.
 * Prioritizes:
 *   1. PULSE_INTELLIGENCE_FEED[0] on Star 01 (α Castor)
 *   2. Stories with full authored flagship essays in CONSTELLATION_ESSAYS and major platform/model launches
 *      over minor SDK version tag bumps on the same UTC date.
 */
function selectConstellationStories(feed, essaysMap) {
  const indexed = feed.map((item, idx) => ({
    item,
    idx,
    ts: Number.isNaN(Date.parse(item.date)) ? 0 : Date.parse(item.date),
    hasFlagshipEssay: Boolean(essaysMap[item.id]),
    isMinorSdkBump: /SDK Milestone/i.test(String(item.tag || '')),
    isPart1: String(item.seriesUrl || '').includes('/part-1'),
    impact: parseFloat(String(item.impactScore || '9.5')) || 9.5,
  }));

  const leadEntry = indexed[0];
  const rest = indexed.slice(1).sort((a, b) => {
    const dayDiff = Math.floor(b.ts / 86400000) - Math.floor(a.ts / 86400000);
    if (dayDiff !== 0) return dayDiff;
    if (a.hasFlagshipEssay !== b.hasFlagshipEssay) return a.hasFlagshipEssay ? -1 : 1;
    if (a.isMinorSdkBump !== b.isMinorSdkBump) return a.isMinorSdkBump ? 1 : -1;
    if (Math.abs(b.impact - a.impact) > 0.01) return b.impact - a.impact;
    if (a.isPart1 !== b.isPart1) return a.isPart1 ? -1 : 1;
    return b.ts !== a.ts ? b.ts - a.ts : a.idx - b.idx;
  });

  const ordered = leadEntry ? [leadEntry, ...rest] : rest;
  const chosen = [];
  const usedIds = new Set();
  const usedSeries = new Set();

  for (const entry of ordered) {
    if (chosen.length >= 8) break;
    const seriesKey = entry.item.seriesUrl
      ? dirname(entry.item.seriesUrl)
      : entry.item.sourceUrl || entry.item.id;
    if (chosen.length === 0 || !usedSeries.has(seriesKey)) {
      chosen.push(entry.item);
      usedIds.add(entry.item.id);
      usedSeries.add(seriesKey);
    }
  }

  for (const entry of ordered) {
    if (chosen.length >= 8) break;
    if (!usedIds.has(entry.item.id)) {
      chosen.push(entry.item);
      usedIds.add(entry.item.id);
    }
  }

  return chosen.slice(0, 8);
}

function deriveShortStarLabel(item, essay) {
  if (essay?.shortStarLabel && essay.shortStarLabel.length <= 19) {
    return essay.shortStarLabel;
  }
  const badge = String(item.modelBadge || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/@google\/genai\s*&\s*google-genai/i, 'Gen AI SDK')
    .replace(/@google\/genai/i, 'Gen AI SDK')
    .replace(/google-genai/i, 'Python SDK')
    .trim();

  const badgeParts = badge
    .split(/\s*(?:\s+\/\s+|&|\+)\s*/)
    .map((s) =>
      s
        .replace(/^Google\s+(?:DeepMind|Cloud|Research)\s+/i, '')
        .replace(/^Google\s+(?!Wallet|Maps|Docs|Sheets)/i, '')
        .trim()
    )
    .filter(Boolean);

  if (badgeParts[0] && /^Antigravity\s+\/teamwork$/i.test(badgeParts[0])) {
    return 'Teamwork Agents';
  }
  if (badgeParts.length >= 2) {
    const combined = `${badgeParts[0]} ${badgeParts[1]}`
      .replace(/Cloud Credits/i, 'Credits')
      .replace(/Personal Intelligence/i, 'AI')
      .replace(/Generative UI Protocol/i, 'Gen UI')
      .replace(/Gemini Live/i, 'Live')
      .trim();
    if (combined.length <= 19) return combined;
  }
  if (badgeParts[0]) {
    const primary = badgeParts[0]
      .replace(/^Gemini Decision 1$/i, 'Decisions API')
      .replace(/^Gemini in AI Studio$/i, 'Maps in AI Studio');
    if (primary.length >= 8 && primary.length <= 19) return primary;
    if (primary.length > 19) {
      const trimmed = truncateWordsNoEllipsis(primary, 19);
      if (trimmed.length >= 8) return trimmed;
    }
  }
  const mainClause = String(item.title || '')
    .split(':')[0]
    .replace(/^Google(\s+DeepMind|\s+Cloud|\s+Research)?\s+(Launches|Unveils|Integrates|Releases|Announces|Publishes|Donates|Embeds|Opens)\s+/i, '')
    .trim();
  return truncateWordsNoEllipsis(mainClause, 19) || 'Gemini Update';
}

function parseSeriesPartsFromDisk(seriesUrl) {
  if (!seriesUrl || !seriesUrl.startsWith('/series/')) return null;
  const relFile = seriesUrl.replace(/^\//, '');
  const fullPart1 = resolve(staticPublicDir, relFile);
  const seriesFolder = dirname(fullPart1);
  if (!existsSync(seriesFolder)) return null;

  const files = readdirSync(seriesFolder).filter((f) => f.endsWith('.html')).sort();
  const findPart = (prefix) => {
    const match = files.find((f) => f.startsWith(prefix));
    return match ? readFileSync(join(seriesFolder, match), 'utf8') : null;
  };

  const parsePartHtml = (html) => {
    if (!html) return null;
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const boxMatch = html.match(/<div class="box[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => stripTags(m[1]).replace(/\.\.\.|…/g, ''))
      .filter((t) => t.length > 55 && !t.startsWith('←') && !t.startsWith('Below is'));
    const codeMatch =
      html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i) ||
      html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);

    return {
      title: h1Match ? stripTags(h1Match[1]).replace(/^Part\s+\d+\s*:\s*/i, '') : '',
      box: boxMatch
        ? stripTags(boxMatch[1]).replace(/^(Executive Summary|Strategic Takeaway|Hands-On Objective|Key Takeaway)\s*:\s*/i, '')
        : '',
      paragraphs: pMatches,
      code: codeMatch ? decodeHtmlEntities(codeMatch[1]).replace(/\.\.\.|…/g, '').trim() : '',
    };
  };

  return {
    part1: parsePartHtml(findPart('part-1')),
    part2: parsePartHtml(findPart('part-2')),
    part3: parsePartHtml(findPart('part-3')),
  };
}

/**
 * Zero-ellipsis fallback synthesizer if a future feed item does not yet have a dedicated
 * entry in CONSTELLATION_ESSAYS. Never truncates sentences or code blocks.
 */
function synthesizeFallbackEssay(item, dates, shortLabel, bp, seriesParts) {
  const p1 = seriesParts?.part1;
  const p2 = seriesParts?.part2;
  const p3 = seriesParts?.part3;
  const cleanTldr = stripTags(item.tldr)
    .replace(/^(Released|Published)\s+[A-Za-z]+\s+\d+(?:–\d+)?,\s+\d{4}(?:\s*\([^)]*\))?\s*:\s*/i, '')
    .replace(/\.\.\.|…/g, '')
    .trim();
  const cleanSummary = stripTags(item.summary).replace(/\.\.\.|…/g, '').trim();

  const mainTitle = String(item.title || shortLabel).split(':')[0].trim();
  const subTitle = String(item.title || '').split(':').slice(1).join(':').trim();

  return {
    id: item.id,
    slug: slugifyId(item.id),
    shortStarLabel: shortLabel,
    readMinutes: '6 MIN READ',
    hudTitle: mainTitle,
    hudSummary: firstCompleteSentence(cleanTldr, 165),
    peekCastor: `${shortLabel}: <em>What changed & why it matters.</em>`,
    peekPollux: `${shortLabel}: <em>Architecture & SDK blueprint.</em>`,
    headline: subTitle ? `${mainTitle}: <em>${subTitle}.</em>` : `${mainTitle}.`,
    standfirst: cleanTldr,
    pulseCheck: [
      { stage: 'What Shipped', detail: cleanTldr },
      { stage: 'Why Humans Care', detail: p2?.box || cleanSummary },
      {
        stage: 'Verification Scope',
        detail: `Grounded directly against ${item.sourceLabel || 'official Google primary documentation'} (${dates.titleShort}).`,
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · HUMAN, FOUNDER & BUSINESS LENS',
      title: p1?.title || mainTitle,
      subtitle: p2?.title || `Why ${shortLabel} changes day-to-day workflows for teams and builders.`,
      paragraphs:
        p1?.paragraphs?.length >= 2
          ? [...p1.paragraphs.slice(0, 2), ...(p2?.paragraphs?.slice(0, 2) || [])]
          : [cleanSummary],
      pullquote: {
        quote: firstCompleteSentence(p2?.box || cleanTldr, 220),
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR PRODUCT & STRATEGY TEAMS',
          question: `What is the immediate practical impact of ${shortLabel}?`,
          answer: p2?.paragraphs?.[0] || cleanTldr,
        },
        {
          lensTag: 'FOR ENGINEERING LEADERS',
          question: `How does ${shortLabel} fit into an existing Google GenAI stack?`,
          answer: p3?.box || cleanSummary,
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · ARCHITECTURE & SDK BLUEPRINT',
      title: p3?.title || `Production Implementation Blueprint for ${shortLabel}`,
      subtitle: p3?.box || `Verified runtime patterns and SDK configuration for ${shortLabel}.`,
      paragraphs: p3?.paragraphs?.length ? p3.paragraphs.slice(0, 3) : [cleanSummary],
      builderRules: [
        {
          label: '01 · Pin Stable @google/genai v3.x',
          detail: 'Use official v1 stable endpoints and inspect usageMetadata on every call.',
        },
        {
          label: '02 · Verify Against Primary Source',
          detail: `Cross-check model IDs and regional availability in ${item.sourceLabel || 'Google documentation'}.`,
        },
      ],
      codeCaption: `COMPLETE ${shortLabel.toUpperCase()} @GOOGLE/GENAI BLUEPRINT`,
      codeSnippet:
        bp?.tsCode ||
        p3?.code ||
        `import { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI();\nconst interaction = await ai.interactions.create({\n  model: "gemini-4-hydrogen",\n  input: "Summarize verified architecture and production guardrails.",\n  tools: [{ type: "google_search" }],\n});\nconsole.log(interaction.output_text);`,
      workbench: {
        title: `${shortLabel} Scenario Workbench`,
        subtitle: 'Interactive telemetry & SDK verification.',
        dek: bp?.description || `Inspect verified telemetry and launch the companion interactive sandbox for ${shortLabel}.`,
        presets: [
          {
            label: '1. RELEASE SPEC',
            k1: 'Model / Surface',
            v1: truncateWordsNoEllipsis(item.modelBadge || shortLabel, 28),
            k2: 'Release Date',
            v2: dates.titleShort,
            k3: 'Impact Rating',
            v3: item.impactScore || '9.8 / 10',
          },
          {
            label: '2. RUNTIME',
            k1: 'SDK Layer',
            v1: '@google/genai v3.3.0',
            k2: 'Grounding',
            v2: 'Primary Google Citation',
            k3: 'Demo Mode',
            v3: 'Interactive Lab Ready',
          },
          {
            label: '3. DEPLOYMENT',
            k1: 'Target',
            v1: 'AI Studio & Vertex AI',
            k2: 'Governance',
            v2: 'Zero-Hallucination Audit',
            k3: 'Series',
            v3: 'Full Essay + 3-Part Archive',
          },
        ],
      },
    },
    verdict: {
      title: `Gemini’s Verdict on ${shortLabel}`,
      subtitle: `Grounded synthesis verified on ${dates.titleShort}.`,
      paragraphs: [cleanTldr],
      sources: [
        {
          role: 'Official Google Primary Source',
          label: item.sourceLabel || mainTitle,
          author: 'Google',
          date: dates.titleShort,
          url: item.sourceUrl,
        },
      ],
    },
  };
}

function escapeCssSingleQuote(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

const SANCTUARY_DIVIDER_HTML = `<div class="celestial-chapter-divider" aria-hidden="true"><span class="ccd-glyph">✦ · <svg width="11" height="12" viewBox="0 0 14 16" aria-hidden="true" style="vertical-align:-1px;margin-inline:2px;"><path d="M1.5 2 H12.5 M1.5 14 H12.5" stroke="#CEC0FF" stroke-width="1.35" stroke-linecap="round"/><line x1="4.6" y1="2.3" x2="4.6" y2="13.7" stroke="#7EB8FF" stroke-width="1.55" stroke-linecap="round"/><line x1="9.4" y1="2.3" x2="9.4" y2="13.7" stroke="#F59E3F" stroke-width="1.55" stroke-linecap="round"/></svg> · ✦</span></div>`;

/**
 * Renders the inner HTML of `#sanctuary-essay-root` (shared identically between
 * `public/index.html` SSR, client-side `buildSanctuaryEssayInner`, and `/articles/<slug>.html`).
 */
function renderSanctuaryEssayInnerHtml(e, options = { standalone: false }) {
  const isStandalone = Boolean(options.standalone);

  const pulseRowsHtml = (e.pulseCheck || [])
    .map(
      (row) => `
              <div class="pcl-row">
                <div class="pcl-stage">${row.stageHtml}</div>
                <div class="pcl-detail">${row.detailHtml}</div>
              </div>`
    )
    .join('');

  const castorParasHtml = (e.castor.paragraphsHtml || []).map((p) => `<p>${p}</p>`).join('');

  const pullquoteHtml = e.castor.pullquote
    ? `
              <blockquote class="celestial-pullquote">
                <p>“${e.castor.pullquote.quoteHtml}”</p>
                <cite>${e.castor.pullquote.attributionHtml}</cite>
              </blockquote>`
    : '';

  let tableHtml = '';
  if (e.castor.table && Array.isArray(e.castor.table.rowsHtml)) {
    const t = e.castor.table;
    const headCells = t.columnsHtml.map((col) => `<th scope="col">${col}</th>`).join('');
    const bodyRows = t.rowsHtml
      .map((r) => {
        const cells = r
          .map((cell, idx) => (idx === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`))
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');
    tableHtml = `
              <div tabindex="0" role="region" aria-labelledby="${t.id}-caption" class="gp-table-wrapper">
                <table class="gp-comparison-table" style="${t.colVarsAttr}">
                  <caption id="${t.id}-caption">${t.captionHtml}</caption>
                  <thead><tr>${headCells}</tr></thead>
                  <tbody>${bodyRows}</tbody>
                </table>
              </div>`;
  }

  const qaItemsHtml = (e.castor.adaptiveQuestions || [])
    .map(
      (q) => `
                <article class="qa-item">
                  <span class="qa-lens-tag">${q.lensTagHtml}</span>
                  <h3 class="qa-question">${q.questionHtml}</h3>
                  <p class="qa-answer">${q.answerHtml}</p>
                </article>`
    )
    .join('');

  const seriesCompanionHtml = e.seriesUrl
    ? `
                <div class="standalone-deep-link-row">
                  <span class="sdl-kicker">COMPANION 3-PART ARCHIVE</span>
                  <a href="${e.seriesUrl}" class="standalone-deep-link">
                    <span>${e.seriesLabelHtml}</span>
                  </a>
                </div>`
    : '';

  const polluxParasHtml = (e.pollux.paragraphsHtml || []).map((p) => `<p>${p}</p>`).join('');

  const builderRulesHtml = (e.pollux.builderRules || [])
    .map(
      (r) => `
                <div class="br-item">
                  <div class="br-label">${r.labelHtml}</div>
                  <div class="br-detail">${r.detailHtml}</div>
                </div>`
    )
    .join('');

  const wb = e.pollux.workbench;
  const p0 = wb.presets[0];
  const presetBtnsHtml = wb.presets
    .map(
      (pr, pIdx) =>
        `<button type="button" class="ac-preset-btn" data-preset="${pIdx}" aria-pressed="${pIdx === 0 ? 'true' : 'false'}">${pr.labelHtml}</button>`
    )
    .join('');

  const verdictParasHtml = (e.verdict.paragraphsHtml || []).map((p) => `<p>${p}</p>`).join('');

  const sourcesHtml = (e.verdict.sources || [])
    .map(
      (src) => `
                <div class="psl-item">
                  <div class="psl-meta">
                    <span class="psl-role">${src.roleHtml}${src.authorHtml ? ` · ${src.authorHtml}` : ''} · ${src.dateHtml}</span>
                    <span class="psl-label">${src.labelHtml}</span>
                  </div>
                  <a class="psl-link" href="${src.urlAttr}" target="_blank" rel="noopener noreferrer">
                    <span>Primary Google Source</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>`
    )
    .join('');

  const navFooterHtml = isStandalone
    ? `
            <nav class="essay-star-nav-footer" aria-label="Navigate Constellation Essays">
              <a href="${e.prevPermalinkUrl}" class="essay-nav-btn">
                <span>← ${e.prevStarLabelHtml}</span>
              </a>
              <a href="/?star=${e.starKey}" class="essay-nav-btn">
                <span>✦ View Star ${e.starIdx} in 3D Sky</span>
              </a>
              <a href="${e.nextPermalinkUrl}" class="essay-nav-btn">
                <span>${e.nextStarLabelHtml} →</span>
              </a>
            </nav>`
    : `
            <nav class="essay-star-nav-footer" aria-label="Navigate Constellation Essays">
              <button type="button" class="essay-nav-btn" data-essay-nav-star="${e.prevStarKey}">
                <span>← ${e.prevStarLabelHtml}</span>
              </button>
              <a href="${e.permalinkUrl}" class="essay-nav-btn">
                <span>Shareable Permalink (${e.permalinkUrl}) ↗</span>
              </a>
              <button type="button" class="essay-nav-btn" data-essay-nav-star="${e.nextStarKey}">
                <span>${e.nextStarLabelHtml} →</span>
              </button>
            </nav>`;

  return `          <header class="essay-hero-block" id="chapter-01" data-chapter-card="0" data-active-chapter="true">
            <div class="essay-coord">
              <span>✦ STAR ${e.starIdx} / 08 · <span class="greek">${e.greek}</span> ${e.starNameUpper} · ${e.lyDisplay} LIGHT-YEARS</span>
              <span>ORIGINAL GEMINI ESSAY · ${e.dateUpper} · ${e.readMinutes}</span>
            </div>
            <h1 class="essay-h1" id="essay-main-title" tabindex="-1" itemprop="headline">${e.headlineHtml}</h1>
            <p class="essay-standfirst">${e.standfirstHtml}</p>
            <div class="essay-byline-bar">
              <span>WRITTEN FIRST-PERSON BY <strong>GOOGLE GEMINI 4 ARGON</strong> · EDITORIAL DIRECTION BY <strong>NEIL S. WHITE</strong></span>
              <span>DUAL-LENS (<span class="greek">α</span> CASTOR + <span class="greek">β</span> POLLUX) · SEARCH-GROUNDED</span>
            </div>
            <div class="essay-lens-toolbar" role="region" aria-label="Essay Perspective Filter">
              <span class="essay-lens-label">Reading Lens (⌘F Searches Both):</span>
              <div class="essay-lens-group" role="group" aria-label="Choose Essay Lens">
                <button type="button" class="essay-lens-btn" data-lens-filter="both" aria-pressed="true">✦ Complete Dual-Lens Essay</button>
                <button type="button" class="essay-lens-btn" data-lens-filter="castor" aria-pressed="false"><span class="greek">α</span> Castor · Human &amp; Business</button>
                <button type="button" class="essay-lens-btn" data-lens-filter="pollux" aria-pressed="false"><span class="greek">β</span> Pollux · Builder &amp; Code</button>
              </div>
            </div>
            <div class="pulse-check-ledger" aria-label="30-Second Executive Pulse Check">
              <div class="pcl-header">
                <span>✦ 30-SECOND PULSE CHECK · BEFORE YOU DIVE IN</span>
                <span>ZERO TRUNCATION · FULL ESSAY BELOW</span>
              </div>
${pulseRowsHtml}
            </div>
          </header>

          <div class="lens-host" id="lens-section-castor">
            <div class="lens-inner-wrap">
              ${SANCTUARY_DIVIDER_HTML}
              <section class="essay-section" aria-label="Part I: Alpha Castor Human and Business Lens">
                <div class="chapter-kicker">
                  <span>${e.castor.kickerHtml}</span>
                  <span><span class="greek">α</span> CASTOR · THE SIGNAL</span>
                </div>
                <h2 class="essay-h2">${e.castor.titleHtml}</h2>
                <p class="essay-sub">${e.castor.subtitleHtml}</p>
                <div class="essay-prose" itemprop="articleBody">
                  ${castorParasHtml}
                </div>
${pullquoteHtml}
${tableHtml}

                <div class="adaptive-qa-section" id="chapter-02" data-chapter-card="1" data-active-chapter="false">
                  <div class="chapter-kicker">
                    <span>CHAPTER 02 / 04 · WHAT THIS MEANS FOR YOU</span>
                    <span>ADAPTIVE READER QUESTIONS</span>
                  </div>
                  <div class="adaptive-qa-list">
${qaItemsHtml}
                  </div>
${seriesCompanionHtml}
                </div>
              </section>
            </div>
          </div>

          <div class="lens-host" id="lens-section-pollux">
            <div class="lens-inner-wrap">
              ${SANCTUARY_DIVIDER_HTML}
              <section class="essay-section" id="chapter-03" data-chapter-card="2" data-active-chapter="false" aria-label="Part II: Beta Pollux Builder Architecture and Code">
                <div class="chapter-kicker">
                  <span>${e.pollux.kickerHtml}</span>
                  <span><span class="greek">β</span> POLLUX · THE WORKBENCH</span>
                </div>
                <h2 class="essay-h2" id="pollux-section-heading" tabindex="-1">${e.pollux.titleHtml}</h2>
                <p class="essay-sub essay-sub--pollux">${e.pollux.subtitleHtml}</p>
                <div class="essay-prose essay-prose--pollux">
                  ${polluxParasHtml}
                </div>
                <div class="builder-rules-ledger" aria-label="Production Engineering Guardrails">
${builderRulesHtml}
                </div>
                <div class="geo-code-wrap">
                  <div class="geo-code-header">
                    <span id="chap3-code-caption">${e.pollux.codeCaptionHtml}</span>
                    <button type="button" class="copy-code-btn" data-copy-essay-code>Copy Full Blueprint</button>
                  </div>
                  <pre class="geo-code-block" id="chap3-code" role="region" aria-labelledby="chap3-code-caption" tabindex="0"><code id="chap3-code-inner">${e.pollux.codeSnippetEscaped}</code></pre>
                </div>

                <aside class="pollux-workbench-card" id="nocturnal-twin-deck" aria-label="Beta Pollux Interactive Scenario Simulator">
                  <div class="salon-header-row">
                    <span class="shr-title">
                      <span class="peek-dot" aria-hidden="true"></span>
                      <span><span class="greek">β</span> POLLUX · INTERACTIVE SCENARIO WORKBENCH</span>
                    </span>
                    <span class="shr-badge">[SIMULATED DEMO]</span>
                  </div>
                  <h3 class="pwc-title">${wb.titleHtml}</h3>
                  <p class="pwc-sub">${wb.dekHtml}</p>
                  <div class="atelier-console">
                    <div class="ac-top">
                      <span>STAR ${e.starIdx} INTERACTIVE LAB</span>
                      <span>[SIMULATED DEMO]</span>
                    </div>
                    <div class="ac-presets" role="group" aria-label="Interactive Workload Presets">
                      ${presetBtnsHtml}
                    </div>
                    <div class="ac-output" aria-live="polite">
                      <div class="ac-line">
                        <span class="ac-k" data-sync="ac-k1">${p0.k1Html}</span>
                        <span class="ac-v" data-sync="ac-v1">${p0.v1Html}</span>
                      </div>
                      <div class="ac-line">
                        <span class="ac-k" data-sync="ac-k2">${p0.k2Html}</span>
                        <span class="ac-v accent" data-sync="ac-v2">${p0.v2Html}</span>
                      </div>
                      <div class="ac-line">
                        <span class="ac-k" data-sync="ac-k3">${p0.k3Html}</span>
                        <span class="ac-v" data-sync="ac-v3">${p0.v3Html}</span>
                      </div>
                    </div>
                  </div>
                  <div class="standalone-deep-link-row" style="margin-block-start:4px;">
                    <span class="sdl-kicker sdl-kicker--pollux">DEDICATED FULL-SCREEN SANDBOX</span>
                    <a href="${e.labUrl}" class="standalone-deep-link standalone-deep-link--pollux">
                      <span>${e.labLabelHtml}</span>
                    </a>
                  </div>
                </aside>
              </section>
            </div>
          </div>

          ${SANCTUARY_DIVIDER_HTML}

          <section class="essay-section" id="chapter-04" data-chapter-card="3" data-active-chapter="false" aria-label="Chapter 04: Gemini Verdict and Primary Sources">
            <div class="chapter-kicker">
              <span>CHAPTER 04 / 04 · GEMINI’S VERDICT &amp; CITATIONS</span>
              <span>PRIMARY GOOGLE SOURCES</span>
            </div>
            <h2 class="essay-h2">${e.verdict.titleHtml}</h2>
            <p class="essay-sub">${e.verdict.subtitleHtml}</p>
            <div class="essay-prose">
              ${verdictParasHtml}
            </div>

            <div class="primary-sources-ledger" aria-label="Primary Google Sources Cited">
              <div class="psl-header">
                <span>PRIMARY GOOGLE SOURCES CITED IN THIS ESSAY</span>
                <span>VERIFIED · ${e.dateUpper}</span>
              </div>
${sourcesHtml}
            </div>
${navFooterHtml}
          </section>`;
}

function buildStarObjects(stories, blueprints, essaysMap) {
  const blueprintByHref = new Map();
  for (const bp of blueprints) {
    if (bp.href) blueprintByHref.set(bp.href, bp);
  }

  // First pass: resolve raw essay + metadata for all 8 stars
  const prelim = STAR_META.map((meta, index) => {
    const item = stories[index];
    const dates = formatReleaseDates(item.date);
    const bp = item.labUrl ? blueprintByHref.get(item.labUrl) : null;
    const seriesParts = parseSeriesPartsFromDisk(item.seriesUrl);
    const rawEssay =
      essaysMap[item.id] || synthesizeFallbackEssay(item, dates, deriveShortStarLabel(item, null), bp, seriesParts);
    const shortLabel = deriveShortStarLabel(item, rawEssay);
    return { meta, item, dates, bp, rawEssay, shortLabel };
  });

  return prelim.map((entry, index) => {
    const { meta, item, dates, rawEssay, shortLabel } = entry;
    const prevEntry = prelim[(index - 1 + prelim.length) % prelim.length];
    const nextEntry = prelim[(index + 1) % prelim.length];

    const prefixText = `${meta.greek} ${meta.starName.toUpperCase()}  `;
    const pillW = Math.max(184, Math.min(226, Math.round(prefixText.length * 5.6 + shortLabel.length * 6.85 + 26)));

    const readMinutes = rawEssay.readMinutes || '7 MIN READ';
    const readMinNumMatch = readMinutes.match(/(\d+)/);
    const readMinShort = `${readMinNumMatch ? readMinNumMatch[1] : '7'} Min`;

    const permalinkUrl = `/articles/${rawEssay.slug}.html`;
    const prevPermalinkUrl = `/articles/${prevEntry.rawEssay.slug}.html`;
    const nextPermalinkUrl = `/articles/${nextEntry.rawEssay.slug}.html`;

    const seriesUrl = item.seriesUrl || '';
    const seriesLabel = `Explore Companion 3-Part ${shortLabel} Archive →`;
    const labUrl = item.labUrl || '/workbench.html';
    const labLabel = `Open Full ${shortLabel} Sandbox [SIMULATED DEMO] →`;

    // Format table if present
    let formattedTable = null;
    if (rawEssay.castor?.comparisonTable) {
      const ct = rawEssay.castor.comparisonTable;
      const c2 = escapeCssSingleQuote(ct.columns[1] || '');
      const c3 = escapeCssSingleQuote(ct.columns[2] || '');
      const c4 = escapeCssSingleQuote(ct.columns[3] || '');
      const rawStyle = `--col-2: '${c2}'; --col-3: '${c3}'; --col-4: '${c4}';`;
      formattedTable = {
        id: ct.id || `${meta.key}-comparison-table`,
        captionHtml: formatRichHtml(ct.caption),
        columnsHtml: ct.columns.map((c) => formatRichHtml(c)),
        rowsHtml: ct.rows.map((row) => row.map((cell) => formatRichHtml(cell))),
        colVarsAttr: escapeHtml(rawStyle),
      };
    }

    const presets = (rawEssay.pollux.workbench.presets || []).map((pr) => ({
      label: stripTags(pr.label),
      labelHtml: escapeHtml(stripTags(pr.label)),
      k1: stripTags(pr.k1),
      k1Html: escapeHtml(stripTags(pr.k1)),
      v1: stripTags(pr.v1),
      v1Html: escapeHtml(stripTags(pr.v1)),
      k2: stripTags(pr.k2),
      k2Html: escapeHtml(stripTags(pr.k2)),
      v2: stripTags(pr.v2),
      v2Html: escapeHtml(stripTags(pr.v2)),
      k3: stripTags(pr.k3),
      k3Html: escapeHtml(stripTags(pr.k3)),
      v3: stripTags(pr.v3),
      v3Html: escapeHtml(stripTags(pr.v3)),
    }));

    const essayDataObj = {
      starKey: meta.key,
      starIdx: meta.idx,
      greek: meta.greek,
      starName: meta.starName,
      starNameUpper: meta.starName.toUpperCase(),
      lyDisplay: meta.lyDisplay,
      spec: meta.spec,
      slug: rawEssay.slug,
      shortStarLabel: shortLabel,
      permalinkUrl,
      prevStarKey: prevEntry.meta.key,
      prevPermalinkUrl,
      prevStarLabelHtml: formatRichHtml(
        `Star ${prevEntry.meta.idx} · ${prevEntry.meta.greek} ${prevEntry.meta.starName} (${prevEntry.shortLabel})`
      ),
      nextStarKey: nextEntry.meta.key,
      nextPermalinkUrl,
      nextStarLabelHtml: formatRichHtml(
        `Star ${nextEntry.meta.idx} · ${nextEntry.meta.greek} ${nextEntry.meta.starName} (${nextEntry.shortLabel})`
      ),
      dateUpper: dates.upperShort,
      dateTitle: dates.titleShort,
      isoDate: dates.isoDate,
      isoFull: dates.isoFull,
      readMinutes,
      readMinShort,
      plainHeadline: stripTags(rawEssay.headline),
      plainStandfirst: stripTags(rawEssay.standfirst),
      headlineHtml: formatRichHtml(rawEssay.headline),
      standfirstHtml: formatRichHtml(rawEssay.standfirst),
      pulseCheck: (rawEssay.pulseCheck || []).map((row) => ({
        stageHtml: formatRichHtml(row.stage),
        detailHtml: formatRichHtml(row.detail),
      })),
      castor: {
        kickerHtml: formatRichHtml(rawEssay.castor.kicker),
        titleHtml: formatRichHtml(rawEssay.castor.title),
        subtitleHtml: formatRichHtml(rawEssay.castor.subtitle),
        paragraphsHtml: (rawEssay.castor.paragraphs || []).map((p) => formatRichHtml(p)),
        pullquote: rawEssay.castor.pullquote
          ? {
              quoteHtml: formatRichHtml(rawEssay.castor.pullquote.quote),
              attributionHtml: formatRichHtml(rawEssay.castor.pullquote.attribution),
            }
          : null,
        table: formattedTable,
        adaptiveQuestions: (rawEssay.castor.adaptiveQuestions || []).map((q) => ({
          lensTagHtml: formatRichHtml(q.lensTag),
          questionHtml: formatRichHtml(q.question),
          answerHtml: formatRichHtml(q.answer),
        })),
      },
      pollux: {
        kickerHtml: formatRichHtml(rawEssay.pollux.kicker),
        titleHtml: formatRichHtml(rawEssay.pollux.title),
        subtitleHtml: formatRichHtml(rawEssay.pollux.subtitle),
        paragraphsHtml: (rawEssay.pollux.paragraphs || []).map((p) => formatRichHtml(p)),
        builderRules: (rawEssay.pollux.builderRules || []).map((r) => ({
          labelHtml: formatRichHtml(r.label),
          detailHtml: formatRichHtml(r.detail),
        })),
        codeCaptionHtml: formatRichHtml(rawEssay.pollux.codeCaption),
        codeSnippetEscaped: escapeHtml(rawEssay.pollux.codeSnippet),
        workbench: {
          titleHtml: formatRichHtml(rawEssay.pollux.workbench.title),
          dekHtml: formatRichHtml(rawEssay.pollux.workbench.dek),
          presets,
        },
      },
      verdict: {
        titleHtml: formatRichHtml(rawEssay.verdict.title),
        subtitleHtml: formatRichHtml(rawEssay.verdict.subtitle),
        paragraphsHtml: (rawEssay.verdict.paragraphs || []).map((p) => formatRichHtml(p)),
        sources: (rawEssay.verdict.sources || []).map((s) => ({
          roleHtml: formatRichHtml(s.role),
          labelHtml: formatRichHtml(s.label),
          authorHtml: s.author ? formatRichHtml(s.author) : '',
          dateHtml: escapeHtml(s.date || dates.titleShort),
          urlAttr: escapeHtml(s.url || item.sourceUrl),
        })),
      },
      faqPlain: (rawEssay.castor.adaptiveQuestions || []).map((q) => ({
        question: stripTags(q.question),
        answer: stripTags(q.answer),
      })),
      primarySourceUrls: (rawEssay.verdict.sources || []).map((s) => s.url).filter(Boolean),
      seriesUrl: escapeHtml(seriesUrl),
      seriesLabelHtml: escapeHtml(seriesLabel),
      labUrl: escapeHtml(labUrl),
      labLabelHtml: escapeHtml(labLabel),
    };

    const catTag = String(item.category || 'GEMINI')
      .toUpperCase()
      .replace(/DEVELOPER TOOLS & STUDIO/i, 'AI STUDIO')
      .replace(/AGENTS & ANTIGRAVITY/i, 'ANTIGRAVITY')
      .replace(/PERSONAL INTELLIGENCE/i, 'PERSONAL AI')
      .slice(0, 18);

    const hudTitle = stripTags(rawEssay.hudTitle || rawEssay.headline);
    const hudSummary = stripTags(rawEssay.hudSummary || rawEssay.standfirst);
    const peekCastor = formatRichHtml(rawEssay.peekCastor || `${shortLabel}: <em>Read Gemini’s essay.</em>`);
    const peekPollux = formatRichHtml(rawEssay.peekPollux || `${shortLabel}: <em>Builder & SDK code.</em>`);

    const qaSummary = (rawEssay.castor.adaptiveQuestions || [])
      .map((q) => stripTags(q.question))
      .join(' · ');

    return {
      meta,
      item,
      dates,
      shortLabel,
      pillW,
      essay: essayDataObj,
      geom:
        meta.side === 'left'
          ? { x1: -(pillW + 22), x2: 20, y1: -18, y2: 18 }
          : { x1: -20, x2: pillW + 22, y1: -18, y2: 18 },
      star3d: {
        idx: meta.idx,
        name: `${meta.greek} ${meta.starName} · ${shortLabel}`,
        x: meta.x,
        y: meta.y,
        z: meta.z,
        ly: meta.ly,
        spec: meta.spec,
        pivotYaw: meta.pivotYaw,
        pivotPitch: meta.pivotPitch,
        ...(typeof meta.panX === 'number' ? { panX: meta.panX, panY: meta.panY } : {}),
      },
      salon: {
        castorBadge: `${meta.greek} GEM · ${meta.shortSpec} · ${meta.lyDisplay} LY`,
        castorMain: stripTags(rawEssay.castor.title),
        castorItalic: stripTags(rawEssay.castor.subtitle),
        castorDek: formatRichHtml(rawEssay.standfirst),
        specCode: `STAR ${meta.idx} · ${meta.greek} ${meta.starName.toUpperCase()}`,
        k1: 'Model / Platform',
        v1: shortLabel,
        k2: 'Verified Release',
        v2: `${dates.titleShort} · ${item.impactScore || '10/10'}`,
        k3: 'Astrophysical Depth',
        v3: meta.astroDepth,
        sourceUrl: item.sourceUrl,
        polluxBadge: meta.pairedPolluxBadge,
        polluxMain: stripTags(rawEssay.pollux.workbench.title),
        polluxItalic: stripTags(rawEssay.pollux.workbench.subtitle || 'Interactive simulation & SDK blueprint.'),
        polluxDek: formatRichHtml(rawEssay.pollux.workbench.dek),
        consoleKicker: `STAR ${meta.idx} INTERACTIVE LAB`,
        presets,
      },
      hud: {
        twin: meta.twin,
        tags: [catTag, 'GEMINI ESSAY'],
        dateRead: `${dates.upperShort} · ⏱ ${readMinutes}`,
        isoDate: dates.isoDate,
        shortStarLabel: shortLabel,
        readMinShort,
        plainHeadline: essayDataObj.plainHeadline,
        plainStandfirst: essayDataObj.plainStandfirst,
        faqPlain: essayDataObj.faqPlain,
        primarySourceUrls: essayDataObj.primarySourceUrls,
        ctaLabel: `↑ Read Gemini’s Essay (${readMinShort})`,
        hudTitle,
        hudSummary,
        peekCastor,
        peekPollux,
        permalinkUrl,
        seriesUrl: seriesUrl || '/workbench.html',
        seriesLabel,
        labUrl,
        labLabel,
        codeCaption: stripTags(rawEssay.pollux.codeCaption),
        toc: [
          {
            label: '01 · The Signal',
            title: `01 · ${stripTags(rawEssay.headline)}`,
            sub: stripTags(rawEssay.standfirst),
            text: stripTags(rawEssay.pulseCheck?.[0]?.detail || rawEssay.standfirst),
          },
          {
            label: '02 · Human & ROI',
            title: `02 · ${stripTags(rawEssay.castor.title)}`,
            sub: stripTags(rawEssay.castor.subtitle),
            text: qaSummary || stripTags(rawEssay.castor.paragraphs?.[0] || ''),
          },
          {
            label: '03 · Builder & Code',
            title: `03 · ${stripTags(rawEssay.pollux.title)}`,
            sub: stripTags(rawEssay.pollux.subtitle),
            text: stripTags(rawEssay.pollux.paragraphs?.[0] || ''),
          },
          {
            label: '04 · Verdict & Sources',
            title: `04 · ${stripTags(rawEssay.verdict.title)}`,
            sub: stripTags(rawEssay.verdict.subtitle),
            text: stripTags(rawEssay.verdict.paragraphs?.[0] || ''),
          },
        ],
      },
    };
  });
}

function renderMajorStarsSvg(stars, initStarKey = 'castor') {
  return stars
    .map((s) => {
      const m = s.meta;
      const isActive = m.key === initStarKey ? 'true' : 'false';
      const nodeClass = m.twin === 'castor' ? 'star-node-castor' : 'star-node-pollux';
      const coreClass = m.twin === 'castor' ? 'star-core-castor' : 'star-core-pollux';
      const ariaLabel = escapeHtml(
        `${m.greek} ${m.starName.toUpperCase()} ${s.shortLabel} — ${m.ariaStar} (${s.dates.titleShort}): Click to focus or click twice to read Gemini's essay`
      );

      if (m.side === 'left') {
        const pillX = -(s.pillW + 18);
        const textX = pillX + 12;
        const hitX = pillX - 8;
        const hitW = s.pillW + 48;
        return `            <!-- STAR ${m.idx}: ${m.greek} ${m.starName.toUpperCase()} (${m.lyDisplay} LY) -->
            <g class="star-node ${nodeClass}" id="node-${m.key}" role="button" tabindex="0" data-star="${m.key}" data-active="${isActive}" aria-label="${ariaLabel}">
              <rect class="star-hit-area" x="${hitX}" y="-24" width="${hitW}" height="48" />
              <rect class="star-pill-bg" x="${pillX}" y="-14" width="${s.pillW}" height="28" />
              <text class="star-label-dest" x="${textX}" y="4"><tspan class="star-bayer-prefix">${m.greek} ${m.starName.toUpperCase()}  </tspan>${escapeHtml(s.shortLabel)}</text>
              <text class="star-depth-chip" data-depth-tag="${m.key}" x="${m.depthChipX}" y="${m.depthChipY}" aria-hidden="true">${m.lyDisplay} LY</text>
              <text class="star-sub-meta" x="${textX}" y="-19" aria-hidden="true">${m.idx} · ${s.dates.upperShort.replace(', 2026', '')} · ${m.lyDisplay} LY</text>
              <circle class="star-halo" cx="0" cy="0" r="${m.haloR}" />
              <circle class="star-reticle" cx="0" cy="0" r="${m.reticleR}" />
              <circle class="${coreClass}" cx="0" cy="0" r="${m.coreR}" />
            </g>`;
      }

      const pillX = 18;
      const textX = 30;
      const hitX = -18;
      const hitW = s.pillW + 46;
      return `            <!-- STAR ${m.idx}: ${m.greek} ${m.starName.toUpperCase()} (${m.lyDisplay} LY) -->
            <g class="star-node ${nodeClass}" id="node-${m.key}" role="button" tabindex="0" data-star="${m.key}" data-active="${isActive}" aria-label="${ariaLabel}">
              <rect class="star-hit-area" x="${hitX}" y="-24" width="${hitW}" height="48" />
              <rect class="star-pill-bg" x="${pillX}" y="-14" width="${s.pillW}" height="28" />
              <text class="star-label-dest" x="${textX}" y="4"><tspan class="star-bayer-prefix">${m.greek} ${m.starName.toUpperCase()}  </tspan>${escapeHtml(s.shortLabel)}</text>
              <text class="star-depth-chip" data-depth-tag="${m.key}" x="${m.depthChipX}" y="${m.depthChipY}" aria-hidden="true">${m.lyDisplay} LY</text>
              <text class="star-sub-meta" x="${textX}" y="-19" aria-hidden="true">${m.idx} · ${s.dates.upperShort.replace(', 2026', '')} · ${m.lyDisplay} LY</text>
              <circle class="star-halo" cx="0" cy="0" r="${m.haloR}" />
              <circle class="star-reticle" cx="0" cy="0" r="${m.reticleR}" />
              <circle class="${coreClass}" cx="0" cy="0" r="${m.coreR}" />
            </g>`;
    })
    .join('\n\n');
}

function buildStandaloneSearchResources(stars, feed, blueprints) {
  const resources = [];
  const seenUrls = new Set();

  // 1. All 8 Standalone Flagship Gemini Essays (/articles/<slug>.html) — zero truncation!
  for (const s of stars) {
    const e = s.essay;
    if (!seenUrls.has(e.permalinkUrl)) {
      seenUrls.add(e.permalinkUrl);
      resources.push({
        id: `essay-${e.slug}`,
        scope: 'lab',
        twin: s.meta.twin,
        badgeKind: `✦ ORIGINAL GEMINI ESSAY · STAR ${s.meta.idx}`,
        badgeSub: `${e.dateUpper} · ${e.readMinutes}`,
        title: e.plainHeadline,
        desc: s.hud.hudSummary,
        keywords: `${e.plainHeadline} ${e.plainStandfirst} ${s.shortLabel} ${s.meta.starName} essay article castor pollux`.toLowerCase(),
        url: e.permalinkUrl,
        primaryActionLabel: 'Read Standalone Essay ↗',
      });
    }
  }

  // 2. All interactive blueprints from STUDIO_LAB_BLUEPRINTS (zero ellipses!)
  for (const bp of blueprints) {
    if (!bp.href || seenUrls.has(bp.href)) continue;
    seenUrls.add(bp.href);
    resources.push({
      id: bp.id,
      scope: 'lab',
      twin: 'pollux',
      badgeKind: '⚡ INTERACTIVE AGILE LAB',
      badgeSub: `${String(bp.badge || 'LIVE').toUpperCase()} · ${String(bp.model || 'GEMINI 4').toUpperCase()}`,
      title: bp.title.replace(/\s*\[SIMULATED DEMO\]\s*/gi, '').trim(),
      desc: firstCompleteSentence(bp.description, 220),
      keywords: `${bp.title} ${bp.model || ''} ${bp.badge || ''} ${bp.description || ''}`.toLowerCase(),
      url: bp.href,
      primaryActionLabel: 'Launch Studio Lab ↗',
    });
  }

  // 3. Companion 3-Part Release Archives & Labs from PULSE_INTELLIGENCE_FEED (zero ellipses!)
  for (const item of feed) {
    const dates = formatReleaseDates(item.date);
    if (item.seriesUrl && !seenUrls.has(item.seriesUrl)) {
      seenUrls.add(item.seriesUrl);
      resources.push({
        id: `series-${item.id}`,
        scope: 'lab',
        twin: 'castor',
        badgeKind: '📜 3-PART TECHNICAL ARCHIVE',
        badgeSub: `${dates.upperShort} · ${String(item.category || 'GEMINI').toUpperCase()}`,
        title: String(item.title || '').replace(/\.\.\.|…/g, '').trim(),
        desc: firstCompleteSentence(item.tldr, 220),
        keywords: `${item.title} ${item.modelBadge || ''} ${item.category || ''} ${item.tag || ''}`.toLowerCase(),
        url: item.seriesUrl,
        primaryActionLabel: 'Open 3-Part Archive ↗',
      });
    }
    if (item.labUrl && !seenUrls.has(item.labUrl)) {
      seenUrls.add(item.labUrl);
      resources.push({
        id: `lab-${item.id}`,
        scope: 'lab',
        twin: 'pollux',
        badgeKind: '⚡ INTERACTIVE AGILE LAB',
        badgeSub: `${dates.upperShort} · ${String(item.modelBadge || 'GEMINI').toUpperCase().slice(0, 28)}`,
        title: `${deriveShortStarLabel(item, null)} Interactive Studio`,
        desc: firstCompleteSentence(item.tldr, 210),
        keywords: `${item.title} ${item.modelBadge || ''} lab simulator demo`.toLowerCase(),
        url: item.labUrl,
        primaryActionLabel: 'Launch Lab ↗',
      });
    }
  }

  // 4. Evergreen Flagship Sanctuaries & Hubs
  const evergreen = [
    {
      id: 'hub-flagship-essays-index',
      scope: 'lab',
      twin: 'castor',
      badgeKind: '✦ THE GEMINI ESSAYS INDEX',
      badgeSub: '8 DUAL-LENS DISPATCHES',
      title: 'All 8 Flagship Dual-Lens Essays Written by Google Gemini 4 Argon',
      desc: 'Browse every untruncated first-person Gemini essay pairing Alpha Castor human/business context with Beta Pollux engineering blueprints.',
      keywords: 'articles essays index castor pollux all flagship dispatches',
      url: '/articles/index.html',
      primaryActionLabel: 'Browse Essays Index ↗',
    },
    {
      id: 'series-open-letter-deepmind',
      scope: 'lab',
      twin: 'castor',
      badgeKind: '📜 OPEN LETTER',
      badgeSub: 'TESTING IN PUBLIC',
      title: 'An Open Letter to Google DeepMind: Testing Gemini in Public',
      desc: 'What happened when Google Gemini 4 Argon built and wrote GeminiPulse—and a practical offer to test preview checkpoints on real workflows.',
      keywords: 'open letter google deepmind ai studio neil white gemini 4 argon charter testing in public',
      url: '/series/google-preview-observatory/open-letter-to-google-deepmind.html',
      primaryActionLabel: 'Read Open Letter ↗',
    },
    {
      id: 'series-everyday-workspace',
      scope: 'lab',
      twin: 'castor',
      badgeKind: '📜 EVERYDAY NO-CODE SANCTUARY',
      badgeSub: 'ZERO CODE REQUIRED',
      title: '5-Minute Google Docs, NotebookLM, Sheets & Classroom Guided Learning Workflows',
      desc: 'Copy-paste no-code prompts for Google Docs @Folder synthesis, NotebookLM Audio Overview steering, 1,200-row Sheets cleanup, and Socratic study mode.',
      keywords: 'everyday workspace docs sheets gmail notebooklm classroom guided learning socratic no code prompts',
      url: '/series/everyday-gemini/workspace-no-code-guides.html',
      primaryActionLabel: 'Open No-Code Sanctuary ↗',
    },
    {
      id: 'lab-cost-calculator',
      scope: 'lab',
      twin: 'pollux',
      badgeKind: '⚡ INTERACTIVE AGILE LAB',
      badgeSub: 'TOKEN ECONOMICS · -90% CACHE',
      title: 'Gemini Context Caching & Cost-Per-Task Calculator Lab (-78% Bill)',
      desc: 'Model Solo (20M), Team (100M), and Scale (500M) monthly token workloads with warm Context Caching and hybrid routing.',
      keywords: 'cost calculator price cut 78% 90% context caching token economics bill savings',
      url: '/labs/gemini-cost-per-task-calculator.html',
      primaryActionLabel: 'Launch Calculator Lab ↗',
    },
    {
      id: 'hub-brand-evolution-archive',
      scope: 'lab',
      twin: 'castor',
      badgeKind: '🏛️ 18-ROUND DESIGN PORTFOLIO',
      badgeSub: 'ERA 0 → LOOK J v10 · CASE STUDY',
      title: 'GeminiPulse Brand Evolution & 18-Round Interactive Prototype Archive',
      desc: 'Explore all 18 preserved prototypes—from the 24,043px Era 0 developer monolith through Look A–I to Look J v10.',
      keywords: 'archive prototypes design evolution case study portfolio look a b c d e f g h i j era 0',
      url: '/prototypes/index.html',
      primaryActionLabel: 'Open Prototype Archive ↗',
    },
    {
      id: 'hub-developer-workbench-spa',
      scope: 'lab',
      twin: 'pollux',
      badgeKind: '🛠️ COMMUNITY & SDK SUITE',
      badgeSub: 'SHOWCASE · FORUM · SHORTS STUDIO',
      title: "Full Developer Workbench, 'Built with Gemini' Community Showcase & AI Forum",
      desc: 'Access the interactive @google/genai SDK playground, community project directory, AI-moderated forum, and YouTube Shorts studio.',
      keywords: 'workbench showcase forum community projects shorts studio sdk playground',
      url: '/workbench.html',
      primaryActionLabel: 'Open Workbench Suite ↗',
    },
  ];

  for (const eg of evergreen) {
    if (!seenUrls.has(eg.url)) {
      seenUrls.add(eg.url);
      resources.push(eg);
    }
  }

  return resources;
}

/**
 * Generates standalone shareable Celestial Reading Sanctuary HTML pages (`/articles/<slug>.html`)
 * plus `/articles/index.html` with cross-document View Transitions, `@container` responsive tables,
 * `hidden="until-found"` lens filtering, interactive `[SIMULATED DEMO]` presets, and Schema.org JSON-LD.
 */
function writeStandaloneArticlePages(stars) {
  if (!existsSync(articlesDir)) {
    mkdirSync(articlesDir, { recursive: true });
  }

  for (const s of stars) {
    const e = s.essay;
    const innerHtml = renderSanctuaryEssayInnerHtml(e, { standalone: true });
    const canonicalUrl = `https://geminipulse.com${e.permalinkUrl}`;
    const presetsJson = JSON.stringify(e.pollux.workbench.presets);

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          headline: e.plainHeadline,
          description: e.plainStandfirst,
          datePublished: e.isoDate,
          url: canonicalUrl,
          author: { '@type': 'Person', name: 'Google Gemini 4 Argon' },
          contributor: { '@type': 'Person', name: 'Neil S. White' },
          publisher: { '@type': 'Organization', name: 'GeminiPulse.com', url: 'https://geminipulse.com/' },
          citation: e.primarySourceUrls,
        },
        {
          '@type': 'FAQPage',
          mainEntity: e.faqPlain.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        },
      ],
    };

    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="text-scale" content="scale" />
  <title>${escapeHtml(e.plainHeadline)} — GeminiPulse Essay (Star ${e.starIdx} · ${e.greek} ${e.starName})</title>
  <meta name="description" content="${escapeHtml(e.plainStandfirst)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="GeminiPulse" />
  <meta property="og:title" content="${escapeHtml(e.plainHeadline)} — Written by Google Gemini 4 Argon" />
  <meta property="og:description" content="${escapeHtml(e.plainStandfirst)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="https://geminipulse.com/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(e.plainHeadline)}" />
  <meta name="twitter:description" content="${escapeHtml(e.plainStandfirst)}" />
  <link rel="icon" type="image/svg+xml" href="/gemini-sparkle.svg" />
  <link rel="alternate" type="application/atom+xml" title="GeminiPulse Atom Feed" href="/feed.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif:wght@400;600&display=swap" rel="stylesheet" /></noscript>
  <script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
  </script>
  <style>
    @media (prefers-reduced-motion: no-preference) {
      @view-transition {
        navigation: auto;
      }
    }

    :root {
      color-scheme: dark;
      --night-zenith: #020307;
      --starlight-ink: #F2F5FA;
      --starlight-dim: #9AA8BE;
      --starlight-muted: #687792;
      --castor-star: #7EB8FF;
      --pollux-star: #F59E3F;
      --ethereal-violet: #A385FF;
      --ethereal-bright: #CEC0FF;
      --serif: "Cormorant Garamond", Georgia, serif;
      --sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: "JetBrains Mono", monospace;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background: var(--night-zenith);
      color: var(--starlight-ink);
    }

    body {
      min-block-size: 100vh;
      font-family: var(--sans);
      background:
        radial-gradient(ellipse 75% 42% at 50% 0%, rgba(18, 32, 62, 0.48) 0%, transparent 72%),
        radial-gradient(ellipse 42% 55% at 8% 32%, rgba(56, 189, 248, 0.065) 0%, transparent 72%),
        radial-gradient(ellipse 42% 55% at 92% 68%, rgba(245, 158, 63, 0.065) 0%, transparent 72%),
        var(--night-zenith);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .greek {
      font-family: "Noto Serif", Georgia, serif;
      text-transform: none !important;
      font-style: normal;
      letter-spacing: 0 !important;
    }

    #sanctuary-stars {
      position: fixed;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .standalone-topbar {
      position: sticky;
      top: 0;
      z-index: 40;
      background: rgba(3, 5, 12, 0.88);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-block-end: 0.75px solid rgba(163, 133, 255, 0.24);
      padding: 10px clamp(16px, 4vw, 44px);
    }

    .stb-inner {
      max-inline-size: 1180px;
      margin-inline: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px 16px;
    }

    .stb-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #FFFFFF;
      font-family: var(--serif);
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .stb-sub {
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.09em;
      color: var(--ethereal-bright);
    }

    .stb-links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .stb-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.95rem;
      border-radius: 999px;
      background: rgba(12, 19, 36, 0.86);
      border: 0.75px solid rgba(163, 133, 255, 0.34);
      color: #F2F6FC;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.18s ease;
    }

    .stb-pill:hover {
      background: rgba(163, 133, 255, 0.22);
      border-color: var(--ethereal-bright);
      color: #FFFFFF;
    }

    .stb-pill--primary {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.5);
      color: #E0F2FE;
    }

    .stb-pill--primary:hover {
      background: #38BDF8;
      color: #04101F;
    }

    main.standalone-main {
      position: relative;
      z-index: 2;
      padding: clamp(3rem, 6.5vh, 5.5rem) clamp(1.25rem, 5vw, 4rem) clamp(6rem, 12vh, 9rem);
    }

    .article-sanctuary-column {
      max-inline-size: 56rem;
      margin-inline: auto;
      display: flex;
      flex-direction: column;
    }

    .essay-hero-block,
    .essay-section,
    .lens-inner-wrap {
      max-inline-size: 48.75rem;
      inline-size: 100%;
      margin-inline: auto;
      scroll-margin-top: 72px;
    }

    .lens-host {
      margin: 0;
      padding: 0;
      border: none;
      background: transparent;
    }

    .essay-coord {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.65rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ethereal-bright);
      margin-block-end: 1.25rem;
    }

    .essay-h1 {
      font-family: var(--serif);
      font-weight: 500;
      font-size: clamp(2.25rem, 1.65rem + 2.15vw, 3.65rem);
      line-height: 1.08;
      letter-spacing: -0.012em;
      color: #FFFFFF;
      margin-block-end: 1.5rem;
      text-shadow: 0 8px 32px rgba(0, 0, 0, 0.75);
      text-wrap: balance;
    }

    .essay-h1 em {
      font-style: italic;
      background: linear-gradient(90deg, var(--castor-star) 0%, var(--ethereal-bright) 52%, var(--pollux-star) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .essay-standfirst {
      font-family: var(--serif);
      font-style: italic;
      font-size: clamp(1.3rem, 1.14rem + 0.62vw, 1.625rem);
      line-height: 1.56;
      color: #BFE0FA;
      max-inline-size: 58ch;
      margin-block-end: 1.85rem;
      text-wrap: pretty;
    }

    .essay-byline-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.65rem 1.25rem;
      padding-block: 0.85rem;
      border-block: 0.65px solid rgba(163, 133, 255, 0.24);
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--starlight-dim);
    }

    .essay-byline-bar strong { color: #FFFFFF; font-weight: 600; }

    .essay-lens-toolbar {
      margin-block-start: 1.35rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .essay-lens-label {
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--starlight-muted);
    }

    .essay-lens-group {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .essay-lens-btn {
      cursor: pointer;
      padding: 0.45rem 0.95rem;
      border-radius: 999px;
      background: rgba(9, 14, 26, 0.84);
      border: 0.75px solid rgba(255, 255, 255, 0.16);
      color: var(--starlight-dim);
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: all 0.18s ease;
    }

    .essay-lens-btn[aria-pressed="true"] {
      background: rgba(163, 133, 255, 0.22);
      border-color: var(--ethereal-bright);
      color: #FFFFFF;
      font-weight: 600;
    }

    .essay-lens-btn[data-lens-filter="castor"][aria-pressed="true"] {
      background: rgba(56, 189, 248, 0.2);
      border-color: #38BDF8;
      color: #F0F9FF;
    }

    .essay-lens-btn[data-lens-filter="pollux"][aria-pressed="true"] {
      background: rgba(245, 158, 63, 0.2);
      border-color: #F59E3F;
      color: #FFF7EB;
    }

    .pulse-check-ledger {
      margin-block-start: 2rem;
      padding: 0.35rem 1.5rem;
      border-radius: 12px;
      background: rgba(8, 14, 28, 0.72);
      border: 0.75px solid rgba(163, 133, 255, 0.26);
    }

    .pcl-header {
      padding-block: 0.85rem 0.75rem;
      border-block-end: 0.65px solid rgba(163, 133, 255, 0.22);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.65rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ethereal-bright);
    }

    .pcl-row {
      display: grid;
      grid-template-columns: 11.75rem minmax(0, 1fr);
      gap: 1.25rem;
      padding-block: 0.95rem;
      border-block-end: 0.65px dashed rgba(255, 255, 255, 0.1);
      align-items: baseline;
    }

    .pcl-row:last-child { border-block-end: none; }

    .pcl-stage {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #7DD3FC;
    }

    .pcl-row:nth-of-type(3) .pcl-stage { color: #FDBA74; }

    .pcl-detail {
      font-size: clamp(1.025rem, 0.98rem + 0.18vw, 1.125rem);
      line-height: 1.68;
      color: #E2ECF8;
      text-wrap: pretty;
    }

    .celestial-chapter-divider {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-block: clamp(3.5rem, 7vh, 5.25rem);
      inline-size: 100%;
    }

    .celestial-chapter-divider::before,
    .celestial-chapter-divider::after {
      content: "";
      flex: 1;
      block-size: 0.65px;
      background: linear-gradient(90deg, transparent 0%, rgba(163, 133, 255, 0.34) 50%, transparent 100%);
    }

    .ccd-glyph {
      padding-inline: 18px;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.26em;
      color: var(--ethereal-bright);
    }

    .chapter-kicker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.65rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7DD3FC;
      margin-block-end: 1.05rem;
    }

    #lens-section-pollux .chapter-kicker { color: #FDBA74; }

    .essay-h2 {
      font-family: var(--serif);
      font-size: clamp(1.85rem, 1.48rem + 1.25vw, 2.65rem);
      font-weight: 600;
      line-height: 1.15;
      color: #FFFFFF;
      margin-block-end: 0.9rem;
      max-inline-size: 30ch;
      text-wrap: balance;
    }

    .essay-sub {
      font-family: var(--serif);
      font-style: italic;
      font-size: clamp(1.22rem, 1.08rem + 0.48vw, 1.5rem);
      line-height: 1.52;
      color: #9ED0FA;
      margin-block-end: 1.85rem;
      max-inline-size: 58ch;
      text-wrap: pretty;
    }

    .essay-sub--pollux { color: #FED7AA; }

    .essay-prose {
      display: flex;
      flex-direction: column;
      gap: 1.45em;
      font-size: clamp(1.125rem, 1.02rem + 0.38vw, 1.275rem);
      line-height: 1.85;
      color: #E4ECF8;
      max-inline-size: 65ch;
    }

    .essay-prose p { text-wrap: pretty; }

    .essay-prose--pollux { color: #F4E8D8; }

    .essay-prose strong, .pcl-detail strong, .qa-answer strong, .br-detail strong {
      color: #FFFFFF;
      font-weight: 600;
    }

    .essay-inline-code {
      font-family: var(--mono);
      font-size: 0.84em;
      padding: 1.5px 6px;
      border-radius: 5px;
      background: rgba(56, 189, 248, 0.12);
      border: 0.65px solid rgba(56, 189, 248, 0.28);
      color: #D6EBFF;
      overflow-wrap: anywhere;
    }

    .essay-prose--pollux .essay-inline-code, .br-item .essay-inline-code {
      background: rgba(245, 158, 63, 0.13);
      border-color: rgba(245, 158, 63, 0.3);
      color: #FDE68A;
    }

    .celestial-pullquote {
      margin-block: 2.5rem;
      padding: 0.5rem 0 0.5rem 1.65rem;
      border-inline-start: 2px solid var(--ethereal-bright);
      max-inline-size: 60ch;
    }

    .celestial-pullquote p {
      font-family: var(--serif);
      font-style: italic;
      font-size: clamp(1.4rem, 1.2rem + 0.7vw, 1.78rem);
      line-height: 1.45;
      color: #F5F3FF;
      text-wrap: pretty;
    }

    .celestial-pullquote cite {
      display: block;
      margin-block-start: 0.75rem;
      font-family: var(--mono);
      font-style: normal;
      font-size: 0.6875rem;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: var(--ethereal-bright);
    }

    .gp-table-wrapper {
      container-type: inline-size;
      overflow-x: auto;
      margin-block: 2.5rem;
      border-radius: 12px;
      border: 0.75px solid rgba(56, 189, 248, 0.26);
      background: rgba(6, 12, 24, 0.78);
    }

    .gp-comparison-table {
      inline-size: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
      line-height: 1.58;
      color: #E2ECF8;
    }

    .gp-comparison-table caption {
      padding: 0.9rem 1.25rem;
      text-align: left;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #7DD3FC;
      background: rgba(56, 189, 248, 0.08);
      border-block-end: 0.75px solid rgba(56, 189, 248, 0.22);
    }

    .gp-comparison-table th, .gp-comparison-table td {
      padding: 0.9rem 1.1rem;
      text-align: left;
      vertical-align: top;
      border-block-end: 0.65px solid rgba(255, 255, 255, 0.08);
    }

    .gp-comparison-table thead th {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #BAE6FD;
      background: rgba(9, 18, 36, 0.88);
    }

    .gp-comparison-table tbody th[scope="row"] { font-weight: 600; color: #FFFFFF; }
    .gp-comparison-table tbody tr:last-child th, .gp-comparison-table tbody tr:last-child td { border-block-end: none; }

    @container (width < 600px) {
      .gp-comparison-table, .gp-comparison-table thead, .gp-comparison-table tbody,
      .gp-comparison-table tr, .gp-comparison-table th, .gp-comparison-table td { display: block; }
      .gp-comparison-table thead { display: none; }
      .gp-comparison-table tbody tr { padding: 1rem 1.1rem; border-block-end: 0.75px solid rgba(56, 189, 248, 0.2); }
      .gp-comparison-table tbody tr:last-child { border-block-end: none; }
      .gp-comparison-table tbody th[scope="row"] {
        padding: 0 0 0.55rem 0;
        margin-block-end: 0.55rem;
        border-block-end: 0.65px dashed rgba(56, 189, 248, 0.24);
        color: #BAE6FD;
      }
      .gp-comparison-table tbody td { padding: 0.35rem 0; border-block-end: none; }
      .gp-comparison-table tbody td::before {
        display: block;
        font-family: var(--mono);
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #8CA3C4;
        margin-block-end: 0.15rem;
      }
      .gp-comparison-table tbody td:nth-of-type(1)::before { content: var(--col-2); }
      .gp-comparison-table tbody td:nth-of-type(2)::before { content: var(--col-3); }
      .gp-comparison-table tbody td:nth-of-type(3)::before { content: var(--col-4); }
    }

    .adaptive-qa-section { margin-block-start: 3rem; scroll-margin-top: 72px; }
    .adaptive-qa-list { display: flex; flex-direction: column; gap: 1.25rem; margin-block-start: 1.15rem; }

    .qa-item {
      padding: 1.35rem 1.65rem;
      border-radius: 12px;
      background: rgba(7, 16, 32, 0.72);
      border: 0.75px solid rgba(56, 189, 248, 0.24);
    }

    .qa-lens-tag {
      display: inline-block;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #7DD3FC;
      margin-block-end: 0.45rem;
    }

    .qa-question {
      font-family: var(--serif);
      font-size: clamp(1.3rem, 1.18rem + 0.45vw, 1.58rem);
      font-weight: 600;
      line-height: 1.26;
      color: #FFFFFF;
      margin-block-end: 0.6rem;
      text-wrap: balance;
    }

    .qa-answer {
      font-size: clamp(1.025rem, 0.98rem + 0.18vw, 1.125rem);
      line-height: 1.74;
      color: #D6E6F8;
      text-wrap: pretty;
    }

    .builder-rules-ledger { margin-block-start: 2rem; display: grid; gap: 1rem; }

    .br-item {
      padding: 1.15rem 1.4rem;
      border-radius: 10px;
      background: rgba(28, 15, 5, 0.7);
      border: 0.75px solid rgba(245, 158, 63, 0.3);
    }

    .br-label {
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #FDBA74;
      margin-block-end: 0.4rem;
    }

    .br-detail {
      font-size: clamp(1.02rem, 0.97rem + 0.18vw, 1.1rem);
      line-height: 1.68;
      color: #F4E6D4;
      text-wrap: pretty;
    }

    .geo-code-wrap {
      margin-block-start: 2rem;
      border-radius: 12px;
      border: 0.75px solid rgba(245, 158, 63, 0.36);
      background: #050811;
      overflow: hidden;
    }

    .geo-code-header {
      padding: 0.7rem 1.15rem;
      background: rgba(245, 158, 63, 0.09);
      border-block-end: 0.65px solid rgba(245, 158, 63, 0.24);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #FDBA74;
    }

    .copy-code-btn {
      cursor: pointer;
      padding: 0.32rem 0.85rem;
      border-radius: 999px;
      background: rgba(245, 158, 63, 0.18);
      border: 0.75px solid rgba(245, 158, 63, 0.48);
      color: #FED7AA;
      font-family: var(--mono);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .geo-code-block {
      padding: 1.25rem 1.4rem;
      overflow-x: auto;
      font-family: var(--mono);
      font-size: 0.875rem;
      line-height: 1.72;
      color: #E6EDF8;
    }

    .pollux-workbench-card {
      margin-block-start: 2.35rem;
      padding: 1.75rem 1.9rem;
      border-radius: 14px;
      border: 0.85px solid rgba(245, 158, 63, 0.4);
      background: linear-gradient(205deg, rgba(33, 17, 4, 0.94) 0%, rgba(22, 11, 3, 0.96) 100%);
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .salon-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-block-end: 0.75rem;
      border-block-end: 0.65px solid rgba(245, 158, 63, 0.25);
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #FED7AA;
    }

    .shr-title { display: inline-flex; align-items: center; gap: 7px; }
    .peek-dot { inline-size: 6px; block-size: 6px; border-radius: 50%; background: #F59E3F; box-shadow: 0 0 8px #F59E3F; }
    .shr-badge { padding: 0.18rem 0.55rem; border-radius: 999px; border: 0.65px solid rgba(245, 158, 63, 0.4); font-size: 0.625rem; }
    .pwc-title { font-family: var(--serif); font-size: clamp(1.5rem, 1.32rem + 0.6vw, 1.875rem); line-height: 1.18; font-weight: 600; color: #FFF7EB; text-wrap: balance; }
    .pwc-sub { font-size: clamp(1.02rem, 0.97rem + 0.18vw, 1.1rem); line-height: 1.66; color: #F4DFC4; text-wrap: pretty; }

    .atelier-console {
      background: #0D0703;
      border: 0.75px solid rgba(245, 158, 63, 0.34);
      border-radius: 10px;
      padding: 1rem 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .ac-top {
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.09em;
      color: #D8B48A;
      text-transform: uppercase;
    }

    .ac-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }

    .ac-preset-btn {
      cursor: pointer;
      padding: 0.48rem 0.6rem;
      border-radius: 6px;
      border: 0.75px solid rgba(245, 158, 63, 0.28);
      background: rgba(255, 255, 255, 0.04);
      color: #F2DEC4;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 500;
      transition: all 0.18s ease;
    }

    .ac-preset-btn[aria-pressed="true"] {
      background: #F59E3F;
      color: #1A0D02;
      border-color: #F59E3F;
      font-weight: 600;
    }

    .ac-output {
      padding: 0.75rem 0.95rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.025);
      border: 0.65px solid rgba(245, 158, 63, 0.18);
      font-family: var(--mono);
      font-size: 0.8125rem;
      line-height: 1.55;
    }

    .ac-line { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-block: 0.25rem; }
    .ac-k { color: #C29D72; font-size: 0.6875rem; }
    .ac-v { color: #FFF8EE; font-weight: 500; }
    .ac-v.accent { color: #FDBA74; }

    .standalone-deep-link-row {
      margin-block-start: 1.8rem;
      padding-block-start: 1.05rem;
      border-block-start: 0.65px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .sdl-kicker {
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: #7DD3FC;
    }

    .sdl-kicker--pollux { color: #FDBA74; }

    .standalone-deep-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.52rem 1.15rem;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.14);
      border: 0.85px solid rgba(56, 189, 248, 0.45);
      color: #F0F9FF;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      text-decoration: none;
    }

    .standalone-deep-link--pollux {
      background: rgba(245, 158, 63, 0.16);
      border-color: rgba(245, 158, 63, 0.5);
      color: #FFF7ED;
    }

    .primary-sources-ledger {
      margin-block-start: 2.4rem;
      padding: 1.35rem 1.65rem;
      border-radius: 12px;
      background: rgba(8, 13, 25, 0.84);
      border: 0.75px solid rgba(163, 133, 255, 0.28);
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .psl-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding-block-end: 0.7rem;
      border-block-end: 0.65px solid rgba(163, 133, 255, 0.2);
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--ethereal-bright);
    }

    .psl-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem 1.15rem;
      padding-block: 0.45rem;
    }

    .psl-meta { display: flex; flex-direction: column; gap: 0.25rem; }
    .psl-role { font-family: var(--mono); font-size: 0.6875rem; letter-spacing: 0.07em; text-transform: uppercase; color: #93C5FD; }
    .psl-label { font-size: 1rem; font-weight: 500; color: #F0F7FF; }

    .psl-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.14);
      border: 0.85px solid rgba(56, 189, 248, 0.48);
      color: #F0F9FF;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      text-decoration: none;
    }

    .essay-star-nav-footer {
      margin-block-start: 2.75rem;
      padding-block-start: 1.5rem;
      border-block-start: 0.65px solid rgba(163, 133, 255, 0.24);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .essay-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.62rem 1.15rem;
      border-radius: 999px;
      background: rgba(12, 18, 34, 0.86);
      border: 0.85px solid rgba(163, 133, 255, 0.38);
      color: #F4F7FC;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
    }

    @media (max-width: 720px) {
      .pcl-row { grid-template-columns: 1fr; gap: 4px; }
      .ac-presets { grid-template-columns: 1fr; }
      .ac-line { flex-direction: column; gap: 2px; }
      .stb-sub { display: none; }
    }
  </style>
</head>
<body>
  <canvas id="sanctuary-stars" aria-hidden="true"></canvas>

  <header class="standalone-topbar">
    <div class="stb-inner">
      <a href="/?star=${e.starKey}" class="stb-brand">
        <span>♊ GEMINIPULSE</span>
        <span class="stb-sub">STAR ${e.starIdx} / 08 · <span class="greek">${e.greek}</span> ${e.starNameUpper}</span>
      </a>
      <nav class="stb-links" aria-label="Essay Navigation">
        <a href="/?star=${e.starKey}" class="stb-pill stb-pill--primary">← Explore 3D Constellation</a>
        <a href="/articles/index.html" class="stb-pill">All 8 Essays</a>
        <a href="/workbench.html" class="stb-pill">Workbench</a>
      </nav>
    </div>
  </header>

  <main class="standalone-main">
    <article class="article-sanctuary-column" id="standalone-essay-root" itemscope itemtype="https://schema.org/TechArticle">
      <meta itemprop="author" content="Google Gemini 4 Argon" />
      <meta itemprop="datePublished" content="${e.isoDate}" />
${innerHtml}
    </article>
  </main>

  <script>
    (() => {
      const PRESETS = ${presetsJson};
      const supportsUntilFound = "onbeforematch" in HTMLElement.prototype;
      const castorHost = document.getElementById("lens-section-castor");
      const polluxHost = document.getElementById("lens-section-pollux");

      function hideLens(el) {
        if (!el) return;
        if (supportsUntilFound) el.setAttribute("hidden", "until-found");
        else el.hidden = true;
      }
      function showLens(el) {
        if (!el) return;
        el.removeAttribute("hidden");
        el.hidden = false;
      }
      function setLens(lens) {
        if (lens === "castor") { showLens(castorHost); hideLens(polluxHost); }
        else if (lens === "pollux") { hideLens(castorHost); showLens(polluxHost); }
        else { showLens(castorHost); showLens(polluxHost); }
        document.querySelectorAll("[data-lens-filter]").forEach((b) => {
          b.setAttribute("aria-pressed", String(b.getAttribute("data-lens-filter") === lens));
        });
      }
      [castorHost, polluxHost].forEach((el) => {
        if (el) el.addEventListener("beforematch", () => setLens("both"));
      });

      document.addEventListener("click", async (ev) => {
        const lensBtn = ev.target.closest("[data-lens-filter]");
        if (lensBtn) {
          setLens(lensBtn.getAttribute("data-lens-filter") || "both");
          return;
        }
        const presetBtn = ev.target.closest(".ac-preset-btn");
        if (presetBtn) {
          const idx = Number(presetBtn.getAttribute("data-preset")) || 0;
          const p = PRESETS[idx] || PRESETS[0];
          document.querySelectorAll(".ac-preset-btn").forEach((b, i) => b.setAttribute("aria-pressed", String(i === idx)));
          const sync = (k, v) => document.querySelectorAll('[data-sync="' + k + '"]').forEach((el) => { el.textContent = v; });
          sync("ac-k1", p.k1); sync("ac-v1", p.v1);
          sync("ac-k2", p.k2); sync("ac-v2", p.v2);
          sync("ac-k3", p.k3); sync("ac-v3", p.v3);
          return;
        }
        const copyBtn = ev.target.closest("[data-copy-essay-code]");
        if (copyBtn) {
          const codeEl = document.getElementById("chap3-code");
          if (codeEl) {
            try { await navigator.clipboard.writeText(codeEl.textContent || ""); } catch (_) {}
            copyBtn.textContent = "✓ Copied Blueprint";
            setTimeout(() => { copyBtn.textContent = "Copy Full Blueprint"; }, 1800);
          }
        }
      });

      const canvas = document.getElementById("sanctuary-stars");
      if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const ctx = canvas.getContext("2d");
        const pts = Array.from({ length: 85 }, (_, i) => ({
          x: ((i * 73) % 100) / 100,
          y: ((i * 41 + 17) % 100) / 100,
          r: (i % 3 === 0 ? 1.25 : 0.75),
          ph: i * 0.7,
          col: i % 5 === 0 ? "#BAE6FD" : (i % 7 === 0 ? "#FED7AA" : "#E2E8F0")
        }));
        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });
        const draw = (t) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const sec = t * 0.001;
          for (const p of pts) {
            ctx.globalAlpha = 0.16 + 0.24 * (0.5 + 0.5 * Math.sin(sec * 0.6 + p.ph));
            ctx.fillStyle = p.col;
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
          requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
      }
    })();
  </script>
</body>
</html>
`;

    writeFileSync(resolve(articlesDir, `${e.slug}.html`), pageHtml);
  }

  // Also generate `/articles/index.html` directory of all 8 Flagship Dual-Lens Essays
  const cardsHtml = stars
    .map((s) => {
      const e = s.essay;
      const borderCol = s.meta.twin === 'castor' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(245, 158, 63, 0.38)';
      return `      <article class="essay-index-card" style="border-color:${borderCol}">
        <div class="eic-meta">
          <span>✦ STAR ${e.starIdx} / 08 · <span class="greek">${e.greek}</span> ${e.starNameUpper} (${e.lyDisplay} LY)</span>
          <span>${e.dateUpper} · ${e.readMinutes}</span>
        </div>
        <h2 class="eic-title"><a href="${e.permalinkUrl}">${e.headlineHtml}</a></h2>
        <p class="eic-standfirst">${e.standfirstHtml}</p>
        <div class="eic-actions">
          <a href="${e.permalinkUrl}" class="eic-btn eic-btn--primary">Read Full Dual-Lens Essay →</a>
          <a href="/?star=${e.starKey}" class="eic-btn">View Star in 3D Sky</a>
        </div>
      </article>`;
    })
    .join('\n');

  const indexDirectoryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="text-scale" content="scale" />
  <title>The Gemini Essays — Original Dual-Lens Dispatches by Google Gemini 4 Argon | GeminiPulse</title>
  <meta name="description" content="Read all 8 untruncated flagship essays written first-person by Google Gemini 4 Argon—pairing Alpha Castor human and business stakes with Beta Pollux architecture and runnable SDK code." />
  <link rel="canonical" href="https://geminipulse.com/articles/index.html" />
  <link rel="icon" type="image/svg+xml" href="/gemini-sparkle.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif:wght@400;600&display=swap" rel="stylesheet" /></noscript>
  <style>
    @media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }
    :root {
      color-scheme: dark;
      --serif: "Cormorant Garamond", Georgia, serif;
      --sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: "JetBrains Mono", monospace;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-block-size: 100vh;
      font-family: var(--sans);
      background: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(22, 36, 68, 0.5) 0%, transparent 72%), #020307;
      color: #F2F5FA;
      padding-block-end: 80px;
    }
    .greek { font-family: "Noto Serif", Georgia, serif; text-transform: none !important; }
    header.top {
      padding: 14px clamp(18px, 4vw, 44px);
      border-block-end: 0.75px solid rgba(163, 133, 255, 0.24);
      background: rgba(3, 5, 12, 0.9);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand { color: #FFF; text-decoration: none; font-family: var(--serif); font-size: 19px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
    .back {
      padding: 0.45rem 1rem;
      border-radius: 999px;
      border: 0.75px solid rgba(56, 189, 248, 0.5);
      background: rgba(56, 189, 248, 0.14);
      color: #E0F2FE;
      font-family: var(--mono);
      font-size: 0.6875rem;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      text-decoration: none;
    }
    main { max-inline-size: 58rem; margin-inline: auto; padding: 3.5rem clamp(1.25rem, 4vw, 2.5rem) 0; }
    .eyebrow { font-family: var(--mono); font-size: 0.6875rem; letter-spacing: 0.12em; text-transform: uppercase; color: #CEC0FF; margin-block-end: 1rem; }
    h1 { font-family: var(--serif); font-size: clamp(2.25rem, 1.65rem + 2.15vw, 3.65rem); font-weight: 500; line-height: 1.08; margin-block-end: 1.15rem; text-wrap: balance; }
    h1 em { font-style: italic; color: #93C5FD; }
    .lead { font-family: var(--serif); font-style: italic; font-size: clamp(1.3rem, 1.14rem + 0.62vw, 1.6rem); line-height: 1.54; color: #BFE0FA; max-inline-size: 60ch; margin-block-end: 2.75rem; text-wrap: pretty; }
    .grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .essay-index-card {
      padding: 1.85rem 2rem;
      border-radius: 14px;
      background: rgba(8, 14, 28, 0.78);
      border: 0.85px solid rgba(163, 133, 255, 0.3);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .eic-meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-family: var(--mono); font-size: 0.6875rem; letter-spacing: 0.09em; color: #9AA8BE; text-transform: uppercase; }
    .eic-title { font-family: var(--serif); font-size: clamp(1.7rem, 1.38rem + 1vw, 2.25rem); font-weight: 500; line-height: 1.15; text-wrap: balance; }
    .eic-title a { color: #FFF; text-decoration: none; }
    .eic-title em { font-style: italic; color: #BAE6FD; }
    .eic-standfirst { font-size: clamp(1.05rem, 0.98rem + 0.22vw, 1.15rem); line-height: 1.72; color: #D6E4F5; max-inline-size: 66ch; text-wrap: pretty; }
    .eic-actions { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-block-start: 0.45rem; }
    .eic-btn {
      padding: 0.5rem 1.05rem;
      border-radius: 999px;
      border: 0.75px solid rgba(255, 255, 255, 0.2);
      color: #F2F5FA;
      font-family: var(--mono);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      text-decoration: none;
    }
    .eic-btn--primary { background: rgba(163, 133, 255, 0.2); border-color: #CEC0FF; color: #FFF; }
  </style>
</head>
<body>
  <header class="top">
    <a href="/" class="brand">♊ GEMINIPULSE</a>
    <a href="/" class="back">← Return to 3D Constellation</a>
  </header>
  <main>
    <div class="eyebrow">✦ WRITTEN BY GOOGLE GEMINI 4 ARGON · EDITORIAL DIRECTION BY NEIL S. WHITE</div>
    <h1>The Gemini Essays. <em>Guided by the Twins.</em></h1>
    <p class="lead">Eight complete, untruncated flagship essays—synthesizing every major Google Gemini milestone through Alpha Castor (human &amp; business meaning) and Beta Pollux (engineering architecture &amp; runnable SDK code).</p>
    <div class="grid">
${cardsHtml}
    </div>
  </main>
</body>
</html>
`;

  writeFileSync(resolve(articlesDir, 'index.html'), indexDirectoryHtml);
}

/**
 * Idempotently syncs `/articles/<slug>.html` and `/articles/index.html` into `sitemap.xml` and `feed.xml`.
 */
function syncSitemapAndAtomFeed(stars) {
  if (existsSync(sitemapPath)) {
    let sm = readFileSync(sitemapPath, 'utf8');
    // Remove any previously auto-injected /articles/ entries so we stay 100% idempotent
    sm = sm.replace(/\s*<url>\s*<loc>https:\/\/geminipulse\.com\/articles\/[^<]+<\/loc>[\s\S]*?<\/url>/g, '');
    const articleUrlsXml = [
      `  <url>\n    <loc>https://geminipulse.com/articles/index.html</loc>\n    <lastmod>${stars[0].dates.isoDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.99</priority>\n  </url>`,
      ...stars.map(
        (s) =>
          `  <url>\n    <loc>https://geminipulse.com${s.essay.permalinkUrl}</loc>\n    <lastmod>${s.dates.isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.98</priority>\n  </url>`
      ),
    ].join('\n');

    sm = sm.replace(
      /(<loc>https:\/\/geminipulse\.com\/prototypes\/look-j-3d-celestial-navigator\.html<\/loc>[\s\S]*?<\/url>)/,
      `$1\n${articleUrlsXml}`
    );
    writeFileSync(sitemapPath, sm);
  }

  if (existsSync(feedXmlPath)) {
    let fx = readFileSync(feedXmlPath, 'utf8');
    fx = fx.replace(/\s*<entry>\s*<title>[^<]*<\/title>\s*<link href="https:\/\/geminipulse\.com\/articles\/[^"]+"[\s\S]*?<\/entry>/g, '');
    const essayEntriesXml = stars
      .map(
        (s) => `  <entry>
    <title>${escapeXml(s.essay.plainHeadline)} (Flagship Gemini Essay)</title>
    <link href="https://geminipulse.com${s.essay.permalinkUrl}" />
    <id>https://geminipulse.com${s.essay.permalinkUrl}</id>
    <updated>${s.dates.isoFull}</updated>
    <summary>${escapeXml(s.essay.plainStandfirst)}</summary>
  </entry>`
      )
      .join('\n\n');

    fx = fx.replace(/(<\/author>)/, `$1\n\n${essayEntriesXml}`);
    writeFileSync(feedXmlPath, fx);
  }
}

function replaceBetweenMarkers(source, startMarker, endMarker, replacement) {
  const sIdx = source.indexOf(startMarker);
  const eIdx = source.indexOf(endMarker);
  if (sIdx === -1 || eIdx === -1 || eIdx < sIdx) {
    throw new Error(`Missing or invalid markers: ${startMarker} ... ${endMarker}`);
  }
  return source.slice(0, sIdx + startMarker.length) + '\n' + replacement + '\n' + source.slice(eIdx);
}

export async function syncConstellation() {
  const cacheBust = `?t=${Date.now()}`;
  const { PULSE_INTELLIGENCE_FEED, STUDIO_LAB_BLUEPRINTS } = await import(
    `${pathToFileURL(dataModulePath).href}${cacheBust}`
  );
  const { CONSTELLATION_ESSAYS } = await import(`${pathToFileURL(essaysModulePath).href}${cacheBust}`);

  const chosenStories = selectConstellationStories(PULSE_INTELLIGENCE_FEED, CONSTELLATION_ESSAYS);
  const stars = buildStarObjects(chosenStories, STUDIO_LAB_BLUEPRINTS, CONSTELLATION_ESSAYS);
  const standaloneResources = buildStandaloneSearchResources(stars, PULSE_INTELLIGENCE_FEED, STUDIO_LAB_BLUEPRINTS);

  writeStandaloneArticlePages(stars);
  syncSitemapAndAtomFeed(stars);

  const s0 = stars[0]; // Star 01: α Castor (initial active star)
  const totalLabCount = standaloneResources.length;
  const totalAllCount = 8 + 32 + totalLabCount;

  let html = readFileSync(indexHtmlPath, 'utf8');

  // 1. SVG Major Stars Layer
  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_MAJOR_STARS -->',
    '<!-- END_AUTO_MAJOR_STARS -->',
    renderMajorStarsSvg(stars, 'castor')
  );

  // 2. Hero Stationary HUD, Telemetry, Progress Nav & Nocturnal Peek Dock
  const cpnStepsHtml = stars
    .map((s) => {
      const m = s.meta;
      const ariaCur = m.key === 'castor' ? 'step' : 'false';
      return `        <button type="button" class="cpn-step" data-chain-type="${m.twin}" data-select-star="${m.key}" aria-current="${ariaCur}" aria-label="${m.idx} ${m.ariaStar}: ${escapeHtml(s.shortLabel)}">
          <span class="cpn-step-dot" aria-hidden="true"></span>
          <span class="cpn-step-label">${m.idx}<span class="cpn-step-name"> · <span class="greek">${m.greek}</span> ${m.starName}</span></span>
        </button>`;
    })
    .join('\n');

  const heroBarsHtml = `      <aside class="star-hud-card" id="star-hud-card" data-twin="${s0.hud.twin}" data-placement="below" data-hidden="true" data-hud-star="castor" aria-live="polite" aria-label="Focused Star Essay Preview">
        <div class="hud-pointer-notch" aria-hidden="true"></div>
        <div class="hud-scanline" aria-hidden="true"></div>
        <div class="hud-top-meta">
          <div class="hud-tags" id="hud-tags">
            <span class="hud-tag-pill">${escapeHtml(s0.hud.tags[0])}</span>
            <span class="hud-tag-pill">${escapeHtml(s0.hud.tags[1])}</span>
          </div>
          <div class="hud-meta-right">
            <span class="hud-read-time" id="hud-read-time">${escapeHtml(s0.hud.dateRead)}</span>
            <button type="button" class="hud-dismiss-btn" id="hud-dismiss-btn" title="Hide Floating Brief" aria-label="Hide Floating Brief">×</button>
          </div>
        </div>

        <h2 class="hud-title" id="hud-title">
          ${escapeHtml(s0.hud.hudTitle)}
        </h2>
        <p class="hud-summary" id="hud-summary">
          ${escapeHtml(s0.hud.hudSummary)}
        </p>

        <div class="hud-actions">
          <button type="button" class="hud-cta-primary" id="hud-read-btn" data-open-drawer="castor">
            <span id="hud-read-btn-label">${escapeHtml(s0.hud.ctaLabel)}</span>
          </button>
          <button type="button" class="hud-cta-secondary" id="hud-lab-btn" data-open-drawer="pollux">
            <span>Builder &amp; Code →</span>
          </button>
        </div>
      </aside>

      <!-- Bottom-Stage 3D Telemetry & Drag Hint -->
      <div class="hero-3d-telemetry-bar">
        <div class="h3d-pill">
          <span>3D RELATIONAL PIVOT · CLICK ANY STAR FOR INSTANT BRIEF · CLICK AGAIN FOR ESSAY</span>
          <span id="telemetry-angles">YAW -11.0° · PITCH 9.0° · DEPTH 34–1,200 LY</span>
          <button type="button" class="h3d-reset-btn" id="reset-3d-btn">Flat 0°</button>
        </div>
        <div class="h3d-pill">
          <span id="active-star-telemetry">FOREGROUND: STAR 01 · <span class="greek">α</span> CASTOR · 51 LIGHT-YEARS (CLICK AGAIN TO READ ESSAY)</span>
        </div>
      </div>
    </main>

    <!-- =====================================================================
         3. UNIFIED "YOU ARE HERE" CONSTELLATION PROGRESS & LOCATION BAR
         ===================================================================== -->
    <nav class="constellation-progress-nav" aria-label="Constellation Star Location and Progress">
      <div class="cpn-location-badge">
        <span class="cpn-loc-dot" aria-hidden="true"></span>
        <span id="cpn-location-text">YOU ARE HERE · STAR 01 / 08 (<span class="greek">α</span> CASTOR · ${escapeHtml(s0.shortLabel.toUpperCase())})</span>
      </div>

      <div class="cpn-track" role="group" aria-label="8 Stars of the Gemini Constellation">
${cpnStepsHtml}
      </div>

      <div class="cpn-arrows">
        <button type="button" class="cpn-arrow-btn" id="prev-star-btn" aria-label="Previous Star">← Prev</button>
        <button type="button" class="cpn-arrow-btn" id="next-star-btn" aria-label="Next Star">Next Star →</button>
      </div>
    </nav>

    <!-- =====================================================================
         4. BOTTOM NOCTURNAL TWIN PEEK DOCK (56px) + FLOATING SLIDE-UP ARROWS
         ===================================================================== -->
    <footer class="porcelain-peek-dock" aria-label="Twin Essay Peek Dock — Click to Slide Up Full Gemini Essay">
      <div class="peek-half peek-castor" role="button" tabindex="0" data-open-drawer="castor">
        <div class="peek-left-group">
          <span class="peek-twin-label">
            <span class="peek-dot" aria-hidden="true"></span>
            <span><span class="greek">α</span> CASTOR<span class="peek-twin-sub"> · THE SIGNAL</span></span>
          </span>
          <span class="peek-live-headline" id="peek-castor-headline">
            ${s0.hud.peekCastor}
          </span>
        </div>
        <div class="peek-right-group">
          <span class="peek-star-badge" id="peek-castor-badge"><span class="greek">α</span> GEM · 51 LY</span>
          <span class="peek-slide-up-btn">
            <span class="slide-up-arrow-icon" aria-hidden="true">↑</span>
            <span><span class="slide-up-word">Read </span>Essay</span>
          </span>
        </div>
      </div>

      <div class="peek-half peek-pollux" role="button" tabindex="0" data-open-drawer="pollux">
        <div class="peek-left-group">
          <span class="peek-twin-label">
            <span class="peek-dot" aria-hidden="true"></span>
            <span><span class="greek">β</span> POLLUX<span class="peek-twin-sub"> · THE WORKBENCH</span></span>
          </span>
          <span class="peek-live-headline" id="peek-pollux-headline">
            ${s0.hud.peekPollux}
          </span>
        </div>
        <div class="peek-right-group">
          <span class="peek-star-badge" id="peek-pollux-badge"><span class="greek">β</span> GEM · 34 LY</span>
          <span class="peek-slide-up-btn">
            <span class="slide-up-arrow-icon" aria-hidden="true">↑</span>
            <span><span class="slide-up-word">Builder &amp; </span>Code</span>
          </span>
        </div>
      </div>
    </footer>`;

  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_HERO_BARS -->',
    '<!-- END_AUTO_HERO_BARS -->',
    heroBarsHtml
  );

  // 3. Sheet Status + Article Microdata Date + Initial Complete Untruncated Essay SSR
  const sheetStatusHtml = `        <span id="sheet-location-status">✦ STAR 01 / 08 · <span class="greek">α</span> CASTOR (51 LY) · ${escapeHtml(s0.hud.dateRead.replace('⏱ ', ''))}</span>`;
  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_SHEET_STATUS -->',
    '<!-- END_AUTO_SHEET_STATUS -->',
    sheetStatusHtml
  );

  const articleLeadHtml = `        <meta itemprop="author" content="Google Gemini 4 Argon" />
        <meta itemprop="datePublished" id="article-date-published" content="${s0.hud.isoDate}" />`;
  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_ARTICLE_META -->',
    '<!-- END_AUTO_ARTICLE_META -->',
    articleLeadHtml
  );

  const sanctuarySsrHtml = `        <div class="article-sanctuary-column" id="sanctuary-essay-root" data-rendered-star="castor">
${renderSanctuaryEssayInnerHtml(s0.essay, { standalone: false })}
        </div>`;

  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_SANCTUARY_SSR -->',
    '<!-- END_AUTO_SANCTUARY_SSR -->',
    sanctuarySsrHtml
  );

  // 4. Search Dialog Header, Prompt Chips & Initial SEO JSON-LD
  const promptChips = [
    ...stars.slice(0, 5).map((s) => ({
      q: s.shortLabel,
      label: s.shortLabel,
    })),
    { q: 'DeepMind open letter', label: 'DeepMind Letter' },
  ];

  const searchHeaderHtml = `    <div class="cs-top-header">
      <div class="cs-eyebrow-row">
        <span id="celestial-search-title">✦ CELESTIAL OBSERVATORY SEARCH &amp; COMMAND PALETTE · 8 STARS · 32 CHAPTERS · ${totalLabCount} ESSAYS, LABS &amp; ARCHIVES</span>
        <button type="button" class="cs-close-pill" id="close-search-btn" aria-label="Close Search Dialog">ESC · CLOSE ×</button>
      </div>

      <search aria-label="Search the Gemini Constellation, Dual-Lens Essays, and Interactive Labs">
        <form id="celestial-search-form" class="cs-search-form">
          <label for="celestial-search-input" class="sr-only">Search Gemini releases, stars, flagship essays, no-code guides, or interactive labs</label>
          <svg class="cs-input-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.8" cy="6.8" r="4.8" stroke="currentColor" stroke-width="1.5"/>
            <line x1="10.4" y1="10.4" x2="14.2" y2="14.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            type="search"
            id="celestial-search-input"
            class="cs-search-input"
            placeholder="Ask anything or search essays, stars &amp; labs (e.g., '${escapeHtml(stars[0].shortLabel)}', '${escapeHtml(stars[1].shortLabel)}', 'cut API bill')"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="button" class="cs-clear-btn" id="cs-clear-btn" hidden aria-label="Clear search query">Clear</button>
          <button type="submit" class="cs-submit-btn">Open Top Match ↵</button>
        </form>
      </search>

      <div class="cs-prompts-row" aria-label="Suggested Search Intents">
        <span class="cs-prompt-label">Try:</span>
${promptChips.map((c) => `        <button type="button" class="cs-prompt-chip" data-search-prompt="${escapeHtml(c.q)}">${escapeHtml(c.label)}</button>`).join('\n')}
      </div>
    </div>

    <div class="cs-scope-bar">
      <div class="cs-scope-tabs" role="group" aria-label="Filter Search Results by Category">
        <button type="button" class="cs-scope-tab" data-search-scope="all" aria-pressed="true">All (<span data-scope-count="all">${totalAllCount}</span>)</button>
        <button type="button" class="cs-scope-tab" data-search-scope="star" aria-pressed="false">✦ 8 Stars (<span data-scope-count="star">8</span>)</button>
        <button type="button" class="cs-scope-tab" data-search-scope="chapter" aria-pressed="false">📖 32 Chapters (<span data-scope-count="chapter">32</span>)</button>
        <button type="button" class="cs-scope-tab" data-search-scope="lab" aria-pressed="false">⚡ Essays &amp; Labs (<span data-scope-count="lab">${totalLabCount}</span>)</button>
      </div>
      <span class="cs-count-meta" id="cs-count-meta" aria-live="polite">SHOWING TOP MATCHES ACROSS CASTOR &amp; POLLUX</span>
    </div>`;

  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_SEARCH_HEADER -->',
    '<!-- END_AUTO_SEARCH_HEADER -->',
    searchHeaderHtml
  );

  const initialSchemaObj = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: s0.essay.plainHeadline,
        description: s0.essay.plainStandfirst,
        datePublished: s0.hud.isoDate,
        url: `https://geminipulse.com${s0.essay.permalinkUrl}`,
        author: { '@type': 'Person', name: 'Google Gemini 4 Argon' },
        contributor: { '@type': 'Person', name: 'Neil S. White' },
        citation: s0.essay.primarySourceUrls,
      },
      {
        '@type': 'FAQPage',
        mainEntity: s0.essay.faqPlain.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      },
    ],
  };
  const seoSchemaHtml = `  <script type="application/ld+json" id="dynamic-seo-geo-schema">
${JSON.stringify(initialSchemaObj, null, 2)
  .split('\n')
  .map((l) => `  ${l}`)
  .join('\n')}
  </script>`;

  html = replaceBetweenMarkers(
    html,
    '<!-- BEGIN_AUTO_SEO_SCHEMA -->',
    '<!-- END_AUTO_SEO_SCHEMA -->',
    seoSchemaHtml
  );

  // 5. JS Constellation Data (`STARS_3D`, `SALON_DATA`, `STAR_PILL_GEOM`, `HUD_DATA`)
  // Full 8-star `ESSAY_DATA` payload (~190KB) is written to `/articles/essays-data.json` and fetched on-demand
  // (Star 01 `castor` is already SSR-rendered inside `#sanctuary-essay-root` for instant zero-network reading!).
  const stars3dMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.star3d]));
  const salonDataMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.salon]));
  const pillGeomMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.geom]));
  const hudDataMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.hud]));
  const essayDataMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.essay]));

  writeFileSync(resolve(articlesDir, 'essays-data.json'), JSON.stringify(essayDataMap));

  const constellationJs = `      const STARS_3D = ${JSON.stringify(stars3dMap)};
      const SALON_DATA = ${JSON.stringify(salonDataMap)};
      const STAR_PILL_GEOM = ${JSON.stringify(pillGeomMap)};
      const HUD_DATA = ${JSON.stringify(hudDataMap)};`;

  html = replaceBetweenMarkers(
    html,
    '/* BEGIN_AUTO_CONSTELLATION_DATA */',
    '/* END_AUTO_CONSTELLATION_DATA */',
    constellationJs
  );

  // 6. JS Search Data (`AUTO_STANDALONE_RESOURCES`)
  const searchDataJs = `      const AUTO_STANDALONE_RESOURCES = ${JSON.stringify(standaloneResources)};`;
  html = replaceBetweenMarkers(
    html,
    '/* BEGIN_AUTO_SEARCH_DATA */',
    '/* END_AUTO_SEARCH_DATA */',
    searchDataJs
  );

  const rootHtml = html
    .replace(
      '<link rel="canonical" href="https://geminipulse.com/prototypes/look-j-3d-celestial-navigator.html" />',
      '<link rel="canonical" href="https://geminipulse.com/" />'
    )
    .replace(
      '<meta property="og:url" content="https://geminipulse.com/prototypes/look-j-3d-celestial-navigator.html" />',
      '<meta property="og:url" content="https://geminipulse.com/" />'
    );

  writeFileSync(indexHtmlPath, rootHtml);
  if (existsSync(dirname(lookJPrototypePath))) {
    const prototypeHtml = rootHtml
      .replace(
        '<link rel="canonical" href="https://geminipulse.com/" />',
        '<link rel="canonical" href="https://geminipulse.com/prototypes/look-j-3d-celestial-navigator.html" />'
      )
      .replace(
        '<meta property="og:url" content="https://geminipulse.com/" />',
        '<meta property="og:url" content="https://geminipulse.com/prototypes/look-j-3d-celestial-navigator.html" />'
      );
    writeFileSync(lookJPrototypePath, prototypeHtml);
  }

  console.log(
    `✦ Synced 8 Flagship Dual-Lens Gemini Essays in index.html, look-j prototype & /articles/*.html (${stars[0].dates.titleShort} → ${stars[7].dates.titleShort} · ${totalLabCount} Essays/Labs/Archives indexed)`
  );
  return { stars, totalLabCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncConstellation().catch((err) => {
    console.error('Failed to sync constellation:', err);
    process.exit(1);
  });
}
