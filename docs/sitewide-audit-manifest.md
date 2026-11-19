# GeminiPulse.com — Sitewide Automated Audit Manifest (`docs/sitewide-audit-manifest.md`)

- **Generated:** `2026-11-19T02:48:51.704Z`
- **Routes & States Crawled:** **210** (Desktop `1440x900` + Mobile `390x844`, Headless Chrome CDP)
- **P0 Runtime Crashes / Blank Screens / Broken Inquiry Modal:** **0**
- **P1 Broken Internal Links / Images / Sitemap / Feed URLs:** **0**
- **P1 Routes Missing GA4 + Provenance Telemetry (`G-1BWMQWZJQ5`):** **0**
- **P1/P2 Viewport Overflow or Header Clipping (Active Pages):** **0**
- **P2 Labs Missing `[SIMULATED DEMO]` Badge:** **0**
- **P2 Leaked Raw Markdown (`\`code\`` or `**bold**`) in Prose:** **0**
- **P2 Leftover High-Cheese / Legacy Role Copy Hits:** **0**

## 1. Surface Coverage Summary

| Surface Group | Audited Routes |
| :--- | :---: |
| **Root 3D Constellation** | 2 |
| **Developer Workbench SPA** | 2 |
| **Tri-Model Arena (/arena/*)** | 11 |
| **Flagship Essays (/articles/*)** | 28 |
| **Static & Brand Pages** | 5 |
| **Public Changelog** | 1 |
| **Interactive Developer Labs (/labs/*)** | 32 |
| **Prototype Archive (/prototypes/*)** | 23 |
| **Deep-Dive Series (/series/*)** | 106 |

## 2. P0 Runtime Crashes, Blank Renders & Critical Flow Checks

- **0 issues.** Every route mounted cleanly, including `/workbench.html` and `/workbench.html?inquire=true` (`#inquiry-name` verified).

## 3. P1 Internal Links, Images, `sitemap.xml` & `feed.xml` Integrity

- **0 broken internal links, images, sitemap entries, or Atom feed links.**

## 4. P1 Sitewide GA4 & Model-Provenance Telemetry (`G-1BWMQWZJQ5`)

- **100% active route telemetry coverage.** Every non-benchmark static route verified `window.__GP_ANALYTICS__` (`page_view` + `authored_model` + `thinking_effort`), `/workbench.html` verified `window.__GP_WORKBENCH_ANALYTICS__`, and untouched `/arena/exp-*` single-shot artifacts remained byte-identical.

## 5. P1/P2 Active-Page Horizontal Overflow & Sticky Header Geometry (`1440px` & `390px`)

- **0 active-page horizontal overflows or clipped header controls.**

## 6. P2 Interactive Labs `[SIMULATED DEMO]` Labeling (House Rule #5)

- **All `/labs/*.html` pages display an explicit `[SIMULATED DEMO]` label.**

## 7. P2 Leaked Raw Markdown Syntax in Visible Prose

- **0 leaked markdown backticks or `**bold**` tokens in visible prose.**

## 8. P2 Legacy Role Attribution / High-Cheese Copy Locations

- **0 leftover high-cheese / legacy role title strings across active pages.**
