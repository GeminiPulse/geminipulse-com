/**
 * GeminiPulse.com — Universal Zero-TBT GA4 & Model-Provenance Telemetry Collector
 * (`/assets/pulse-analytics.js`)
 *
 * Instrumenting static HTML sanctuaries, interactive developer labs, empirical arena pages,
 * and the 3D Celestial Navigator with:
 *   1. Explicit Model + Thinking Effort provenance (`authored_model`, `thinking_effort`, `content_surface`, `page_slug`)
 *   2. Deterministic `window.__GP_ANALYTICS__` inspection handle & `eventsBuffer` for Chrome CDP verification
 *   3. Strict headless/bot/Lighthouse network suppression (zero synthetic audit pollution in GA4)
 *   4. Zero-TBT post-paint / first-interaction `gtag.js` loader (`G-1BWMQWZJQ5`) for real human browsers
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.__GP_ANALYTICS__ && window.__GP_ANALYTICS__.__initialized) return;

  var MEASUREMENT_ID = 'G-1BWMQWZJQ5';
  var BOT_UA_RE =
    /HeadlessChrome|Lighthouse|Chrome-Lighthouse|PTST|Speed Insights|Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|facebookexternalhit|Twitterbot|LinkedInBot/i;

  function isHeadlessOrBot() {
    if (window.__GP_FORCE_GTAG__ === true) return false;
    try {
      if (navigator.webdriver === true) return true;
      var ua = navigator.userAgent || '';
      if (BOT_UA_RE.test(ua)) return true;
    } catch (_) {
      return true;
    }
    return false;
  }

  function normalizeModelSlug(raw) {
    if (!raw || typeof raw !== 'string') return '';
    var cleaned = raw
      .trim()
      .replace(/\(.*?\)/g, ' ')
      .replace(/^(?:authored\s+by|written\s+by)\s+/i, '')
      .replace(/^google\s+/i, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!cleaned) return '';
    if (cleaned.indexOf('gemini-4-carbon') !== -1) return 'gemini-4-carbon';
    if (cleaned.indexOf('gemini-4-neon') !== -1) return 'gemini-4-neon';
    if (cleaned.indexOf('gemini-4-hydrogen') !== -1) return 'gemini-4-hydrogen';
    if (cleaned.indexOf('gemini-4-argon') !== -1) return 'gemini-4-argon';
    if (cleaned.indexOf('gemini-3-8-flash') !== -1) return 'gemini-3-8-flash';
    if (cleaned.indexOf('claude-opus-5-5') !== -1) return 'claude-opus-5-5';
    return cleaned;
  }

  function normalizeEffort(raw) {
    if (!raw || typeof raw !== 'string') return '';
    var effortMatch = raw.match(/(?:thinking\s+)?effort\s*[:=]\s*([a-z0-9_-]+)/i);
    var candidate = (effortMatch ? effortMatch[1] : raw).trim().toLowerCase();
    if (candidate === 'low' || candidate === 'medium' || candidate === 'high' || candidate === 'xhigh') {
      return candidate;
    }
    if (candidate === 'med') return 'medium';
    if (candidate === 'minimal' || candidate === 'none') return candidate;
    return '';
  }

  function parseAuthorProvenance(authorRaw) {
    if (!authorRaw || typeof authorRaw !== 'string') return { model: '', effort: '' };
    return {
      model: normalizeModelSlug(authorRaw),
      effort: normalizeEffort(authorRaw),
    };
  }

  function getMetaContent(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  function setMetaContent(name, val) {
    if (!val) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', val);
  }

  function readSchemaOrgAuthor() {
    var dynamicSchema = document.getElementById('dynamic-seo-geo-schema');
    var scripts = dynamicSchema
      ? [dynamicSchema]
      : Array.prototype.slice.call(document.querySelectorAll('script[type="application/ld+json"]'));

    for (var i = 0; i < scripts.length; i++) {
      var txt = scripts[i].textContent;
      if (!txt) continue;
      try {
        var parsed = JSON.parse(txt);
        var nodes = Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed];
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (!node || typeof node !== 'object') continue;
          var author = node.author;
          if (typeof author === 'string' && author.trim()) {
            return parseAuthorProvenance(author);
          }
          if (author && typeof author.name === 'string' && author.name.trim()) {
            return parseAuthorProvenance(author.name);
          }
        }
      } catch (_) {
        // Ignore malformed JSON-LD blocks
      }
    }

    var microdataAuthor = document.getElementById('article-author-meta');
    if (microdataAuthor) {
      var mc = microdataAuthor.getAttribute('content');
      if (mc) return parseAuthorProvenance(mc);
    }

    return { model: '', effort: '' };
  }

  function inferSurfaceFromPath(pathname) {
    var p = pathname || '/';
    if (p === '/' || p === '/index.html' || p.indexOf('/look-j-3d-celestial-navigator') !== -1) {
      return 'constellation_home';
    }
    if (p === '/articles/' || p === '/articles/index.html') return 'essays_index';
    if (p.indexOf('/articles/') === 0) return 'flagship_essay';
    if (p.indexOf('/arena/') === 0) return 'empirical_arena';
    if (p.indexOf('/labs/') === 0) return 'interactive_lab';
    if (p.indexOf('open-letter-to-google-deepmind') !== -1) return 'open_letter';
    if (p.indexOf('/series/') === 0) return 'release_series';
    if (p.indexOf('/changelog') === 0) return 'public_changelog';
    if (p.indexOf('/status') === 0) return 'system_status';
    if (p.indexOf('/partners') === 0) return 'partners_info';
    if (p.indexOf('/brand') === 0) return 'brand_assets';
    if (p.indexOf('/prototypes/') === 0) return 'prototype_archive';
    if (p.indexOf('/shorts/') === 0) return 'youtube_short';
    if (p.indexOf('/workbench') === 0) return 'workbench_spa';
    return 'static_page';
  }

  function inferSlugFromPath(pathname) {
    var p = (pathname || '/').replace(/\/+$/, '');
    if (!p || p === '/index.html') return 'constellation-home';
    var stripped = p.replace(/^\//, '').replace(/\.html$/i, '');
    if (stripped === 'articles/index') return 'articles-index';
    if (stripped.indexOf('articles/') === 0) return stripped.slice('articles/'.length);
    if (stripped.indexOf('arena/') === 0) return stripped.slice('arena/'.length);
    if (stripped.indexOf('labs/') === 0) return stripped.slice('labs/'.length);
    if (stripped.indexOf('series/') === 0) return stripped.slice('series/'.length);
    return stripped.replace(/\//g, '-') || 'constellation-home';
  }

  var dynamicStarOverride = {
    model: '',
    effort: '',
    starKey: '',
  };

  function syncStarProvenance(starKeyHint) {
    var activeStar = starKeyHint || document.documentElement.getAttribute('data-star') || '';
    if (!activeStar) return;

    var resolvedModel = '';
    var resolvedEffort = '';

    var essayPool = window.ESSAY_DATA;
    if (essayPool && essayPool[activeStar]) {
      var entry = essayPool[activeStar];
      resolvedModel = normalizeModelSlug(entry.authoredByModel || entry.authorWithEffortPlain || '');
      resolvedEffort =
        normalizeEffort(entry.thinkingEffort || '') ||
        normalizeEffort(entry.authorWithEffortPlain || '');
    }

    if (!resolvedModel || !resolvedEffort) {
      var itemAuthor = document.getElementById('article-author-meta');
      if (itemAuthor) {
        var parsedMeta = parseAuthorProvenance(itemAuthor.getAttribute('content') || '');
        if (!resolvedModel && parsedMeta.model) resolvedModel = parsedMeta.model;
        if (!resolvedEffort && parsedMeta.effort) resolvedEffort = parsedMeta.effort;
      }
    }

    if (!resolvedModel || !resolvedEffort) {
      var parsedLd = readSchemaOrgAuthor();
      if (!resolvedModel && parsedLd.model) resolvedModel = parsedLd.model;
      if (!resolvedEffort && parsedLd.effort) resolvedEffort = parsedLd.effort;
    }

    dynamicStarOverride.starKey = activeStar;
    if (resolvedModel) {
      dynamicStarOverride.model = resolvedModel;
      setMetaContent('gp:model', resolvedModel);
    }
    if (resolvedEffort) {
      dynamicStarOverride.effort = resolvedEffort;
      setMetaContent('gp:effort', resolvedEffort);
    }
  }

  // Initial star sync for `/` or `/?star=...`
  if (document.documentElement.hasAttribute('data-star')) {
    syncStarProvenance();
  }

  function getContext() {
    var pathname = window.location ? window.location.pathname : '/';
    var metaModel = normalizeModelSlug(getMetaContent('gp:model'));
    var metaEffort = normalizeEffort(getMetaContent('gp:effort'));
    var metaSurface = getMetaContent('gp:surface');
    var metaSlug = getMetaContent('gp:slug');

    var schemaFallback = (!metaModel || !metaEffort) ? readSchemaOrgAuthor() : { model: '', effort: '' };

    var model = dynamicStarOverride.model || metaModel || schemaFallback.model || 'gemini-4-argon';
    var effort = dynamicStarOverride.effort || metaEffort || schemaFallback.effort || 'high';
    var surface = metaSurface || inferSurfaceFromPath(pathname);
    var slug = metaSlug || inferSlugFromPath(pathname);
    var activeStar = document.documentElement.getAttribute('data-star') || dynamicStarOverride.starKey || '';

    var ctx = {
      measurementId: MEASUREMENT_ID,
      authored_model: model,
      thinking_effort: effort,
      content_surface: surface,
      page_slug: slug,
      page_path: pathname,
      model: model,
      effort: effort,
      surface: surface,
      slug: slug,
      is_bot: isBot,
    };
    if (activeStar) ctx.active_star = activeStar;
    return ctx;
  }

  var isBot = isHeadlessOrBot();
  var eventsBuffer = [];
  var gtagScriptLoaded = false;

  if (!isBot) {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
    var bootCtx = getContext();
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      authored_model: bootCtx.authored_model,
      thinking_effort: bootCtx.thinking_effort,
      content_surface: bootCtx.content_surface,
      page_slug: bootCtx.page_slug,
    });
  }

  function injectGtagScriptOnce() {
    if (gtagScriptLoaded || isHeadlessOrBot()) return;
    gtagScriptLoaded = true;
    try {
      var existing = document.querySelector(
        'script[src*="googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID + '"]'
      );
      if (existing) return;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
      (document.head || document.documentElement).appendChild(s);
    } catch (_) {
      // Non-blocking
    }
  }

  if (!isBot) {
    var interactionEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    var onFirstHumanInput = function () {
      for (var i = 0; i < interactionEvents.length; i++) {
        window.removeEventListener(interactionEvents[i], onFirstHumanInput, true);
      }
      injectGtagScriptOnce();
    };
    for (var k = 0; k < interactionEvents.length; k++) {
      window.addEventListener(interactionEvents[k], onFirstHumanInput, {
        once: true,
        passive: true,
        capture: true,
      });
    }

    var schedulePostLoadGtag = function () {
      setTimeout(function () {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(injectGtagScriptOnce, { timeout: 1000 });
        } else {
          injectGtagScriptOnce();
        }
      }, 1400);
    };

    if (document.readyState === 'complete') {
      schedulePostLoadGtag();
    } else {
      window.addEventListener('load', schedulePostLoadGtag, { once: true, passive: true });
    }

    document.addEventListener(
      'visibilitychange',
      function () {
        if (document.visibilityState === 'hidden') {
          injectGtagScriptOnce();
        }
      },
      { passive: true }
    );
  }

  function track(eventName, params) {
    if (!eventName || typeof eventName !== 'string') return null;
    var ctx = getContext();
    var payload = {
      authored_model: ctx.authored_model,
      thinking_effort: ctx.thinking_effort,
      content_surface: ctx.content_surface,
      page_slug: ctx.page_slug,
    };
    if (ctx.active_star && payload.active_star === undefined) {
      payload.active_star = ctx.active_star;
    }
    if (params && typeof params === 'object') {
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = params[key];
        if (val !== undefined && val !== null && val !== '') {
          payload[key] = val;
        }
      }
    }

    var record = {
      event: eventName,
      params: payload,
      ts: Date.now(),
    };
    eventsBuffer.push(record);
    if (eventsBuffer.length > 200) {
      eventsBuffer.shift();
    }

    if (!isHeadlessOrBot() && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, payload);
      } catch (_) {
        // Non-blocking
      }
    }
    return record;
  }

  window.__GP_ANALYTICS__ = {
    __initialized: true,
    measurementId: MEASUREMENT_ID,
    getContext: getContext,
    track: track,
    eventsBuffer: eventsBuffer,
  };

  /* =========================================================================
     1. ENRICHED PAGE VIEW (WITH UTM ATTRIBUTION WHEN PRESENT)
     ========================================================================= */
  (function sendInitialPageView() {
    var pvParams = {
      page_title: document.title || '',
      page_location: window.location ? window.location.href : '',
      page_path: window.location ? window.location.pathname : '/',
    };
    if (document.referrer) {
      pvParams.page_referrer = document.referrer;
    }
    try {
      var sp = new URLSearchParams(window.location ? window.location.search : '');
      var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      for (var i = 0; i < utmKeys.length; i++) {
        var uk = utmKeys[i];
        var uv = sp.get(uk);
        if (uv) pvParams[uk] = uv;
      }
    } catch (_) {
      // Ignore malformed query strings
    }
    track('page_view', pvParams);
  })();

  /* =========================================================================
     2. ENGAGED READ MILESTONES (15s, 45s, 120s ACTIVE VISIBLE TAB TIME)
     ========================================================================= */
  (function bindEngagedReadTimers() {
    var MILESTONES_SEC = [15, 45, 120];
    var nextIdx = 0;
    var accumulatedMs = 0;
    var activeSince = document.visibilityState === 'visible' ? Date.now() : null;
    var timerId = null;

    function clearTimer() {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    }

    function scheduleNext() {
      clearTimer();
      if (nextIdx >= MILESTONES_SEC.length) return;
      if (document.visibilityState !== 'visible') return;
      if (activeSince === null) activeSince = Date.now();

      var now = Date.now();
      var totalElapsed = accumulatedMs + (now - activeSince);
      var targetMs = MILESTONES_SEC[nextIdx] * 1000;
      var remaining = Math.max(0, targetMs - totalElapsed);

      timerId = setTimeout(function () {
        timerId = null;
        if (document.visibilityState !== 'visible') return;
        var currentNow = Date.now();
        var elapsedNow = accumulatedMs + (activeSince !== null ? currentNow - activeSince : 0);
        while (nextIdx < MILESTONES_SEC.length && elapsedNow >= MILESTONES_SEC[nextIdx] * 1000 - 25) {
          var milestone = MILESTONES_SEC[nextIdx];
          nextIdx += 1;
          track('engaged_read', {
            milestone_seconds: milestone,
            engagement_tier: milestone + 's',
          });
        }
        scheduleNext();
      }, remaining);
    }

    document.addEventListener(
      'visibilitychange',
      function () {
        if (document.visibilityState === 'visible') {
          if (activeSince === null) activeSince = Date.now();
          scheduleNext();
        } else {
          if (activeSince !== null) {
            accumulatedMs += Math.max(0, Date.now() - activeSince);
            activeSince = null;
          }
          clearTimer();
        }
      },
      { passive: true }
    );

    scheduleNext();
  })();

  /* =========================================================================
     3. SCROLL MILESTONES (50% & 90% ON WINDOW AND SANCTUARY DRAWER)
     ========================================================================= */
  (function bindScrollMilestones() {
    var firedKeys = {};
    var rafPending = false;
    var pendingContainer = null;

    function evaluateDepth(ratio, containerKind) {
      if (!(ratio > 0)) return;
      var ctx = getContext();
      var scopeKey = ctx.page_slug + ':' + (ctx.active_star || 'main') + ':' + containerKind;
      var depths = [50, 90];
      for (var i = 0; i < depths.length; i++) {
        var d = depths[i];
        var k = scopeKey + ':' + d;
        if (!firedKeys[k] && ratio * 100 >= d) {
          firedKeys[k] = true;
          track('scroll_milestone', {
            percent_scrolled: d,
            scroll_container: containerKind,
          });
        }
      }
    }

    function measureWindowScroll() {
      var docEl = document.documentElement;
      var body = document.body;
      var scrollHeight = Math.max(
        docEl ? docEl.scrollHeight : 0,
        body ? body.scrollHeight : 0
      );
      var viewportH = window.innerHeight || (docEl ? docEl.clientHeight : 0) || 0;
      if (scrollHeight <= viewportH + 80) return;
      var scrollTop = window.scrollY || window.pageYOffset || (docEl ? docEl.scrollTop : 0) || 0;
      evaluateDepth((scrollTop + viewportH) / scrollHeight, 'window');
    }

    function measureElementScroll(el) {
      if (!el || el.scrollHeight <= el.clientHeight + 80) return;
      evaluateDepth((el.scrollTop + el.clientHeight) / el.scrollHeight, 'sanctuary_drawer');
    }

    function onScrollCapture(ev) {
      var target = ev ? ev.target : null;
      if (
        target &&
        target !== document &&
        target !== window &&
        target !== document.documentElement &&
        target !== document.body &&
        target.nodeType === 1
      ) {
        if (
          target.id === 'sanctuary-drawer' ||
          target.id === 'drawer-scroll-body' ||
          target.id === 'salon-sheet' ||
          (target.classList && target.classList.contains('drawer-scroll-body'))
        ) {
          pendingContainer = target;
        } else {
          return;
        }
      }

      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(function () {
        rafPending = false;
        if (pendingContainer) {
          var el = pendingContainer;
          pendingContainer = null;
          measureElementScroll(el);
        } else {
          measureWindowScroll();
        }
      });
    }

    window.addEventListener('scroll', onScrollCapture, { passive: true });
    document.addEventListener('scroll', onScrollCapture, { passive: true, capture: true });
  })();

  /* =========================================================================
     4. MUTATION OBSERVER FOR DYNAMIC STAR SWITCHING ON `/`
     ========================================================================= */
  if (typeof MutationObserver === 'function') {
    var rootObserver = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'data-star') {
          setTimeout(function () {
            syncStarProvenance();
          }, 0);
          break;
        }
      }
    });
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-star'],
    });
  }

  /* =========================================================================
     5. DELEGATED INTERACTION & MODEL-ROI ATTRIBUTION LISTENERS
     ========================================================================= */
  var lastCodeCopyAt = 0;

  function fireCodeCopyOnce(sourceKind, label) {
    var now = Date.now();
    if (now - lastCodeCopyAt < 400) return;
    lastCodeCopyAt = now;
    track('sdk_code_copy', {
      copy_trigger: sourceKind,
      snippet_label: label || undefined,
    });
  }

  document.addEventListener(
    'click',
    function (ev) {
      var rawTarget = ev.target;
      if (!rawTarget || typeof rawTarget.closest !== 'function') return;

      // 5a. Constellation Star Clicks (`[data-star-key]`, `.star-node[data-star]`, `[data-select-star]`, `[data-essay-nav-star]`)
      var starEl = rawTarget.closest(
        '[data-star-key], [data-essay-nav-star], [data-select-star], .star-node[data-star]'
      );
      if (starEl) {
        var starKey =
          starEl.getAttribute('data-star-key') ||
          starEl.getAttribute('data-essay-nav-star') ||
          starEl.getAttribute('data-select-star') ||
          starEl.getAttribute('data-star') ||
          '';
        var triggerKind = starEl.hasAttribute('data-essay-nav-star')
          ? 'essay_prev_next'
          : starEl.hasAttribute('data-select-star')
            ? 'dock_step'
            : 'constellation_node';
        if (starKey) {
          setTimeout(function () {
            syncStarProvenance(starKey);
            track('constellation_star_select', {
              star_key: starKey,
              nav_trigger: triggerKind,
            });
          }, 0);
        }
        return;
      }

      // 5b. Dual-Lens Filter Switches (`[data-lens-filter]`)
      var lensBtn = rawTarget.closest('[data-lens-filter]');
      if (lensBtn) {
        var lensVal = (lensBtn.getAttribute('data-lens-filter') || 'both').toLowerCase();
        track('essay_lens_switch', {
          lens: lensVal,
        });
        return;
      }

      // 5c. Copy Buttons -> `sdk_code_copy`
      var copyBtn = rawTarget.closest(
        '[data-copy-essay-code], .copy-code-btn, #ev-copy-btn, [data-copy], [data-copy-code], button[id*="copy" i], button[class*="copy" i]'
      );
      if (copyBtn) {
        var btnText = (copyBtn.getAttribute('aria-label') || copyBtn.textContent || '')
          .trim()
          .slice(0, 60);
        fireCodeCopyOnce('button', btnText);
        return;
      }

      // 5d. Arena Comparator Controls & Artifact Links (`/arena/*`)
      var arenaBtn = rawTarget.closest(
        '[data-t1-mode], [data-shot-theme], [data-open-sandbox], [data-sandbox-pick], [data-sbs-preset], [data-sbs-render], [data-jump-matchup], [data-t1-sort], [data-t2-filter], [data-trap-row], [data-ev-tab], #ev-mode-formatted, #ev-mode-raw, #reload-sandbox-btn'
      );
      if (arenaBtn) {
        var actionKind = 'comparator_control';
        var targetArtifact = '';
        if (arenaBtn.hasAttribute('data-t1-mode')) {
          actionKind = 't1_mode_switch';
          targetArtifact = arenaBtn.getAttribute('data-t1-mode');
        } else if (arenaBtn.hasAttribute('data-shot-theme')) {
          actionKind = 'shot_theme_switch';
          targetArtifact = arenaBtn.getAttribute('data-shot-theme');
        } else if (arenaBtn.hasAttribute('data-open-sandbox')) {
          actionKind = 'open_live_sandbox';
          targetArtifact = arenaBtn.getAttribute('data-open-sandbox');
        } else if (arenaBtn.hasAttribute('data-sandbox-pick')) {
          actionKind = 'sandbox_model_pick';
          targetArtifact = arenaBtn.getAttribute('data-sandbox-pick');
        } else if (arenaBtn.hasAttribute('data-sbs-preset')) {
          actionKind = 'sbs_preset_select';
          targetArtifact = arenaBtn.getAttribute('data-sbs-preset');
        } else if (arenaBtn.hasAttribute('data-sbs-render')) {
          actionKind = 'sbs_render_mode';
          targetArtifact = arenaBtn.getAttribute('data-sbs-render');
        } else if (arenaBtn.hasAttribute('data-jump-matchup')) {
          actionKind = 'jump_matchup';
          targetArtifact = arenaBtn.getAttribute('data-jump-matchup');
        } else if (arenaBtn.hasAttribute('data-t1-sort')) {
          actionKind = 'scorecard_sort';
          targetArtifact = arenaBtn.getAttribute('data-t1-sort');
        } else if (arenaBtn.hasAttribute('data-t2-filter')) {
          actionKind = 't2_matrix_filter';
          targetArtifact = arenaBtn.getAttribute('data-t2-filter');
        } else if (arenaBtn.hasAttribute('data-trap-row')) {
          actionKind = 't2_trap_inspect';
          targetArtifact = arenaBtn.getAttribute('data-trap-row');
        } else if (arenaBtn.hasAttribute('data-ev-tab')) {
          actionKind = 'evidence_tab_select';
          targetArtifact = arenaBtn.getAttribute('data-ev-tab');
        } else if (arenaBtn.id === 'ev-mode-formatted' || arenaBtn.id === 'ev-mode-raw') {
          actionKind = 'evidence_view_mode';
          targetArtifact = arenaBtn.id === 'ev-mode-raw' ? 'raw' : 'formatted';
        } else if (arenaBtn.id === 'reload-sandbox-btn') {
          actionKind = 'sandbox_reload';
          targetArtifact = 'active_sandbox';
        }
        track('arena_artifact_engage', {
          action_kind: actionKind,
          target_artifact: targetArtifact || 'arena_ui',
        });
        return;
      }

      // 5e. Anchor Clicks: Arena raw/fullscreen artifacts & Outbound `https://` citations
      var anchor = rawTarget.closest('a[href]');
      if (!anchor) return;
      var rawHref = anchor.getAttribute('href') || '';
      if (!rawHref || rawHref.charAt(0) === '#') return;

      if (
        /\/arena\/exp-\d+-/i.test(rawHref) ||
        /^exp-\d+-/i.test(rawHref) ||
        /\.(?:json|ts)(?:$|\?)/i.test(rawHref)
      ) {
        var isExpHtml = /exp-\d+-.*\.html/i.test(rawHref);
        track('arena_artifact_engage', {
          action_kind: isExpHtml ? 'fullscreen_build_open' : 'raw_evidence_open',
          target_artifact: rawHref,
        });
        return;
      }

      if (/^https:\/\//i.test(rawHref)) {
        try {
          var parsedUrl = new URL(rawHref, window.location.origin);
          var host = (parsedUrl.hostname || '').toLowerCase();
          if (host && host !== 'geminipulse.com' && !/\.geminipulse\.com$/.test(host)) {
            track('outbound_source_click', {
              outbound_host: host,
              outbound_url: parsedUrl.href,
            });
          }
        } catch (_) {
          // Ignore invalid URLs
        }
      }
    },
    { passive: true }
  );

  // Arena `<select>` comparator dropdown changes (`#sbs-select-a`, `#sbs-select-b`)
  document.addEventListener(
    'change',
    function (ev) {
      var t = ev.target;
      if (!t || (t.id !== 'sbs-select-a' && t.id !== 'sbs-select-b')) return;
      track('arena_artifact_engage', {
        action_kind: t.id === 'sbs-select-a' ? 'sbs_select_a' : 'sbs_select_b',
        target_artifact: t.value || 'unknown',
      });
    },
    { passive: true }
  );

  // Manual text selection copy inside `<pre>` or `<code>`
  document.addEventListener(
    'copy',
    function () {
      try {
        var sel = window.getSelection ? window.getSelection() : null;
        var anchorNode = sel ? sel.anchorNode : null;
        var el =
          anchorNode && anchorNode.nodeType === 1
            ? anchorNode
            : anchorNode
              ? anchorNode.parentElement
              : null;
        if (el && typeof el.closest === 'function' && el.closest('pre, code')) {
          fireCodeCopyOnce('selection_copy', 'code_block');
        }
      } catch (_) {
        // Non-blocking
      }
    },
    { passive: true }
  );
})();
