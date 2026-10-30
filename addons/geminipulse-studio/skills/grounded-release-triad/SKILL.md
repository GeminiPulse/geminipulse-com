---
name: grounded-release-triad
description: Verifies official Google Gemini, DeepMind, Workspace, Cloud & SDK releases using direct Google primary sources, YouTube oEmbed checks, and the Zero-Filler No-Op Guard.
---

# Grounded Release Triad & Primary-Source Verification

Use this runbook whenever checking for new Google ecosystem updates (including the 8:45 AM DeepMind London, 12:45 PM Mountain View 9 AM PT, and 5:45 PM West Coast SDK windows) or fact-checking any model name, benchmark, price, or release date for GeminiPulse.com.

## 1. Authorized Primary Google Citation Sources ONLY

Every claim, figure, and `sourceUrl` on GeminiPulse.com **must** resolve directly to an official Google primary domain:
- **Models & Research:** `https://blog.google/innovation-and-ai/...`, `https://deepmind.google/blog/...`
- **Gemini API & Models:** `https://ai.google.dev/gemini-api/docs/changelog`, `https://ai.google.dev/gemini-api/docs/models`
- **Google Antigravity:** `https://antigravity.google/docs`, `https://antigravity.google/changelog`, `https://antigravity.google/blog`
- **GenAI SDK Releases:** `https://github.com/googleapis/js-genai/releases`, `https://github.com/googleapis/python-genai/releases`, `https://github.com/google-gemini/gemini-cli/releases`
- **Workspace & Cloud:** `https://workspace.google.com/blog/...`, `https://cloud.google.com/blog/...`, `https://firebase.google.com/blog/...`, `https://developers.googleblog.com/...`

Never cite third-party blogs, rumor threads, or news aggregators. For SDK method signatures, verify via `mcp_gemini-api_gemini-api-docs_gemini_search_docs` (using **Current SDK** `@google/genai` / `google-genai` Interactions API only).

## 2. Deduplication & Zero-Filler No-Op Guard

1. Grep `PULSE_INTELLIGENCE_FEED` and `GEMINI_VIDEO_SHOWCASE` in `public/src/data/geminiEcosystemData.js` to see what is already live.
2. For YouTube creator or Google talks (`domain: "youtube.com"`), verify every video URL returns HTTP 200 JSON via:
   `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=<VIDEO_ID>`
3. **Zero-Filler No-Op Guard:** If no genuinely new, verified Google release or standout verified YouTube video has shipped since the top entry in `PULSE_INTELLIGENCE_FEED`, **stop immediately** with `0` file edits and `0` commits.

## 3. Dual-Audience Impact Framing ("Pros to Joes & Jills")

For every verified release, extract both angles before handing off to `pulse-twin-educator`:
- **Pollux Angle (Everyday Joes & Jills):** How does this save time or money in Gemini App, Gmail, Docs, Sheets, Slides, NotebookLM, or switching off legacy web hosts?
- **Castor Angle (Pros & Builders):** Exact model string (`gemini-4-argon`, `gemini-4-carbon`, `gemini-3.8-flash`, `gemini-omni-1.1-flash`, `gemini-nano-banana-2.1`, `gemini-3.8-flash-tts`), `$ / 1M` input/output/cached pricing, context window, and `client.interactions.create()` parameter delta.
