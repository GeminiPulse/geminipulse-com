---
name: twin-track-editorial
description: Authors GeminiPulse "Pros to Joes & Jills" Twin-Track guides and Rosetta Stone series, and deterministically scaffolds Dual-Theme HTML + sitemap.xml + feed.xml via pulse-content-cli.mjs.
---

# Twin-Track Editorial & Zero-Token SEO Scaffolder

Use this skill when creating or updating educational guides, multi-part release breakdowns (`public/public/series/`), longitudinal study articles (`public/public/insights/`), or Build Chronicles (`chronicles/`).

## 1. The `(T)winning` Dual-Lens Architecture (Castor & Pollux)

GeminiPulse exists to educate and spread practical mastery of Google Gemini across the entire spectrum—from senior AI engineers ("Pros") to non-technical operators, founders, and WordPress switchers ("Joes & Jills"):

1. **The Rosetta Stone Hook (First 100 Words):** Bridge familiar mental models (WordPress/FTP, Excel VLOOKUP, phpMyAdmin, manual email triage) to the modern Google equivalent (Antigravity, Gemini in Sheets, Cloud Firestore, Workspace side-panel).
2. **Track 1 — Pollux ("Everyday Win for Joes & Jills"):**
   - Concrete 3-step recipe anyone can run today in Gemini App, Google Docs, Gmail, Sheets, Slides, NotebookLM, or AI Studio with zero local setup.
3. **Track 2 — Castor ("Production Blueprint for Pros"):**
   - Verified Current-SDK TypeScript (`@google/genai` v2.32+) or Python (`google-genai` v2.34+) snippet using `client.interactions.create()`, Search Grounding (`tools: [{ type: "google_search" }]`), or `automatic_continuation: true`.
   - Token & cost math (comparing `gemini-3.8-flash` `$0.75/$3.75` vs `gemini-4-argon` / `gemini-4-carbon` `$2.00/$10.00` + `$0.10/1M` cached input).
   - Explicit `[SIMULATED DEMO]` badge on any client-side interactive translator or simulator (House Rule #5).

## 2. Deterministic HTML + `sitemap.xml` + `feed.xml` CLI (`pulse-content-cli.mjs`)

Instead of spending thousands of LLM output tokens hand-editing XML files and HTML `<head>` boilerplate, run [pulse-content-cli.mjs](./scripts/pulse-content-cli.mjs):

```bash
# Scaffold a Dual-Theme M3 standalone article with TechArticle JSON-LD & og-image.png AND auto-index in sitemap.xml + feed.xml:
node ~/.gemini/config/plugins/geminipulse-studio/skills/twin-track-editorial/scripts/pulse-content-cli.mjs scaffold \
  --repo . \
  --route "/series/google-workspace-twinning/part-1-gmail-docs-sheets.html" \
  --title "Everyday (T)winning with Gemini in Gmail, Docs & Sheets" \
  --summary "A practical Rosetta Stone guide for Joes, Jills, and Pros to reclaim 5+ hours a week across Google Workspace and the Gemini API." \
  --category "Twin-Track Guide"

# Or register an already-written standalone HTML route into sitemap.xml + feed.xml idempotently:
node ~/.gemini/config/plugins/geminipulse-studio/skills/twin-track-editorial/scripts/pulse-content-cli.mjs register-seo \
  --repo . \
  --route "/series/example/page.html" \
  --title "Page Title" \
  --summary "Concise summary for Atom feed."
```

After scaffolding, customize the `<main id="article-content">` body with rich Rosetta Stone tables, custom brand SVGs (`/assets/*.svg`), and Twin-Track examples.
