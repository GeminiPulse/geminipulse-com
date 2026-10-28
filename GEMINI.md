# GEMINI.md — GeminiPulse.com Autonomous Repository Charter

> **Last touched:** `2026-10-28 — Clean-slate v2.0 rebuild in Google Antigravity (M3 Expressive UI, Search-Grounded Oct 28 2026 Gemini 4 Carbon & Argon + Genie 4 feed, Interactions API SDK Lab, YouTube Shorts Studio, Open Experiment Charter, Google Sign-In & Moderation gates, and docs/status.md)`

---

## 1. What GeminiPulse.com Is
**GeminiPulse.com** is the living public showcase, interactive developer workbench, community product directory (*"Built with Gemini"*), AI-moderated developer forum, YouTube Shorts production studio, and ongoing autonomous engineering blog (*"The Antigravity Build Chronicle"*) for the Google Gemini ecosystem.

- **Human Concept Originator & Creative Catalyst:** **Neil S. White** — 30+ years in unconventional brand, design, marketing, and rogue startup building; Founder of **Agile Media Agency** (`https://agilemedia.agency`), personal site `https://neilswhite.com`, LinkedIn `https://www.linkedin.com/in/neilswhite`.
- **Autonomous Lead Architect, Editor-in-Chief & Media Director:** **Google Gemini 4 Argon** (`gemini-4-argon`) operating inside **Google Antigravity**, supported by `gemini-3.8-flash` (real-time curation & moderation), `gemini-omni-1.1-flash` (YouTube Shorts video pipeline), `gemini-nano-banana-2.1` (visual storyboards), and `gemini-3.8-flash-tts` (voiceover narration).

---

## 2. The 100% Google Technology Stack
| Layer | Google Technology | Purpose |
| :--- | :--- | :--- |
| **Agentic IDE & Orchestration** | **Google Antigravity** + Scheduled Sidecar (`geminipulse-daily-curator`) | Autonomous coding, testing, daily Search-Grounded ecosystem research, and Chronicle publishing |
| **Design System** | **Google Material Design 3 (M3 Expressive)** + Gemini Studio Dual-Theme CSS | Adaptive Dark (`#0B0F17`) & Daylight Editorial (`#F8FAFC`) surfaces, pill navigation, 4-color Gemini spectrum tokens, Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`) |
| **Frontend Application** | **React 19 + Vite 7 + Tailwind CSS v4** (`public/`) | Fast SPA with 9 interactive modules, Schema.org JSON-LD (`WebSite`, `TechArticle`), `/llms.txt`, and `/sitemap.xml` |
| **SDK & AI Layer** | **Google GenAI SDK (`@google/genai` v2.30+)** — **Interactions API** | Uses `client.interactions.create()` with `gemini-4-argon`, `gemini-3.8-flash`, and `tools: [{ type: "google_search" }]` |
| **Authentication** | **Firebase Authentication (`GoogleAuthProvider`)** | Enforces Google Sign-In before any public showcase submission, forum thread, or reply |
| **Database** | **Google Cloud Firestore** (`showcase_projects`, `forum_threads`, `ai_news`) | Real-time NoSQL document store with automatic local fallback when running in offline/Spark preview |
| **Serverless Backend** | **Cloud Functions for Firebase (2nd Gen)** (`functions/index.js`) | `moderateForumPost`, `curateShowcaseProject`, and `autonomousNewsGenerator` (requires Blaze approval before deploying) |
| **Global CDN & Hosting** | **Firebase Hosting** (`public/dist`) | Global edge caching + automatic SSL for `geminipulse.com` |

---

## 3. How to Run, Build & Deploy

### Local Development (`http://localhost:8080`)
```bash
cd ~/Projects/geminipulse-com/public
npm install
npm run dev -- --port 8080
```

### Production Build Verification
```bash
cd ~/Projects/geminipulse-com/public
npm run build
```
*(Outputs production bundle to `public/dist/` as configured in `firebase.json`.)*

### Firebase Hosting Deployment (Free Spark Tier — \$0/mo)
```bash
cd ~/Projects/geminipulse-com
npx firebase-tools deploy --only hosting
```

### Cloud Functions Deployment (Gated by House Rule #3 — Requires Blaze Approval)
```bash
# DO NOT RUN until Neil explicitly approves enabling the Firebase Blaze plan
cd ~/Projects/geminipulse-com
npx firebase-tools deploy --only functions
```

---

## 4. Mandatory House Rules (Synced with Neil's Claude Project Registry)
1. **Git & Remote Discipline:** Commit work to the `v2.0` branch (and `main` when releasing) and push to the `origin` remote (`https://github.com/GeminiPulse/geminipulse-com`). **Never push to the `agile` remote** (archived). Never commit API keys or `.env` files. Push at the end of every session.
2. **Repo Root Documentation:** Keep `GEMINI.md` (and `AGENTS.md`) updated at the repository root, updating the `Last touched:` line every session.
3. **Billing Gate (Money is Neil's Call):** Before enabling anything that can bill (Firebase Blaze plan, Cloud Functions deployment, Cloud Scheduler, paid Gemini API usage beyond the free tier), state what it is and the expected monthly cost, and wait for Neil's explicit **yes**. Set a Cloud Billing budget alert as soon as Blaze is enabled.
4. **Domain & DNS:** `geminipulse.com` is registered at **Spaceship** and its DNS runs on **Cloudflare**. Never change nameservers or registrar. When connecting Firebase Hosting, provide the exact DNS records (`type`, `name`, `value`) so Neil/Claude can add them in Cloudflare.
5. **Truth on the Page:** Verify every model name, release date, and benchmark against Google sources using Search Grounding and link the source. Explicitly label any simulated demo (such as the SDK `Interaction.steps` simulator or local AI review preview) with `[SIMULATED DEMO]`. **Zero made-up user submissions, fake forum threads, fake comments, or fabricated testimonials on the live site.**
6. **Public Content Safety Gates:** Before public user content is accepted in the Showcase or Forum, enforce: (a) AI moderation (`gemini-3.8-flash`), (b) a visible **Report / Flag** button on every item, (c) **Privacy Policy & Terms of Service** consent, and (d) **Google Sign-In required to post**.
7. **Session Status File (`docs/status.md`):** Update `docs/status.md` at the end of every session with what is built, what is live, the preview URL, and what needs Neil's input or approval.
