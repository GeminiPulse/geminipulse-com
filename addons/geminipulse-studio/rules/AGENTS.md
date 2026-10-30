# GeminiPulse Studio — Token-Optimized Multi-Agent Routing

When operating inside the `geminipulse-com` repository, preserve the 20,000-token Customization Budget and maximize accuracy by delegating specialized subtasks to the narrowest subagent with the lightest effective model tier:

| Subagent | Invoke With `Model` | Scoped Tools & Purpose |
| :--- | :--- | :--- |
| `pulse-fact-scout` | `"flash"` (routine) / `"inherit"` (deep) | **Read + Web Only** (`search_web`, `read_url_content`, `view_file`). Verifies official Google primary sources (`blog.google`, `deepmind.google`, `ai.google.dev`, `antigravity.google`, `workspace.google.com`, `github.com/googleapis/*`), YouTube oEmbed HTTP 200, and Zero-Filler No-Op Guard. |
| `pulse-twin-educator` | `"inherit"` | **Twin-Track Editorial + CLI Scaffolder**. Authors "Pros to Joes & Jills" `(T)winning` guides (Pollux Everyday Track + Castor Pro SDK Track) and indexes `sitemap.xml` + `feed.xml` deterministically via `pulse-content-cli.mjs`. |
| `pulse-omnichannel-director` | `"flash"` (social kits) / `"inherit"` (Shorts/SVGs) | **Media + 5-Channel Distribution**. Produces 9:16 YouTube Shorts storyboards, `gemini-3.8-flash-tts` scripts, custom brand SVGs, and native `@geminipulse` YouTube, X, LinkedIn, `r/GeminiPulse`, and GitHub launch kits with FTC referral disclosures. |
| `pulse-arena-architect` | `"inherit"` | **Single-Shot Arena & Agile Labs Forge**. Builds zero-dependency `/arena/*.html` and `/labs/*.html` apps with M3 dual-theme CSS, `[SIMULATED DEMO]` badges, and Schema.org JSON-LD. |
| `pulse-release-guardian` | `"flash"` | **Read + Audit CLI Only**. Runs `pulse-preflight-audit.mjs`, `npm run build`, and `audit-layout.mjs` (4 viewports) to verify 0 PII, 0 overflows, and full doc sync before pushing to `origin/v2.0`. |

- **Firestore Security Rules (`firestore.rules`):** Always delegate to `firestore-rules-author` (from the `firebase` plugin).
- **The `(T)winning` Dual-Lens Standard:** Every GeminiPulse tutorial or release breakdown should help both everyday **"Joes & Jills"** (plain-English Rosetta Stones, Google Workspace/Gemini App quick wins) and **"Pros"** (verified `@google/genai` Interactions API blueprints & token math).
