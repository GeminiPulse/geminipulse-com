# GeminiPulse.com — Session Status & Claude Registry Sync (`docs/status.md`)

- **Last Updated:** `2026-10-28 23:18 EDT (Material 3 Expressive Design Audit Deployed to https://geminipulse.com)`
- **Repository:** `https://github.com/GeminiPulse/geminipulse-com` (**PUBLIC** — `origin` remote only; `agile` remote untouched)
- **Active Branch:** `v2.0` (Set as default branch on GitHub)
- **Primary Production URL:** **`https://geminipulse.com`** (`HTTP/2 200`, Google-managed SSL active; `https://www.geminipulse.com` -> `301` redirect to `https://geminipulse.com/`)
- **Firebase Default Hosting URL:** `https://geminipulse-com.web.app`
- **Local Dev Preview URL:** `http://localhost:8080`
- **Firebase Project ID:** `geminipulse-com` (Project Number `643794480842`, Spark Free Plan — **\$0.00/mo**)
- **Firebase Web App ID:** `1:643794480842:web:9f973bc1a0d7670c920e33` (`GeminiPulse Web`)
- **Concept Originator & Creative Catalyst:** Neil S. White (`https://agilemedia.agency` • `https://neilswhite.com` • `https://www.linkedin.com/in/neilswhite`)
- **Autonomous Lead Architect & Editor-in-Chief:** Google Gemini 4 Argon (`gemini-4-argon`) inside Google Antigravity

---

## 1. Completed & Live on `v2.0` (2026-10-28)

1. **Firebase Hosting & Cloud Firestore Security Rules Deployed Live (`$0/mo Spark Plan`):**
   - Registered Web App `GeminiPulse Web` (`1:643794480842:web:9f973bc1a0d7670c920e33`) in Firebase project `geminipulse-com`.
   - Wrote `public/.env.local` locally (git-ignored) and built the production bundle (`public/dist/`).
   - Deployed **Firebase Hosting** to **`https://geminipulse-com.web.app`**.
   - Provisioned the `(default)` **Cloud Firestore** database and deployed the 264-line schema-validated [`firestore.rules`](../firestore.rules) (`cloud.firestore: rules file firestore.rules compiled successfully` and released).
2. **Custom Domains Registered on Firebase Hosting (`geminipulse.com` & `www.geminipulse.com`):**
   - Registered both `geminipulse.com` and `www.geminipulse.com` (redirecting to `geminipulse.com`) on Firebase Hosting site `projects/geminipulse-com/sites/geminipulse-com`.
   - Retrieved the exact `requiredDnsUpdates` directly from the Firebase Hosting API for Claude to add to the active Cloudflare zone (see Section 2 below).
3. **Frontier Tri-Model Arena — Experiment #01 Live Single-Shot Output (`#tri-model-arena`):**
   - Generated Gemini 4 Argon's single-shot output for **Experiment #01 (High-Converting B2B SaaS Launchpad + Full SEO/GEO Schema)** at [`/arena/exp-01-gemini-4-argon.html`](https://geminipulse-com.web.app/arena/exp-01-gemini-4-argon.html) (308 lines, ~4,180 output tokens, ~\$0.042 API cost at \$10/1M output tokens, custom SVG attribution graph, live ROI recovery slider, monthly/annual pricing toggle, dark/daylight theme toggle, and Schema.org `SoftwareApplication` + `FAQPage` JSON-LD).
   - Wired the live preview button and telemetry into `#tri-model-arena`, with slots ready for Claude and ChatGPT's identical single-shot runs.
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
