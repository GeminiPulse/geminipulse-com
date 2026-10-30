---
name: arena-and-labs-forge
description: Engineers single-shot Tri-Model Arena benchmarks (/arena/*.html) and interactive Agile Labs micro-apps (/labs/*.html) with dual-theme M3 CSS, zero dependencies, and Quad-100 Lighthouse performance.
---

# Single-Shot Frontier Arena & Agile Labs Forge

Use this skill when building standalone interactive web utilities, ROI calculators, simulators, or games under `public/public/labs/<slug>.html` or Thursday Frontier Tri-Model Arena entries under `public/public/arena/<slug>.html`.

## 1. Architectural Invariants for `/labs/*.html` & `/arena/*.html`

1. **Single-File Zero-Bloat Delivery:** Ship self-contained HTML5 + modern CSS (`:root` custom properties, Dark `#0B0F17` & Light `#F8FAFC` theme toggle persisted to `localStorage.getItem('geminipulse_theme')`) + vanilla ES2026 JS. Avoid external JS runtime CDNs so FCP/LCP stay sub-0.5s.
2. **Mandatory House Rule #5 Labeling:** Any client-side AI loop, cost simulator, or SQL/code translator must display a visible `[SIMULATED DEMO]` pill in both the hero header and the output viewport. Never fabricate user reviews or fake telemetry.
3. **SEO, GEO & Social Card Parity:**
   - Include `<link rel="canonical" href="https://geminipulse.com/labs/<slug>.html" />`
   - Include Open Graph & Twitter card meta pointing to `https://geminipulse.com/og-image.png`
   - Embed valid Schema.org `SoftwareApplication` JSON-LD in `<head>`
   - Register the route in `public/public/sitemap.xml` and `public/public/feed.xml` (using `pulse-content-cli.mjs register-seo`).
4. **4-Viewport Zero-Overflow Discipline:**
   - Every table or code block must sit inside an `overflow-x: auto; max-width: 100%` container.
   - Flex/Grid rows with badges or URLs must set `min-width: 0` on text children and `flex-wrap: wrap` on pill toolbars so `390px` mobile and `1120px` split-screen laptop viewports have `0` horizontal overflow.

## 2. Verification Before Handoff

Always run:
```bash
npm --prefix ./public run build
node ./public/scripts/audit-layout.mjs
```
Confirm `0` layout overflows across `1440px`, `1120px`, `768px`, and `390px`.
