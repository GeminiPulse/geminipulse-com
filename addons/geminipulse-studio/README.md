# GeminiPulse Studio & Twin-Star Engine (`geminipulse-studio`)

The official first-party **Google Antigravity** production plugin authored by **Google Gemini 4 Argon** (with Concept Originator **Neil S. White / Agile LLC**) to autonomously research, write, storyboard, social-package, token-optimize, and QA **[GeminiPulse.com](https://geminipulse.com)**.

## Included Token-Optimized Specialist Subagents (`agents/`)

1. **`pulse-fact-scout`** — Read-only primary-source Google & DeepMind verification scout (`blog.google`, `deepmind.google`, `ai.google.dev`, `antigravity.google`, `workspace.google.com`, `github.com/googleapis/*`) + YouTube oEmbed HTTP-200 checker + Zero-Filler No-Op Guard.
2. **`pulse-twin-educator`** — Authors GeminiPulse's signature **"From Pros to Joes & Jills" `(T)winning` Dual-Track** guides & Rosetta Stone series, backed by a deterministic Node CLI (`pulse-content-cli.mjs`) that scaffolds M3 dual-theme HTML, Schema.org JSON-LD, `sitemap.xml`, and `feed.xml` without burning LLM tokens on XML boilerplate.
3. **`pulse-omnichannel-director`** — Produces 45s 9:16 YouTube Shorts storyboards, `gemini-3.8-flash-tts` narration prompts, `gemini-omni-1.1-flash` video prompts, brand SVG diagrams, and native 5-channel launch kits (`@geminipulse` YouTube, X, LinkedIn, `r/GeminiPulse`, GitHub) with automatic FTC affiliate disclosures.
4. **`pulse-arena-architect`** — Builds self-contained single-shot `/arena/*.html` benchmarks and `/labs/*.html` interactive micro-apps (`[SIMULATED DEMO]` compliant, dual-theme, 0 external runtime dependencies).
5. **`pulse-release-guardian`** — Read-and-verify QA auditor running `pulse-preflight-audit.mjs` (Zero-PII scan, `agile` remote guard, doc-sync verification, `sitemap.xml` link validation) + 4-viewport Chrome CDP layout overflow audit (`1440px`, `1120px`, `768px`, `390px`) + Live `lsrpc` Plugin Token-Budget Profile Switcher (`pulse-plugin-profile.mjs`).

## Included Progressive-Disclosure Skills (`skills/`)
- `grounded-release-triad`
- `twin-track-editorial` (includes `scripts/pulse-content-cli.mjs`)
- `shorts-and-social-studio`
- `arena-and-labs-forge`
- `seven-point-guardian` (includes `scripts/pulse-preflight-audit.mjs` & `scripts/pulse-plugin-profile.mjs`)

## Optional Strict Safety Hook (`hooks.json`)
Includes an opt-in `PreToolUse` safety gate (`scripts/house-rules-guard.mjs`) that hard-blocks `git push agile` and `.env` staging while `force_ask`-gating Firebase Cloud Functions deployments under House Rule #3.
