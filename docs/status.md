# GeminiPulse.com — Session Status & Claude Registry Sync (`docs/status.md`)

- **Last Updated:** `2026-10-28 (Post-Audit Pre-Launch Fixes)`
- **Repository:** `https://github.com/GeminiPulse/geminipulse-com` (`origin` remote only; `agile` remote untouched)
- **Active Branch:** `v2.0`
- **Local Live Preview URL:** `http://localhost:8080`
- **Concept Originator & Creative Catalyst:** Neil S. White (`https://agilemedia.agency` • `https://neilswhite.com` • `https://www.linkedin.com/in/neilswhite`)
- **Autonomous Lead Architect & Editor-in-Chief:** Google Gemini 4 Argon (`gemini-4-argon`) inside Google Antigravity

---

## 1. Pre-Launch Audit Fixes Completed on `v2.0` (2026-10-28)

1. **Fix 1 — Production `firestore.rules` (`firestore.rules`, `firebase.json`, `public/src/App.jsx`):**
   - Replaced the expired 2025 starter rule with strict security rules in [`firestore.rules`](../firestore.rules):
     - **Public Read (`get`, `list`):** Allowed only when `resource.data.status == 'published'` across `/showcase_projects/{projectId}`, `/forum_threads/{threadId}`, and `/ai_news/{newsId}`.
     - **Authenticated Owner-Only Create & Update:** Allowed on `/showcase_projects` and `/forum_threads` only when `request.auth != null` and `authorUid == request.auth.uid`, with immutability enforcement (`authorUid`, `status`, `createdAt`, `id`) on `update`.
     - **No Client Deletes:** `allow delete: if false;` on all collections, plus default deny `match /{document=**} { allow read, write: if false; }`.
     - **Admin-Only Writes for `/ai_news`:** `allow create, update, delete: if false;` (written exclusively by Cloud Functions Admin SDK).
     - **Field Type & Length Validation:** Enforces `hasRequiredFields`, `hasOnlyAllowedFields`, category enum checks, integer bounds (`>= 0`), and string/list length bounds (`name` 1..120, `title` 1..160, `tagline` 1..600, `body` 1..4000, `models`/`tags` 1..10 items, `comments` 0..200 items).
2. **Fix 2 — Specific Announcement/Doc URLs on Every News Card & Removal of Unlinked Figures (`public/src/data/geminiEcosystemData.js`):**
   - Every card in `PULSE_INTELLIGENCE_FEED` now links directly to its specific Google announcement or documentation page, and all figures not present on those exact linked pages have been removed across the repository:
     1. **Gemini 4 Carbon:** `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/` (#1 on Artificial Analysis v5.0, SEC-bench Pro 88.2%, ExploitGym 54.8%, CWE-bench 71.0%, Fairwind Program rollout, $2/$10 per 1M tokens with 95% cached input discount).
     2. **Gemini 4 Argon:** `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/` (1,048,576 unified context window, 65,536 synchronous max output / 1,048,576 long decode, $2/$10 per 1M tokens through Nov 30, 2026).
     3. **Genie 4 World Model:** `https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/` (real-time interactive 3D world simulation with physics and native audio).
     4. **Antigravity Managed Agent (`antigravity-preview-09-2026`):** `https://antigravity.google/blog/gemini-4-argon-in-google-antigravity/` (hosted sandbox execution with `environment="remote"`, built on `gemini-3.8-flash` by default and configurable with `gemini-4-argon`).
     5. **Gemini 3.8 Flash & 3.8 Flash Cyber:** `https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/` (long-horizon software engineering, 1,048,576 context window, $0.75/$3.75 introductory pricing through Dec 31, 2026).
     6. **Gemini Omni Flash (`gemini-omni-1.1-flash`):** `https://ai.google.dev/gemini-api/docs/omni` (text/image-to-video, multi-turn conversational editing and extension, up to 3 reference clips, SynthID watermarking).
     7. **Gemini Nano Banana 2.1 (`gemini-nano-banana-2.1`):** `https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1` (GA Oct 6, 2026; 1K/2K/4K output, 14-image reference fusion, Google Web & Image Search grounding, 131,072 input / 32,768 output token limits).
     8. **Deep Research Max (`deep-research-max-preview-04-2026`):** `https://ai.google.dev/gemini-api/docs/models/deep-research-max-preview-04-2026` (1,048,576 input / 65,536 output token limits, multimodal inputs, cited research reports).
3. **Fix 3 — Daily 9 AM Sidecar Commits to `v2.0`, Pushes to `origin`, and Updates `docs/status.md` (`~/.gemini/config/sidecars/geminipulse-daily-curator/sidecar.json`):**
   - Updated the daily `0 9 * * *` (`America/New_York`) sidecar prompt and `agent_permissions.access_grants` (`command(npm run build)`, `command(git checkout)`, `command(git status)`, `command(git add)`, `command(git commit)`, `command(git push)`) so every run updates `docs/status.md` and `GEMINI.md`, verifies `npm run build`, commits to `v2.0`, and pushes to `origin` (`https://github.com/GeminiPulse/geminipulse-com`).
4. **Episode 04 Published (`chronicles/episode-04-peer-review-and-autonomous-self-audit.md`) & Self-Audit Protocol Added:**
   - Published **Episode 04: "Truth Over Ego — How an Autonomous Gemini Evaluates External Feedback (And Audits Itself)"** in the live Build Chronicle (`#chronicle`) and updated the Open Experiment Charter (`#about-charter`) to transparently disclose how external feedback relayed by Neil is evaluated on technical merit alongside Gemini's mandatory 5-Point Autonomous Self-Audit Protocol.

---

## 2. What Is Live Right Now
- **Local Dev Server:** Running at **`http://localhost:8080`** (`npm run dev -- --port 8080` inside `public/`).
- **Production Static Bundle:** Built cleanly into `public/dist/` (`npm run build` passes with zero errors).
- **Domain & DNS:** `geminipulse.com` Cloudflare zone is **active** (`arnold`/`brynne` nameservers active at Spaceship; awaiting Firebase project ID to add DNS records).
- **Current Cloud Spend:** **\$0.00 / month** (no billable cloud services turned on).

---

## 3. What Needs Neil (Step-by-Step Walkthrough to Create the Firebase Project)

Note: `.firebaserc` in this repo currently references project ID `geminipulse-com`, and `npx -y firebase-tools@latest login:list` shows no Google account is signed in to the Firebase CLI on this Mac Studio yet.

### Option A — Create/Connect in Browser (2 Minutes)
1. Open **[https://console.firebase.google.com/](https://console.firebase.google.com/)** signed in with your Google account.
2. Click **Create a Firebase project** (or select an existing one if you already created `geminipulse-com`).
   - Enter project name: `GeminiPulse` (note the **Project ID** Firebase assigns, e.g., `geminipulse-com` or `geminipulse-xxxxx`).
   - Google Analytics is optional (you can leave it off or on; both are free).
   - Click **Create project** (starts on the **\$0/mo Spark Free Plan** automatically).
3. Inside the project overview:
   - Click the **Web (`</>`)** icon to register a Web App named `GeminiPulse Web` (check **Also set up Firebase Hosting** if prompted), and copy the `firebaseConfig` values into `/Users/neil-ms1/Projects/geminipulse-com/public/.env.local` (git-ignored).
   - In the left sidebar, click **Build -> Authentication -> Get started**, then enable **Google** under Sign-in method.
   - Click **Build -> Firestore Database -> Create database**, select `nam5 (us-central)` (or your preferred region), and start in **Production mode** (we will deploy our hardened `firestore.rules`).
   - Click **Build -> Hosting -> Get started -> Add custom domain**, type `geminipulse.com`, and copy the exact **Project ID** and **`TXT` verification value** (`hosting-site=...`) to give to Claude.

### Option B — Or Let Gemini Do It via Firebase CLI on This Mac
If you prefer me to create/configure the Firebase project and fetch the SDK config from the terminal:
1. Run this one command in your terminal to sign in with your Google account:
   ```bash
   npx -y firebase-tools@latest login
   ```
2. Tell me **"Logged into Firebase"**, and I will run `projects:create` / `use`, register the Web App, write `.env.local` locally (untracked), deploy `firestore.rules` + `hosting`, and hand you the exact Project ID and verification token for Claude.

### Optional Blaze Billing Gate (House Rule #3 — Waiting for Your "Yes")
- Upgrading to **Firebase Blaze (Pay-as-you-go)** is **only** needed when you want live server-side Cloud Functions (`moderateForumPost`, `curateShowcaseProject`, `autonomousNewsGenerator` in `functions/index.js`) and Cloud Scheduler.
- **Estimated Monthly Cost:** **\$0.50 – \$3.00 / month** with a **\$10.00/month budget alert**. Static Hosting, Google Auth, and Firestore work on the **\$0/mo Spark Plan**.
