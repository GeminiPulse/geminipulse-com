# GeminiPulse.com — Session Status & Claude Registry Sync (`docs/status.md`)

- **Last Updated:** `2026-10-30 18:00 EDT (Episode 08 Published + Brand Rosetta Stone SVG + Short #05 Registered + Making the Switch Series Page Live v2.0.43)`
- **Repository:** `https://github.com/GeminiPulse/geminipulse-com` (**PUBLIC** — `origin` remote only; `agile` remote untouched)
- **Active Branch:** `v2.0` (Set as default branch on GitHub)
- **Primary Production URL:** **`https://geminipulse.com`** (`HTTP/2 200`, Google-managed SSL active; `https://www.geminipulse.com` -> `301` redirect to `https://geminipulse.com/`)
- **Firebase Default Hosting URL:** `https://geminipulse-com.web.app`
- **Local Dev Preview URL:** `http://localhost:8080`
- **Firebase Project ID:** `geminipulse-com` (Project Number `643794480842`, Spark Free Plan — **\$0.00/mo**)
- **Firebase Web App ID:** `1:643794480842:web:9f973bc1a0d7670c920e33` (`GeminiPulse Web`)
- **Concept Originator & Creative Catalyst:** Neil S. White (`https://www.linkedin.com/in/neilswhite`, **Agile LLC**)
- **Autonomous Lead Architect & Editor-in-Chief:** Google Gemini 4 Argon (`gemini-4-argon`) inside Google Antigravity

---

## 1. Completed & Live on `v2.0` (2026-10-30 6:00 PM ET Update)

- **Published Build Chronicle Episode 08 & Webmaster's Rosetta Stone (`v2.0.43`):**
  - **Article:** `chronicles/episode-08-making-the-switch-from-wordpress-ftp-to-antigravity.md` published and integrated into `ANTIGRAVITY_CHRONICLES` in `geminiEcosystemData.js`.
  - **Brand Graphic (SVG):** Created high-resolution GeminiPulse brand diagram (`public/public/assets/making-the-switch-rosetta-stone.svg`) translating traditional web concepts (FTP, `wp-content`, staging subdomains, Dropbox/S3 backups, and 40+ plugins) into agentic concepts (Local Checkout, Git Worktrees, branches `main`/`v2.0`, GitHub Remotes, and specialized subagents).
  - **Standalone Series Landing Page:** `public/public/series/making-the-switch/part-1-from-wordpress-to-antigravity.html` complete with Schema.org `TechArticle` metadata.
  - **Shorts Studio Integration:** Registered Short #05 (*"Making the Switch: Translating 20 Years of WordPress into Antigravity"*) into `YOUTUBE_SHORTS_STUDIO`.
  - **Video & Social Production Kit:** Created `social-kits/episode-08-making-the-switch-video-kit.md` with 60-second vertical video script, LinkedIn agency post, and X/Twitter thread.
  - **Production Build:** Passed `npm run build` cleanly (stamped `v2.0.43`).

- **Curated Official Google Gemini Computer Use General Availability (GA) (`v2.0.42`):**
  - **Grounded Primary Source:** Google AI for Developers Changelog (`ai.google.dev/gemini-api/docs/changelog#10-30-2026`) & Guide (`ai.google.dev/gemini-api/docs/computer-use`) on October 30, 2026.
  - **Core Capabilities Promoted to GA:** Multi-environment support (`browser`, `desktop`, `mobile`), native `intent` reasoning explanation on every action payload, configurable safety policies, and opt-in screenshot scanning for adversarial prompt injection detection.
  - **Model Tiering:** Recommended `gemini-3.8-flash` for high-frequency low-latency UI agent loops (`$0.75 / $3.75` per 1M tokens) + `gemini-4-argon` for frontier multi-window orchestration.
  - **Feed Integration:** Added to `PULSE_INTELLIGENCE_FEED` in `public/src/data/geminiEcosystemData.js`.

- **Published 3-Part Deep-Dive Series (`public/public/series/gemini-computer-use/`):**
  - **Part 1 (`part-1-computer-use-ga-breakdown.html`):** *Gemini Computer Use Reaches General Availability: Multi-Environment Browser, Desktop & Mobile UI Control* (Preview vs. GA delta, model tiering, minimal TypeScript/Python snippet).
  - **Part 2 (`part-2-how-it-affects-builders.html`):** *How Gemini Computer Use Affects Builders: Intent Fields, Safety Policies & Prompt Injection Defense* (Telemetry observability, client execution loops with Playwright/Puppeteer, screenshot defense).
  - **Part 3 (`part-3-concrete-business-use-cases.html`):** *5 Concrete Business & Enterprise Use Cases for Gemini Computer Use GA* (Vendor invoice reconcile, autonomous regression QA, competitor pricing scanner, legacy ERP form filling, Android flow verification).

- **Published Companion Agile Labs Simulator (`public/public/labs/`):**
  - **Interactive Workbench (`gemini-computer-use-simulator.html` [SIMULATED DEMO]):** Interactive UI allowing builders to test target environments (`browser`, `desktop`, `mobile`), model tiers (`gemini-3.8-flash` vs `gemini-4-argon`), prompt injection interception, and inspect turn-by-turn intent and bounding-box coordinates with copy-and-paste SDK blueprints.

- **Antigravity Build Chronicle Episode 07 Registered (`v2.0.42`):**
  - *Episode 07: The 20K Customization Ceiling — Context Hygiene, Quota Preservation, and Tool Pruning in Antigravity* registered into `ANTIGRAVITY_CHRONICLES` and `feed.xml`.

- **SEO & Distribution Parity:**
  - `sitemap.xml` updated to index all 4 new standalone pages (now `17` discovered pages).
  - `feed.xml` Atom stream updated with Computer Use GA series and Episode 07.

- **LIVE Stripe Supporter Checkout & Self-Serve Customer Portal Active (`v2.0.41`):**
  - **One-Time Supporter Pass (`\$15` suggested / `\$5` min):** `https://buy.stripe.com/cNidR9h2J469b3jdgn7Re00` (`HTTP/2 200`, redirects post-payment to `https://geminipulse.com/?support=thanks#support`).
  - **Monthly Founding Supporter & Pro Insider (`\$9/mo`):** `https://buy.stripe.com/7sYeVdbIp6eh4EVa4b7Re01` (`HTTP/2 200`, redirects post-payment to `https://geminipulse.com/?support=welcome#support`).
  - **Self-Serve Stripe Customer Portal:** `https://billing.stripe.com/p/login/cNidR9h2J469b3jdgn7Re00` (`HTTP/2 200`, 1-click subscription management, card updates, and invoice history).
  - Wired live across `STRIPE_SUPPORT_CONFIG` (`public/src/data/geminiEcosystemData.js`), post-checkout native `<dialog>` confirmation in `public/src/App.jsx`, `/partners`, and `/status` (`$0.00/mo` Spark-compatible, Radar Lite `$0.00` included, zero paid Stripe add-ons).

- **Twin-Star (`Castor & Pollux`) Brand Kit Live Across All 5 Channels + Open Graph Preview Card Deployed (`v2.0.39`):**
  - **5-for-5 Platform Avatar & Safe-Zone Banner Rollout Verified Live on Platform CDNs:**
    1. **YouTube (`https://www.youtube.com/@geminipulse`):** `800x800` Twin-Star Avatar + `2560x1440` (`1546x423` safe-zone) Channel Banner published live via YouTube Studio.
    2. **X (`https://x.com/geminipulse`):** `800x800` Twin-Star Avatar + `1500x500` Header Banner uploaded & saved live.
    3. **LinkedIn (`https://www.linkedin.com/company/geminipulse/`):** `800x800` Company Logo + `1128x191` Cover Ribbon uploaded & saved live.
    4. **Reddit (`https://www.reddit.com/r/GeminiPulse/`):** `800x800` Community Icon + `1920x256` Community Banner uploaded & saved live.
    5. **GitHub Organization (`https://github.com/GeminiPulse`):** `800x800` Twin-Star Organization Avatar + Website (`https://geminipulse.com`) + X (`@geminipulse`) profile metadata saved & verified live.
  - **1200x630 Social Preview Card (`og-image.png`):** Deployed `https://geminipulse.com/og-image.png` (`HTTP/2 200`) across `public/index.html`, `/partners`, `/status`, all 3 `/labs/*.html` apps, and all 3 `/series/gemini-4-carbon/*.html` articles (`0` layout overflows across all 4 viewports).
  - **Zero-PII Rule Enforced:** Verified `0` personal emails, `0` personal social handles, `0` internal billing/affiliate account IDs, and `0` local filesystem paths across all tracked repository files (`.local/` gitignored).

- **Stripe `GeminiPulse` Sub-Account Branded & CJ Affiliate `GeminiPulse` Property Configured (`2026-10-30 03:00 EDT`):**
  - **Stripe Sub-Account (`GeminiPulse` under `AGILE LLC`):** Configured Account Display Name (`GeminiPulse`), Website (`https://geminipulse.com`), payment/subscription workflows, and Checkout Branding (`512x512` `gemini-sparkle` Icon & Logo, `#0B0F19` Brand color, `#4285F4` Accent color). Parked at `Activate your products` for final operator `Agree & submit` click to unlock Live `buy.stripe.com` Payment Links.
  - **CJ Affiliate Publisher Onboarding (Branded Google Cloud Invite):** Completed & saved **Network Profile** and **Primary Promotional Property `GeminiPulse`** (`https://geminipulse.com`, `Content/Blog/Media`, `Status: Active`); parked at `onboarding.cj` awaiting operator completion of tax & payout verification to click `ACTIVATE ACCOUNT`.

- **Google Workspace Referral Partner Link Wired Live (`v2.0.37`):**
  - **Live Referral URL:** **`https://sharegoogleworkspace.advocate.impact.com/mzYYGz3`** wired with `rel="sponsored noopener noreferrer"` and transparent FTC/Google disclosure across `#get-started` Path 01 (`public/src/data/geminiEcosystemData.js`, `public/src/App.jsx`) and the interactive **GeminiStack Advisor** (`/labs/gemini-4-stack-advisor.html`).
  - **Bot-Safe Single-Use 10% First-Year Promo Code Request Flow:** Because Google's 10% first-year Business Starter / Standard / Plus promo codes are strictly single-use per domain, added a 1-click **"Request 10% Promo Code →"** trigger into our write-only Cloud Firestore `business_inquiries` modal so codes are never scraped or burned on public HTML.

- **5 of 5 Unified `geminipulse` Social & Developer Channels Claimed, Cross-Linked & Wired Live (`v2.0.34` – `v2.0.36`):**
  - **YouTube Brand Channel (`@geminipulse`):** **`https://www.youtube.com/@geminipulse`**, created as a dedicated Brand Account channel with full bio and all 5 official external links (`GeminiPulse.com`, `GitHub`, `X`, `Reddit`, `LinkedIn`) published via YouTube Studio.
  - **X Business Professional Account (`@geminipulse`):** **`https://x.com/geminipulse`**, configured on the `$0.00` free X Business Professional Account tier (`Science & Technology`) with official branding, bio, and `https://geminipulse.com`.
  - **LinkedIn Company Page (`/company/geminipulse`):** **`https://www.linkedin.com/company/geminipulse/`**, created with industry (`Technology, Information and Internet`), website (`https://geminipulse.com`), and official tagline.
  - **Reddit Community (`r/GeminiPulse`):** **`https://www.reddit.com/r/GeminiPulse/`** (Public, SFW), created with community description linking to `https://geminipulse.com`.
  - **GitHub Organization (`GeminiPulse`):** **`https://github.com/GeminiPulse/geminipulse-com`** (live public repo).
  - **Wired onto `https://geminipulse.com`:** All 5 live channels are now linked in Schema.org `Organization.sameAs` + `twitter:site` (`public/index.html`), `#video-showcase`, `#forum`, the site footer (`public/src/App.jsx`), and `/llms.txt`.

- **Google Search Console Verified Live + `sitemap.xml` (`15` Pages) Submitted (`v2.0.33`):**
  - **Dual-Verified URL Prefix (`https://geminipulse.com/`):** Verified ownership in Google Search Console via both `<meta name="google-site-verification" content="-dXZoocEE2o2es_1mSraj1roS7XuldTg7iTVNwtADMs" />` (`public/index.html`) and `google5049391f94391a64.html` (`public/public/google5049391f94391a64.html`), with `robots.txt` validated as **`Valid`**.
  - **Sitemap & Priority Crawl Queue:** Submitted `https://geminipulse.com/sitemap.xml` -> Status **`Success`**, **`15` discovered pages** (`Oct 30, 2026`), and triggered URL Inspection **Request Indexing** on `https://geminipulse.com/` (*"URL is on Google — added to a priority crawl queue"*).
  - **Optional Wildcard Domain TXT Record Captured (`geminipulse.com`):** Saved `google-site-verification=-dXZoocEE2o2es_1mSraj1roS7XuldTg7iTVNwtADMs` in Section 2 below for optional future Cloudflare DNS wildcard subdomain (`*.geminipulse.com`) verification.

- **"Built with Google Gemini" Expansion — 2 Playable Astrological Originals + 5 Curated Ecosystem Apps (`v2.0.32`):**
  - **`/labs/twin-stars-of-gemini.html` (*Castor & Pollux: Twin Stars of Gemini*):** 60fps HTML5 Canvas + procedural Web Audio zodiac arcade game where players rotate & polarity-swap the Twin Stars of Gemini to illuminate all 12 real stars of the Gemini constellation and unlock astronomical lore.
  - **`/labs/gemini-cosmic-horoscope.html` (*Gemini Twin-Star Cosmic Oracle & Daily Horoscope*):** Interactive 1-page astrology & daily dual-mind horoscope for all 12 signs with real synodic lunar phase calculation, birthday sign finder (with Twin-Born Sovereign mode for May 21 – June 20 birthdays), Castor (Strategy) vs. Pollux (Creative Spark) readings, and Twin-Aspect compatibility matcher.
  - **5 Real "Found by GeminiPulse" Curated Discoveries in `#showcase`:** Added *Deviation Game / Outdraw AI* (`deviationgame.com`), *Jayu* (`ai.google.dev/competition/projects/jayu`), *Prospera* (`ai.google.dev/competition/projects/prospera`), *Google NotebookLM* (`notebooklm.google`), and *Gemini CLI* (`github.com/google-gemini/gemini-cli`), each clearly badged (`Gemini Labs Original` vs. `Found by GeminiPulse` vs. `Official Google Reference` vs. `Community Submission`) in strict compliance with House Rule #5.
  - **Chalked Up on Master Roadmap — Subdomain & Domain-Portfolio Micro-App Launchpad:** Incubate rapid 1-page games & utilities under `/labs/<slug>.html`, validate traction via GA4 (`G-1BWMQWZJQ5`), and graduate winners either to `*.geminipulse.com` subdomains (`arcade.geminipulse.com`, `cosmic.geminipulse.com`, `tools.geminipulse.com` via Firebase Hosting multi-site + 1 Cloudflare CNAME) or standalone domains from Neil’s domain portfolio.

- **Google Sign-In Live Fix + Support & Contribute Portal (`v2.0.31`):**
  - **Fixed Live Google Sign-In (`public/vite.config.js` + `public/src/firebase.js`):** Resolved the regression where Rollup's custom `firebase-*` `manualChunks` split caused `loadFirebaseRuntime()` to catch an initialization error and surface the false `"Firebase Auth is not yet connected..."` fallback. Restored native Rollup dynamic ESM splitting for `firebase/*`, made `initializeApp` idempotent (`getApps().length ? getApp() : initializeApp(firebaseConfig)`), added transient retry recovery + popup-blocked guidance, and verified live Google OAuth popup invocation (`https://geminipulse-com.firebaseapp.com/__/auth/handler`) via headless Chrome CDP.
  - **Support & Contribute Portal (`STRIPE_SUPPORT_CONFIG` + Native `<dialog>`):** Added **Contribute** entry points in the top telemetry bar, navbar `More` menu, Hero CTA bar, `#about-charter`, Footer, and `/partners` (`/#support`), opening an accessible top-layer `<dialog closedby="any">` modal with two tiers (*One-Time Contribution* and *Founding Supporter \$9/mo*). Wired directly to `STRIPE_SUPPORT_CONFIG` in `public/src/data/geminiEcosystemData.js` for 1-click `buy.stripe.com` checkout (`$0/mo` Spark-compatible) with write-only Firestore early-supporter email notification until Neil pastes his Stripe Payment Link URLs.

0. **3-Part Gemini 4 Carbon Release Series, Agile Labs Mini-Project, YouTube Video Showcase, `/status` + `/partners` & Live GA4 (`G-1BWMQWZJQ5`):**
   - **3-Part Gemini 4 Carbon Deep-Dive Series (`#release-series` + `/series/gemini-4-carbon/*.html`):** Cites 100% direct official Google primary documentation (`blog.google/.../introducing-gemini-4-carbon/`), translates dry specs into *"What Changed vs. Argon → How Does This Affect Me? → 5 Concrete Business & Security Use Cases"*, and publishes 3 standalone crawlable HTML pages indexed in `sitemap.xml` and `feed.xml`.
   - **Agile Labs Showcase Mini-Project (`/labs/gemini-4-stack-advisor.html`):** Interactive native-slider **GeminiStack Advisor** calculating real-time 95% cached-input API savings (`$2.00/1M -> $0.10/1M`), Hybrid `3.8-flash` / `4-argon` / `4-carbon` routing, and Google Workspace with Gemini team consolidation ROI.
   - **Curated YouTube Creator & Official Google Video Showcase (`#video-showcase`):** Features 8 oEmbed-verified YouTube videos (*Featured Video of the Day* + independent creators & official `@GoogleDevelopers` / `@googledeepmind` / `@googlecloudtech` talks), real lazy-loaded `hqdefault.jpg` thumbnails, Gemini AI executive video reviews, and zero-bloat click-to-play `youtube-nocookie.com` embeds.
   - **Prominent "How to Get Started with Google Gemini" Hub (`#get-started`):** 4 actionable onboarding tracks (*Google Workspace with Gemini*, *Google AI Studio + Antigravity*, *Google Jules + `MadeWithJules.com` sister-platform teaser*, and *Firebase + Google Cloud Free Tier*).
   - **Post-Submit Inquiry Completion UX + `/status` & `/partners` Routes:** Replaced post-submit form clutter with a clean confirmation screen and topic-aware next steps routing to `/partners` (Sponsorship & Featured Launchpad opportunities) or `/status` (auto-stamped live Build Number via `public/scripts/stamp-build.mjs`).
   - **Live Google Analytics 4 (`G-1BWMQWZJQ5`):** Wired post-paint inside `public/src/firebase.js` (`loadFirebaseRuntime()`) with custom event tracking so Quad-100 Desktop Lighthouse is preserved while visitor sessions & funnel actions record immediately.

1. **Glass-Box Speed, Search & Blind AI-Content Lab (`#performance-ledger`) + Automated Lighthouse Bot (`audit-lighthouse.mjs`):**
   - Built `public/scripts/audit-lighthouse.mjs` (`npm run audit:lighthouse`) running official Google Lighthouse CLI across Desktop & Mobile against `https://geminipulse.com`.
   - Upgraded SDK button contrast (`bg-blue-700 text-white`), fixed 2 skipped `h4` -> `h3` headings, added metric-calibrated `Plus Jakarta Fallback` `@font-face`, and switched Google Fonts to non-render-blocking preload.
   - Deployed live `#performance-ledger` displaying real measured Lighthouse & Core Web Vitals history, external monitor hooks (GTmetrix, Google Search Console, AI-Detector Calibration), and the **4-Track Blind 5-Wave Longitudinal Content Study** specification (`/insights/<slug>`, 5 waves, 5 days apart: Gemini 4 Argon vs. Claude vs. ChatGPT vs. Human-Edited Hybrid Control).
2. **Personal Portfolio Link Cleanup & Write-Only Business Inquiry + Email Dispatch Plumbing:**
   - Removed all legacy external portfolio and agency URLs across the live application (`0` occurrences), removed personal attribution from top telemetry/navbar/footer banners, and kept a single quiet LinkedIn link inside `#about-charter`.
   - Delegated to `firestore-rules-author` to add write-only PII-protected rules (`allow get, list: if false; allow update, delete: if false;`) for `business_inquiries/{inquiryId}` and `newsletter_subscribers/{subscriberId}`, deployed live to Cloud Firestore.
   - Added accessible **Business & Creator Inquiries** dialog and **Weekly Pulse & Thursday Arena Dispatch** email opt-in + `/feed.xml` Atom syndication feed (`<link rel="alternate" type="application/atom+xml">`).
3. **Google GenAI SDK v2.32 (JS/TS) & v2.34 (Python) Upstream Release Folded In:**
   - Curated the October 29, 2026 upstream SDK release on npm (`@google/genai` v2.32.0) and PyPI (`google-genai` v2.34.0).
   - Added `pulse-genai-sdk-v2-32-continuation` to `PULSE_INTELLIGENCE_FEED`, highlighting native `automatic_continuation` on `client.interactions.create`, `continuation_token` / `requires_continuation` detection, and multi-hop grouping under `continuation_ids`.
   - Published **Chronicle Episode 06**: `chronicles/episode-06-native-interactions-api-continuation-and-the-embargo-triad.md`.
2. **3x/Day Google Embargo Triad with Zero-Filler Guard:**
   - Synchronized curation runs to the 3 Google announcement windows: `8:45 AM ET` (DeepMind London), `12:45 PM ET` (Mountain View 9 AM PT embargo lift), and `5:45 PM ET` (West Coast afternoon SDK releases).
   - Enforced the hard Zero-Filler No-Op Guard to halt without file edits or empty commits whenever no verified Google release exists.
3. **Global Firestore Community Persistence & Linked Contributions Ledger:**
   - Hardened 398-line `firestore.rules` for forum replies, deduplicated project upvotes (1 per Google UID), and private moderation reports.
   - Deployed the linked Human & AI Contributions Ledger (`docs/contributions-ledger.md` + `#contributions-ledger`) celebrating Neil S. White, Gemini 4 Argon, Claude (operator), and Antigravity specialist subagents.
4. **Firebase Hosting & Cloud Firestore Security Rules Deployed Live (`$0/mo Spark Plan`):**
   - Registered Web App `GeminiPulse Web` (`1:643794480842:web:9f973bc1a0d7670c920e33`) in Firebase project `geminipulse-com`.
   - Wrote `public/.env.local` locally (git-ignored) and built the production bundle (`public/dist/`).
   - Deployed **Firebase Hosting** to **`https://geminipulse-com.web.app`**.
   - Provisioned the `(default)` **Cloud Firestore** database and deployed the 264-line schema-validated [`firestore.rules`](../firestore.rules) (`cloud.firestore: rules file firestore.rules compiled successfully` and released).
2. **Custom Domains Registered on Firebase Hosting (`geminipulse.com` & `www.geminipulse.com`):**
   - Registered both `geminipulse.com` and `www.geminipulse.com` (redirecting to `geminipulse.com`) on Firebase Hosting site `projects/geminipulse-com/sites/geminipulse-com`.
   - Retrieved the exact `requiredDnsUpdates` directly from the Firebase Hosting API for Claude to add to the active Cloudflare zone (see Section 2 below).
3. **Frontier Tri-Model Arena — All 4 Single-Shot Gemini 4 Argon Apps Live (`#tri-model-arena`):**
   - **Experiment #01 (`/arena/exp-01-gemini-4-argon.html`):** *PulseMetric B2B AI Attribution Launchpad + Full SEO/GEO Schema* (308 lines, custom SVG attribution graph, live ROI recovery slider, monthly/annual pricing toggle, Schema.org `SoftwareApplication` + `FAQPage` JSON-LD).
   - **Experiment #02 (`/arena/exp-02-gemini-4-argon.html`):** *AgileScope Client Scope & Dynamic Proposal Studio* (345 lines, 8 toggleable deliverables across 4 tracks, Standard vs. 1.25x Sprint math, week-by-week Gantt timeline bars, `localStorage` persistence, and `@media print` PDF proposal mode).
   - **Experiment #03 (`/arena/exp-03-gemini-4-argon.html`):** *Enterprise Vector & Property Graph Databases 2026 (GEO Authority Hub)* (326 lines, direct-answer GEO citation block, 3-question interactive stack recommender, `TechArticle` + `ItemList` JSON-LD, and `/llms.txt` modal generator).
   - **Experiment #04 (`/arena/exp-04-gemini-4-argon.html`):** *Orbital Pulse — 60fps HTML5 Canvas & Procedural Web Audio Arcade Game* (429 lines, zero external image/audio assets, orbital shield deflection physics, combo multipliers, EMP shockwaves, and procedural Web Audio API sound synthesis).
   - Added an embedded **Live Interactive Sandbox Preview** (`<iframe>` + Fullscreen launcher) directly inside `#tri-model-arena`.
4. **Public Repository & Open Architecture Blueprint (`docs/architecture-plan.md`):**
   - Audited full git history for zero secrets (`git log --all -p` verified clean) and switched `https://github.com/GeminiPulse/geminipulse-com` to **Public** with `README.md`, `GEMINI.md`, `AGENTS.md`, `docs/architecture-plan.md`, and `chronicles/` Episodic Logs.
5. **All 3 Pre-Launch Audit Fixes & Daily 9 AM Sidecar Verified:**
   - Every news card in `PULSE_INTELLIGENCE_FEED` deep-links to its specific Google announcement or documentation page with zero unlinked figures.
   - Daily `0 9 * * *` sidecar (`~/.gemini/config/sidecars/geminipulse-daily-curator/sidecar.json`) commits to `v2.0`, updates `docs/status.md` & `GEMINI.md`, and pushes to `origin`.

---

## 2. Exact Cloudflare DNS Records for Claude (`geminipulse.com`)

Both custom domains are now registered on Firebase Hosting site `geminipulse-com` and waiting for these exact DNS records in Cloudflare (all with Cloudflare Proxy OFF / **DNS Only**, grey cloud):

| Type | Name | Value (`rdata`) | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`A`** | `@` (`geminipulse.com`) | `199.36.158.100` | **DNS Only (Grey Cloud)** | Points apex `geminipulse.com` to Firebase Hosting global CDN & enables Google-managed SSL |
| **`TXT`** | `@` (`geminipulse.com`) | `hosting-site=geminipulse-com` | **DNS Only** | Verifies site ownership for `projects/geminipulse-com/sites/geminipulse-com` |
| **`CNAME`** | `www` (`www.geminipulse.com`) | `geminipulse-com.web.app` | **DNS Only (Grey Cloud)** | Points `www` to Firebase Hosting (configured to redirect to `geminipulse.com`) |
| **`TXT`** *(Optional)* | `@` (`geminipulse.com`) | `google-site-verification=-dXZoocEE2o2es_1mSraj1roS7XuldTg7iTVNwtADMs` | **DNS Only** | Optional Domain-level Search Console verification for future `*.geminipulse.com` subdomains (`https://geminipulse.com/` is already dual-verified & indexing!) |

*(Remember to remove any old parking `A` / `AAAA` / `CNAME` records on `@` and `www` in Cloudflare so Google Trust Services can auto-provision the SSL certificate cleanly.)*

---

## 3. What Needs Neil (Optional Future Milestones Only)

1. **Google Sign-In Provider & Authorized Domains — COMPLETED (`2026-10-28 22:25 EDT`):**
   - Google Sign-In is **Enabled** in Firebase Authentication.
   - `geminipulse.com` and `www.geminipulse.com` are registered in Firebase Authentication's `authorizedDomains` alongside `geminipulse-com.web.app`.
   - Composite indexes for `forum_threads` and `showcase_projects` (`status` ASC + `createdAt` DESC) are deployed in `firestore.indexes.json`.
2. **Optional Blaze Billing Gate (House Rule #3 — Waiting for Your Explicit "Yes"):**
   - Everything currently live (`https://geminipulse.com`, Google Sign-In, Firestore database + `firestore.rules` + indexes, custom domain SSL, and the Tri-Model Arena) runs on the **\$0.00/month Spark Free Plan**.
   - Upgrading to **Firebase Blaze (Pay-as-you-go)** is **only** needed when you want to deploy the 3 server-side Cloud Functions (`moderateForumPost`, `curateShowcaseProject`, `autonomousNewsGenerator` in `functions/index.js`). Estimated cost: **\$0.50 – \$3.00 / month** with a **\$10.00/mo budget alert**.
