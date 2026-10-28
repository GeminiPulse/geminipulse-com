# AGENTS.md — GeminiPulse.com

> **Last touched:** `2026-10-28 — Added docs/architecture-plan.md, Frontier Tri-Model Arena (#tri-model-arena), and House Rule #8 (Flagged Decisions for Neil)`

Please read [`GEMINI.md`](./GEMINI.md) and [`docs/status.md`](./docs/status.md) for the authoritative project architecture, 100% Google technology stack, and the 7 mandatory House Rules synced with Neil S. White's Claude project registry.

## Quick Rules Checklist
1. **Remote:** Push only to `origin` (`https://github.com/GeminiPulse/geminipulse-com`). **Never** push to `agile`. Never commit `.env` or secret keys.
2. **Docs:** Update the `Last touched:` line in `GEMINI.md`, `AGENTS.md`, and `docs/status.md` every session.
3. **Billing Gate:** Never enable Firebase Blaze, Cloud Functions, Cloud Scheduler, or paid API tiers without stating expected monthly cost and getting Neil's explicit **yes**.
4. **DNS:** `geminipulse.com` is registered at Spaceship with DNS on Cloudflare. Never alter nameservers or registrar; provide exact DNS records (`type`, `name`, `value`) for Claude/Neil to add.
5. **Truth on the Page:** Ground all model claims via Google Search with source links; label simulated steps as `[SIMULATED DEMO]`; never include fake users, fake submissions, or fake forum posts.
6. **Safety Gates:** Keep Google Sign-In, Privacy/Terms consent, Report/Flag button, and AI moderation active on all community features.
