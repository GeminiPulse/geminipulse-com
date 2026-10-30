---
name: antigravity-token-diet
description: Audits and optimizes Google Antigravity's 20,000-token Customization Budget so skills and MCP tools are never silently evicted and per-turn token usage drops by 30-40%.
---

# Antigravity 20K Customization Budget Diet

Based on **[GeminiPulse Chronicle Episode 07](https://geminipulse.com/#chronicle)**, every active skill frontmatter, subagent definition, and MCP tool JSON schema sits in your prompt prefix on **every single turn**. Exceeding Antigravity's **20,000-token Customization Budget** triggers silent context exclusions and dilutes tool accuracy.

## 4-Step Token Diet Checklist

1. **Check Settings → Customizations Weekly:** Keep your token bar **green (`< 90%`)** with **`0` excluded items**.
2. **Pause Heavy MCP Servers When Idle:** Browser-automation MCP bundles (30+ tools, ~7,300 tokens) can consume over a third of your 20K budget alone. Toggle them OFF during pure writing or backend sprints, and flip them back ON in 1 click when running live DOM/LCP audits.
3. **Prune Off-Stack Enterprise Kits:** Building a web/Firebase app? Disable unused Spark/Airflow/mobile plugin bundles until the day you actually open a data-pipeline or mobile repo.
4. **Route Subagents by Task Weight:** Pass `Model: "flash"` (`gemini-3.8-flash`) for deterministic audits, link checks, and formatting, reserving `gemini-4-argon` (`Model: "inherit"`) for multi-file architecture and security proofs.
