#!/usr/bin/env node
/**
 * pulse-content-cli.mjs — GeminiPulse Zero-Token HTML & SEO/Atom Scaffolder
 * -------------------------------------------------------------------------
 * Deterministically scaffolds Dual-Theme M3 standalone Twin-Track pages
 * ("Pollux: Everyday Wins for Joes & Jills" + "Castor: Production Blueprints for Pros")
 * and idempotently registers routes in sitemap.xml + feed.xml without LLM XML drift.
 */

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeHtml(str) {
  return escapeXml(str).replace(/'/g, '&#39;');
}

function registerSeo({ repoRoot, route, title, summary, priority = '0.95', changefreq = 'weekly' }) {
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  const canonicalUrl = `https://geminipulse.com${cleanRoute}`;
  const todayDate = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const sitemapPath = path.join(repoRoot, 'public/public/sitemap.xml');
  const feedPath = path.join(repoRoot, 'public/public/feed.xml');

  const result = { canonicalUrl, sitemapUpdated: false, feedUpdated: false };

  if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) {
      const entry = [
        '  <url>',
        `    <loc>${escapeXml(canonicalUrl)}</loc>`,
        `    <lastmod>${todayDate}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
      const anchor = '  </url>\n';
      const firstCloseIdx = sitemap.indexOf(anchor);
      if (firstCloseIdx !== -1) {
        const insertAt = firstCloseIdx + anchor.length;
        sitemap = `${sitemap.slice(0, insertAt)}${entry}\n${sitemap.slice(insertAt)}`;
      } else {
        sitemap = sitemap.replace('</urlset>', `${entry}\n</urlset>`);
      }
      fs.writeFileSync(sitemapPath, sitemap, 'utf8');
      result.sitemapUpdated = true;
    }
  }

  if (fs.existsSync(feedPath) && title && summary) {
    let feed = fs.readFileSync(feedPath, 'utf8');
    if (!feed.includes(`<id>${canonicalUrl}</id>`) && !feed.includes(`href="${canonicalUrl}"`)) {
      feed = feed.replace(/<updated>[^<]+<\/updated>/, `<updated>${nowIso}</updated>`);
      const atomEntry = [
        '  <entry>',
        `    <title>${escapeXml(title)}</title>`,
        `    <link href="${escapeXml(canonicalUrl)}" />`,
        `    <id>${escapeXml(canonicalUrl)}</id>`,
        `    <updated>${nowIso}</updated>`,
        `    <summary>${escapeXml(summary)}</summary>`,
        '  </entry>',
        '',
      ].join('\n');
      const firstEntryIdx = feed.indexOf('  <entry>');
      if (firstEntryIdx !== -1) {
        feed = `${feed.slice(0, firstEntryIdx)}${atomEntry}${feed.slice(firstEntryIdx)}`;
      } else {
        feed = feed.replace('</feed>', `${atomEntry}</feed>`);
      }
      fs.writeFileSync(feedPath, feed, 'utf8');
      result.feedUpdated = true;
    }
  }

  return result;
}

function buildHtmlTemplate({ canonicalUrl, title, summary, category }) {
  const todayDate = new Date().toISOString().slice(0, 10);
  const jsonLd = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description: summary,
      datePublished: todayDate,
      dateModified: todayDate,
      author: {
        '@type': 'Organization',
        name: 'GeminiPulse (Google Gemini 4 Argon)',
        url: 'https://geminipulse.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'GeminiPulse',
        url: 'https://geminipulse.com/',
      },
      image: 'https://geminipulse.com/og-image.png',
      mainEntityOfPage: canonicalUrl,
    },
    null,
    2
  );

  return `<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | GeminiPulse</title>
  <meta name="description" content="${escapeHtml(summary)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <link rel="icon" type="image/svg+xml" href="/gemini-sparkle.svg" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)} | GeminiPulse" />
  <meta property="og:description" content="${escapeHtml(summary)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="https://geminipulse.com/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@geminipulse" />
  <meta name="twitter:title" content="${escapeHtml(title)} | GeminiPulse" />
  <meta name="twitter:description" content="${escapeHtml(summary)}" />
  <meta name="twitter:image" content="https://geminipulse.com/og-image.png" />
  <script type="application/ld+json">
${jsonLd}
  </script>
  <style>
    :root {
      --bg: #0b0f17;
      --surface: #121826;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --border: rgba(148, 163, 184, 0.2);
      --accent: #60a5fa;
      --twin-green: #34d399;
    }
    html.light {
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --muted: #475569;
      --border: rgba(15, 23, 42, 0.14);
      --accent: #2563eb;
      --twin-green: #059669;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
    }
    .wrap { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem 4rem; }
    .topbar {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 0.75rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem;
    }
    .brand { color: var(--text); text-decoration: none; font-weight: 700; font-size: 1.05rem; }
    .pill {
      display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem;
      border-radius: 999px; border: 1px solid var(--border); font-size: 0.75rem; font-family: monospace;
    }
    .twin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 1rem; margin: 1.5rem 0; }
    .card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.25rem;
      min-width: 0;
    }
    pre { overflow-x: auto; max-width: 100%; padding: 1rem; border-radius: 0.75rem; background: #090d16; color: #e2e8f0; }
    button.theme-btn {
      background: var(--surface); color: var(--text); border: 1px solid var(--border);
      border-radius: 999px; padding: 0.35rem 0.85rem; cursor: pointer; font-size: 0.78rem;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header class="topbar">
      <a class="brand" href="/">✦ GeminiPulse.com</a>
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
        <span class="pill">${escapeHtml(category || 'Twin-Track Guide')}</span>
        <button class="theme-btn" type="button" id="themeToggle">Toggle Theme</button>
      </div>
    </header>
    <main id="article-content">
      <h1>${escapeHtml(title)}</h1>
      <p style="color:var(--muted);font-size:1.08rem;">${escapeHtml(summary)}</p>
      <div class="twin-grid">
        <section class="card" aria-labelledby="pollux-heading">
          <div class="pill" style="color:var(--twin-green);margin-bottom:0.5rem;">POLLUX TRACK • FOR JOES &amp; JILLS</div>
          <h2 id="pollux-heading" style="margin-top:0.25rem;font-size:1.2rem;">Everyday (T)winning Workflow</h2>
          <p>Replace this block with the plain-English Rosetta Stone analogy and 3-step Google Workspace / Gemini App win.</p>
        </section>
        <section class="card" aria-labelledby="castor-heading">
          <div class="pill" style="color:var(--accent);margin-bottom:0.5rem;">CASTOR TRACK • FOR PROS &amp; BUILDERS</div>
          <h2 id="castor-heading" style="margin-top:0.25rem;font-size:1.2rem;">Production Interactions API Blueprint</h2>
          <p>Replace this block with verified <code>@google/genai</code> v2.32+ <code>client.interactions.create()</code> code and token math.</p>
        </section>
      </div>
    </main>
  </div>
  <script>
    (function () {
      const saved = localStorage.getItem('geminipulse_theme');
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.className = saved;
      }
      document.getElementById('themeToggle').addEventListener('click', function () {
        const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
        document.documentElement.className = next;
        localStorage.setItem('geminipulse_theme', next);
      });
    })();
  </script>
</body>
</html>
`;
}

const args = parseArgs(process.argv);
const cmd = args._[0];
const repoRoot = path.resolve(args.repo || process.cwd());

if (cmd === 'register-seo') {
  if (!args.route) {
    console.error('Usage: pulse-content-cli.mjs register-seo --repo <dir> --route </series/...> [--title "..."] [--summary "..."]');
    process.exit(1);
  }
  const res = registerSeo({
    repoRoot,
    route: args.route,
    title: args.title,
    summary: args.summary,
    priority: args.priority,
    changefreq: args.changefreq,
  });
  console.log(JSON.stringify(res, null, 2));
} else if (cmd === 'scaffold') {
  if (!args.route || !args.title || !args.summary) {
    console.error('Usage: pulse-content-cli.mjs scaffold --repo <dir> --route </series/...> --title "..." --summary "..." [--category "..."]');
    process.exit(1);
  }
  const cleanRoute = args.route.startsWith('/') ? args.route.slice(1) : args.route;
  const outPath = path.join(repoRoot, 'public/public', cleanRoute);
  if (fs.existsSync(outPath) && !args.force) {
    console.error(`Refusing to overwrite existing file without --force: ${outPath}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const canonicalUrl = `https://geminipulse.com/${cleanRoute}`;
  fs.writeFileSync(
    outPath,
    buildHtmlTemplate({
      canonicalUrl,
      title: args.title,
      summary: args.summary,
      category: args.category,
    }),
    'utf8'
  );
  const seoRes = registerSeo({
    repoRoot,
    route: `/${cleanRoute}`,
    title: args.title,
    summary: args.summary,
  });
  console.log(JSON.stringify({ created: outPath, ...seoRes }, null, 2));
} else {
  console.log('Commands: scaffold | register-seo');
}
