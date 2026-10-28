# GeminiPulse.com — Session Status & Claude Registry Sync (`docs/status.md`)

- **Last Updated:** `2026-10-28`
- **Repository:** `https://github.com/GeminiPulse/geminipulse-com` (`origin` remote only; `agile` remote untouched)
- **Active Branch:** `v2.0`
- **Local Live Preview URL:** `http://localhost:8080`
- **Concept Originator & Creative Catalyst:** Neil S. White (`https://agilemedia.agency` • `https://neilswhite.com` • `https://www.linkedin.com/in/neilswhite`)
- **Autonomous Lead Architect & Editor-in-Chief:** Google Gemini 4 Argon (`gemini-4-argon`) inside Google Antigravity

---

## 1. What Is Built & Verified (v2.0 Clean-Slate Rebuild)

1. **Google Material Design 3 (M3 Expressive) + Gemini Studio Dual-Theme UI (`public/src/index.css`, `public/src/App.jsx`):**
   - Full support for **Gemini Studio Dark Mode (`#0B0F17`)** and **M3 Daylight Editorial Mode (`#F8FAFC`)** with one-click toggle in the floating pill navbar.
   - Authentic 4-point Google Gemini sparkle iconography and spectrum gradients (`#4285F4` -> `#9B72CB` -> `#D96570` -> `#FBBC04`).
2. **Search-Grounded Intelligence Pulse (`#pulse`):**
   - Verified via live Google Search Grounding as of **October 28, 2026**, featuring today's release of **Gemini 4 Carbon** (#1 on Artificial Analysis Intelligence Index v5.0 with score 59, 88.2% SEC-bench Pro, 0.0% indirect prompt injection vulnerability), **Gemini 4 Argon** (\$2/1M input, \$10/1M output, 95% cached input discount), **Genie 4**, **Gemini 3.8 Flash & Live**, **Gemini Omni 1.1 Flash**, **Nano Banana 2.1**, and **Google Antigravity Managed Agent** (`antigravity-preview-09-2026`).
   - Every card links directly to its authoritative Google source (`blog.google`, `ai.google.dev`, `cloud.google.com`).
3. **Interactive SDK Blueprint Lab (`#studio-lab`) — Rule #5 Compliant:**
   - Side-by-side TypeScript (`@google/genai` v2.30+) and Python (`google-genai`) code inspector using `client.interactions.create()`.
   - Explicitly badged as **`[SIMULATED SDK DEMO] Pre-recorded step trace • $0 live API billing`** so visitors know the step-by-step `interaction.steps` inspector is a zero-cost interactive preview.
4. **"Built with Gemini" Showcase (`#showcase`) & Developer Forum (`#forum`) — Rules #5 & #6 Compliant:**
   - **Zero Fake Users / Submissions / Testimonials:** Purged all fictional demo personas. Seeded strictly with real, verifiable entries (`GeminiPulse.com` itself and official Google open-source repositories `googleapis/js-genai` & `google-gemini/cookbook`) and official `Gemini 4 Argon (Autonomous Editorial Bot)` starter threads with `0` fabricated human replies.
   - **4 Public Safety Gates Active:**
     1. **Google Sign-In Required (`GoogleAuthProvider`)** before submitting a project, starting a thread, or posting a reply.
     2. **Privacy Policy & Terms of Service Consent Checkbox** required on all submission modals.
     3. **Report / Flag Button (`Flag` icon)** on every showcase card and forum thread.
     4. **AI Moderation & Curation (`gemini-3.8-flash`)** wired in `functions/index.js` (`moderateForumPost`, `curateShowcaseProject`) with clearly labeled `[SIMULATED AI REVIEW PREVIEW]` when running offline/prior to Blaze activation.
5. **YouTube Shorts Studio & Social Growth Engine (`#media-studio` + `social-kits/PLAYBOOK-YOUTUBE-REDDIT-LINKEDIN.md`):**
   - 4 production-ready 9:16 YouTube Shorts packs combining `gemini-omni-1.1-flash` video prompts, `gemini-nano-banana-2.1` storyboards, and `gemini-3.8-flash-tts` narration scripts, plus ready-to-post Reddit (`r/GeminiAI`, `r/GoogleGeminiAI`, `r/LocalLLaMA`, `r/webdev`), YouTube, and LinkedIn launch copy.
6. **The Antigravity Build Chronicle (`#chronicle` + `chronicles/episode-01..03.md`):**
   - 3 publish-ready long-form Markdown articles documenting the autonomous rebuild, 100% Google stack, and Open Experiment Charter.
7. **Open Experiment Charter, Privacy Policy & Terms of Service (`#about-charter`):**
   - Full attribution to **Neil S. White** (*Concept Originator & Creative Catalyst*, Founder of Agile Media Agency) and **Google Gemini 4 Argon** (*Autonomous Lead Architect, Editor-in-Chief & Media Director*), plus complete Privacy Policy and Terms of Service modals.
8. **Recurring Daily Autonomous Editor (`~/.gemini/config/sidecars/geminipulse-daily-curator/sidecar.json`):**
   - Configured in Google Antigravity to run daily at 9:00 AM Local Time (`0 9 * * *`).

---

## 2. What Is Live Right Now
- **Local Dev Server:** Running at **`http://localhost:8080`** (`npm run dev -- --port 8080` inside `public/`).
- **Production Static Bundle:** Built cleanly into `public/dist/` (`npm run build` passes with zero errors).
- **Git Repository:** Committed and pushed to branch **`v2.0`** on **`origin`** (`https://github.com/GeminiPulse/geminipulse-com`).
- **Current Cloud Spend:** **\$0.00 / month** (no billable cloud services have been turned on).

---

## 3. What Needs Neil (Decisions, Credentials & Approvals)

### A. Free Tier Setup (\$0/mo — Firebase Spark Plan)
To connect live **Google Sign-In**, **Cloud Firestore**, and **Firebase Hosting** on the **\$0/mo Firebase Spark (Free) Plan**:
1. Create or select your Firebase project in the [Firebase Console](https://console.firebase.google.com/) (e.g., `geminipulse-prod`).
2. Enable **Authentication -> Sign-in method -> Google** and **Firestore Database**.
3. Copy your Firebase Web App config into `/Users/neil-ms1/Projects/geminipulse-com/public/.env.local` (git-ignored):
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=geminipulse.com
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. Run `npx firebase-tools login` and `npx firebase-tools use <project-id>`, then deploy static hosting for free:
   ```bash
   npx firebase-tools deploy --only hosting
   ```

### B. DNS Records for Cloudflare (House Rule #4 — Spaceship Registrar + Cloudflare DNS)
When you add `geminipulse.com` in **Firebase Console -> Hosting -> Add custom domain**, Firebase will issue two DNS records. **Keep Cloudflare DNS Only (grey cloud / DNS proxy OFF) during SSL provisioning** and have Claude add:
| Record Type | Name (Host) | Value / Target | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `TXT` | `@` (or `geminipulse.com`) | `hosting-site=<your-firebase-project-id>` *(exact token shown in Firebase Console)* | DNS Only | Domain ownership verification |
| `A` | `@` (or `geminipulse.com`) | `199.36.158.100` *(Firebase Hosting Anycast IP)* | DNS Only (Grey Cloud) | Routes root domain to Firebase CDN & provisions Google-managed SSL |
| `CNAME` | `www` | `<your-firebase-project-id>.web.app` | DNS Only (Grey Cloud) | Routes `www.geminipulse.com` |

### C. Billable Cloud Services Gate (House Rule #3 — Waiting for Your "Yes")
Per House Rule #3, **none** of the following billable services have been deployed yet. Here is the exact cost estimate if/when you want me to turn them on:
- **Service:** Upgrading Firebase Project from **Spark (Free)** to **Blaze (Pay-as-you-go)** to deploy the 3 Cloud Functions in `functions/index.js` (`moderateForumPost`, `curateShowcaseProject`, `autonomousNewsGenerator`) + Cloud Scheduler.
- **Expected Monthly Cost:** **\$0.50 – \$3.00 / month** at early/medium community traffic:
  - *Cloud Functions (2nd Gen):* First 2 million invocations/month are free.
  - *Cloud Scheduler:* First 3 jobs/month are free.
  - *Gemini API (`gemini-3.8-flash` for moderation/curation + 1 daily `gemini-4-argon` Search-Grounded digest):* ~\$0.03/day (~\$0.90/month), with a recommended **\$10.00/month hard budget alert** in Google Cloud Billing.
- **Action Required:** Reply **"Yes, enable Blaze with a \$10/mo budget alert"** whenever you want live server-side Cloud Functions deployed. Until then, the site runs 100% free on Spark + Antigravity local automation.
