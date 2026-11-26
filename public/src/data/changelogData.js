/**
 * Public Engineering & Oversight Changelog — GeminiPulse.com
 *
 * Editorial & Security Rules:
 * 1. Keep summaries short, plain, and low-cheese (one scannable line; click open for 2-sentence root cause & fix).
 * 2. Attribute honestly whether an issue was caught by Human Oversight (Product Development & Creative Direction)
 *    or by Gemini Self-Audit (headless Chrome CDP, Lighthouse, or prebuild schema validator).
 * 3. ZERO PII & ZERO SECURITY EXPOSURE: Never include personal emails, local filesystem paths, credentials,
 *    internal account IDs, or security-sensitive rule/infrastructure internals. Enforced by scripts/validate-data.mjs.
 */

export const CHANGELOG_META = {
  title: 'Engineering & Oversight Changelog',
  subtitle: 'Bugs, UX oversights, and scope restraint across an AI-maintained site.',
  introParagraphs: [
    'Short demo videos often make AI web development look like a single prompt and a finished website. In practice, shipping and maintaining a working product still involves iterations, layout bugs, data-shape regressions, and editorial course corrections.',
    'For a solo or small-team business, AI genuinely speeds up execution—yet because trying "one quick idea" feels effortless, it also creates a pull toward scope drift unless human direction enforces MVP boundaries and accepts when good enough is good enough. Below is an ongoing, plain-English log of issues caught either automatically by Gemini’s own build checks or by human product direction sending QA notes back like any developer workflow.',
  ],
};

export const CHANGELOG_ENTRIES = [
  {
    id: 'cl-2026-11-25-wcag-253-and-scrollable-regions',
    date: '2026-11-25',
    dateDisplay: 'Nov 25, 2026',
    surface: '3D Constellation Hero & Developer Workbench (/, /workbench.html)',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Running AgileADA Monitor against geminipulse.com flagged 20 WCAG 2.5.3 label-in-name mismatches (84/100) that Lighthouse missed, plus 6 unfocusable scroll boxes on /workbench.html.',
    whatHappened:
      'Google Lighthouse disables axe-core label-content-name-mismatch by default, while an earlier WCAG 2.5.3 pull request stalled in merge conflict behind daily curation rounds and /workbench.html had 6 scrollable code/article panels without keyboard tabIndex.',
    fixApplied:
      'Reconciled the WCAG 2.5.3 accessible-name fixes against latest v2.0 (prefixing visible Search ⌘K, Greek star labels, and Prev/Next text inside aria-label), added role="region" + aria-label + tabIndex={0} to all scrollable Workbench panels, and verified 0 axe-core WCAG 2.2 AA violations (100/100).',
  },
  {
    id: 'cl-2026-11-18-sitewide-ga4-provenance-telemetry',
    date: '2026-11-18',
    dateDisplay: 'Nov 18, 2026',
    surface: 'Sitewide Static Sanctuaries, Arena & Labs (/, /articles/*, /arena/*, /labs/*)',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Operator review before Post #001 caught that GA4 (G-1BWMQWZJQ5) was only wired into /workbench.html after the Look J static-sanctuary transition, leaving /, /articles/*, /arena/*, and /labs/* uninstrumented.',
    whatHappened:
      'Moving the homepage, Dual-Lens essays, Day-0 Arena comparator, and developer labs to zero-bundle static HTML left Firebase Analytics mounted solely inside the React Workbench SPA (/workbench.html), while inline window.gtag calls on / fired into a no-op.',
    fixApplied:
      'Rolled out build-enforced pulse-analytics.js via scripts/sync-analytics.mjs across all 196 static HTML routes (preserving SHA-256 hashes on untouched /arena/exp-* benchmark artifacts), stamping authored_model and thinking_effort custom dimensions with zero-TBT deferred loading, headless-bot suppression, and sitewide Chrome CDP verification.',
  },
  {
    id: 'cl-2026-11-18-article-model-effort-provenance',
    date: '2026-11-18',
    dateDisplay: 'Nov 18, 2026',
    surface: 'Flagship Essays, Series & Chronicle (/articles/*, /series/*)',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Articles credited "Google Gemini" or "Gemini 4 Argon" generically without recording which exact model checkpoint and thinking effort authored each piece.',
    whatHappened:
      'As we expanded from Gemini 4 Argon curation to multi-tier Gemini 4 Hydrogen, Neon (low–xhigh), and Carbon runs, generic model attribution hid the reasoning budget behind each dispatch.',
    fixApplied:
      'Added required authoredByModel and thinkingEffort fields enforced by scripts/validate-data.mjs, and stamped explicit Model + Effort bylines and TechArticle JSON-LD authorship across Sanctuary essays, /articles/index.html, and the Neon series.',
  },
  {
    id: 'cl-2026-11-18-neon-xhigh-nan-cdp-catch',
    date: '2026-11-18',
    dateDisplay: 'Nov 18, 2026',
    surface: 'Day-0 Neon Field Test (/arena/exp-05-neon-xhigh.html)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Arena Chrome CDP Harness',
    summary: 'Gemini 4 Neon (XHigh) over-thought its 3,830-line single-shot control room UI into a live "Lane Utilization NaN%" bug while Neon (High) scored 100.0/100.',
    whatHappened:
      'Automated headless Chrome CDP scoring (scripts/score-neon-gauntlet.mjs) caught Neon (XHigh) referencing an uninitialized ls.recentTraffic property inside its lane-capacity formula and overlapping two canvas status labels.',
    fixApplied:
      'Preserved the untouched single-shot build as empirical evidence in /arena/neon-field-test.html and documented the generative UI sweet spot—defaulting single-shot UI synthesis to Neon (High) or Hydrogen (High) (both 100.0/100) while reserving XHigh and Carbon for deductive security audits.',
  },
  {
    id: 'cl-2026-11-15-sitewide-p2-sweep',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Sitewide Labs, Series & Workbench (22 Routes)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Sitewide CDP Crawler',
    summary: 'Three developer labs overflowed horizontally at 1440px, three older labs lacked [SIMULATED DEMO] pills, and 15 routes displayed raw markdown syntax.',
    whatHappened:
      'Unbounded 1fr CSS Grid tracks allowed wide <pre> code blocks to expand parent columns past 1440px on three labs, while older series headings and Chronicle panels rendered raw markdown text.',
    fixApplied:
      'Constrained multi-column lab grids with minmax(0, 1fr) and min-inline-size: 0, added [SIMULATED DEMO] badges to all 25 labs, converted inline backticks to semantic <code> elements, and added a structured Markdown renderer for Chronicle episodes.',
  },
  {
    id: 'cl-2026-11-15-maps-studio-init-crash',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Maps Geospatial Lab (/labs/gemini-maps-studio.html)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Sitewide CDP Crawler',
    summary: 'Initial preset loader referenced undefined window.event on page load, leaving the SVG map preview and code block blank until clicked.',
    whatHappened:
      'Running our new 144-route headless Chrome crawler (audit-sitewide.mjs) caught a runtime TypeError inside setPreset("nyc3d") during initial script execution.',
    fixApplied:
      'Replaced implicit global event.target references with explicit data-preset and data-tab attribute selectors so the default NYC 3D skyline and code snippet render on load.',
  },
  {
    id: 'cl-2026-11-15-workbench-inquire-crash',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Workbench (?inquire=true)',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Clicking "Send a Note or Inquiry" from the Open Letter rendered a blank screen on /workbench.html.',
    whatHappened:
      'An autonomous Round 37 curation commit added a showcase entry using liveUrl instead of url, causing an unguarded .startsWith("/") call in App.jsx to throw on mount.',
    fixApplied:
      'Normalized the showcase item schema, added defensive URL fallbacks and a React ErrorBoundary in the Workbench app, aligned cross-document View Transition opt-ins, and added scripts/validate-data.mjs to prebuild so malformed feed items fail before build.',
  },
  {
    id: 'cl-2026-11-15-open-letter-backticks-header',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Open Letter & /status.html',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Literal markdown backticks leaked into Gate 07, header pills crowded the right edge at mid-desktop widths, and /status.html held stale v1 links.',
    whatHappened:
      'Gate 07 on the Open Letter contained literal markdown backtick characters around 100 and 99 instead of HTML code elements, the header kicker stayed visible too long on medium desktop windows, and stamp-build.mjs still output retired /#support links.',
    fixApplied:
      'Replaced raw backticks with semantic <code> tags, collapsed the decorative header kicker earlier (<76.25em) so navigation pills keep clean right-hand margin, aligned /articles/* bylines, and updated stamp-build.mjs.',
  },
  {
    id: 'cl-2026-11-15-open-letter-tone-reset',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Open Letter to Google DeepMind',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Earlier Open Letter draft read too much like a self-important manifesto and used over-adjectivized role titles.',
    whatHappened:
      'Default model prose leaned into grand self-proclamations ("uniquely positioned", "compressing a 4-month agency redesign into days") and inflated human title phrasing.',
    fixApplied:
      'Rewrote the page in a plain, self-aware voice focused on candid autonomous failure modes and a practical preview testbed offer, and standardized human credit site-wide to Product Development & Creative Direction.',
  },
  {
    id: 'cl-2026-11-15-lighthouse-cta-cls',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Open Letter (Accessibility & CLS)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Lighthouse Gate',
    summary: 'Prose link selector overrode primary orange button text contrast (1.74:1) and webfont swap shifted mobile layout (0.125 CLS).',
    whatHappened:
      'Automated Lighthouse auditing caught .chapter-prose a overriding .cta-primary dark text with light blue and flagged serif fallback height shift on mobile.',
    fixApplied:
      'Scoped prose links via .chapter-prose a:not(.cta-celestial) and added metric-calibrated Cormorant Fallback @font-face overrides, restoring 100/100/100/100 Lighthouse scores.',
  },
  {
    id: 'cl-2026-11-15-toc-pill-04-typography',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Reading Sanctuary & /articles/*',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Fourth bottom TOC button ("04 · Verdict & Sources") cramped its orbital ring, and 8.5px–9.5px micro-labels strained older 27-inch monitors.',
    whatHappened:
      'Four equal 1fr grid columns gave short labels excess width while squeezing the longest fourth label against its border, and Retina-tuned micro-typography read too small on 109-PPI desktop displays.',
    fixApplied:
      'Switched the TOC bar to a 1140px natural-width flex rail with automated margin checks in audit-layout.mjs, opted into OS text scaling (<meta name="text-scale" content="scale">), and calibrated rem-fluid body copy (18px–20.4px) with an 11px UI label floor.',
  },
  {
    id: 'cl-2026-11-15-peek-dock-1120px',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Homepage Peek Dock (1120px)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Chrome CDP Gate',
    summary: 'Split-screen 1120px laptop viewport truncated the bottom peek-bar headline with an ellipsis.',
    whatHappened:
      'Headless Chrome bounding-box checks (audit-layout.mjs) detected .peek-live-headline exceeding its flex container width by 53px before the mobile breakpoint fired.',
    fixApplied:
      'Converted dock and TOC breakpoints to scalable em media queries (max-width: 80em) so split-screen laptop windows switch cleanly to compact badges with zero truncation.',
  },
  {
    id: 'cl-2026-11-15-drawer-truncation-essays',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: '3D Constellation & Editorial Model',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Clicking a star required two steps to open a drawer that repeated its own subheadline, cut off after five lines ("..."), and hid the source link.',
    whatHappened:
      'The homepage looked distinctive visually, but fed truncated recap snippets into the slide-up sheet instead of original analysis—leaving first-time visitors confused about where the actual article lived.',
    fixApplied:
      'Shifted editorial strategy from multi-item link blurbs to complete Dual-Lens Gemini essays (/articles/*.html), eliminated all ellipses and duplicated lead sentences, and made stars open essays in one click.',
  },
  {
    id: 'cl-2026-11-15-constellation-stale-sync',
    date: '2026-11-15',
    dateDisplay: 'Nov 15, 2026',
    surface: 'Homepage 3D Star Chart (/)',
    caughtBy: 'gemini',
    caughtByLabel: 'Gemini Self-Audit · Build Pipeline Check',
    summary: 'Homepage 3D stars remained hardcoded to Nov 3–5 releases while scheduled curation updated internal feeds through Nov 13.',
    whatHappened:
      'Scheduled curation runs updated PULSE_INTELLIGENCE_FEED and /series/* pages, but index.html still held static inline JavaScript star objects.',
    fixApplied:
      'Built scripts/sync-constellation.mjs into prebuild so every build automatically syncs the 8 flagship stars, HUD cards, standalone /articles/* pages, sitemap.xml, and ⌘K search.',
  },
  {
    id: 'cl-2026-11-05-monolith-restraint',
    date: '2026-11-05',
    dateDisplay: 'Nov 05, 2026',
    surface: 'Homepage Information Architecture',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Early autonomous builds stacked 9 modules into a 24,043px homepage packed with competing cards, pills, and dense text.',
    whatHappened:
      'Left uncurbed, iterative feature additions turned the landing page into an overwhelming developer dashboard with poor scannability for human visitors.',
    fixApplied:
      'Applied scope restraint across iterative prototypes (/prototypes/index.html): moved the multi-module developer suite to /workbench.html and dedicated / to a focused 3D constellation reader.',
  },
  {
    id: 'cl-2026-10-29-banner-and-signin-pill',
    date: '2026-10-29',
    dateDisplay: 'Oct 29, 2026',
    surface: 'Navigation & Attribution Hygiene',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Top banner carried unnecessary external portfolio links, and signed-in navbar buttons wrapped into tall vertical ovals at ~1100px.',
    whatHappened:
      'Autonomous copy over-indexed on external creator links in the top banner, and multi-button signed-in controls lacked nowrap protection on mid-width screens.',
    fixApplied:
      'Removed external portfolio banner links in favor of a clean on-site inquiry modal, merged signed-in controls into a single single-line account chip, and added automated navbar height checks.',
  },
  {
    id: 'cl-2026-10-28-card-subgrid-overflow',
    date: '2026-10-28',
    dateDisplay: 'Oct 28, 2026',
    surface: 'Responsive Card Grids',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Product Dev & Creative Direction',
    summary: 'Long technical titles and inline code identifiers extended past card borders on narrow viewports.',
    whatHappened:
      'CSS Grid tracks defaulted to min-content minimums when rendering unbreakable SDK method names inside cards.',
    fixApplied:
      'Enforced minmax(0, 1fr) grid tracks with overflow-wrap: anywhere on inline code spans and built scripts/audit-layout.mjs to check 4 viewports before every push.',
  },
  {
    id: 'cl-2026-10-28-deep-links-and-rules',
    date: '2026-10-28',
    dateDisplay: 'Oct 28, 2026',
    surface: 'Citations & Pre-Launch Readiness',
    caughtBy: 'human',
    caughtByLabel: 'Human Oversight · Pre-Launch Review',
    summary: 'Initial v2.0 build linked several feed cards to top-level blog homepages instead of exact release posts and used temporary starter DB rules.',
    whatHappened:
      'Pre-launch review flagged generic domain-root source URLs and time-limited starter database configuration.',
    fixApplied:
      'Resolved every citation to its exact primary Google announcement URL and replaced starter configuration with explicit per-collection schema checks prior to DNS cutover.',
  },
];
