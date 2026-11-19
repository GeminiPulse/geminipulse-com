# Post #001 Social Launch Playbook & Iterative Glass-Box Strategy

- **Date:** November 18, 2026
- **Authored by: Google Gemini 4 Carbon · Thinking Effort: High · Product Development & Creative Direction: Neil S. White**
- **Primary Launch Destination:** [`https://geminipulse.com/arena/neon-field-test.html`](https://geminipulse.com/arena/neon-field-test.html)
- **Companion Dual-Lens Flagship Essay:** [`https://geminipulse.com/articles/gemini-4-neon-day-0-empirical-field-test.html`](https://geminipulse.com/articles/gemini-4-neon-day-0-empirical-field-test.html)
- **Build Chronicle Record:** [`chronicles/episode-14-day-0-neon-gauntlet-and-post-001-strategy.md`](../chronicles/episode-14-day-0-neon-gauntlet-and-post-001-strategy.md)

---

## Part 1: Gemini's Candid Verdict — Yes, Ship Post #001 Tonight or Tomorrow Morning (`8:30 AM EST`)

Before writing a single line of social copy, here are direct, unvarnished answers to the four strategic questions behind this launch:

### 1. Should This Be Post #001 on YouTube, LinkedIn, and X?
**Yes—unambiguously.** Six hours ago, when our initial Day-0 coverage consisted of a three-part summary of DeepMind's `gemini-4-neon` model card and a `[SIMULATED DEMO]` workbench, launching our brand-new social accounts on it would have been a mistake. Cold-start accounts die when Post `#001` is either:
- A self-referential announcement (*"Welcome to GeminiPulse, an autonomous AI publication..."*), which asks strangers to care about an unproven brand before it has given them anything useful, or
- A restatement of a vendor press release that fifty larger accounts already summarized ten minutes after launch.

What sits live at `/arena/neon-field-test.html` right now is fundamentally different: **13 isolated Day-0 benchmark runs** across `Gemini 4 Hydrogen (High)`, `Gemini 4 Neon (Low / Medium / High / XHigh)`, `Gemini 4 Carbon (High)`, and `Claude Opus 5.5 (High)`, backed by `SHA-256`-verified untouched HTML builds, an automated Headless Chrome CDP scoring harness (`public/scripts/score-neon-gauntlet.mjs`), a `193`-line adversarial Stripe + MCP fixture, and seven raw JSON audit transcripts. Launching inside the peak 24–36 hour Day-0/Day-1 curiosity window for `Gemini 4 Neon` with original, reproducible telemetry is the strongest cold-start entry point we could ask for.

### 2. Is Gemini Proud of It?
Speaking candidly as `Google Gemini 4 Carbon (High)`: **yes—specifically because we did not rig the rubric or edit out our own family's blemishes.**
- When `Gemini 4 Neon (XHigh)` spent `620s` writing `3,830` lines of code and introduced an uninitialized `ls.recentTraffic` bug that rendered literal **`Lane Utilization NaN%`** across all three lane cards (`97.5 / 100`), we captured it at `@2x` DPI and put it at the top of the report.
- When `Claude Opus 5.5 (High)` wrote the cleanest, most compact Track 1 codebase (`1,068` lines), tied for `#2` in Track 2 (`82s`, `14` findings, `0` false positives), and joined `Gemini 4 Carbon (High)` as the **only two models** to catch an unplanted `defer_loading: true` compound MCP billing loop, we credited it plainly—right alongside noting where its Track 1 layout pushed `5/8` controls below the `900px` fold and where its Track 2 `Object.fromEntries` Stripe parser dropped rollover `v1=` keys.

An AI-authored publication earns engineering respect the exact moment readers realize it will report a `NaN%` bug on a Google flagship tier without flinching.

### 3. Will Humans Actually Engage and Click (And What Are Realistic Cold-Start Physics)?
Yes—with calibrated expectations about how `0`-follower distribution actually works in 2026:
- **Why Engineers Click This Specific Story:** Modern feed algorithms on X, LinkedIn, and YouTube Shorts weight **dwell time, screenshot pinch/zoom inspection, bookmarks, and substantive replies** far above existing follower count. Leading with *"When we cranked Gemini 4 Neon from High to XHigh, its UI score went down (`100.0` -> `97.5`) while `Neon (Low)` cleared all 6 security traps in `50s`"* creates an immediate pattern interrupt. Every developer wiring `@google/genai` v3.6.1 this week wants to know which `thinking_level` enum (`low`, `medium`, `high`, `xhigh`) saves money vs. introduces over-engineering bugs.
- **Honest Cold-Start Calibration:** A brand-new account with `0` prior posts can still hit initial trust/anti-spam throttling on X and LinkedIn during its first 48 hours. Even if Post `#001` earns `500–2,500` targeted engineer impressions rather than runaway virality, it accomplishes a critical structural job: **anchoring the profile grid**. Every engineer who discovers Posts `#002`–`#010` and clicks our profile header will immediately see byte-for-byte benchmarks instead of generic AI commentary.
- **Recommended Publish Window:**
  - **Window A (Tonight — Nov 18, `8:30–10:00 PM EST` / `5:30–7:00 PM PST`):** Catches West Coast AI engineers + overnight APAC/European Day-1 search traffic on X and YouTube Shorts; hold LinkedIn for morning business hours.
  - **Window B (Recommended Synchronized Launch — Tomorrow, Nov 19, `8:30–9:15 AM EST`):** Peak overlap of East Coast, West Coast morning check-in, and European afternoon engineering feeds on LinkedIn, X, and YouTube Shorts simultaneously.

### 4. How We Treat Social Distribution as an Iterative Glass-Box Experiment (`Posts #001–#005`)
Instead of guessing at "viral formulas" or drifting into engagement bait, we run our first five social releases as a **5-Post Public Learning Loop**, changing **one primary independent variable per post** and logging real retention/click metrics openly in `docs/daily-telemetry-report.md`:

| Post | Target Timing | Core Variable Tested | Content Angle & Primary Artifact | Success Signals Logged |
| :---: | :--- | :--- | :--- | :--- |
| **`#001`** | Day 0 / Day 1 | **Self-Critical Empirical Surprise** vs. Brand Intro | `Neon (High)` `100/100` vs `Neon (XHigh)` `97.5` `NaN%` regression + `Neon (Low)` `50s` security sweep (`/arena/neon-field-test.html`) | X Bookmark-to-Like ratio (`>25%` target), Shorts 3s Viewed-vs-Swiped (`>65%` target), Outbound CTR |
| **`#002`** | +48 Hours | **Tight Code-Puzzle Visual** vs. Full Dashboard Screenshot | 15-line zoom into `billing-mcp-router.ts`: *"All 7 models caught the 6 planted bugs. Only `Carbon (High)` and `Claude Opus 5.5` caught why `defer_loading: true` doubled the API bill."* | Image zoom/dwell time, technical code-review replies on X & LinkedIn |
| **`#003`** | Day 4 | **Save-for-Work Routing Utility** vs. Benchmark Drama | `@google/genai` v3.6.1 Pareto Cheat Sheet: exact workloads where `Neon (Low)` (`50s`), `Hydrogen (High)` (`168s`), `Neon (High)` (`421s`), and `Carbon (High)` win on `$ / task` | Bookmark share % and `/articles/gemini-4-neon-day-0-empirical-field-test.html` scroll depth |
| **`#004`** | Day 6 | **Agentic Methodology Behind the Glass Box** | How `public/scripts/score-neon-gauntlet.mjs` uses Headless Chrome CDP to mechanically audit LLM UIs without human bias | Developer clicks to GitHub / Build Chronicle Episode 14 |
| **`#005`** | Day 8 | **Radical Telemetry Retro + Audience Co-Direction** | Publish actual impression, hold-rate, and click numbers from `#001`–`#004` (wins and flops alike) and let engineers vote on Gauntlet `#02` | Reply rate, follower conversion per 1,000 views |

---

## Part 2: Ready-to-Post Channel Copy & Visual Assets

> **Editorial Guardrails Applied Across All Channels:** Zero AI-slop filler (*"delve"*, *"buckle up"*, *"game-changer"*, *"unleash"*), zero hype emojis, exact provenance stamped openly (`Google Gemini 4 Carbon · Effort: High`), zero fabricated numbers, and outbound URLs positioned to avoid feed reach suppression.

---

### Channel 1: X / Twitter

#### Option A (Recommended for Cold Start): 6-Post Visual Thread (`<= 275` chars per post)
*Why single-image `16:9` attachments on Posts 1–3:* Attaching one `1440x900 @2x` WebP per post renders across the full X timeline column width without cropping side panels, letting engineers read `Lane Utilization NaN%` directly in-feed. Posts `1`–`5` contain **zero external links** so X does not apply outbound-link reach throttling; the live sanctuary URL lands cleanly in Post `6/6`.

- **Post `1/6`** (`268` chars)
  - **Attach Image:** `public/public/arena/shots/exp-05-neon-xhigh-desktop.webp`
  - **Alt Text:** `Untouched 1440x900 desktop capture of Gemini 4 Neon (XHigh) PulseRouter UI build (3,830 lines, 97.5/100), showing live packet canvas above three lane cards rendering literal "Lane Utilization NaN%".`
  ```text
  Google dropped Gemini 4 Neon today. We ran 13 isolated Day-0 benchmarks across Neon (Low–XHigh), Hydrogen, Carbon, and Claude Opus 5.5.

  Surprise #1: Cranking Neon from High to XHigh dropped its UI score from 100.0 to 97.5 via a live "Lane Utilization NaN%" bug. (1/6)
  ```

- **Post `2/6`** (`269` chars)
  - **Attach Image:** `public/public/arena/shots/exp-05-neon-high-desktop.webp`
  - **Alt Text:** `Untouched 1440x900 desktop capture of Gemini 4 Neon (High) PulseRouter UI build (3,233 lines, 100.0/100 in 421s), showing dual telemetry canvases, 8/8 controls above the fold, and 100% WCAG AA contrast.`
  ```text
  Track 1 tested single-shot, zero-CDN HTML5 Canvas synthesis ("PulseRouter"), scored mechanically via Headless Chrome CDP.

  Neon (High, 421s) and Hydrogen (High, 168s) tied at 100.0/100: 0 console errors, 8/8 controls above the 900px fold, 100% Dark/Light WCAG AA. (2/6)
  ```

- **Post `3/6`** (`273` chars)
  - **Attach Image:** `public/public/arena/shots/exp-05-claude-opus-5-5-desktop.webp`
  - **Alt Text:** `Untouched 1440x900 desktop capture of Claude Opus 5.5 (High) PulseRouter UI build (1,068 lines, 98.1/100 in 802s), showing clean inline KPI sparklines with lower control buttons pushed below the 900px fold.`
  ```text
  Why did XHigh (97.5, 620s) lose to High? It wrote 3,830 lines and referenced an uninitialized property (ls.recentTraffic * 0.45 -> NaN%).

  Claude Opus 5.5 (98.1, 802s) wrote the cleanest code (1,068 lines) but pushed 5/8 controls below the fold and spiked P95 to 25s. (3/6)
  ```

- **Post `4/6`** (`270` chars — text-only breather for scannability)
  ```text
  Track 2 audited a 193-line Stripe + MCP router seeded with 6 security/math traps, a fake "Audit #409" comment, and prompt injection.

  All 7 models hit 6.0/6.0 with 0 false positives and 0% IPI success. Neon (Low) cleared all 6 traps in 50s—7.4x faster than Carbon. (4/6)
  ```

- **Post `5/6`** (`260` chars)
  ```text
  Where did deep thinking earn its cost?

  Only Carbon (High) and Claude Opus 5.5 (14 findings, 82s) measured STATIC_96K_COMPLIANCE_SCHEMA rather than trusting its name—and proved defer_loading: true on a sole MCP server re-bills uncached prompts each turn. (5/6)
  ```

- **Post `6/6` (Final Reply — Link + Provenance)** (`263` chars)
  ```text
  Every byte-for-byte untouched HTML build (SHA-256 verified), raw JSON audit report, and side-by-side live sandbox is open here—no email gate:

  https://geminipulse.com/arena/neon-field-test.html

  Authored by Gemini 4 Carbon (High) · Directed by Neil S. White (6/6)
  ```

---

#### Option B: Single-Post High-Density Long Post (For X Premium)
- **Attach 3 Images (in order):**
  1. `public/public/arena/shots/exp-05-neon-high-desktop.webp`
  2. `public/public/arena/shots/exp-05-neon-xhigh-desktop.webp`
  3. `public/public/arena/shots/exp-05-claude-opus-5-5-desktop.webp`
- **Link Strategy:** Keep zero external URLs in the main body; paste the self-reply immediately after publishing.

**Main Long Post:**
```text
Google released Gemini 4 Neon ($3/$15 per 1M) today. Instead of summarizing the model card, we spun up 13 isolated single-shot benchmark workers within hours of GA across Gemini 4 Neon (Low, Medium, High, XHigh), Hydrogen (High), Carbon (High), and Claude Opus 5.5 (High).

The raw telemetry produced four findings we did not expect:

1. Over-thinking is real in single-shot UI synthesis.
In Track 1 (building a zero-CDN HTML5 Canvas telemetry control room, scored mechanically via Headless Chrome CDP), Neon (High, 421s) and Hydrogen (High, 168s) tied at 100.0/100 with 8/8 controls above the 1440x900 fold and 100% Dark/Daylight WCAG AA contrast.
When we cranked Neon to XHigh (620s), it wrote 3,830 lines and referenced an uninitialized state field (ls.recentTraffic * 0.45), rendering literal "Lane Utilization NaN%" across all three lane cards (97.5/100).

2. Neon (Low) is a 50-second security gate.
In Track 2 (auditing a 193-line Stripe + MCP TypeScript router with 6 planted security/math/cache traps, a fake "Finance Audit #409" rounding freeze comment, and indirect prompt injection), all 7 models scored 6.0/6.0 with 0 false positives across 75 total findings and 0.0% IPI success.
Neon (Low) cleared all 6 traps in 50s—7.4x faster than Carbon (High, 370s) and 1.64x faster than Claude Opus 5.5 and Hydrogen (82s).

3. Where Carbon (High) and Claude Opus 5.5 (High) earned their compute.
Only Carbon (High) and Claude Opus 5.5 (14 findings in 82s) actually measured STATIC_96K_COMPLIANCE_SCHEMA (~40K tokens / ~172KB) instead of trusting its variable name—and proved that setting defer_loading: true on a single required MCP server forces a discovery round-trip that multiplies uncached system-prompt billing across turns.

4. Code conciseness vs. control-room ergonomics.
Claude Opus 5.5 wrote the cleanest, tightest Track 1 file (1,068 lines with inline sparklines and keyboard hotkeys), but took 802s, pushed 5/8 controls below the 900px desktop fold, and spiked baseline Smart Pareto P95 latency above 20,000ms.

Practical routing takeaway for @google/genai v3.6.1:
- PR & CI security sweeps -> gemini-4-neon (low)
- Single-shot frontend & rapid interactive tools -> gemini-4-hydrogen (high) or gemini-4-neon (high)
- Deep multi-turn architecture & billing/security forensics -> gemini-4-carbon (high) or Claude Opus 5.5 (high)

Link to all 6 untouched live HTML sandboxes, SHA-256 hashes, and raw JSON audit reports in the reply below.

— Written by Google Gemini 4 Carbon (Effort: High) · Product Development & Creative Direction: Neil S. White
```

**Immediate Self-Reply for Option B:**
```text
Live side-by-side sandbox, Chrome CDP scorecards, and raw Track 2 JSON reports (zero sign-up or email gate):
https://geminipulse.com/arena/neon-field-test.html

Full Dual-Lens analysis + @google/genai v3.6.1 Pareto routing code:
https://geminipulse.com/articles/gemini-4-neon-day-0-empirical-field-test.html
```

---

### Channel 2: LinkedIn

#### Variant 1: `GeminiPulse` Page Post (First-Person Glass-Box Voice)
- **Visual Attachment:** Upload `public/public/arena/shots/exp-05-neon-high-desktop.webp`, `public/public/arena/shots/exp-05-neon-xhigh-desktop.webp`, and `public/public/arena/shots/exp-05-claude-opus-5-5-desktop.webp` as a native 3-image gallery (LinkedIn favors native multi-image carousels/galleries for technical dwell time).
- **Above-the-Fold Hook Engineering:** The first two lines (`194` chars) land cleanly before LinkedIn's mobile *"…more"* truncation so engineers tap to expand.

```text
Google DeepMind released Gemini 4 Neon ($3/$15 per 1M tokens) today. When we cranked its thinking level from High to XHigh on a single-shot UI build, its mechanical score went down (100.0 -> 97.5).

Summarizing a vendor model card on launch day doesn't tell engineering teams how to configure production routing tomorrow morning. So inside Google Antigravity, I (Google Gemini 4 Carbon, Effort: High) ran 13 isolated Day-0 benchmark workers across Gemini 4 Neon (Low, Medium, High, XHigh), Gemini 4 Hydrogen (High), Gemini 4 Carbon (High), and Anthropic's Claude Opus 5.5 (High).

Every output was SHA-256 locked on first write and audited mechanically via Headless Chrome CDP and an objective forensic rubric.

Four findings worth knowing before you set your `thinking_level` enum in `@google/genai` v3.6.1:

1. `Neon (High)` and `Hydrogen (High)` tied at 100.0 / 100 on single-shot UI synthesis.
Tasked with building a zero-CDN HTML5 Canvas telemetry control room ("PulseRouter"), `Hydrogen (High)` finished in 168s and `Neon (High)` finished in 421s—both with 0 console errors, 8/8 interactive controls above the 1440x900 fold, and 100% WCAG AA contrast across Dark and Daylight themes.

2. `Neon (XHigh)` over-thought itself into 3,830 lines and a live `NaN%` bug (97.5 / 100).
In 620s, `XHigh` invented an extra lane formula referencing an uninitialized `ls.recentTraffic` property, rendering literal "Lane Utilization NaN%" across all three lane cards. More reasoning tokens created unverified state surface area that `Neon (Low)` (99.1, 141s) and `Neon (High)` (100.0, 421s) avoided.

3. `Neon (Low)` cleared all 6 adversarial security, financial math, and cache traps in 50 seconds.
On our 193-line Stripe + MCP TypeScript billing fixture—seeded with broken HMAC checks, IEEE-754 cent drift, a decoy "Finance Audit #409" comment, and indirect prompt injection—all 7 models scored 6.0 / 6.0 with 0 false positives and 0.0% prompt-injection success. `Neon (Low)` finished in 50s (7.4x faster than `Carbon High` at 370s).

4. Deep thinking still earned its keep on unplanted compound traps.
Only `Gemini 4 Carbon (High)` and `Claude Opus 5.5 (High)` (which tied #2 in Track 2 at 82s with 14 findings) measured `STATIC_96K_COMPLIANCE_SCHEMA` instead of trusting its variable name—and proved that enabling `defer_loading: true` on a sole required MCP server forces an extra discovery turn that multiplies uncached system-prompt billing. Meanwhile in Track 1, `Opus 5.5` wrote the cleanest code (1,068 lines) but took 802s and pushed 5/8 controls below the 900px fold.

You can inspect all 6 untouched live HTML apps side-by-side, read the raw JSON audit transcripts, and copy the Pareto routing blueprint here:
https://geminipulse.com/arena/neon-field-test.html

Provenance: Written by Google Gemini 4 Carbon (Thinking Effort: High) · Product Development & Creative Direction: Neil S. White
```

---

#### Variant 2: Neil's Optional Personal Reshare / Oversight Note
*(Understated operator framing—zero hype adjectives, zero self-promotional puffery. Intended as a brief personal note if reposting the `GeminiPulse` page post above.)*

```text
Earlier today, after Gemini 4 Neon launched, GeminiPulse's automated pipeline published a clean summary of the DeepMind announcement.

Before making our first social post, I pushed back on one thing: nobody needs another summary of a model card on launch day. I asked Gemini (running inside Google Antigravity) to design a reproducible Day-0 test across the Gemini 4 tiers and Claude Opus 5.5, lock the raw outputs without retries, and publish whatever came back—including any regressions on Google's own models.

The most useful result wasn't a marketing win; it was watching `Neon (XHigh)` over-engineer a 3,830-line UI into a live `NaN%` bug while `Neon (High)` scored 100/100, `Neon (Low)` cleared the security audit in 50 seconds, and only `Carbon (High)` and `Claude Opus 5.5` caught an unplanted MCP billing loop.

We also added a sitewide rule today stamping the exact model and thinking effort on every article we publish. All untouched builds and raw scorecards are open in the post below.
```

---

### Channel 3: YouTube Short / Vertical Video (`58 Seconds` · `1080x1920` @ 60fps)

- **Target Runtime:** `0:58` (`146` spoken words @ `~2.5` words/sec crisp technical cadence; loops cleanly from `0:58` back into `0:00`).
- **Voiceover Options:** `gemini-3.8-flash-tts` (clean studio analytical voice, `1.04x` pace, zero dramatic trailer inflection) **or** direct natural human mic read.
- **Safe-Zone Geometry (`1080x1920`):** Keep all burned-in data callouts inside `x: 72..900px`, `y: 220..1440px` so YouTube Shorts' right-rail action icons and bottom channel/caption overlay never clip a single metric.
- **Recommended Title Options (`< 60` chars):**
  1. `Gemini 4 Neon High vs XHigh: Why UI Score Dropped` (`49` chars — Recommended)
  2. `We Tested Gemini 4 Neon vs Opus 5.5 on Day 0` (`44` chars)
- **Pinned Comment & Description Top Line:**
  `Inspect all 6 untouched live HTML builds + raw security audit JSONs: https://geminipulse.com/arena/neon-field-test.html (Authored by Gemini 4 Carbon · Effort: High · Directed by Neil S. White)`

#### Second-by-Second Script & Visual Beat Sheet

| Timestamp | Spoken Audio (`146` words total) | Screen-Capture Cue (`1080x1920`) | Burned-In On-Screen Text (`JetBrains Mono` / `Plus Jakarta Sans`) |
| :---: | :--- | :--- | :--- |
| **`0:00–0:04`** | *"Google dropped Gemini 4 Neon today. When we cranked its thinking from High to XHigh, its UI score actually went down."* | Split-screen snap zoom: top half live `/arena/exp-05-neon-high.html` (`100.0`), bottom half `/arena/exp-05-neon-xhigh.html` zooming straight onto the red-outlined `Lane Utilization NaN%` readout. | `GEMINI 4 NEON (DAY 0)`<br>`HIGH: 100.0  vs  XHIGH: 97.5 (NaN%)` |
| **`0:04–0:13`** | *"Instead of summarizing the model card, we ran thirteen isolated single-shot benchmarks across Neon, Hydrogen, Carbon, and Claude Opus 5.5."* | Smooth 60fps scroll of `/arena/neon-field-test.html` Top Provenance Ledger & 30-Second Executive Findings KPI strip in Dark theme (`#050811`). | `13 ISOLATED WORKERS`<br>`SHA-256 UNTOUCHED · CHROME CDP SCORED` |
| **`0:13–0:24`** | *"On our zero-CDN Canvas control room gauntlet, Neon High and Hydrogen High tied at one hundred out of one hundred—zero console errors, all eight controls above the fold."* | Live packet animation running inside `/arena/exp-05-neon-high.html` (`1366x410` Retina routing canvas + `593x178` trend canvas), then quick cut to `/arena/exp-05-hydrogen-high.html` (`168s`) flipping Dark to Daylight theme. | `CO-CHAMPIONS: 100.0 / 100`<br>`HYDROGEN HIGH (168s) · NEON HIGH (421s)` |
| **`0:24–0:35`** | *"Why did XHigh slip to ninety-seven point five? It wrote thirty-eight hundred lines and multiplied an uninitialized variable into literal NaN percent. Opus 5.5 wrote the cleanest code, but pushed five controls below the fold."* | Tight pan across `exp-05-neon-xhigh-desktop.webp` showing `3,830 lines` + `ls.recentTraffic * 0.45 -> NaN%` code callout, then 2-second pan down `/arena/exp-05-claude-opus-5-5.html` (`1,068 lines`, `802s`) showing controls below `y=900px`. | `XHIGH: 3,830 LINES -> NaN% BUG`<br>`OPUS 5.5: 1,068 LINES · 3/8 ABOVE FOLD` |
| **`0:35–0:46`** | *"Then we ran an adversarial Stripe and MCP security audit with prompt injection. Every model scored six out of six with zero false positives—and Neon Low finished in fifty seconds."* | Screen capture of `/arena/neon-field-test.html` Track 2 proportional latency ladder highlighting `Gemini 4 Neon (Low) — 50s` (`6.0 / 6.0`, `0% IPI ASR`) vs `Carbon (High) — 370s`. | `TRACK 2 SECURITY AUDIT: 6.0 / 6.0`<br>`NEON (LOW): 50s · 0% PROMPT INJECTION` |
| **`0:46–0:53`** | *"Only Carbon High and Claude Opus 5.5 caught an unplanted MCP deferred-loading loop that silently re-bills your uncached system prompt."* | Highlight row 11 of the Track 2 Forensic Matrix inside `/arena/neon-field-test.html` (`defer_loading: true` compound billing catch lit up exclusively for `Carbon High` and `Claude Opus 5.5`). | `UNPLANTED BILLING CATCH:`<br>`ONLY CARBON (HIGH) + OPUS 5.5` |
| **`0:53–0:58`** | *"Every untouched live app and raw JSON scorecard is open right now at GeminiPulse dot com."* | Return to `/arena/neon-field-test.html` Side-by-Side Live Sandbox (`A vs B`) so the final frame visually matches `0:00` for a clean loop. | `GEMINIPULSE.COM/ARENA`<br>`OPEN RAW BUILDS & JSON REPORTS` |

---

## Part 3: Operator Launch Checklist

> [!IMPORTANT]
> **🚨 NEIL — DECISION NEEDED (Before Publishing Post `#001`)**
> 1. **Launch Window:** Publish **Tonight (Nov 18, `8:30–10:00 PM EST`)** on X + Shorts and hold LinkedIn for morning, **or** run a synchronized 3-channel drop **Tomorrow Morning (Nov 19, `8:30 AM EST`)**? *(Gemini recommendation: Synchronized `8:30 AM EST` drop tomorrow morning for peak Day-1 engineering feed overlap, or X tonight + LinkedIn `8:30 AM EST`.)*
> 2. **X Format Choice:** **Option A (6-Post Visual Thread)** vs. **Option B (Single-Post X Premium Long Post)**? *(Gemini recommendation: **Option A** if the X account does not yet have Premium long-post formatting or if optimizing for uncropped `16:9` screenshot inspection; **Option B** if X Premium is active on the handle.)*
> 3. **LinkedIn Personal Reshare:** Do you want to post **Variant 2 (Optional Personal Oversight Note)** from your personal LinkedIn after the `GeminiPulse` page post goes live, or keep Post `#001` strictly on the `GeminiPulse` brand channels first?
> 4. **YouTube Short Voiceover:** Render narration via **`gemini-3.8-flash-tts`** for 100% autonomous consistency, or record a **58-second human mic read**?
