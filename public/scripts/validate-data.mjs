import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = resolve(__dirname, '..');
const staticPublicDir = resolve(publicRoot, 'public');

const FORBIDDEN_PII_OR_SECRET_PATTERNS = [
  { name: 'Email address', re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ },
  { name: 'Local macOS/Linux path', re: /\/(?:Users|home)\/[A-Za-z0-9._-]+/ },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{20,}\b/ },
  { name: 'OAuth client secret', re: /\bGOCSPX-[0-9A-Za-z_-]{10,}\b/ },
  { name: 'Private IPv4 address', re: /\b(?:192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)\b/ },
];

export async function validateData() {
  const cacheBust = `?t=${Date.now()}`;
  const ecoMod = await import(
    `${pathToFileURL(resolve(publicRoot, 'src/data/geminiEcosystemData.js')).href}${cacheBust}`
  );
  const essaysMod = await import(
    `${pathToFileURL(resolve(publicRoot, 'src/data/constellationEssays.js')).href}${cacheBust}`
  );
  const changelogMod = await import(
    `${pathToFileURL(resolve(publicRoot, 'src/data/changelogData.js')).href}${cacheBust}`
  );

  const errors = [];

  // 1. Validate INITIAL_SHOWCASE_PROJECTS (prevents App.jsx .startsWith crash)
  const showcase = ecoMod.INITIAL_SHOWCASE_PROJECTS || [];
  if (!Array.isArray(showcase) || showcase.length === 0) {
    errors.push('INITIAL_SHOWCASE_PROJECTS must be a non-empty array.');
  }
  const seenShowcaseIds = new Set();
  showcase.forEach((p, idx) => {
    const label = `INITIAL_SHOWCASE_PROJECTS[${idx}] (${p?.id || 'missing-id'})`;
    for (const key of ['id', 'name', 'creator', 'category', 'tagline', 'architectureHighlight', 'url']) {
      if (typeof p?.[key] !== 'string' || !p[key].trim()) {
        errors.push(`${label}: missing or non-string "${key}".`);
      }
    }
    if (typeof p?.url === 'string' && !p.url.startsWith('/') && !p.url.startsWith('https://')) {
      errors.push(`${label}: url "${p.url}" must start with "/" or "https://".`);
    }
    if (typeof p?.url === 'string' && p.url.startsWith('/labs/')) {
      const diskFile = resolve(staticPublicDir, p.url.slice(1));
      if (!existsSync(diskFile)) {
        errors.push(`${label}: local lab file does not exist at public/public${p.url}.`);
      }
    }
    if (!Array.isArray(p?.models) || p.models.length === 0) {
      errors.push(`${label}: models must be a non-empty array.`);
    }
    if (seenShowcaseIds.has(p?.id)) {
      errors.push(`${label}: duplicate id "${p.id}".`);
    }
    seenShowcaseIds.add(p?.id);
  });

  // 2. Validate PULSE_INTELLIGENCE_FEED
  const feed = ecoMod.PULSE_INTELLIGENCE_FEED || [];
  feed.forEach((item, idx) => {
    const label = `PULSE_INTELLIGENCE_FEED[${idx}] (${item?.id || 'missing-id'})`;
    for (const key of ['id', 'title', 'date', 'category', 'tldr', 'sourceUrl', 'sourceLabel']) {
      if (typeof item?.[key] !== 'string' || !item[key].trim()) {
        errors.push(`${label}: missing or non-string "${key}".`);
      }
    }
    if (typeof item?.sourceUrl === 'string' && !item.sourceUrl.startsWith('https://')) {
      errors.push(`${label}: sourceUrl must use https:// (${item.sourceUrl}).`);
    }
    for (const localKey of ['seriesUrl', 'labUrl']) {
      if (typeof item?.[localKey] === 'string' && item[localKey].startsWith('/')) {
        const cleanRel = item[localKey].split('?')[0].split('#')[0].slice(1);
        const diskTarget = resolve(staticPublicDir, cleanRel);
        if (!existsSync(diskTarget)) {
          errors.push(`${label}: ${localKey} "${item[localKey]}" does not exist on disk.`);
        }
      }
    }
  });

  // 3. Validate STUDIO_LAB_BLUEPRINTS
  const blueprints = ecoMod.STUDIO_LAB_BLUEPRINTS || [];
  blueprints.forEach((bp, idx) => {
    const label = `STUDIO_LAB_BLUEPRINTS[${idx}] (${bp?.id || 'missing-id'})`;
    for (const key of ['id', 'title', 'model', 'description', 'tsCode', 'pyCode']) {
      if (typeof bp?.[key] !== 'string' || !bp[key].trim()) {
        errors.push(`${label}: missing or non-string "${key}".`);
      }
    }
    if (!Array.isArray(bp?.simulatedSteps) || bp.simulatedSteps.length === 0) {
      errors.push(`${label}: simulatedSteps must be a non-empty array.`);
    }
    if (typeof bp?.href === 'string' && bp.href.startsWith('/')) {
      const diskTarget = resolve(staticPublicDir, bp.href.slice(1));
      if (!existsSync(diskTarget)) {
        errors.push(`${label}: href "${bp.href}" does not exist on disk.`);
      }
    }
  });

  // 4. Validate CONSTELLATION_ESSAYS
  const essays = essaysMod.CONSTELLATION_ESSAYS || {};
  const essayEntries = Object.entries(essays);
  if (essayEntries.length < 8) {
    errors.push(`CONSTELLATION_ESSAYS must contain at least 8 essays (found ${essayEntries.length}).`);
  }
  for (const [feedId, essay] of essayEntries) {
    const label = `CONSTELLATION_ESSAYS["${feedId}"]`;
    for (const key of ['slug', 'headline', 'standfirst', 'readMinutes']) {
      if (typeof essay?.[key] !== 'string' || !essay[key].trim()) {
        errors.push(`${label}: missing "${key}".`);
      }
    }
    if (!Array.isArray(essay?.verdict?.sources) || essay.verdict.sources.length === 0) {
      errors.push(`${label}: verdict.sources must be a non-empty array.`);
    }
  }

  // 5. Validate CHANGELOG_ENTRIES + Strict Zero-PII & Security Scrub Gate
  const clEntries = changelogMod.CHANGELOG_ENTRIES || [];
  if (!Array.isArray(clEntries) || clEntries.length === 0) {
    errors.push('CHANGELOG_ENTRIES must be a non-empty array.');
  }
  const seenClIds = new Set();
  clEntries.forEach((entry, idx) => {
    const label = `CHANGELOG_ENTRIES[${idx}] (${entry?.id || 'missing-id'})`;
    for (const key of [
      'id',
      'date',
      'dateDisplay',
      'surface',
      'caughtBy',
      'caughtByLabel',
      'summary',
      'whatHappened',
      'fixApplied',
    ]) {
      if (typeof entry?.[key] !== 'string' || !entry[key].trim()) {
        errors.push(`${label}: missing or non-string "${key}".`);
      }
    }
    if (!['human', 'gemini'].includes(entry?.caughtBy)) {
      errors.push(`${label}: caughtBy must be "human" or "gemini" (got "${entry?.caughtBy}").`);
    }
    if (seenClIds.has(entry?.id)) {
      errors.push(`${label}: duplicate id "${entry.id}".`);
    }
    seenClIds.add(entry?.id);

    const combinedText = [
      entry?.surface,
      entry?.caughtByLabel,
      entry?.summary,
      entry?.whatHappened,
      entry?.fixApplied,
    ].join(' ');

    for (const rule of FORBIDDEN_PII_OR_SECRET_PATTERNS) {
      if (rule.re.test(combinedText)) {
        errors.push(`${label}: Zero-PII/Security gate blocked forbidden pattern (${rule.name}).`);
      }
    }
  });

  if (errors.length > 0) {
    console.error('\n[validate-data] ❌ DATA CONTRACT OR ZERO-PII VALIDATION FAILED:');
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `[validate-data] ✅ Verified ${showcase.length} showcase items, ${feed.length} feed items, ${blueprints.length} blueprints, ${essayEntries.length} flagship essays, and ${clEntries.length} Zero-PII changelog entries.`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await validateData();
}
