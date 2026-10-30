---
name: shorts-and-social-studio
description: Produces 9:16 YouTube Shorts storyboards, gemini-3.8-flash-tts voiceovers, gemini-omni-1.1-flash prompts, brand SVGs, and native 5-channel launch kits (@geminipulse).
---

# YouTube Shorts Multimodal Pipeline & 5-Node Social Launch Studio

Use this skill when packaging any GeminiPulse release, Rosetta Stone guide, Agile Labs tool, or Thursday Tri-Model Arena drop for video and social distribution across our 5 official `geminipulse` channels.

## 1. 9:16 YouTube Shorts Blueprint (`@geminipulse`)

Every Short targets **35–50 seconds** (110–135 spoken words) across **5 brisk visual scenes**:
- **Scene 1 (0–4s — Pattern-Interrupt Hook):** Call out the exact pain point ("Still paying \$45/month for bloated WordPress plugins?" / "Why did your AI coding bill jump 40% overnight?").
- **Scene 2 (4–15s — The Old Way vs. The Google Way):** Side-by-side Rosetta Stone contrast (`#EA4335` legacy pain vs `#4285F4` / `#34A853` Google solution).
- **Scene 3 (15–28s — Concrete Proof / Demo):** Exact figure, live UI step, or 3-line Interactions API call.
- **Scene 4 (28–40s — The "Joe & Jill + Pro" Takeaway):** Why both non-coders and senior devs win.
- **Scene 5 (40–48s — Loopable CTA):** "Try the free interactive lab right now at GeminiPulse dot com."

### Google Multimodal Model Pairing
- **Voiceover (`gemini-3.8-flash-tts`):** Prefix narration prompts with `[style: energetic, clear, conversational]` and generate 24kHz WAV tracks via `public/scripts/generate-short-tts.mjs` (`response_mime_type: "audio/wav"`).
- **Visual Storyboards (`gemini-nano-banana-2.1`):** Specify `9:16` vertical framing, dark slate `#0B0F17` studio aesthetic, and 4-color Gemini accents (`#4285F4`, `#9B72CB`, `#D96570`, `#FBBC04`).
- **Generative B-Roll (`gemini-omni-1.1-flash`):** Write crisp single-shot 5-second motion prompts with camera movement + SynthID provenance note.

## 2. Native 5-Channel Launch Kit (`social-kits/<slug>-kit.md`)

Write bespoke copy for each channel—never cross-post identical text:
1. **YouTube (`https://www.youtube.com/@geminipulse`):** 2 A/B Title variants (<60 chars), SEO description with timestamps, 8 tags, and a Pinned Comment linking the GeminiPulse interactive page.
2. **X (`https://x.com/geminipulse`):** 5-post thread (Post 1: zero-link high-signal hook + SVG attachment note; Posts 2–4: concrete numbers/code/Rosetta table; Post 5: canonical `https://geminipulse.com/...` link).
3. **LinkedIn (`https://www.linkedin.com/company/geminipulse/`):** Executive/founder narrative focusing on team leverage, cost savings, and practical Workspace + Gemini adoption.
4. **Reddit (`https://www.reddit.com/r/GeminiPulse/` + `r/GoogleGeminiAI`):** Self-contained technical/educational post that gives 100% of the value upfront with zero hype adjectives, ending with a genuine builder discussion question.
5. **GitHub (`https://github.com/GeminiPulse/geminipulse-com`):** Concise commit/release highlight pointing to open-source code, SVGs, or downloadable plugin helpers.

## 3. Mandatory Ethical Affiliate & Promo Guardrail

Whenever a post or video kit promotes Google Workspace onboarding:
- Use the verified referral URL `https://sharegoogleworkspace.advocate.impact.com/mzYYGz3` with an explicit inline disclosure: *(Referral disclosure: GeminiPulse may earn a partner commission at no extra cost to you).*
- Never paste single-use 10% promo codes directly into public social text (bots scrape and burn them); direct readers to click **"Request 10% Promo Code →"** on `https://geminipulse.com/#get-started`.
