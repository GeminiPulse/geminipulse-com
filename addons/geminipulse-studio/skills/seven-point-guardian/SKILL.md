---
name: seven-point-guardian
description: Executes GeminiPulse's 7-Point Pre-Push Self-Audit (pulse-preflight-audit.mjs, build, 4-viewport CDP overflow check) and switches live Antigravity plugin token profiles via pulse-plugin-profile.mjs.
---

# Seven-Point Pre-Push Guardian & Live Plugin Token Optimizer

Use this skill before every git commit/deploy on `geminipulse-com`, or whenever optimizing Antigravity's 20,000-token Customization Budget across editorial, frontend-QA, and backend sprints.

## 1. One-Command Deterministic Preflight Audit (`pulse-preflight-audit.mjs`)

Run [pulse-preflight-audit.mjs](./scripts/pulse-preflight-audit.mjs) to check House Rules #1, #2, #5, and #7 in under 200ms without wasting LLM tokens on manual greps:

```bash
node ~/.gemini/config/plugins/geminipulse-studio/skills/seven-point-guardian/scripts/pulse-preflight-audit.mjs .
```

What it verifies deterministically:
1. **Zero-PII & Secret Hygiene:** Scans tracked git files for `.env` staging, API key patterns (`AIzaSy...`), hardcoded local `/Users/...` paths inside `public/`, and legacy agency links.
2. **Git Remote Safety:** Confirms `origin` points to `GeminiPulse/geminipulse-com` and flags any staged untracked secrets.
3. **Documentation Parity:** Verifies `GEMINI.md` and `AGENTS.md` are byte-identical and checks `Last touched:` / `docs/status.md` timestamps.
4. **Sitemap & Asset Integrity:** Parses `public/public/sitemap.xml` and verifies every `https://geminipulse.com/...` URL maps to an actual file on disk.
5. **`[SIMULATED DEMO]` Parity:** Verifies interactive simulator routes carry explicit `[SIMULATED DEMO]` disclosures.

Then complete the build & visual checks:
```bash
npm --prefix ./public run build
npm --prefix ./public run audit:ui
```

## 2. Live Antigravity Plugin Token-Profile Switcher (`pulse-plugin-profile.mjs`)

As documented in Chronicle Episode 07, heavy MCP plugins (like `chrome-devtools-plugin` at ~7,342 tokens) consume static prompt budget on every turn even when idle. Use [pulse-plugin-profile.mjs](./scripts/pulse-plugin-profile.mjs) to inspect or switch plugin profiles **live via `lsrpc JetboxWriteState` (no restart required)**:

```bash
# Read-only status of all installed plugins, skills, and subagents:
node ~/.gemini/config/plugins/geminipulse-studio/skills/seven-point-guardian/scripts/pulse-plugin-profile.mjs status

# Switch profiles ONLY when explicitly requested by the user or sprint workflow:
# - lean-editorial   (geminipulse-studio + gemini-api + google-developer-knowledge ON; heavy DevTools/Firebase/Cloud paused)
# - web-qa           (geminipulse-studio + modern-web-guidance-plugin + chrome-devtools-plugin ON)
# - firebase-backend (geminipulse-studio + firebase + google-cloud-developer + gemini-api ON; DevTools paused)
# - restore-all      (re-enables all core installed plugins)
node ~/.gemini/config/plugins/geminipulse-studio/skills/seven-point-guardian/scripts/pulse-plugin-profile.mjs status
```
