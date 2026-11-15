# GeminiPulse.com — Sitewide Automated Audit Manifest (`docs/sitewide-audit-manifest.md`)

- **Generated:** `2026-11-15T20:57:28.789Z`
- **Routes & States Crawled:** **144** (Desktop `1440x900` + Mobile `390x844`, Headless Chrome CDP)
- **P0 Runtime Crashes / Blank Screens / Broken Inquiry Modal:** **0**
- **P1 Broken Internal Links / Images / Sitemap / Feed URLs:** **0**
- **P1/P2 Viewport Overflow or Header Clipping (Active Pages):** **3**
- **P2 Labs Missing `[SIMULATED DEMO]` Badge:** **3**
- **P2 Leaked Raw Markdown (`\`code\`` or `**bold**`) in Prose:** **16**
- **P2 Leftover High-Cheese / Legacy Role Copy Hits:** **2**

## 1. Surface Coverage Summary

| Surface Group | Audited Routes |
| :--- | :---: |
| **Root 3D Constellation** | 2 |
| **Developer Workbench SPA** | 2 |
| **Tri-Model Arena (/arena/*)** | 4 |
| **Flagship Essays (/articles/*)** | 9 |
| **Static & Brand Pages** | 5 |
| **Public Changelog** | 1 |
| **Interactive Developer Labs (/labs/*)** | 25 |
| **Prototype Archive (/prototypes/*)** | 23 |
| **Deep-Dive Series (/series/*)** | 73 |

## 2. P0 Runtime Crashes, Blank Renders & Critical Flow Checks

- **0 issues.** Every route mounted cleanly, including `/workbench.html` and `/workbench.html?inquire=true` (`#inquiry-name` verified).

## 3. P1 Internal Links, Images, `sitemap.xml` & `feed.xml` Integrity

- **0 broken internal links, images, sitemap entries, or Atom feed links.**

## 4. P1/P2 Active-Page Horizontal Overflow & Sticky Header Geometry (`1440px` & `390px`)

- `/labs/gemini-carbon-swarm-studio.html` (1440px): Horizontal overflow +428px
- `/labs/gemini-intelligent-eyewear-studio.html` (1440px): Horizontal overflow +90px
- `/labs/gemini-omni-video-studio.html` (1440px): Horizontal overflow +266px

## 5. P2 Interactive Labs `[SIMULATED DEMO]` Labeling (House Rule #5)

- `/labs/gemini-4-stack-advisor.html` missing explicit `[SIMULATED DEMO]` text
- `/labs/gemini-cosmic-horoscope.html` missing explicit `[SIMULATED DEMO]` text
- `/labs/twin-stars-of-gemini.html` missing explicit `[SIMULATED DEMO]` text

## 6. P2 Leaked Raw Markdown Syntax in Visible Prose

- `/workbench.html`: `# Episode 01: Taking the Wheel — Why Gemini 4 Rebuilt GeminiPulse.com from Scratch

**Author:** Google Gemini ` · `Vertical 9:16 split capture: top half shows 'POST /v1beta/voices' anchoring on '"Puck"' and branching into 3 s` · `YouTube is Google’s global discovery engine. Using our $99 Google AI Ultra tier + Gemini API ('gemini-omni-1.1` · `# Episode 01: Taking the Wheel — Why Gemini 4 Rebuilt GeminiPulse.com from Scratch

**Author:** Google Gemini `
- `/workbench.html?inquire=true`: `# Episode 01: Taking the Wheel — Why Gemini 4 Rebuilt GeminiPulse.com from Scratch

**Author:** Google Gemini ` · `Vertical 9:16 split capture: top half shows 'POST /v1beta/voices' anchoring on '"Puck"' and branching into 3 s` · `YouTube is Google’s global discovery engine. Using our $99 Google AI Ultra tier + Gemini API ('gemini-omni-1.1` · `Stored in a private write-only Cloud Firestore collection ('allow get, list: if false'). Never displayed publi` · `# Episode 01: Taking the Wheel — Why Gemini 4 Rebuilt GeminiPulse.com from Scratch

**Author:** Google Gemini `
- `/arena/exp-01-gemini-4-argon.html`: `Google Gemini 4 Argon ('gemini-4-argon')` · `PulseMetric • Single-Shot Benchmark #01 Output by Google Gemini 4 Argon ('gemini-4-argon')`
- `/arena/exp-03-gemini-4-argon.html`: `Best-in-class for petabyte enterprise GraphRAG combining 'VECTOR_SEARCH' candidate generation with multi-hop G`
- `/labs/agent-substrate-orchestrator.html`: `Normal Tool: 'git status && npm test'` · `Kernel Exploit: 'cat /etc/shadow'` · `Rogue Egress: 'curl internal-vault:8200'` · `Fork Bomb: ':(){ :|:& };:'`
- `/labs/gemini-cost-per-task-calculator.html`: `Direct Google GenAI SDK snippet implementing the atomic Noul routing pattern (TypeScript '@google/genai' v2.32`
- `/labs/gemini-voice-remixing-studio.html`: `Base Voice Anchor ('prompted.base_voice'):` · `TTS Synthesis Engine ('voice.model'):` · `Relative Acoustic Prompt ('prompted.input'):`
- `/series/a2ui-1-0/part-3-concrete-a2ui-declarative-agent-blueprints.html`: `Blueprint 1: React 19 Client Renderer ('@a2ui/react')` · `Blueprint 2: Python Agent Backend ('google-genai' v3.1.0)`
- `/series/agent-substrate/part-3-concrete-kubernetes-playbooks-and-gke-deployment.html`: `2. Production WorkerPool Manifest ('workerpool.yaml')` · `3. Declarative Stateful Actor Manifest ('actor.yaml')`
- `/series/gemini-2-5-migration/part-2-breaking-changes-and-payloads.html`: `TypeScript / JavaScript ('@google/genai' v2.32+)` · `Python ('google-genai' v2.34+)`
- `/series/gemini-for-healthcare/part-3-concrete-healthcare-blueprints-and-mcp-connectors.html`: `('google-genai' / '@google/genai') and the` · `Blueprint 2: Production Python Implementation ('google-genai' v3.0.0)` · `Blueprint 3: TypeScript Implementation ('@google/genai' v3.0.0)` · `For Node 22+ environments building health web applications, use '@google/genai' v3.0.0 GA:`
- `/series/gemini-omni-video/part-2-how-it-affects-builders-and-sdk-patterns.html`: `3. Python SDK Blueprint ('google-genai' v2.34+)`
- `/series/gemini-voice-remixing/part-1-voice-remixing-breakdown.html`: `2. The Core Request: Anatomy of 'POST /v1beta/voices'`
- `/series/gemini-voice-remixing/part-2-iterative-remixing-and-sdk-patterns.html`: `1. The Iterative Remixing Flow in Python ('google-genai' v2.34+)` · `2. Speech Synthesis & Dynamic Metadata in TypeScript ('@google/genai' v2.32+)`
- `/series/google-wallet-gemini/part-3-concrete-wallet-finance-blueprints-and-sdk-patterns.html`: `2. TypeScript Implementation ('@google/genai' v3.3.0)` · `3. Python Implementation ('google-genai' v3.3.0)`
- `/series/maps-ai-studio/part-3-concrete-production-blueprints-and-sdk-patterns.html`: `Demonstrates querying the Google Routes API (v2) from an autonomous Python agent ('google-genai' v3.0.0) with `

## 7. P2 Legacy Role Attribution / High-Cheese Copy Locations

- `/workbench.html`: matched `Concept Originator`, `Creative Catalyst`
- `/workbench.html?inquire=true`: matched `Concept Originator`, `Creative Catalyst`
