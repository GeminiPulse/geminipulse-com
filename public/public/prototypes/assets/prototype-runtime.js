/**
 * GeminiPulse v2.0 Brand Exploration Runtime
 * Implements modern-web-guidance progressive enhancements & fallbacks:
 * 1. Conditional feature-detected polyfills for Popover, Interest Invokers, and Invoker Commands
 * 2. Viewport-clamped anchor fallback when CSS `position-area` is unavailable
 * 3. Top-layer discrete display exit animation fallback (`canTransitionDisplay` + `data-closing`)
 * 4. `<dialog closedby="any">` light-dismiss fallback
 * 5. Real-time Curiosity Funnel Telemetry (`peek_intent` -> `brief_open` -> `route_commit`)
 */

// 1. Conditional feature-detected polyfills (never loaded unconditionally)
if (!('popover' in HTMLElement.prototype)) {
  import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
}

if (!HTMLButtonElement.prototype.hasOwnProperty('interestForElement')) {
  import('https://unpkg.com/interestfor@latest').catch(() => {});
}

if (!('commandForElement' in HTMLButtonElement.prototype)) {
  import('https://esm.run/invokers-polyfill').catch(() => {});
}

// 2. Reliable discrete `display` transition probe (guards against Firefox bug 1882408)
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
}

export async function closeTopLayer(element) {
  if (!element) return;
  if (!supportsTopLayerExit()) {
    element.setAttribute('data-closing', '');
    const animations = element.getAnimations ? element.getAnimations({ subtree: true }) : [];
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 400)),
      ]);
    }
    if (!element.hasAttribute('data-closing')) return;
    element.removeAttribute('data-closing');
  }
  if (typeof element.close === 'function' && element.open) {
    element.close();
  } else if (typeof element.hidePopover === 'function') {
    element.hidePopover();
  }
}

// 3. Curiosity Funnel Telemetry State (4 Uncontaminated Intent Buckets)
const telemetryState = {
  peeks: 0,
  briefs: 0,
  flips: 0,
  commits: 0,
  lastEvent: 'Ready — hover a headline or tap Brief',
};

export function logIntentSignal(type, detail) {
  if (type === 'peek') telemetryState.peeks += 1;
  else if (type === 'brief') telemetryState.briefs += 1;
  else if (type === 'flip' || type === 'twin_polarity_choice' || type === 'demo_interact' || type === 'lens_filter') {
    telemetryState.flips += 1;
  } else if (type === 'commit') {
    telemetryState.commits += 1;
  }
  telemetryState.lastEvent = `${type.toUpperCase()}: ${detail}`;

  const summary =
    telemetryState.flips > 0 || telemetryState.briefs > 0
      ? `${telemetryState.peeks} Peeks · ${telemetryState.briefs} Briefs · ${telemetryState.flips} Flips · ${telemetryState.commits} Clicks`
      : `${telemetryState.peeks} Peeks · ${telemetryState.briefs} Briefs · ${telemetryState.commits} Clicks`;

  document.querySelectorAll('#gp-telemetry-counts, [data-telemetry-hud]').forEach((el) => {
    el.textContent = summary;
  });

  const lastEl = document.getElementById('gp-telemetry-last');
  if (lastEl) {
    lastEl.textContent = telemetryState.lastEvent;
  }
}

function initHovercardPositionFallback() {
  const supportsAnchorArea = window.CSS?.supports?.('position-area', 'block-end');
  const triggers = document.querySelectorAll('[interestfor]');
  const boundCards = new WeakSet();
  const activeTriggerByCard = new WeakMap();

  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute('interestfor');
    const card = targetId ? document.getElementById(targetId) : null;
    if (!card) return;

    const rememberTrigger = () => activeTriggerByCard.set(card, trigger);
    trigger.addEventListener('pointerenter', rememberTrigger);
    trigger.addEventListener('focusin', rememberTrigger);

    const positionCard = (anchorEl) => {
      if (supportsAnchorArea) return;
      const rect = (anchorEl || trigger).getBoundingClientRect();
      const cardWidth = Math.min(360, window.innerWidth - 24);
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - cardWidth - 12));
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > 230 ? rect.bottom + 10 : Math.max(12, rect.top - 210);
      card.style.position = 'fixed';
      card.style.inset = 'auto';
      card.style.left = `${Math.round(left)}px`;
      card.style.top = `${Math.round(top)}px`;
      card.style.margin = '0';
    };

    if (!boundCards.has(card)) {
      boundCards.add(card);
      card.addEventListener('beforetoggle', (e) => {
        if (e.newState === 'open') {
          positionCard(activeTriggerByCard.get(card) || trigger);
          if (card.dataset.telemetryIgnore !== 'true') {
            logIntentSignal('peek', card.dataset.storySlug || targetId);
          }
        }
      });
    }

    // Progressive keyboard/hover fallback if interestfor polyfill is still loading or blocked offline
    let hoverTimer = null;
    let hideTimer = null;
    const hasNativeInterest = 'interestForElement' in HTMLButtonElement.prototype || 'interestForElement' in HTMLAnchorElement.prototype;
    if (!hasNativeInterest) {
      const openHint = () => {
        clearTimeout(hideTimer);
        hoverTimer = setTimeout(() => {
          if (card.matches(':is(:popover-open, .\\:popover-open)')) return;
          positionCard();
          try {
            card.showPopover?.();
          } catch {
            // ignore if already open
          }
        }, 180);
      };
      const closeHint = () => {
        clearTimeout(hoverTimer);
        hideTimer = setTimeout(() => {
          try {
            card.hidePopover?.();
          } catch {
            // ignore
          }
        }, 140);
      };
      trigger.addEventListener('mouseenter', openHint);
      trigger.addEventListener('mouseleave', closeHint);
      trigger.addEventListener('focus', openHint);
      trigger.addEventListener('blur', closeHint);
      card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      card.addEventListener('mouseleave', closeHint);
    }
  });
}

function initDialogsAndTelemetry() {
  // Mandatory fallback for <dialog closedby="any"> in browsers lacking closedBy (e.g. Safari)
  const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;
  const supportsCommandInvoker = 'commandForElement' in HTMLButtonElement.prototype;

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeTopLayer(dialog);
    });

    if (!supportsClosedBy && dialog.getAttribute('closedby') === 'any') {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        closeTopLayer(dialog);
      });
    }
  });

  // Immediate resilient click delegation while invokers-polyfill loads or if offline
  document.addEventListener('click', (event) => {
    const cmdBtn = event.target.closest('button[commandfor]');
    if (cmdBtn) {
      const targetId = cmdBtn.getAttribute('commandfor');
      const cmd = cmdBtn.getAttribute('command');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target && cmd === 'show-modal') {
        logIntentSignal('brief', target.dataset.storySlug || targetId);
        if (!supportsCommandInvoker && !target.open) {
          target.showModal();
        }
      } else if (target && cmd === 'close' && !supportsCommandInvoker && target.open) {
        closeTopLayer(target);
      }
    }

    const trackedLink = event.target.closest('a[data-intent-route]');
    if (trackedLink) {
      logIntentSignal('commit', trackedLink.getAttribute('data-intent-route'));
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHovercardPositionFallback();
    initDialogsAndTelemetry();
  });
} else {
  initHovercardPositionFallback();
  initDialogsAndTelemetry();
}
