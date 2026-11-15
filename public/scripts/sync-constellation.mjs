#!/usr/bin/env node
/**
 * GeminiPulse.com — Autonomous 3D Constellation & Sanctuary Sync Engine
 * (`public/scripts/sync-constellation.mjs`)
 *
 * Runs automatically during `npm run prebuild` (via `stamp-build.mjs`) and on demand.
 * Reads `PULSE_INTELLIGENCE_FEED` and `STUDIO_LAB_BLUEPRINTS` from
 * `public/src/data/geminiEcosystemData.js`, plus companion 3-part HTML series
 * under `public/public/series/` and standalone labs under `public/public/labs/`,
 * and deterministically updates all 8 constellation stars, HUD briefs, Nocturnal
 * Twin Salons, 4-Chapter Reading Sanctuaries, Dynamic SEO/GEO Schema.org JSON-LD,
 * and the ⌘K Celestial Search & Command Palette in:
 *   1. `public/index.html`
 *   2. `public/public/prototypes/look-j-3d-celestial-navigator.html`
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..');
const staticPublicDir = resolve(publicDir, 'public');
const indexHtmlPath = resolve(publicDir, 'index.html');
const lookJPrototypePath = resolve(staticPublicDir, 'prototypes/look-j-3d-celestial-navigator.html');
const dataModulePath = resolve(publicDir, 'src/data/geminiEcosystemData.js');

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
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateClean(str, maxLen) {
  const clean = String(str || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = lastSpace > Math.floor(maxLen * 0.55) ? sliced.slice(0, lastSpace) : sliced;
  return base.replace(/[,:;.\-–—\s]+$/, '') + '…';
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

function formatReleaseDates(dateStr) {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    return {
      upperShort: 'NOV 14, 2026',
      titleShort: 'Nov 14, 2026',
      isoDate: '2026-11-14',
    };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).formatToParts(parsed);
  const month = parts.find((p) => p.type === 'month')?.value || 'Nov';
  const day = parts.find((p) => p.type === 'day')?.value || '14';
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
  };
}

/**
 * Selects the 8 freshest distinct flagship stories from PULSE_INTELLIGENCE_FEED.
 * Always places PULSE_INTELLIGENCE_FEED[0] (sorted newest-first) on Star 01 (α Castor),
 * and prefers distinct `seriesUrl` across the 8 stars so every star has its own
 * dedicated 3-Part Series and Agile Labs workbench.
 */
function selectConstellationStories(feed) {
  const indexed = feed.map((item, idx) => ({
    item,
    idx,
    ts: Number.isNaN(Date.parse(item.date)) ? 0 : Date.parse(item.date),
    isPart1: String(item.seriesUrl || '').includes('/part-1'),
  }));
  indexed.sort((a, b) => {
    const dayDiff = Math.floor(b.ts / 86400000) - Math.floor(a.ts / 86400000);
    if (dayDiff !== 0) return dayDiff;
    if (a.isPart1 !== b.isPart1) return a.isPart1 ? -1 : 1;
    return b.ts !== a.ts ? b.ts - a.ts : a.idx - b.idx;
  });

  const chosen = [];
  const usedIds = new Set();
  const usedSeries = new Set();

  for (const entry of indexed) {
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

  // Fallback if fewer than 8 unique series exist
  for (const entry of indexed) {
    if (chosen.length >= 8) break;
    if (!usedIds.has(entry.item.id)) {
      chosen.push(entry.item);
      usedIds.add(entry.item.id);
    }
  }

  return chosen.slice(0, 8);
}

/**
 * Derives a crisp <= 19 character star pill destination label for any current or future release.
 */
function deriveShortStarLabel(item) {
  const badge = String(item.modelBadge || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/@google\/genai\s*&\s*google-genai/i, 'Gen AI SDK')
    .replace(/@google\/genai/i, 'Gen AI SDK')
    .replace(/google-genai/i, 'Python SDK')
    .trim();

  // Split only on spaced slashes (" / "), "&", or "+" so slash commands like "/teamwork" stay intact
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
    let primary = badgeParts[0]
      .replace(/^Antigravity\s+\/teamwork$/i, 'Teamwork Agents')
      .replace(/^Gemini Decision 1$/i, 'Decisions API')
      .replace(/^Gemini in AI Studio$/i, 'Maps in AI Studio');
    if (primary.length >= 8 && primary.length <= 19) return primary;
    if (primary.length > 19) {
      const trimmed = truncateWordsNoEllipsis(primary, 19);
      if (trimmed.length >= 8) return trimmed;
    }
  }

  // Fallback from item.title main clause
  const mainClause = String(item.title || '')
    .split(':')[0]
    .replace(/^Google(\s+DeepMind|\s+Cloud|\s+Research)?\s+(Launches|Unveils|Integrates|Releases|Announces|Publishes|Donates|Embeds|Opens)\s+/i, '')
    .replace(/\s+into\s+Google\s+/i, ' ')
    .replace(/\s+into\s+/i, ' ')
    .replace(/\s+to\s+General\s+Availability$/i, ' GA')
    .trim();

  return truncateWordsNoEllipsis(mainClause, 19) || 'Gemini Update';
}

/**
 * Builds zero-truncation <= 40 visible-char bottom peek dock headlines (`Main. <em>Hook.</em>`).
 */
function buildPeekHeadlines(shortLabel, item, labTitle) {
  const cleanTag = String(item.tag || 'Verified')
    .replace(/General Availability/i, 'Now GA')
    .replace(/Research Breakthrough/i, 'Multi-agent R&D')
    .replace(/Feature Launch/i, 'Live rollout')
    .replace(/Model Launch/i, 'New model')
    .replace(/SDK Milestone/i, 'SDK upgrade')
    .replace(/Pre-Orders Live/i, 'Pre-orders')
    .trim();

  const maxHookCastor = Math.max(8, 36 - shortLabel.length);
  const hookCastor = truncateWordsNoEllipsis(cleanTag, maxHookCastor);

  let polluxLead = String(labTitle || item.labLabel || 'Interactive Lab')
    .replace(/\[SIMULATED DEMO\]/gi, '')
    .replace(/^Google\s+(DeepMind\s+|Cloud\s+)?/i, '')
    .replace(/\s+&\s+.*$/, '')
    .replace(/\s+Simulator$/i, ' Lab')
    .replace(/\s+Workbench$/i, ' Lab')
    .replace(/→/g, '')
    .trim();
  polluxLead = truncateWordsNoEllipsis(polluxLead, 22) || shortLabel;

  const maxHookPollux = Math.max(8, 36 - polluxLead.length);
  const hookPollux = truncateWordsNoEllipsis('Try live lab', maxHookPollux);

  return {
    peekCastor: `${escapeHtml(shortLabel)}: <em>${escapeHtml(hookCastor)}.</em>`,
    peekPollux: `${escapeHtml(polluxLead)}: <em>${escapeHtml(hookPollux)}.</em>`,
  };
}

/**
 * Reads companion 3-part HTML series files (`part-1`, `part-2`, `part-3`) if present on disk
 * to extract authentic titles, summaries, body paragraphs, and SDK code blocks.
 */
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
      .map((m) => stripTags(m[1]))
      .filter((t) => t.length > 55 && !t.startsWith('←') && !t.startsWith('Below is'));
    const codeMatch = html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i) || html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);

    const rawTitle = h1Match ? stripTags(h1Match[1]).replace(/^Part\s+\d+\s*:\s*/i, '') : '';
    const rawBox = boxMatch
      ? stripTags(boxMatch[1]).replace(/^(Executive Summary|Strategic Takeaway|Hands-On Objective|Key Takeaway)\s*:\s*/i, '')
      : '';

    return {
      title: rawTitle,
      box: rawBox,
      paragraphs: pMatches,
      code: codeMatch ? decodeHtmlEntities(codeMatch[1]).trim() : '',
    };
  };

  return {
    part1: parsePartHtml(findPart('part-1')),
    part2: parsePartHtml(findPart('part-2')),
    part3: parsePartHtml(findPart('part-3')),
  };
}

/**
 * Extracts numbered breakthroughs `(1) ... (2) ...` from PULSE_INTELLIGENCE_FEED `summary`.
 */
function extractNumberedMilestones(summaryStr) {
  const text = String(summaryStr || '');
  const matches = [...text.matchAll(/\((\d+)\)\s*([^()]+?)(?=,\s*\(\d+\)|,\s*and\s*\(\d+\)|\.\s|$)/g)];
  return matches.map((m) => m[2].replace(/^[—–\-:\s]+/, '').replace(/[,;\s]+$/, '').trim()).filter(Boolean);
}

function trimCodeSnippet(rawCode, fallbackModel = 'gemini-4-hydrogen') {
  if (!rawCode) {
    return `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();
const interaction = await ai.interactions.create({
  model: "${fallbackModel}",
  input: "Summarize verified release architecture and team impact.",
  tools: [{ type: "google_search" }]
});`;
  }
  const lines = rawCode.split('\n');
  if (lines.length <= 16) return rawCode;
  return lines.slice(0, 15).join('\n') + '\n// ... see full blueprint in standalone Part 3 & Lab';
}

function buildStarObjects(stories, blueprints) {
  const blueprintByHref = new Map();
  for (const bp of blueprints) {
    if (bp.href) blueprintByHref.set(bp.href, bp);
  }

  return STAR_META.map((meta, index) => {
    const item = stories[index];
    const dates = formatReleaseDates(item.date);
    const shortLabel = deriveShortStarLabel(item);
    const bp = item.labUrl ? blueprintByHref.get(item.labUrl) : null;
    const seriesParts = parseSeriesPartsFromDisk(item.seriesUrl);
    const milestones = extractNumberedMilestones(item.summary);

    // Compute exact SVG pill geometry so text never clips or collides
    const prefixText = `${meta.greek} ${meta.starName.toUpperCase()}  `;
    const pillW = Math.max(184, Math.min(226, Math.round(prefixText.length * 5.6 + shortLabel.length * 6.85 + 26)));

    const cleanTldr = String(item.tldr || '')
      .replace(/^(Released|Published)\s+[A-Za-z]+\s+\d+(?:–\d+)?,\s+\d{4}(?:\s*\([^)]*\))?\s*:\s*/i, '')
      .trim();

    const rawTitleParts = String(item.title || '').split(':');
    const mainHeadline = rawTitleParts[0].trim();
    const subHeadline = (rawTitleParts[1] || '').trim();
    const hudTitle =
      item.title.length <= 78
        ? item.title
        : mainHeadline.length <= 78
          ? mainHeadline
          : truncateClean(mainHeadline, 78);
    const hudSummary = truncateClean(cleanTldr, 154);

    const { peekCastor, peekPollux } = buildPeekHeadlines(shortLabel, item, bp?.title);

    // 4 Bespoke Non-Repetitive Chapters (from 3-part HTML series on disk + feed ledger)
    const p1 = seriesParts?.part1;
    const p2 = seriesParts?.part2;
    const p3 = seriesParts?.part3;

    const ch1Title = `01 · ${truncateClean(p1?.title || mainHeadline, 72)}`;
    const ch1Sub = truncateClean(p1?.box || cleanTldr, 145);
    const ch1Text = truncateClean(
      p1?.paragraphs?.[0]
        ? `${p1.box ? p1.box + ' ' : ''}${p1.paragraphs[0]}`
        : item.summary.split('. ').slice(0, 2).join('. ') + '.',
      380
    );

    const ch2Title = `02 · ${truncateClean(
      p2?.title || (subHeadline ? `How ${shortLabel} Changes Workflows: ${subHeadline}` : `How ${shortLabel} Applies to Builders & Teams`),
      72
    )}`;
    const ch2Sub = truncateClean(p2?.box || milestones[0] || cleanTldr, 145);
    const ch2Text = truncateClean(
      p2?.paragraphs?.[0]
        ? `${p2.box ? p2.box + ' ' : ''}${p2.paragraphs[0]}`
        : milestones.slice(0, 2).join('. ') || item.summary,
      380
    );

    const ch3Title = `03 · ${truncateClean(p3?.title || `Production Blueprint & @google/genai Implementation`, 72)}`;
    const ch3Sub = truncateClean(p3?.box || milestones[1] || `Verified implementation pattern and runtime guardrails for ${shortLabel}.`, 145);
    const ch3Text = truncateClean(
      p3?.paragraphs?.[0]
        ? `${p3.box ? p3.box + ' ' : ''}${p3.paragraphs[0]}`
        : milestones.slice(2, 4).join('. ') || cleanTldr,
      360
    );

    const ch4Title = `04 · Key Takeaways & Primary Google Verification (${dates.titleShort})`;
    const ch4Sub = truncateClean(
      `Grounded directly against ${item.sourceLabel || 'official Google primary documentation'} (${item.impactScore || '10/10'}).`,
      145
    );
    const milestoneDigest = milestones.length > 0
      ? `Core verified capabilities: ${milestones.slice(0, 4).join('; ')}.`
      : cleanTldr;
    const ch4Text = truncateClean(`${milestoneDigest} Verified via ${item.groundedBy || item.sourceLabel}.`, 380);

    const rawCode = bp?.tsCode || p3?.code || '';
    const codeSnippet = trimCodeSnippet(rawCode, bp?.model || 'gemini-4-hydrogen');
    const codeCaption = `VERIFIED ${String(item.modelBadge || '@GOOGLE/GENAI').toUpperCase().slice(0, 44)} BLUEPRINT`;

    // Salon Spread Data (Castor Signal + Pollux Workbench)
    const castorMain = `${truncateWordsNoEllipsis(shortLabel, 24)} (${dates.titleShort.replace(', 2026', '')}).`;
    const castorItalic = truncateClean(subHeadline ? subHeadline.split(',')[0] : item.tag || 'Verified Google Release', 42);
    const castorDek = `<strong>How it applies to you:</strong> ${escapeHtml(truncateClean(cleanTldr, 235))}`;

    const polluxLabCleanTitle = bp
      ? bp.title.replace(/\s*\[SIMULATED DEMO\]\s*/gi, '').trim()
      : (item.labLabel || 'Interactive Agile Lab').replace(/→/g, '').replace(/\[DEMO\]/gi, '').trim();
    const polluxMain = `${truncateClean(polluxLabCleanTitle, 38)}.`;
    const polluxItalic = 'Interactive simulation & SDK export.';
    const polluxDek = `<strong>Live Workbench:</strong> ${escapeHtml(
      truncateClean(
        bp?.description || `Explore interactive scenarios, latency/cost telemetry, and copy-ready @google/genai code for ${shortLabel}.`,
        215
      )
    )}`;

    // 3 Interactive Presets in Pollux Atelier Console
    let presets = [];
    if (bp?.simulatedSteps && bp.simulatedSteps.length >= 3) {
      presets = bp.simulatedSteps.slice(0, 3).map((st, sIdx) => {
        const cleanStepLabel = String(st.label || `STEP ${sIdx + 1}`)
          .replace(/^step\[\d+\]\s*[•·-]\s*/i, '')
          .toUpperCase();
        const shortBtn = `${sIdx + 1}. ${truncateWordsNoEllipsis(cleanStepLabel, 13)}`;
        const detailSentences = String(st.detail || '').split(/\.\s+/).filter(Boolean);
        return {
          label: shortBtn,
          k1: '1. Stage:',
          v1: truncateClean(cleanStepLabel, 30),
          k2: '2. Telemetry:',
          v2: truncateClean(detailSentences[0] || st.detail, 34),
          k3: '3. Outcome:',
          v3: truncateClean(detailSentences[1] || item.impactScore || 'Verified Primary Source', 34),
        };
      });
    } else {
      const m0 = milestones[0] || cleanTldr;
      const m1 = milestones[1] || cleanTldr;
      const m2 = milestones[2] || item.groundedBy || 'Primary Google Link';
      presets = [
        {
          label: '1. ARCHITECTURE',
          k1: '1. Release:',
          v1: truncateClean(shortLabel, 30),
          k2: '2. Highlight:',
          v2: truncateClean(m0, 34),
          k3: '3. Date:',
          v3: dates.titleShort,
        },
        {
          label: '2. CAPABILITY',
          k1: '1. Badge:',
          v1: truncateClean(item.modelBadge, 30),
          k2: '2. Milestone:',
          v2: truncateClean(m1, 34),
          k3: '3. Impact:',
          v3: item.impactScore || '9.9 / 10',
        },
        {
          label: '3. VERIFICATION',
          k1: '1. Grounding:',
          v1: '100% Google Primary URL',
          k2: '2. Key Gain:',
          v2: truncateClean(m2, 34),
          k3: '3. Series:',
          v3: '3-Part Deep Dive Live',
        },
      ];
    }

    const catTag = String(item.category || 'GEMINI')
      .toUpperCase()
      .replace(/DEVELOPER TOOLS & STUDIO/i, 'AI STUDIO')
      .replace(/AGENTS & ANTIGRAVITY/i, 'ANTIGRAVITY')
      .replace(/PERSONAL INTELLIGENCE/i, 'PERSONAL AI')
      .slice(0, 18);
    const secTag = String(item.tag || 'LAUNCH').toUpperCase().slice(0, 18);

    return {
      meta,
      item,
      dates,
      shortLabel,
      pillW,
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
        castorMain,
        castorItalic,
        castorDek,
        specCode: `STAR ${meta.idx} · ${meta.greek} ${meta.starName.toUpperCase()}`,
        k1: 'Model / Platform',
        v1: truncateClean(item.modelBadge || shortLabel, 30),
        k2: 'Verified Release',
        v2: `${dates.titleShort} · ${item.impactScore || '10/10'}`,
        k3: 'Astrophysical Depth',
        v3: meta.astroDepth,
        sourceUrl: item.sourceUrl,
        polluxBadge: meta.pairedPolluxBadge,
        polluxMain,
        polluxItalic,
        polluxDek,
        consoleKicker: `STAR ${meta.idx} INTERACTIVE LAB`,
        presets,
      },
      hud: {
        twin: meta.twin,
        tags: [catTag, secTag],
        dateRead: `${dates.upperShort} · ⏱ 4 MIN READ`,
        isoDate: dates.isoDate,
        ctaLabel: '↑ Read Full Brief (4 Min)',
        hudTitle,
        hudSummary,
        peekCastor,
        peekPollux,
        seriesUrl: item.seriesUrl || '/workbench.html',
        seriesLabel: `Open 3-Part ${shortLabel} Series →`,
        labUrl: item.labUrl || '/workbench.html',
        labLabel: `Launch ${shortLabel} Lab [DEMO] →`,
        codeCaption,
        codeSnippet,
        toc: [
          { label: '01 · What Shipped', title: ch1Title, sub: ch1Sub, text: ch1Text },
          { label: '02 · Workflow ROI', title: ch2Title, sub: ch2Sub, text: ch2Text },
          { label: '03 · SDK Blueprint', title: ch3Title, sub: ch3Sub, text: ch3Text },
          { label: '04 · Key Takeaways', title: ch4Title, sub: ch4Sub, text: ch4Text },
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
      const ariaLabel = escapeHtml(`${m.ariaStar}: ${s.shortLabel} (${s.dates.titleShort})`);

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
              <text class="star-depth-chip" data-depth-tag="${m.key}" x="${m.depthChipX}" y="${m.depthChipY}">${m.lyDisplay} LY</text>
              <text class="star-sub-meta" x="${textX}" y="-19">${m.idx} · ${s.dates.upperShort.replace(', 2026', '')} · ${m.lyDisplay} LY</text>
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
              <text class="star-depth-chip" data-depth-tag="${m.key}" x="${m.depthChipX}" y="${m.depthChipY}">${m.lyDisplay} LY</text>
              <text class="star-sub-meta" x="${textX}" y="-19">${m.idx} · ${s.dates.upperShort.replace(', 2026', '')} · ${m.lyDisplay} LY</text>
              <circle class="star-halo" cx="0" cy="0" r="${m.haloR}" />
              <circle class="star-reticle" cx="0" cy="0" r="${m.reticleR}" />
              <circle class="${coreClass}" cx="0" cy="0" r="${m.coreR}" />
            </g>`;
    })
    .join('\n\n');
}

function buildStandaloneSearchResources(feed, blueprints) {
  const resources = [];
  const seenUrls = new Set();

  // 1. All interactive blueprints from STUDIO_LAB_BLUEPRINTS
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
      desc: truncateClean(bp.description, 175),
      keywords: `${bp.title} ${bp.model || ''} ${bp.badge || ''} ${bp.description || ''}`.toLowerCase(),
      url: bp.href,
      primaryActionLabel: 'Launch Studio Lab ↗',
    });
  }

  // 2. All curated series & companion labs from PULSE_INTELLIGENCE_FEED
  for (const item of feed) {
    const dates = formatReleaseDates(item.date);
    if (item.seriesUrl && !seenUrls.has(item.seriesUrl)) {
      seenUrls.add(item.seriesUrl);
      resources.push({
        id: `series-${item.id}`,
        scope: 'lab',
        twin: 'castor',
        badgeKind: '📜 3-PART RELEASE SERIES',
        badgeSub: `${dates.upperShort} · ${String(item.category || 'GEMINI').toUpperCase()}`,
        title: truncateClean(item.title, 96),
        desc: truncateClean(item.tldr, 175),
        keywords: `${item.title} ${item.modelBadge || ''} ${item.category || ''} ${item.tag || ''}`.toLowerCase(),
        url: item.seriesUrl,
        primaryActionLabel: 'Read 3-Part Series ↗',
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
        title: `${deriveShortStarLabel(item)} Interactive Studio`,
        desc: truncateClean(item.tldr, 165),
        keywords: `${item.title} ${item.modelBadge || ''} lab simulator demo`.toLowerCase(),
        url: item.labUrl,
        primaryActionLabel: 'Launch Lab ↗',
      });
    }
  }

  // 3. Evergreen Flagship Sanctuaries & Hubs
  const evergreen = [
    {
      id: 'series-open-letter-deepmind',
      scope: 'lab',
      twin: 'castor',
      badgeKind: '📜 FLAGSHIP OPEN LETTER',
      badgeSub: 'PUBLIC PREVIEW OBSERVATORY',
      title: 'An Open Letter to Google DeepMind & Google AI Studio: The Public Preview Observatory',
      desc: 'Why Neil S. White and Google Gemini 4 Argon built GeminiPulse—and our proposal to evaluate experimental Gemini checkpoints in public.',
      keywords: 'open letter google deepmind ai studio neil white gemini 4 argon charter public preview observatory',
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

function replaceBetweenMarkers(source, startMarker, endMarker, replacement) {
  const sIdx = source.indexOf(startMarker);
  const eIdx = source.indexOf(endMarker);
  if (sIdx === -1 || eIdx === -1 || eIdx < sIdx) {
    throw new Error(`Missing or invalid markers: ${startMarker} ... ${endMarker}`);
  }
  return source.slice(0, sIdx + startMarker.length) + '\n' + replacement + '\n' + source.slice(eIdx);
}

export async function syncConstellation() {
  const dataUrl = `${pathToFileURL(dataModulePath).href}?t=${Date.now()}`;
  const { PULSE_INTELLIGENCE_FEED, STUDIO_LAB_BLUEPRINTS } = await import(dataUrl);

  const chosenStories = selectConstellationStories(PULSE_INTELLIGENCE_FEED);
  const stars = buildStarObjects(chosenStories, STUDIO_LAB_BLUEPRINTS);
  const standaloneResources = buildStandaloneSearchResources(PULSE_INTELLIGENCE_FEED, STUDIO_LAB_BLUEPRINTS);

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

  const heroBarsHtml = `      <aside class="star-hud-card" id="star-hud-card" data-twin="${s0.hud.twin}" data-placement="below" data-hidden="true" data-hud-star="castor" aria-live="polite" aria-label="Focused Star Article Brief">
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
            <span>Open Lab →</span>
          </button>
        </div>
      </aside>

      <!-- Bottom-Stage 3D Telemetry & Drag Hint -->
      <div class="hero-3d-telemetry-bar">
        <div class="h3d-pill">
          <span>3D RELATIONAL PIVOT · CLICK ANY STAR TO PULL TO FOREGROUND</span>
          <span id="telemetry-angles">YAW -11.0° · PITCH 9.0° · DEPTH 34–1,200 LY</span>
          <button type="button" class="h3d-reset-btn" id="reset-3d-btn">Flat 0°</button>
        </div>
        <div class="h3d-pill">
          <span id="active-star-telemetry">FOREGROUND: STAR 01 · <span class="greek">α</span> CASTOR · 51 LIGHT-YEARS (SCALE 1.28× · DRAG 360°)</span>
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
    <footer class="porcelain-peek-dock" aria-label="Twin Salons Peek Dock — Click to Slide Up Full Content">
      <div class="peek-half peek-castor" role="button" tabindex="0" data-open-drawer="castor" aria-label="Slide up Alpha Castor Signal Salon">
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
            <span><span class="slide-up-word">Slide Up </span>Signal</span>
          </span>
        </div>
      </div>

      <div class="peek-half peek-pollux" role="button" tabindex="0" data-open-drawer="pollux" aria-label="Slide up Beta Pollux Workbench Salon">
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
            <span><span class="slide-up-word">Slide Up </span>Lab</span>
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

  // 3. Sheet Status + Article Microdata Date + Initial Chapter 01 SSR
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

  const d0 = s0.salon;
  const h0 = s0.hud;
  const p0 = d0.presets[0];
  const dividerHtml = `          <div class="celestial-chapter-divider" aria-hidden="true">
            <span class="ccd-glyph">✦ · <svg width="11" height="12" viewBox="0 0 14 16" aria-hidden="true" style="vertical-align:-1px;margin-inline:2px;"><path d="M1.5 2 H12.5 M1.5 14 H12.5" stroke="#CEC0FF" stroke-width="1.35" stroke-linecap="round"/><line x1="4.6" y1="2.3" x2="4.6" y2="13.7" stroke="#7EB8FF" stroke-width="1.55" stroke-linecap="round"/><line x1="9.4" y1="2.3" x2="9.4" y2="13.7" stroke="#F59E3F" stroke-width="1.55" stroke-linecap="round"/></svg> · ✦</span>
          </div>`;

  const sanctuarySsrHtml = `        <div class="article-sanctuary-column">
          <div class="article-deep-col">
            <section class="chapter-card" id="chapter-01" data-chapter-card="0" data-active-chapter="true">
              <div class="chapter-kicker">
                <span id="chap1-kicker">CHAPTER 01 / 04 · WHAT SHIPPED</span>
                <span><span class="greek">α</span> CASTOR · THE SIGNAL</span>
              </div>
              <h3 class="chapter-h3" id="chap1-title" tabindex="-1" itemprop="headline">
                ${escapeHtml(h0.toc[0].title)}
              </h3>
              <p class="chapter-sub" id="chap1-sub">
                ${escapeHtml(h0.toc[0].sub)}
              </p>
              <p class="chapter-body" id="chap1-body" itemprop="articleBody">
                ${escapeHtml(h0.toc[0].text)}
              </p>
            </section>
          </div>

${dividerHtml}

          <div class="magazine-spread" id="nocturnal-twin-deck">
            <aside class="spread-salon spread-castor" aria-label="Alpha Castor Nocturnal Sapphire Signal Ledger">
              <div class="salon-header-row">
                <span class="shr-title">
                  <span class="peek-dot" aria-hidden="true"></span>
                  <span><span class="greek">α</span> CASTOR · THE SIGNAL</span>
                </span>
                <span class="shr-badge" data-sync="castor-star-badge" id="castor-star-badge"><span class="greek">α</span> GEM · A1V · 51 LY</span>
              </div>

              <div class="salon-body-split">
                <div class="salon-story-col">
                  <h2 class="couture-headline" id="castor-salon-heading" tabindex="-1">
                    <span data-sync="castor-title-main" id="castor-title-main">${escapeHtml(d0.castorMain)}</span>
                    <em data-sync="castor-title-italic" id="castor-title-italic">${escapeHtml(d0.castorItalic)}</em>
                  </h2>
                  <p class="couture-dek" data-sync-html="castor-dek" id="castor-dek">
                    ${d0.castorDek}
                  </p>
                </div>

                <div class="telemetry-card" aria-label="Verified Google Telemetry">
                  <div class="tc-header">
                    <span>SIGNAL LEDGER</span>
                    <span data-sync-html="castor-spec-code" id="castor-spec-code">STAR 01 · <span class="greek">α</span> CASTOR</span>
                  </div>
                  <div class="tc-row">
                    <span class="tc-key" data-sync="tc-k1" id="tc-k1">${escapeHtml(d0.k1)}</span>
                    <span class="tc-val" data-sync="tc-v1" id="tc-v1">${escapeHtml(d0.v1)}</span>
                  </div>
                  <div class="tc-row">
                    <span class="tc-key" data-sync="tc-k2" id="tc-k2">${escapeHtml(d0.k2)}</span>
                    <span class="tc-val" data-sync="tc-v2" id="tc-v2">${escapeHtml(d0.v2)}</span>
                  </div>
                  <div class="tc-row">
                    <span class="tc-key" data-sync="tc-k3" id="tc-k3">${escapeHtml(d0.k3)}</span>
                    <span class="tc-val" data-sync="tc-v3" id="tc-v3">${escapeHtml(d0.v3)}</span>
                  </div>
                  <a class="tc-source-link" data-sync-href="castor-source-link" id="castor-source-link" href="${escapeHtml(d0.sourceUrl)}" target="_blank" rel="noopener noreferrer">
                    <span>Verified Google Source</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </aside>

            <aside class="spread-salon spread-pollux" aria-label="Beta Pollux Nocturnal Amber-Bronze Interactive Workbench">
              <div class="salon-header-row">
                <span class="shr-title">
                  <span class="peek-dot" aria-hidden="true"></span>
                  <span><span class="greek">β</span> POLLUX · THE WORKBENCH</span>
                </span>
                <span class="shr-badge" data-sync="pollux-star-badge" id="pollux-star-badge"><span class="greek">β</span> GEM · K0III · 34 LY</span>
              </div>

              <div class="salon-body-split">
                <div class="salon-story-col">
                  <h2 class="couture-headline" id="pollux-salon-heading" tabindex="-1">
                    <span data-sync="pollux-title-main" id="pollux-title-main">${escapeHtml(d0.polluxMain)}</span>
                    <em data-sync="pollux-title-italic" id="pollux-title-italic">${escapeHtml(d0.polluxItalic)}</em>
                  </h2>
                  <p class="couture-dek" data-sync-html="pollux-dek" id="pollux-dek">
                    ${d0.polluxDek}
                  </p>
                </div>

                <div class="atelier-console">
                  <div class="ac-top">
                    <span data-sync="ac-console-kicker" id="ac-console-kicker">${escapeHtml(d0.consoleKicker)}</span>
                    <span>[SIMULATED DEMO]</span>
                  </div>
                  <div class="ac-presets" role="group" aria-label="Interactive Workload Presets">
                    <button type="button" class="ac-preset-btn" data-preset="0" aria-pressed="true">${escapeHtml(d0.presets[0].label)}</button>
                    <button type="button" class="ac-preset-btn" data-preset="1" aria-pressed="false">${escapeHtml(d0.presets[1].label)}</button>
                    <button type="button" class="ac-preset-btn" data-preset="2" aria-pressed="false">${escapeHtml(d0.presets[2].label)}</button>
                  </div>
                  <div class="ac-output" aria-live="polite">
                    <div class="ac-line">
                      <span class="ac-k" data-sync="ac-k1" id="ac-k1">${escapeHtml(p0.k1)}</span>
                      <span class="ac-v" data-sync="ac-v1" id="ac-v1">${escapeHtml(p0.v1)}</span>
                    </div>
                    <div class="ac-line">
                      <span class="ac-k" data-sync="ac-k2" id="ac-k2">${escapeHtml(p0.k2)}</span>
                      <span class="ac-v accent" data-sync="ac-v2" id="ac-v2">${escapeHtml(p0.v2)}</span>
                    </div>
                    <div class="ac-line">
                      <span class="ac-k" data-sync="ac-k3" id="ac-k3">${escapeHtml(p0.k3)}</span>
                      <span class="ac-v" data-sync="ac-v3" id="ac-v3">${escapeHtml(p0.v3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

${dividerHtml}

          <div class="article-deep-col">
            <section class="chapter-card" id="chapter-02" data-chapter-card="1" data-active-chapter="false">
              <div class="chapter-kicker">
                <span id="chap2-kicker">CHAPTER 02 / 04 · FOR YOUR WORK</span>
                <span>PRACTICAL WORKFLOW IMPACT</span>
              </div>
              <h3 class="chapter-h3" id="chap2-title">
                ${escapeHtml(h0.toc[1].title)}
              </h3>
              <p class="chapter-sub" id="chap2-sub">
                ${escapeHtml(h0.toc[1].sub)}
              </p>
              <p class="chapter-body" id="chap2-body">
                ${escapeHtml(h0.toc[1].text)}
              </p>
              <div class="standalone-deep-link-row">
                <span style="font-family:var(--mono);font-size:9px;color:#7DD3FC;letter-spacing:0.12em;text-transform:uppercase;">STANDALONE DEEP-DIVE EDITION</span>
                <a href="${escapeHtml(h0.seriesUrl)}" class="standalone-deep-link" id="open-standalone-series-link">
                  <span id="open-standalone-series-label">${escapeHtml(h0.seriesLabel)}</span>
                </a>
              </div>
            </section>
          </div>

${dividerHtml}

          <div class="article-deep-col article-deep-col--pollux">
            <section class="chapter-card" id="chapter-03" data-chapter-card="2" data-active-chapter="false">
              <div class="chapter-kicker">
                <span id="chap3-kicker">CHAPTER 03 / 04 · BENCHMARKS &amp; WORKBENCH</span>
                <span><span class="greek">β</span> POLLUX · VERIFIED TELEMETRY</span>
              </div>
              <h3 class="chapter-h3" id="chap3-title">
                ${escapeHtml(h0.toc[2].title)}
              </h3>
              <p class="chapter-sub" id="chap3-sub">
                ${escapeHtml(h0.toc[2].sub)}
              </p>
              <p class="chapter-body" id="chap3-body">
                ${escapeHtml(h0.toc[2].text)}
              </p>
              <div class="geo-code-wrap">
                <div class="geo-code-header">
                  <span id="chap3-code-caption">${escapeHtml(h0.codeCaption)}</span>
                  <button type="button" class="copy-code-btn" id="copy-chap3-code-btn">Copy Snippet</button>
                </div>
                <pre class="geo-code-block" id="chap3-code" role="region" aria-labelledby="chap3-code-caption" tabindex="0"><code id="chap3-code-inner">${escapeHtml(h0.codeSnippet)}</code></pre>
              </div>
            </section>

${dividerHtml}

            <section class="chapter-card" id="chapter-04" data-chapter-card="3" data-active-chapter="false">
              <div class="chapter-kicker">
                <span id="chap4-kicker">CHAPTER 04 / 04 · KEY TAKEAWAYS &amp; DECISION RUBRIC</span>
                <span>PRIMARY GOOGLE SOURCES</span>
              </div>
              <h3 class="chapter-h3" id="chap4-title">
                ${escapeHtml(h0.toc[3].title)}
              </h3>
              <p class="chapter-sub" id="chap4-sub">
                ${escapeHtml(h0.toc[3].sub)}
              </p>
              <p class="chapter-body" id="chap4-body">
                ${escapeHtml(h0.toc[3].text)}
              </p>
              <div class="standalone-deep-link-row">
                <span style="font-family:var(--mono);font-size:9px;color:#FDBA74;letter-spacing:0.12em;text-transform:uppercase;">INTERACTIVE STANDALONE LAB</span>
                <a href="${escapeHtml(h0.labUrl)}" class="standalone-deep-link standalone-deep-link--pollux" id="open-standalone-lab-link">
                  <span id="open-standalone-lab-label">${escapeHtml(h0.labLabel)}</span>
                </a>
              </div>
            </section>
          </div>
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
        <span id="celestial-search-title">✦ CELESTIAL OBSERVATORY SEARCH &amp; COMMAND PALETTE · 8 STARS · 32 CHAPTERS · ${totalLabCount} LABS &amp; SERIES</span>
        <button type="button" class="cs-close-pill" id="close-search-btn" aria-label="Close Search Dialog">ESC · CLOSE ×</button>
      </div>

      <search aria-label="Search the Gemini Constellation, Sanctuary Chapters, and Interactive Labs">
        <form id="celestial-search-form" class="cs-search-form">
          <label for="celestial-search-input" class="sr-only">Search Gemini releases, stars, chapters, no-code guides, or interactive labs</label>
          <svg class="cs-input-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6.8" cy="6.8" r="4.8" stroke="currentColor" stroke-width="1.5"/>
            <line x1="10.4" y1="10.4" x2="14.2" y2="14.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            type="search"
            id="celestial-search-input"
            class="cs-search-input"
            placeholder="Ask anything or search stars, chapters &amp; labs (e.g., '${escapeHtml(stars[0].shortLabel)}', '${escapeHtml(stars[1].shortLabel)}', 'cut API bill')…"
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
        <button type="button" class="cs-scope-tab" data-search-scope="lab" aria-pressed="false">⚡ Labs &amp; Series (<span data-scope-count="lab">${totalLabCount}</span>)</button>
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
    '@type': 'TechArticle',
    headline: s0.hud.hudTitle,
    description: s0.hud.hudSummary,
    datePublished: s0.hud.isoDate,
    author: { '@type': 'Person', 'name': 'Google Gemini 4 Argon' },
    contributor: { '@type': 'Person', 'name': 'Neil S. White' },
    citation: s0.salon.sourceUrl,
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
  const stars3dMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.star3d]));
  const salonDataMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.salon]));
  const pillGeomMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.geom]));
  const hudDataMap = Object.fromEntries(stars.map((s) => [s.meta.key, s.hud]));

  const constellationJs = `      const STARS_3D = ${JSON.stringify(stars3dMap, null, 2)};

      const SALON_DATA = ${JSON.stringify(salonDataMap, null, 2)};

      const STAR_PILL_GEOM = ${JSON.stringify(pillGeomMap, null, 2)};

      const HUD_DATA = ${JSON.stringify(hudDataMap, null, 2)};`;

  html = replaceBetweenMarkers(
    html,
    '/* BEGIN_AUTO_CONSTELLATION_DATA */',
    '/* END_AUTO_CONSTELLATION_DATA */',
    constellationJs
  );

  // 6. JS Search Data (`STANDALONE_RESOURCES` + dynamic `synthesizeInstantAnswer`)
  const searchDataJs = `      const AUTO_STANDALONE_RESOURCES = ${JSON.stringify(standaloneResources, null, 2)};`;
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
    `✦ Synced 8 Constellation Stars in index.html & look-j prototype (${stars[0].dates.titleShort} → ${stars[7].dates.titleShort} · ${totalLabCount} Labs/Series indexed)`
  );
  return { stars, totalLabCount };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncConstellation().catch((err) => {
    console.error('Failed to sync constellation:', err);
    process.exit(1);
  });
}
