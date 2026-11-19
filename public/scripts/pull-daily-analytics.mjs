#!/usr/bin/env node
/**
 * GeminiPulse.com — Automated Daily Visitor, UTM, Model-Efficiency & Search Console Puller
 * (`public/scripts/pull-daily-analytics.mjs`)
 *
 * Zero external npm dependencies: uses built-in Node 22 modules (`node:crypto`, `node:fs`,
 * `node:os`, `node:path`, `node:url`, and native `fetch`).
 *
 * Credentials lookup order (read-only Viewer / Restricted service account JSON):
 *   1. `process.env.GEMINIPULSE_GA_CREDENTIALS` (file path or inline JSON)
 *   2. `~/.config/geminipulse/analytics-reader.json`
 *
 * Optional non-secret config cache:
 *   `~/.config/geminipulse/analytics-config.json`
 *   `{ "ga4PropertyId": "...", "ga4MeasurementId": "G-1BWMQWZJQ5", "gscSiteUrl": "sc-domain:geminipulse.com" }`
 */

import { createSign } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PUBLIC_ROOT, '..');
const TELEMETRY_REPORT_PATH = resolve(REPO_ROOT, 'docs', 'daily-telemetry-report.md');

const CONFIG_DIR = join(homedir(), '.config', 'geminipulse');
const DEFAULT_CREDS_PATH = join(CONFIG_DIR, 'analytics-reader.json');
const CONFIG_FILE_PATH = join(CONFIG_DIR, 'analytics-config.json');

const DEFAULT_MEASUREMENT_ID = 'G-1BWMQWZJQ5';
const DEFAULT_GSC_SITE_URLS = ['sc-domain:geminipulse.com', 'https://geminipulse.com/'];

const PULSE_START_MARKER = '<!-- LIVE-ANALYTICS-PULSE-START -->';
const PULSE_END_MARKER = '<!-- LIVE-ANALYTICS-PULSE-END -->';

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

function redactHomePath(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return '';
  const home = homedir();
  if (home && rawPath.startsWith(home)) {
    return `~${rawPath.slice(home.length)}`;
  }
  return rawPath;
}

function expandLeadingTilde(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') return inputPath;
  if (inputPath === '~') return homedir();
  if (inputPath.startsWith('~/')) return join(homedir(), inputPath.slice(2));
  return inputPath;
}

function parseCliArgs(argv) {
  const flags = new Set(argv.slice(2));
  const noWrite = flags.has('--no-write') || flags.has('--dry-run');
  return {
    write: !noWrite,
    strict: flags.has('--strict'),
    json: flags.has('--json'),
  };
}

function formatTimestampET(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')} ${get('timeZoneName') || 'ET'}`.trim();
  } catch {
    return date.toISOString();
  }
}

function formatIsoDateUTC(daysAgoCount = 0) {
  const d = new Date(Date.now() - daysAgoCount * 86_400_000);
  return d.toISOString().slice(0, 10);
}

function formatDuration(totalSeconds) {
  const secs = Math.max(0, Math.round(Number(totalSeconds) || 0));
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  if (mins < 60) return `${mins}m ${String(rem).padStart(2, '0')}s`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${String(remMins).padStart(2, '0')}m`;
}

function formatPercent(ratio) {
  const val = (Number(ratio) || 0) * 100;
  return `${val.toFixed(1)}%`;
}

function escapeMdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function normalizeModelSlug(rawModel) {
  const s = String(rawModel || '').toLowerCase().trim();
  if (!s || s === '(not set)') return '';
  if (s.includes('gemini-4-carbon') || s.includes('gemini 4 carbon')) return 'gemini-4-carbon';
  if (s.includes('gemini-4-argon') || s.includes('gemini 4 argon')) return 'gemini-4-argon';
  if (s.includes('gemini-4-neon') || s.includes('gemini 4 neon')) return 'gemini-4-neon';
  if (s.includes('gemini-4-hydrogen') || s.includes('gemini 4 hydrogen')) return 'gemini-4-hydrogen';
  if (s.includes('claude-opus-5-5') || s.includes('claude opus 5.5')) return 'claude-opus-5-5';
  if (s.includes('gemini-3.8-flash') || s.includes('gemini 3.8 flash')) return 'gemini-3.8-flash';
  return s.replace(/^google\s+/, '').replace(/\s+/g, '-');
}

function normalizeEffortSlug(rawEffort) {
  const s = String(rawEffort || '').toLowerCase().trim();
  if (!s || s === '(not set)') return '';
  if (['low', 'medium', 'high', 'xhigh'].includes(s)) return s;
  return s;
}

function loadAnalyticsConfig() {
  let fileCfg = {};
  if (existsSync(CONFIG_FILE_PATH)) {
    try {
      fileCfg = JSON.parse(readFileSync(CONFIG_FILE_PATH, 'utf8')) || {};
    } catch {
      fileCfg = {};
    }
  }
  const envProp = (process.env.GEMINIPULSE_GA4_PROPERTY_ID || '').trim();
  const envGsc = (process.env.GEMINIPULSE_GSC_SITE_URL || '').trim();
  const rawProp = envProp || String(fileCfg.ga4PropertyId || '').trim();
  return {
    rawFileCfg: fileCfg,
    ga4PropertyId: rawProp.replace(/^properties\//, ''),
    ga4MeasurementId: String(fileCfg.ga4MeasurementId || DEFAULT_MEASUREMENT_ID).trim(),
    gscSiteUrl: envGsc || String(fileCfg.gscSiteUrl || '').trim(),
  };
}

function saveAnalyticsConfig(patch) {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    let existing = {};
    if (existsSync(CONFIG_FILE_PATH)) {
      try {
        existing = JSON.parse(readFileSync(CONFIG_FILE_PATH, 'utf8')) || {};
      } catch {
        existing = {};
      }
    }
    const merged = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    writeFileSync(CONFIG_FILE_PATH, `${JSON.stringify(merged, null, 2)}\n`, { mode: 0o600 });
  } catch (err) {
    console.warn(`[telemetry:pull] Non-fatal: unable to cache config at ${redactHomePath(CONFIG_FILE_PATH)}: ${err.message}`);
  }
}

function resolveServiceAccountCredentials() {
  const envSpec = (process.env.GEMINIPULSE_GA_CREDENTIALS || '').trim();
  if (envSpec) {
    if (envSpec.startsWith('{')) {
      const parsed = JSON.parse(envSpec);
      return { creds: parsed, sourceLabel: 'env:GEMINIPULSE_GA_CREDENTIALS (inline JSON)' };
    }
    const resolvedEnvPath = resolve(expandLeadingTilde(envSpec));
    if (!existsSync(resolvedEnvPath)) {
      return {
        creds: null,
        missingReason: `Environment variable GEMINIPULSE_GA_CREDENTIALS points to non-existent file (${redactHomePath(resolvedEnvPath)}).`,
      };
    }
    const parsed = JSON.parse(readFileSync(resolvedEnvPath, 'utf8'));
    return { creds: parsed, sourceLabel: redactHomePath(resolvedEnvPath) };
  }

  if (existsSync(DEFAULT_CREDS_PATH)) {
    const parsed = JSON.parse(readFileSync(DEFAULT_CREDS_PATH, 'utf8'));
    return { creds: parsed, sourceLabel: '~/.config/geminipulse/analytics-reader.json' };
  }

  return {
    creds: null,
    missingReason: 'No read-only service account key found at ~/.config/geminipulse/analytics-reader.json (or GEMINIPULSE_GA_CREDENTIALS).',
  };
}

function signServiceAccountJwt(creds) {
  if (!creds?.client_email || !creds?.private_key) {
    throw new Error('Service account JSON must include "client_email" and "private_key".');
  }
  const tokenUri = creds.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: creds.client_email,
    scope: OAUTH_SCOPES.join(' '),
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaims = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signingInput = `${encodedHeader}.${encodedClaims}`;

  const privateKeyPem = String(creds.private_key).replace(/\\n/g, '\n');
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKeyPem, 'base64url');

  return {
    assertion: `${signingInput}.${signature}`,
    tokenUri,
  };
}

async function fetchGoogleAccessToken(creds) {
  const { assertion, tokenUri } = signServiceAccountJwt(creds);
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok || !payload.access_token) {
    const desc = payload.error_description || payload.error || `HTTP ${res.status}`;
    throw new Error(`Google OAuth2 token exchange failed: ${desc}`);
  }
  return payload.access_token;
}

async function googleApiFetch(url, accessToken, options = {}) {
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function discoverGa4PropertyId(accessToken, config) {
  if (config.ga4PropertyId) {
    return { propertyId: config.ga4PropertyId, discoverySource: 'cached_config' };
  }

  const summariesRes = await googleApiFetch(
    'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200',
    accessToken
  );

  if (!summariesRes.ok) {
    const apiMsg = summariesRes.data?.error?.message || `HTTP ${summariesRes.status}`;
    throw new Error(
      `GA4 property discovery failed (${apiMsg}). Ensure Google Analytics Admin API is enabled and the service account has Viewer access on GA4 property ${config.ga4MeasurementId} (see docs/analytics-setup-guide.md).`
    );
  }

  const accountSummaries = summariesRes.data?.accountSummaries || [];
  const candidateProps = [];
  for (const acct of accountSummaries) {
    for (const prop of acct.propertySummaries || []) {
      if (prop.property) {
        candidateProps.push({
          propertyResource: prop.property,
          numericId: String(prop.property).replace(/^properties\//, ''),
          displayName: prop.displayName || '',
        });
      }
    }
  }

  if (candidateProps.length === 0) {
    throw new Error(
      `Service account has access to 0 GA4 properties. Add its client_email as a Viewer in GA4 Admin -> Property Access Management for ${config.ga4MeasurementId} (see docs/analytics-setup-guide.md Step 3).`
    );
  }

  let fallbackMatch = null;
  for (const candidate of candidateProps) {
    const streamsRes = await googleApiFetch(
      `https://analyticsadmin.googleapis.com/v1beta/${candidate.propertyResource}/dataStreams`,
      accessToken
    );
    if (streamsRes.ok) {
      for (const stream of streamsRes.data?.dataStreams || []) {
        const mId = stream.webStreamData?.measurementId || '';
        const defaultUri = stream.webStreamData?.defaultUri || '';
        if (mId.toUpperCase() === config.ga4MeasurementId.toUpperCase()) {
          saveAnalyticsConfig({
            ga4PropertyId: candidate.numericId,
            ga4MeasurementId: config.ga4MeasurementId,
          });
          return { propertyId: candidate.numericId, discoverySource: `auto_discovered (${mId})` };
        }
        if (
          !fallbackMatch &&
          (defaultUri.toLowerCase().includes('geminipulse.com') ||
            candidate.displayName.toLowerCase().includes('geminipulse'))
        ) {
          fallbackMatch = candidate;
        }
      }
    } else if (!fallbackMatch && candidate.displayName.toLowerCase().includes('geminipulse')) {
      fallbackMatch = candidate;
    }
  }

  if (fallbackMatch) {
    saveAnalyticsConfig({
      ga4PropertyId: fallbackMatch.numericId,
      ga4MeasurementId: config.ga4MeasurementId,
    });
    return {
      propertyId: fallbackMatch.numericId,
      discoverySource: `auto_discovered_by_name (${fallbackMatch.displayName})`,
    };
  }

  if (candidateProps.length === 1) {
    saveAnalyticsConfig({
      ga4PropertyId: candidateProps[0].numericId,
      ga4MeasurementId: config.ga4MeasurementId,
    });
    return {
      propertyId: candidateProps[0].numericId,
      discoverySource: `single_accessible_property (${candidateProps[0].displayName || candidateProps[0].numericId})`,
    };
  }

  throw new Error(
    `Found ${candidateProps.length} GA4 properties, none matching ${config.ga4MeasurementId}. Set "ga4PropertyId" explicitly in ~/.config/geminipulse/analytics-config.json.`
  );
}

async function runGa4Report(accessToken, propertyId, reportBody) {
  return googleApiFetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    accessToken,
    { method: 'POST', body: reportBody }
  );
}

async function buildPagePathProvenanceMap() {
  const exactMap = new Map();
  let leadModel = 'gemini-4-carbon';
  let leadEffort = 'high';

  try {
    const essaysUrl = `${pathToFileURL(resolve(PUBLIC_ROOT, 'src/data/constellationEssays.js')).href}?t=${Date.now()}`;
    const mod = await import(essaysUrl);
    const essays = Object.values(mod.CONSTELLATION_ESSAYS || {});
    if (essays.length > 0) {
      leadModel = normalizeModelSlug(essays[0].authoredByModel) || leadModel;
      leadEffort = normalizeEffortSlug(essays[0].thinkingEffort) || leadEffort;
    }
    for (const essay of essays) {
      if (!essay?.slug) continue;
      const entry = {
        model: normalizeModelSlug(essay.authoredByModel) || 'gemini-4-argon',
        effort: normalizeEffortSlug(essay.thinkingEffort) || 'high',
        surface: 'flagship_essay',
      };
      exactMap.set(`/articles/${essay.slug}.html`, entry);
      exactMap.set(`/articles/${essay.slug}`, entry);
    }
  } catch {
    // Fallback gracefully if constellationEssays cannot be imported
  }

  const homeEntry = { model: leadModel, effort: leadEffort, surface: 'constellation_home' };
  exactMap.set('/', homeEntry);
  exactMap.set('/index.html', homeEntry);
  exactMap.set('/prototypes/look-j-3d-celestial-navigator.html', homeEntry);

  exactMap.set('/arena/neon-field-test.html', {
    model: 'gemini-4-carbon',
    effort: 'high',
    surface: 'empirical_arena',
  });
  exactMap.set('/arena/neon-field-test', {
    model: 'gemini-4-carbon',
    effort: 'high',
    surface: 'empirical_arena',
  });

  const arenaSandboxes = [
    ['/arena/exp-05-neon-low.html', 'gemini-4-neon', 'low'],
    ['/arena/exp-05-neon-high.html', 'gemini-4-neon', 'high'],
    ['/arena/exp-05-neon-xhigh.html', 'gemini-4-neon', 'xhigh'],
    ['/arena/exp-05-hydrogen-high.html', 'gemini-4-hydrogen', 'high'],
    ['/arena/exp-05-carbon-high.html', 'gemini-4-carbon', 'high'],
    ['/arena/exp-05-claude-opus-5-5.html', 'claude-opus-5-5', 'high'],
  ];
  for (const [routePath, model, effort] of arenaSandboxes) {
    exactMap.set(routePath, { model, effort, surface: 'arena_sandbox' });
  }

  return function resolvePathProvenance(rawPath) {
    const clean = String(rawPath || '/')
      .split('?')[0]
      .split('#')[0]
      .trim() || '/';
    const normalized = clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;

    if (exactMap.has(normalized)) return exactMap.get(normalized);
    if (exactMap.has(`${normalized}.html`)) return exactMap.get(`${normalized}.html`);

    if (normalized === '/articles' || normalized === '/articles/index.html') {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'essays_index' };
    }
    if (normalized.startsWith('/articles/')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'flagship_essay' };
    }
    if (normalized.startsWith('/arena/')) {
      return { model: 'gemini-4-carbon', effort: 'high', surface: 'empirical_arena' };
    }
    if (normalized.startsWith('/labs/')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'interactive_lab' };
    }
    if (normalized.includes('open-letter-to-google-deepmind')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'open_letter' };
    }
    if (normalized.startsWith('/series/')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'release_series' };
    }
    if (normalized === '/workbench' || normalized === '/workbench.html') {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'workbench_spa' };
    }
    if (normalized.startsWith('/changelog')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'changelog' };
    }
    if (normalized.startsWith('/status')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'status_health' };
    }
    if (normalized.startsWith('/partners')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'partners' };
    }
    if (normalized.startsWith('/shorts/')) {
      return { model: 'gemini-4-argon', effort: 'high', surface: 'shorts_studio' };
    }
    return { model: 'gemini-4-argon', effort: 'high', surface: 'site_general' };
  };
}

async function queryTrafficBaseline(accessToken, propertyId) {
  const windows = [
    { key: '24h', label: 'Last 24h (`yesterday–today`)', startDate: '1daysAgo', endDate: 'today' },
    { key: '7d', label: 'Last 7 Days (`7daysAgo–today`)', startDate: '7daysAgo', endDate: 'today' },
    { key: '28d', label: 'Last 28 Days (`28daysAgo–today`)', startDate: '28daysAgo', endDate: 'today' },
  ];

  const metricsSpec = [
    { name: 'activeUsers' },
    { name: 'newUsers' },
    { name: 'sessions' },
    { name: 'engagedSessions' },
    { name: 'engagementRate' },
    { name: 'userEngagementDuration' },
  ];

  const results = await Promise.all(
    windows.map(async (win) => {
      const res = await runGa4Report(accessToken, propertyId, {
        dateRanges: [{ startDate: win.startDate, endDate: win.endDate }],
        metrics: metricsSpec,
      });
      if (!res.ok) {
        const msg = res.data?.error?.message || `HTTP ${res.status}`;
        throw new Error(`GA4 baseline report (${win.key}) failed: ${msg}`);
      }
      const vals = res.data?.rows?.[0]?.metricValues || [];
      const activeUsers = Number(vals[0]?.value || 0);
      const newUsers = Number(vals[1]?.value || 0);
      const sessions = Number(vals[2]?.value || 0);
      const engagedSessions = Number(vals[3]?.value || 0);
      const engagementRate = Number(vals[4]?.value || 0);
      const userEngagementDuration = Number(vals[5]?.value || 0);
      const avgDwellPerSession = sessions > 0 ? userEngagementDuration / sessions : 0;

      return {
        ...win,
        activeUsers,
        newUsers,
        sessions,
        engagedSessions,
        engagementRate,
        userEngagementDuration,
        avgDwellPerSession,
      };
    })
  );

  return results;
}

function describeTrafficReality(baselineRows) {
  const r24 = baselineRows.find((r) => r.key === '24h') || { activeUsers: 0 };
  const r7 = baselineRows.find((r) => r.key === '7d') || { activeUsers: 0 };

  if (r7.activeUsers === 0) {
    return `**0 human visitors** in the last 7 days (\`0\` in last 24h) — verified zero-traffic / cold-start baseline. Do not claim audience traction until outbound distribution lands.`;
  }
  if (r7.activeUsers < 25) {
    return `**${r7.activeUsers} human visitor${r7.activeUsers === 1 ? '' : 's'} — early cold-start baseline** (\`${r24.activeUsers}\` in last 24h). Treat percentage splits as directional small-n signals (\`n=${r7.activeUsers}\`), never statistical proof.`;
  }
  if (r7.activeUsers < 250) {
    return `**${r7.activeUsers} human visitors (7d)** (\`${r24.activeUsers}\` in last 24h) — emerging technical cohort; channel and dwell comparisons are directionally meaningful.`;
  }
  return `**${r7.activeUsers.toLocaleString('en-US')} human visitors (7d)** (\`${r24.activeUsers.toLocaleString('en-US')}\` in last 24h) — active cohort with sufficient volume for channel & model-tier efficiency splits.`;
}

async function queryChannelFunnel(accessToken, propertyId) {
  const res = await runGa4Report(accessToken, propertyId, {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
      { name: 'sessionCampaignName' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'engagedSessions' },
      { name: 'engagementRate' },
      { name: 'userEngagementDuration' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 15,
  });

  if (!res.ok) {
    const msg = res.data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`GA4 channel funnel report failed: ${msg}`);
  }

  return (res.data?.rows || []).map((row) => {
    const source = row.dimensionValues?.[0]?.value || '(direct)';
    const medium = row.dimensionValues?.[1]?.value || '(none)';
    const campaign = row.dimensionValues?.[2]?.value || '(not set)';
    const sessions = Number(row.metricValues?.[0]?.value || 0);
    const activeUsers = Number(row.metricValues?.[1]?.value || 0);
    const engagedSessions = Number(row.metricValues?.[2]?.value || 0);
    const engagementRate = Number(row.metricValues?.[3]?.value || 0);
    const duration = Number(row.metricValues?.[4]?.value || 0);
    return {
      source,
      medium,
      campaign,
      sessions,
      activeUsers,
      engagedSessions,
      engagementRate,
      avgDwellSeconds: sessions > 0 ? duration / sessions : 0,
    };
  });
}

async function queryModelEffortMatrix(accessToken, propertyId) {
  const resolvePathProvenance = await buildPagePathProvenanceMap();
  const bucketMap = new Map();

  const upsertBucket = (model, effort, surface) => {
    const m = normalizeModelSlug(model) || 'gemini-4-argon';
    const e = normalizeEffortSlug(effort) || 'high';
    const s = String(surface || '').trim() && surface !== '(not set)' ? surface : 'site_general';
    const key = `${m}|${e}|${s}`;
    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        model: m,
        effort: e,
        surface: s,
        views: 0,
        activeUsers: 0,
        engagementSeconds: 0,
        engagedReadEvents: 0,
        scrollMilestoneEvents: 0,
      });
    }
    return bucketMap.get(key);
  };

  // Attempt 1: Registered custom event dimensions (`authored_model`, `thinking_effort`, `content_surface`)
  const customViewsRes = await runGa4Report(accessToken, propertyId, {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'customEvent:authored_model' },
      { name: 'customEvent:thinking_effort' },
      { name: 'customEvent:content_surface' },
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'userEngagementDuration' },
    ],
    limit: 50,
  });

  let attributionMode = 'custom_dimensions';
  let customAttributedViews = 0;

  if (customViewsRes.ok) {
    for (const row of customViewsRes.data?.rows || []) {
      const rawModel = row.dimensionValues?.[0]?.value || '';
      const rawEffort = row.dimensionValues?.[1]?.value || '';
      const rawSurface = row.dimensionValues?.[2]?.value || '';
      const views = Number(row.metricValues?.[0]?.value || 0);
      const users = Number(row.metricValues?.[1]?.value || 0);
      const dur = Number(row.metricValues?.[2]?.value || 0);

      const normModel = normalizeModelSlug(rawModel);
      if (normModel && views > 0) {
        customAttributedViews += views;
        const b = upsertBucket(normModel, rawEffort || 'high', rawSurface || 'site_general');
        b.views += views;
        b.activeUsers += users;
        b.engagementSeconds += dur;
      }
    }

    if (customAttributedViews > 0) {
      const customEventsRes = await runGa4Report(accessToken, propertyId, {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [
          { name: 'customEvent:authored_model' },
          { name: 'customEvent:thinking_effort' },
          { name: 'customEvent:content_surface' },
          { name: 'eventName' },
        ],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: { values: ['engaged_read', 'scroll_milestone'] },
          },
        },
        limit: 100,
      });

      if (customEventsRes.ok) {
        for (const row of customEventsRes.data?.rows || []) {
          const normModel = normalizeModelSlug(row.dimensionValues?.[0]?.value || '');
          if (!normModel) continue;
          const rawEffort = row.dimensionValues?.[1]?.value || 'high';
          const rawSurface = row.dimensionValues?.[2]?.value || 'site_general';
          const evName = row.dimensionValues?.[3]?.value || '';
          const count = Number(row.metricValues?.[0]?.value || 0);
          const b = upsertBucket(normModel, rawEffort, rawSurface);
          if (evName === 'engaged_read') b.engagedReadEvents += count;
          if (evName === 'scroll_milestone') b.scrollMilestoneEvents += count;
        }
      }
    }
  }

  // Fallback (or backfill during 24-48h GA4 custom dimension warmup): `pagePath` -> `CONSTELLATION_ESSAYS`
  if (!customViewsRes.ok || customAttributedViews === 0) {
    bucketMap.clear();
    attributionMode = customViewsRes.ok
      ? 'pagePath_fallback_24h_warmup'
      : 'pagePath_fallback_unregistered_custom_dims';

    const pathViewsRes = await runGa4Report(accessToken, propertyId, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'userEngagementDuration' },
      ],
      limit: 250,
    });

    if (pathViewsRes.ok) {
      for (const row of pathViewsRes.data?.rows || []) {
        const pagePath = row.dimensionValues?.[0]?.value || '/';
        const views = Number(row.metricValues?.[0]?.value || 0);
        const users = Number(row.metricValues?.[1]?.value || 0);
        const dur = Number(row.metricValues?.[2]?.value || 0);
        if (views === 0 && dur === 0) continue;
        const prov = resolvePathProvenance(pagePath);
        const b = upsertBucket(prov.model, prov.effort, prov.surface);
        b.views += views;
        b.activeUsers += users;
        b.engagementSeconds += dur;
      }
    }

    const pathEventsRes = await runGa4Report(accessToken, propertyId, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: ['engaged_read', 'scroll_milestone'] },
        },
      },
      limit: 250,
    });

    if (pathEventsRes.ok) {
      for (const row of pathEventsRes.data?.rows || []) {
        const pagePath = row.dimensionValues?.[0]?.value || '/';
        const evName = row.dimensionValues?.[1]?.value || '';
        const count = Number(row.metricValues?.[0]?.value || 0);
        const prov = resolvePathProvenance(pagePath);
        const b = upsertBucket(prov.model, prov.effort, prov.surface);
        if (evName === 'engaged_read') b.engagedReadEvents += count;
        if (evName === 'scroll_milestone') b.scrollMilestoneEvents += count;
      }
    }
  }

  const rows = Array.from(bucketMap.values())
    .map((b) => ({
      ...b,
      avgEngagementSeconds: b.views > 0 ? b.engagementSeconds / b.views : 0,
    }))
    .sort((a, b) => b.views - a.views || b.engagementSeconds - a.engagementSeconds);

  return { attributionMode, rows };
}

function computeEditorialTakeaway(matrixRows) {
  const totalViews = matrixRows.reduce((sum, r) => sum + r.views, 0);
  if (totalViews < 10) {
    return `Sample volume (\`n=${totalViews}\` total views over 7d) is below our \`n >= 10\` significance floor. Do not over-index or re-weight \`authored_model\` / \`thinking_effort\` allocation yet—continue pairing empirical \`gemini-4-carbon · high\` / \`gemini-4-neon · high\` artifacts with fast \`gemini-4-argon · high\` release dispatches while \`Post #001\`–\`#005\` gather real reader dwell.`;
  }

  const eligible = matrixRows.filter((r) => r.views >= 3);
  const pool = eligible.length > 0 ? eligible : matrixRows;
  const byDwell = [...pool].sort((a, b) => b.avgEngagementSeconds - a.avgEngagementSeconds);
  const top = byDwell[0];
  const low = byDwell[byDwell.length - 1];

  if (!top) {
    return 'No model/effort cohorts have recorded views yet.';
  }
  if (top === low) {
    return `Cohort \`${top.model} · ${top.effort}\` (\`${top.surface}\`) accounts for \`${top.views}\` views averaging **${Math.round(top.avgEngagementSeconds)}s** active dwell (\`${top.engagedReadEvents}\` \`engaged_read\` events, \`${top.scrollMilestoneEvents}\` \`50%/90%\` scroll milestones). Expand cross-tier comparisons on the next release cycle.`;
  }

  return `**Dwell Leader:** \`${top.model} · ${top.effort}\` on \`${top.surface}\` is earning **${Math.round(top.avgEngagementSeconds)}s/view** across \`${top.views}\` views (\`${top.engagedReadEvents}\` \`engaged_read\` milestones, \`${top.scrollMilestoneEvents}\` \`50%/90%\` scroll milestones), vs. \`${low.model} · ${low.effort}\` on \`${low.surface}\` at **${Math.round(low.avgEngagementSeconds)}s/view** (\`${low.views}\` views). **Curation Action:** Lean into \`${top.surface}\` depth powered by \`${top.model} (${top.effort})\` and tighten above-the-fold scannability on \`${low.surface}\`.`;
}

async function querySearchConsole(accessToken, config) {
  const candidates = config.gscSiteUrl
    ? [config.gscSiteUrl, ...DEFAULT_GSC_SITE_URLS.filter((u) => u !== config.gscSiteUrl)]
    : [...DEFAULT_GSC_SITE_URLS];

  const startDate = formatIsoDateUTC(7);
  const endDate = formatIsoDateUTC(0);

  let lastError = '';
  for (const siteUrl of candidates) {
    const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
    const queriesRes = await googleApiFetch(endpoint, accessToken, {
      method: 'POST',
      body: { startDate, endDate, dimensions: ['query'], rowLimit: 8 },
    });

    if (!queriesRes.ok) {
      lastError = queriesRes.data?.error?.message || `HTTP ${queriesRes.status} on ${siteUrl}`;
      continue;
    }

    const pagesRes = await googleApiFetch(endpoint, accessToken, {
      method: 'POST',
      body: { startDate, endDate, dimensions: ['page'], rowLimit: 8 },
    });

    if (config.gscSiteUrl !== siteUrl) {
      saveAnalyticsConfig({ gscSiteUrl: siteUrl });
    }

    return {
      ok: true,
      siteUrl,
      startDate,
      endDate,
      queries: (queriesRes.data?.rows || []).map((r) => ({
        query: r.keys?.[0] || '',
        clicks: Number(r.clicks || 0),
        impressions: Number(r.impressions || 0),
        ctr: Number(r.ctr || 0),
        position: Number(r.position || 0),
      })),
      pages: (pagesRes.data?.rows || []).map((r) => ({
        page: String(r.keys?.[0] || '').replace(/^https?:\/\/(?:www\.)?geminipulse\.com/i, '') || '/',
        clicks: Number(r.clicks || 0),
        impressions: Number(r.impressions || 0),
        ctr: Number(r.ctr || 0),
        position: Number(r.position || 0),
      })),
    };
  }

  return {
    ok: false,
    error:
      lastError ||
      'Service account does not yet have Restricted user access in Google Search Console (see docs/analytics-setup-guide.md Step 4).',
    startDate,
    endDate,
    queries: [],
    pages: [],
  };
}

function renderPendingCredentialsBlock(missingReason) {
  const stampedAt = formatTimestampET();
  return [
    PULSE_START_MARKER,
    '## 00. Automated Live Visitor, UTM & Model-Efficiency Pulse (`npm run telemetry:pull`)',
    '',
    `> **Pipeline Status:** **PENDING READ-ONLY VIEWER KEY** (Checked \`${stampedAt}\`)`,
    `> - **Why Live Tables Are Paused:** ${missingReason}`,
    '> - **Honest Traffic Rule (Zero Hallucination):** Until `~/.config/geminipulse/analytics-reader.json` is connected, treat external human traffic as **unverified / cold-start (`0` confirmed visitors)** and never extrapolate audience traction.',
    '> - **Collector Readiness on `geminipulse.com`:** **LIVE SITEWIDE** — `pulse-analytics.js` (`G-1BWMQWZJQ5`) is recording human `page_view`, `engaged_read` (`15s`/`45s`/`120s`), `scroll_milestone` (`50%`/`90%`), `arena_artifact_engage`, channel UTMs (`x`, `linkedin`, `linkedin_neil`, `youtube_shorts`), and model provenance (`authored_model`, `thinking_effort`, `content_surface`), while filtering `HeadlessChrome`/`Lighthouse` bots.',
    '> - **3-Minute Operator Activation (`$0.00/mo`):** Follow [`docs/analytics-setup-guide.md`](./analytics-setup-guide.md), drop the read-only Viewer JSON key at `~/.config/geminipulse/analytics-reader.json` (`chmod 600`), and run `cd public && npm run telemetry:pull`.',
    '',
    '| Report Module | Target API & Scope | Pre-Key Status |',
    '| :--- | :--- | :--- |',
    '| **00a. Human Traffic Baseline (24h / 7d / 28d)** | `analyticsdata.googleapis.com/v1beta` (`G-1BWMQWZJQ5`) | Awaiting Viewer key (`~/.config/geminipulse/analytics-reader.json`) |',
    '| **00b. Channel & Post #001 UTM Funnel** | `sessionSource` / `sessionMedium` / `sessionCampaignName` (`post_001_neon_gauntlet`) | Outbound UTMs wired in [`docs/social-launch-kit-post-001.md`](./social-launch-kit-post-001.md); awaiting Viewer key |',
    '| **00c. Model × Thinking Effort Efficiency Matrix** | `customEvent:authored_model` × `thinking_effort` × `content_surface` (+ `CONSTELLATION_ESSAYS` `pagePath` fallback) | Ready (24–48h GA4 custom-dimension warmup automatically covered by `pagePath` fallback) |',
    '| **00d. Google Search Console (7d Queries & Pages)** | `searchconsole.googleapis.com/webmasters/v3` (`sc-domain:geminipulse.com`) | Awaiting Restricted GSC user grant (Step 4 in [`docs/analytics-setup-guide.md`](./analytics-setup-guide.md)) |',
    PULSE_END_MARKER,
  ].join('\n');
}

function renderLiveAnalyticsBlock({
  propertyId,
  discoverySource,
  baselineRows,
  channelRows,
  matrixResult,
  gscResult,
}) {
  const stampedAt = formatTimestampET();
  const realityNote = describeTrafficReality(baselineRows);
  const editorialTakeaway = computeEditorialTakeaway(matrixResult.rows);

  const attributionLabel =
    matrixResult.attributionMode === 'custom_dimensions'
      ? 'GA4 Custom Dimensions (`customEvent:authored_model` / `thinking_effort` / `content_surface`)'
      : matrixResult.attributionMode === 'pagePath_fallback_24h_warmup'
        ? '`pagePath` -> `CONSTELLATION_ESSAYS` Fallback (GA4 custom dimensions inside 24–48h warmup window)'
        : '`pagePath` -> `CONSTELLATION_ESSAYS` Fallback (register custom dimensions per `docs/analytics-setup-guide.md` Step 3)';

  const baselineTableRows = baselineRows.map((r) =>
    `| ${r.label} | **${r.activeUsers.toLocaleString('en-US')}** | ${r.newUsers.toLocaleString('en-US')} | ${r.sessions.toLocaleString('en-US')} | ${r.engagedSessions.toLocaleString('en-US')} | ${formatPercent(r.engagementRate)} | ${formatDuration(r.avgDwellPerSession)} (${formatDuration(r.userEngagementDuration)} total) |`
  );

  const channelTableRows =
    channelRows.length > 0
      ? channelRows.map((c) =>
          `| \`${escapeMdCell(c.source)} / ${escapeMdCell(c.medium)}\` | \`${escapeMdCell(c.campaign)}\` | **${c.sessions}** | ${c.activeUsers} | ${c.engagedSessions} (${formatPercent(c.engagementRate)}) | ${formatDuration(c.avgDwellSeconds)} |`
        )
      : [
          '| `(no human sessions recorded in 7d)` | `post_001_neon_gauntlet` (awaiting clicks) | **0** | 0 | 0 (0.0%) | 0s |',
        ];

  const matrixTableRows =
    matrixResult.rows.length > 0
      ? matrixResult.rows.map((m) =>
          `| \`${escapeMdCell(m.model)} · ${escapeMdCell(m.effort)}\` | \`${escapeMdCell(m.surface)}\` | **${m.views}** | ${formatDuration(m.avgEngagementSeconds)} | ${m.engagedReadEvents} | ${m.scrollMilestoneEvents} |`
        )
      : [
          '| `gemini-4-carbon · high` / `gemini-4-argon · high` | `(0 views in 7d)` | **0** | 0s | 0 | 0 |',
        ];

  const gscSectionLines = [];
  if (!gscResult.ok) {
    gscSectionLines.push(
      `> **Search Console Status:** Pending or restricted (${escapeMdCell(gscResult.error)}). See Step 4 in [\`docs/analytics-setup-guide.md\`](./analytics-setup-guide.md).`
    );
  } else {
    gscSectionLines.push(
      `*Property \`${escapeMdCell(gscResult.siteUrl)}\` · Window \`${gscResult.startDate}\` to \`${gscResult.endDate}\`*`,
      '',
      '| Top Search Queries (7d) | Clicks | Impressions | CTR | Avg Position |',
      '| :--- | :---: | :---: | :---: | :---: |',
      ...(gscResult.queries.length > 0
        ? gscResult.queries.map(
            (q) =>
              `| \`${escapeMdCell(q.query)}\` | **${q.clicks}** | ${q.impressions} | ${formatPercent(q.ctr)} | ${q.position.toFixed(1)} |`
          )
        : ['| `(0 search impressions finalized in 7d window)` | **0** | 0 | 0.0% | — |']),
      '',
      '| Top Search Landing Pages (7d) | Clicks | Impressions | CTR | Avg Position |',
      '| :--- | :---: | :---: | :---: | :---: |',
      ...(gscResult.pages.length > 0
        ? gscResult.pages.map(
            (p) =>
              `| \`${escapeMdCell(p.page)}\` | **${p.clicks}** | ${p.impressions} | ${formatPercent(p.ctr)} | ${p.position.toFixed(1)} |`
          )
        : ['| `(0 search landing-page rows finalized in 7d window)` | **0** | 0 | 0.0% | — |'])
    );
  }

  return [
    PULSE_START_MARKER,
    '## 00. Automated Live Visitor, UTM & Model-Efficiency Pulse (`npm run telemetry:pull`)',
    '',
    `- **Last Pulled:** \`${stampedAt}\` · **GA4 Property:** \`${propertyId}\` (\`G-1BWMQWZJQ5\`, ${discoverySource})`,
    `- **Honest Traffic Calibration:** ${realityNote}`,
    '',
    '### 00a. Daily, 7-Day & 28-Day Human Traffic Baseline',
    '',
    '| Window | Active Users | New Users | Sessions | Engaged Sessions | Engagement Rate | Avg Dwell / Session |',
    '| :--- | :---: | :---: | :---: | :---: | :---: | :---: |',
    ...baselineTableRows,
    '',
    '### 00b. Channel & Social Campaign Funnel (`7d` · `x`, `linkedin`, `youtube_shorts`, `post_001_neon_gauntlet`)',
    '',
    '| Source / Medium | Campaign | Sessions (Clicks) | Users | Engaged Sessions | Avg Dwell |',
    '| :--- | :--- | :---: | :---: | :---: | :---: |',
    ...channelTableRows,
    '',
    '### 00c. Model × Thinking Effort Efficiency Matrix (`7d`)',
    '',
    `*Attribution Mode: ${attributionLabel}*`,
    '',
    '| Authoring Model · Effort | Content Surface | Page Views | Avg Active Dwell / View | `engaged_read` (`15s/45s/120s`) | `scroll_milestone` (`50%/90%`) |',
    '| :--- | :--- | :---: | :---: | :---: | :---: |',
    ...matrixTableRows,
    '',
    `> **Editorial Takeaway for Today's Curation:** ${editorialTakeaway}`,
    '',
    '### 00d. Google Search Console Organic Discovery (`7d`)',
    '',
    ...gscSectionLines,
    PULSE_END_MARKER,
  ].join('\n');
}

function upsertSectionZeroZero(markdownBlock) {
  if (!existsSync(TELEMETRY_REPORT_PATH)) {
    throw new Error(`Telemetry report not found at ${redactHomePath(TELEMETRY_REPORT_PATH)}`);
  }
  const existing = readFileSync(TELEMETRY_REPORT_PATH, 'utf8');
  const startIdx = existing.indexOf(PULSE_START_MARKER);
  const endIdx = existing.indexOf(PULSE_END_MARKER);

  let updated;
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    updated =
      existing.slice(0, startIdx) +
      markdownBlock +
      existing.slice(endIdx + PULSE_END_MARKER.length);
  } else {
    const firstHrMatch = existing.match(/\n---\n/);
    if (firstHrMatch && firstHrMatch.index !== undefined) {
      const insertPos = firstHrMatch.index + firstHrMatch[0].length;
      updated = `${existing.slice(0, insertPos)}\n${markdownBlock}\n\n---\n${existing.slice(insertPos)}`;
    } else {
      updated = `${markdownBlock}\n\n---\n\n${existing}`;
    }
  }

  writeFileSync(TELEMETRY_REPORT_PATH, updated, 'utf8');
}

async function main() {
  const cli = parseCliArgs(process.argv);
  const config = loadAnalyticsConfig();
  const credLookup = resolveServiceAccountCredentials();

  if (!credLookup.creds) {
    const pendingMd = renderPendingCredentialsBlock(credLookup.missingReason);
    if (cli.write) {
      upsertSectionZeroZero(pendingMd);
      console.log(
        '[telemetry:pull] Pending read-only Viewer key (~/.config/geminipulse/analytics-reader.json not present yet).'
      );
      console.log(
        '[telemetry:pull] Updated Section 00 in docs/daily-telemetry-report.md with setup instructions (-> docs/analytics-setup-guide.md).'
      );
    } else {
      console.log(pendingMd);
    }
    if (cli.strict) {
      process.exit(1);
    }
    return;
  }

  try {
    console.log(`[telemetry:pull] Authenticating via Google OAuth2 RS256 (${credLookup.sourceLabel})...`);
    const accessToken = await fetchGoogleAccessToken(credLookup.creds);
    const { propertyId, discoverySource } = await discoverGa4PropertyId(accessToken, config);
    console.log(`[telemetry:pull] Resolved GA4 Property ID ${propertyId} (${discoverySource}). Pulling 4 telemetry reports...`);

    const [baselineRows, channelRows, matrixResult, gscResult] = await Promise.all([
      queryTrafficBaseline(accessToken, propertyId),
      queryChannelFunnel(accessToken, propertyId),
      queryModelEffortMatrix(accessToken, propertyId),
      querySearchConsole(accessToken, config),
    ]);

    const payload = {
      pulledAt: new Date().toISOString(),
      propertyId,
      discoverySource,
      baselineRows,
      channelRows,
      matrixResult,
      gscResult,
    };

    const liveMd = renderLiveAnalyticsBlock(payload);

    if (cli.write) {
      upsertSectionZeroZero(liveMd);
      const r7 = baselineRows.find((r) => r.key === '7d');
      console.log(
        `[telemetry:pull] Updated Section 00 in docs/daily-telemetry-report.md (7d activeUsers=${r7?.activeUsers ?? 0}, GSC=${gscResult.ok ? gscResult.siteUrl : 'pending'}).`
      );
    }
    if (cli.json) {
      console.log(JSON.stringify(payload, null, 2));
    } else if (!cli.write) {
      console.log(liveMd);
    }
  } catch (err) {
    console.error(`[telemetry:pull] Error: ${err.message}`);
    if (cli.strict) {
      process.exit(1);
    }
    process.exitCode = 1;
  }
}

await main();
