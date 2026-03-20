/**
 * data-anim Inspector
 *
 * Drop this script onto any website to interactively click elements
 * and apply data-anim animations. Injects the data-anim CDN script
 * at runtime so no animation definitions are bundled.
 *
 * Usage:
 *   <script src="data-anim-inspector.min.js"></script>
 */

// ── Types ──────────────────────────────────────────────────────────
interface AnimCategory {
  label: string;
  names: string[];
}

// ── Animation categories for the UI ────────────────────────────────
const categories: AnimCategory[] = [
  { label: 'Fade', names: ['fadeIn', 'fadeOut', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight'] },
  { label: 'Slide', names: ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight'] },
  { label: 'Zoom', names: ['zoomIn', 'zoomOut', 'zoomInUp', 'zoomInDown'] },
  { label: 'Bounce', names: ['bounce', 'bounceIn', 'bounceInUp', 'bounceInDown'] },
  { label: 'Attention', names: ['shake', 'pulse', 'wobble', 'flip', 'swing', 'rubberBand'] },
  { label: 'Rotate', names: ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight'] },
  { label: 'Special', names: ['blur', 'clipReveal', 'typewriter'] },
];

// ── Easing presets (inline, no external dependency) ────────────────
const EASING_PRESETS = ['ease', 'ease-out-expo', 'ease-out-back', 'spring'] as const;

// ── State ──────────────────────────────────────────────────────────
let active = false;
let selectedEl: HTMLElement | null = null;
let hoveredEl: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let toggleBtn: HTMLElement | null = null;
let currentAnim = '';
let currentDuration = '800ms';
let currentEasing: string = EASING_PRESETS[0];

/** Tracks elements that have been overridden with data-anim attributes. */
const appliedElements = new Set<HTMLElement>();
let showOverlays = false;
let multiSelect = false;
const multiSelectedEls = new Set<HTMLElement>();

// ── Import animation data from data-anim source ─────────────────
import { getKeyframesCSS, animationMap } from '../../../src/animations/index';
import { easings as easingValues } from '../../../src/core/config';

// ── Keyframes injection ──────────────────────────────────────────
let keyframesInjected = false;
function ensureKeyframes(): void {
  if (keyframesInjected) return;
  keyframesInjected = true;

  const s = document.createElement('style');
  s.id = 'da-inspector-keyframes';
  s.textContent = getKeyframesCSS();
  document.head.appendChild(s);
}

// ── CSS for the inspector UI ───────────────────────────────────────
function injectStyles(): void {
  const s = document.createElement('style');
  s.id = 'da-inspector-styles';
  s.textContent = `
    .da-inspector-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483646;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: #18181b;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.3);
      transition: transform .15s, background .15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .da-inspector-toggle:hover { transform: scale(1.1); }
    .da-inspector-toggle[data-active="true"] { background: #2563eb; }

    .da-inspector-highlight {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px solid #2563eb;
      border-radius: 4px;
      background: rgba(37,99,235,.08);
      transition: all .1s;
    }

    .da-inspector-selected {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px solid #f59e0b;
      border-radius: 4px;
      background: rgba(245,158,11,.08);
    }

    .da-inspector-multi-box {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px solid #10b981;
      border-radius: 4px;
      background: rgba(16,185,129,.08);
    }

    .da-inspector-applied-badge {
      position: absolute;
      top: -8px;
      left: -4px;
      z-index: 2147483645;
      padding: 1px 6px;
      background: #818cf8;
      color: #fff;
      font-size: 10px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      border-radius: 4px;
      pointer-events: none;
      white-space: nowrap;
      line-height: 1.4;
    }

    .da-inspector-applied-outline {
      position: fixed;
      z-index: 2147483644;
      pointer-events: none;
      border: 2px dashed #818cf8;
      border-radius: 4px;
      background: rgba(129,140,248,.06);
    }

    .da-inspector-panel {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      width: 320px;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: #18181b;
      user-select: none;
    }

    .da-inspector-panel * { box-sizing: border-box; }

    .da-inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e4e4e7;
      font-weight: 600;
      font-size: 14px;
    }

    .da-inspector-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .da-inspector-logo:hover { opacity: 0.8; }
    .da-inspector-logo svg { flex-shrink: 0; }

    .da-inspector-close {
      border: none;
      background: none;
      font-size: 18px;
      cursor: pointer;
      color: #52525b;
      padding: 0 4px;
      line-height: 1;
    }
    .da-inspector-close:hover { color: #18181b; }

    .da-inspector-topbar {
      display: flex;
      gap: 8px;
      padding: 8px 16px;
      border-bottom: 1px solid #e4e4e7;
    }

    .da-inspector-topbar .da-inspector-replay {
      flex: 1;
    }

    .da-inspector-icon-btn {
      position: relative;
      width: 34px;
      padding: 6px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      background: #fafafa;
      cursor: pointer;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #52525b;
    }
    .da-inspector-icon-btn:hover { background: #f0f0ff; border-color: #818cf8; color: #818cf8; }
    .da-inspector-btn-active {
      background: #ede9fe;
      border-color: #818cf8;
      color: #818cf8;
    }
    .da-inspector-btn-disabled {
      opacity: 0.4;
      cursor: default;
    }
    .da-inspector-btn-disabled:hover { background: #fafafa; border-color: #e4e4e7; color: #52525b; }

    .da-inspector-icon-btn[data-tooltip]:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      padding: 3px 8px;
      background: #18181b;
      color: #fff;
      font-size: 11px;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
    }

    .da-inspector-multi-info {
      padding: 6px 16px;
      font-size: 12px;
      color: #10b981;
      border-bottom: 1px solid #e4e4e7;
    }

    .da-inspector-hint {
      padding: 16px;
      color: #52525b;
      text-align: center;
      line-height: 1.5;
    }

    .da-inspector-preview {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e4e4e7;
      min-height: 80px;
      position: relative;
      overflow: hidden;
      background: #fafafa;
    }

    .da-inspector-preview-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #818cf8, #c084fc);
    }

    .da-inspector-preview-label {
      position: absolute;
      bottom: 6px;
      right: 12px;
      font-size: 11px;
      color: #52525b;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    .da-inspector-section { padding: 8px 16px; }

    .da-inspector-section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #52525b;
      margin-bottom: 6px;
    }

    .da-inspector-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .da-inspector-anim-btn {
      padding: 4px 8px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      background: #fafafa;
      font-size: 12px;
      cursor: pointer;
      transition: all .1s;
      color: #18181b;
      line-height: 1.4;
      font-family: inherit;
    }
    .da-inspector-anim-btn:hover { background: #f0f0ff; border-color: #2563eb; }
    .da-inspector-anim-btn[data-selected="true"] {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }

    .da-inspector-controls {
      padding: 8px 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #e4e4e7;
    }

    .da-inspector-control {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .da-inspector-control label {
      font-size: 12px;
      font-weight: 500;
      min-width: 56px;
      color: #52525b;
    }

    .da-inspector-control select,
    .da-inspector-control input {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      font-size: 12px;
      background: #fafafa;
      color: #18181b;
      font-family: inherit;
    }

    .da-inspector-replay {
      width: 100%;
      padding: 6px;
      border: 1px solid #e4e4e7;
      border-radius: 6px;
      background: #fafafa;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      color: #18181b;
    }
    .da-inspector-replay:hover { background: #f0f0ff; border-color: #2563eb; }

    .da-inspector-unapply {
      width: 100%;
      padding: 6px;
      border: 1px solid #fecaca;
      border-radius: 6px;
      background: #fef2f2;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
      color: #dc2626;
    }
    .da-inspector-unapply:hover:not(:disabled) { background: #fee2e2; border-color: #dc2626; }
    .da-inspector-unapply:disabled { opacity: 0.5; cursor: default; background: #fafafa; border-color: #e4e4e7; color: #a1a1aa; }

    .da-inspector-code {
      padding: 8px 16px 16px;
      border-top: 1px solid #e4e4e7;
    }

    .da-inspector-code-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #52525b;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .da-inspector-copy {
      font-size: 11px;
      border: none;
      background: none;
      color: #2563eb;
      cursor: pointer;
      font-family: inherit;
      text-transform: none;
      letter-spacing: 0;
      font-weight: 500;
    }
    .da-inspector-copy:hover { text-decoration: underline; }

    .da-inspector-code pre {
      margin: 0;
      padding: 8px;
      background: #f4f4f5;
      border-radius: 6px;
      font-size: 11px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.5;
      color: #18181b;
    }


    .da-inspector-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-top: 1px solid #e4e4e7;
    }
    .da-inspector-footer a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #71717a;
      text-decoration: none;
    }
    .da-inspector-footer a:hover { color: #18181b; }
    .da-inspector-footer svg { flex-shrink: 0; }

    @media (max-width: 400px) {
      .da-inspector-panel { width: calc(100vw - 32px); right: 16px; }
    }
  `;
  document.head.appendChild(s);
}

// ── Highlight helpers ──────────────────────────────────────────────
let highlightBox: HTMLElement | null = null;
let selectedBox: HTMLElement | null = null;

function positionBox(box: HTMLElement, target: HTMLElement): void {
  const r = target.getBoundingClientRect();
  box.style.left = r.left - 2 + 'px';
  box.style.top = r.top - 2 + 'px';
  box.style.width = r.width + 4 + 'px';
  box.style.height = r.height + 4 + 'px';
}

function showHighlight(el: HTMLElement): void {
  if (!highlightBox) {
    highlightBox = document.createElement('div');
    highlightBox.className = 'da-inspector-highlight';
    document.body.appendChild(highlightBox);
  }
  positionBox(highlightBox, el);
  highlightBox.style.display = 'block';
}

function hideHighlight(): void {
  if (highlightBox) highlightBox.style.display = 'none';
}

function showSelected(el: HTMLElement): void {
  if (!selectedBox) {
    selectedBox = document.createElement('div');
    selectedBox.className = 'da-inspector-selected';
    document.body.appendChild(selectedBox);
  }
  positionBox(selectedBox, el);
  selectedBox.style.display = 'block';
}

function hideSelected(): void {
  if (selectedBox) selectedBox.style.display = 'none';
}

// ── Multi-select boxes ────────────────────────────────────────────
const multiBoxes = new Map<HTMLElement, HTMLElement>();

function refreshMultiBoxes(): void {
  // Remove boxes for deselected elements
  for (const [el, box] of multiBoxes) {
    if (!multiSelectedEls.has(el)) {
      box.remove();
      multiBoxes.delete(el);
    }
  }
  for (const el of multiSelectedEls) {
    let box = multiBoxes.get(el);
    if (!box) {
      box = document.createElement('div');
      box.className = 'da-inspector-multi-box';
      document.body.appendChild(box);
      multiBoxes.set(el, box);
    }
    positionBox(box, el);
  }
}

function clearMultiBoxes(): void {
  for (const [, box] of multiBoxes) box.remove();
  multiBoxes.clear();
}

// ── Applied element overlays ──────────────────────────────────────
const appliedOverlays = new Map<HTMLElement, HTMLElement>();

function refreshAppliedOverlays(): void {
  // Remove overlays for elements no longer in the set
  for (const [el, overlay] of appliedOverlays) {
    if (!appliedElements.has(el)) {
      overlay.remove();
      appliedOverlays.delete(el);
    }
  }

  // Create or update overlays for applied elements
  for (const el of appliedElements) {
    let overlay = appliedOverlays.get(el);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'da-inspector-applied-outline';
      document.body.appendChild(overlay);
      appliedOverlays.set(el, overlay);
    }

    overlay.style.display = showOverlays ? 'block' : 'none';

    const r = el.getBoundingClientRect();
    overlay.style.left = r.left - 2 + 'px';
    overlay.style.top = r.top - 2 + 'px';
    overlay.style.width = r.width + 4 + 'px';
    overlay.style.height = r.height + 4 + 'px';

    const animName = el.getAttribute('data-anim') || '';
    let badge = overlay.querySelector('.da-inspector-applied-badge') as HTMLElement | null;
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'da-inspector-applied-badge';
      overlay.appendChild(badge);
    }
    badge.textContent = animName;
  }
}

function clearAppliedOverlays(): void {
  for (const [, overlay] of appliedOverlays) overlay.remove();
  appliedOverlays.clear();
}

// ── Element tag description ────────────────────────────────────────
function describeEl(el: HTMLElement): string {
  let s = el.tagName.toLowerCase();
  if (el.id) s += `#${el.id}`;
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.split(/\s+/).filter((c) => !c.startsWith('da-inspector'));
    if (classes.length) s += '.' + classes.slice(0, 2).join('.');
  }
  return s;
}

// ── Apply animation attributes to element ─────────────────────────
// Sets data-anim attributes and lets the data-anim runtime (loaded
// via CDN) handle the actual animation through its MutationObserver.
function applyToElement(el: HTMLElement, animName: string): void {
  ensureKeyframes();
  el.setAttribute('data-anim', animName);
  el.setAttribute('data-anim-duration', currentDuration);
  if (currentEasing !== 'ease') {
    el.setAttribute('data-anim-easing', currentEasing);
  } else {
    el.removeAttribute('data-anim-easing');
  }
  appliedElements.add(el);

  replayElement(el);
  refreshAppliedOverlays();
}

/** Remove data-anim attributes from an element. */
function unapplyElement(el: HTMLElement): void {
  el.removeAttribute('data-anim');
  el.removeAttribute('data-anim-duration');
  el.removeAttribute('data-anim-easing');
  el.style.animation = '';
  appliedElements.delete(el);
  refreshAppliedOverlays();
}

/** Replay animation on a single element by directly setting style.animation. */
function replayElement(el: HTMLElement): void {
  const animName = el.getAttribute('data-anim');
  if (!animName) return;
  ensureKeyframes();

  const dur = el.getAttribute('data-anim-duration') || '800ms';
  const easingName = el.getAttribute('data-anim-easing') || 'ease';
  const easingVal = easingValues[easingName] || easingName;

  // Reset and re-apply animation
  // data-anim's anti-FOUC CSS applies `[data-anim]{opacity:0}`.
  // For animations with initialStyle (fade, slide, etc.), we set the
  // initial styles so `fill: both` can transition from them.
  // For animations without initialStyle (bounce, attention, etc.),
  // we override opacity to 1 so the element stays visible.
  const def = animationMap.get(animName);
  el.style.animation = 'none';
  el.style.transform = '';
  el.style.filter = '';
  el.style.clipPath = '';
  if (def?.initialStyle) {
    def.initialStyle.split(';').forEach((rule) => {
      const [prop, val] = rule.split(':');
      if (prop && val) el.style.setProperty(prop.trim(), val.trim());
    });
  } else {
    el.style.opacity = '1';
  }
  void el.offsetWidth; // force reflow
  el.style.animation = `da-${animName} ${dur} ${easingVal} 0s 1 both`;
}

/** Replay all applied animations across the page. */
function replayAll(): void {
  appliedElements.forEach((el) => replayElement(el));
}

// ── Generate code snippet ──────────────────────────────────────────
function generateCode(): string {
  if (!currentAnim) return '';
  let attrs = `data-anim="${currentAnim}"`;
  if (currentDuration !== '800ms') attrs += ` data-anim-duration="${currentDuration}"`;
  if (currentEasing !== 'ease') attrs += ` data-anim-easing="${currentEasing}"`;
  return attrs;
}

// ── Panel UI ───────────────────────────────────────────────────────
function renderPanel(): void {
  if (!panel) return;

  const eyeIcon = showOverlays
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  const trashIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';

  const topbarHtml = `
    <div class="da-inspector-header">
      <a class="da-inspector-logo" href="https://ryo-manba.github.io/data-anim/" target="_blank" rel="noopener"><svg width="20" height="20" viewBox="0 0 32 32"><defs><linearGradient id="da-logo-g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient><linearGradient id="da-logo-g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#f472b6"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="#0a0a1f"/><rect x="9" y="9" width="14" height="14" rx="4" fill="url(#da-logo-g2)" opacity="0.15" transform="translate(4,-3)"/><rect x="9" y="9" width="14" height="14" rx="4" fill="url(#da-logo-g1)" opacity="0.4" transform="translate(2,-1.5)"/><rect x="9" y="9" width="14" height="14" rx="4" fill="url(#da-logo-g1)"/></svg><span>data-anim Inspector</span></a>
      <button class="da-inspector-close" title="Close">&times;</button>
    </div>
    <div class="da-inspector-topbar">
      <button class="da-inspector-replay" ${appliedElements.size === 0 ? 'disabled' : ''}>Replay All (${appliedElements.size})</button>
      <button class="da-inspector-icon-btn da-inspector-multi-toggle ${multiSelect ? 'da-inspector-btn-active' : ''}" data-tooltip="Multi-select">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
      </button>
      <button class="da-inspector-icon-btn da-inspector-clear-all ${appliedElements.size === 0 ? 'da-inspector-btn-disabled' : ''}" data-tooltip="Clear all" ${appliedElements.size === 0 ? 'disabled' : ''}>${trashIcon}</button>
      <button class="da-inspector-icon-btn da-inspector-overlay-toggle ${showOverlays ? 'da-inspector-btn-active' : ''}" data-tooltip="${showOverlays ? 'Hide overlays' : 'Show overlays'}">${eyeIcon}</button>
    </div>
  `;

  const footerHtml = `
    <div class="da-inspector-footer">
      <a href="https://github.com/ryo-manba/data-anim" target="_blank" rel="noopener">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>
    </div>
  `;

  if (!selectedEl) {
    panel.innerHTML = `
      ${topbarHtml}
      <div class="da-inspector-hint">
        Click any element on the page<br>to select it and try animations.
      </div>
      ${footerHtml}
    `;
    panel.querySelector('.da-inspector-close')!.addEventListener('click', deactivate);
    const replayBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-replay');
    if (replayBtn) replayBtn.addEventListener('click', (e) => { e.stopPropagation(); replayAll(); });
    const overlayToggle = panel.querySelector<HTMLButtonElement>('.da-inspector-overlay-toggle');
    if (overlayToggle) overlayToggle.addEventListener('click', (e) => { e.stopPropagation(); showOverlays = !showOverlays; refreshAppliedOverlays(); renderPanel(); });
    const multiToggle = panel.querySelector<HTMLButtonElement>('.da-inspector-multi-toggle');
    if (multiToggle) multiToggle.addEventListener('click', (e) => { e.stopPropagation(); multiSelect = !multiSelect; if (!multiSelect) { multiSelectedEls.clear(); clearMultiBoxes(); } renderPanel(); });
    const clearAllBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-clear-all');
    if (clearAllBtn) clearAllBtn.addEventListener('click', (e) => { e.stopPropagation(); for (const el of [...appliedElements]) unapplyElement(el); currentAnim = ''; renderPanel(); });
    return;
  }

  const code = generateCode();

  let html = `
    ${topbarHtml}
    ${multiSelect ? `<div class="da-inspector-multi-info">${multiSelectedEls.size} elements selected</div>` : ''}
    <div class="da-inspector-preview">
      <div class="da-inspector-preview-box"></div>
      <span class="da-inspector-preview-label">hover to preview</span>
    </div>
  `;

  for (const cat of categories) {
    html += `
      <div class="da-inspector-section">
        <div class="da-inspector-section-title">${cat.label}</div>
        <div class="da-inspector-grid">
          ${cat.names
            .map(
              (n) =>
                `<button class="da-inspector-anim-btn" data-anim-name="${n}" data-selected="${n === currentAnim}">${n}</button>`,
            )
            .join('')}
        </div>
      </div>
    `;
  }

  html += `
    <div class="da-inspector-controls">
      <div class="da-inspector-control">
        <label>Duration</label>
        <select class="da-inspector-dur">
          ${['400ms', '600ms', '800ms', '1000ms', '1200ms', '1600ms', '2000ms']
            .map((d) => `<option value="${d}" ${d === currentDuration ? 'selected' : ''}>${d}</option>`)
            .join('')}
        </select>
      </div>
      <div class="da-inspector-control">
        <label>Easing</label>
        <select class="da-inspector-ease">
          ${EASING_PRESETS.map(
            (e) => `<option value="${e}" ${e === currentEasing ? 'selected' : ''}>${e}</option>`,
          ).join('')}
        </select>
      </div>
      <button class="da-inspector-unapply" ${!appliedElements.has(selectedEl) ? 'disabled' : ''}>Remove from this element</button>
    </div>
  `;

  html += `
    <div class="da-inspector-code">
      <div class="da-inspector-code-title">
        <span>HTML Attributes</span>
        <button class="da-inspector-copy" ${!code ? 'disabled' : ''}>Copy</button>
      </div>
      <pre>${code ? escapeHtml(code) : '<span style="color:#71717a">Select an animation</span>'}</pre>
    </div>
    ${footerHtml}
  `;

  panel.innerHTML = html;

  panel.querySelector('.da-inspector-close')!.addEventListener('click', deactivate);

  const previewBox = panel.querySelector<HTMLElement>('.da-inspector-preview-box');
  const previewLabel = panel.querySelector<HTMLElement>('.da-inspector-preview-label');

  panel.querySelectorAll<HTMLButtonElement>('.da-inspector-anim-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.animName!;
      currentAnim = name;
      if (multiSelect && multiSelectedEls.size > 0) {
        multiSelectedEls.forEach((el) => applyToElement(el, name));
      } else if (selectedEl) {
        applyToElement(selectedEl, name);
      }
      renderPanel();
    });

    btn.addEventListener('mouseenter', () => {
      if (!previewBox) return;
      // Use inline preview keyframes for the panel preview box
      ensureKeyframes();
      const name = btn.dataset.animName!;
      previewBox.style.animation = 'none';
      void previewBox.offsetWidth;
      const easingVal = easingValues[currentEasing] || currentEasing;
      previewBox.style.animation = `da-${name} ${currentDuration} ${easingVal} 0s 1 both`;
      if (previewLabel) previewLabel.textContent = name;
    });
  });

  const durSelect = panel.querySelector<HTMLSelectElement>('.da-inspector-dur');
  if (durSelect) {
    durSelect.addEventListener('change', () => {
      currentDuration = durSelect.value;
      renderPanel();
    });
  }

  const easeSelect = panel.querySelector<HTMLSelectElement>('.da-inspector-ease');
  if (easeSelect) {
    easeSelect.addEventListener('change', () => {
      currentEasing = easeSelect.value;
      renderPanel();
    });
  }

  const replayBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-replay');
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      replayAll();
    });
  }

  const overlayToggle = panel.querySelector<HTMLButtonElement>('.da-inspector-overlay-toggle');
  if (overlayToggle) {
    overlayToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      showOverlays = !showOverlays;
      refreshAppliedOverlays();
      renderPanel();
    });
  }

  const multiToggle = panel.querySelector<HTMLButtonElement>('.da-inspector-multi-toggle');
  if (multiToggle) {
    multiToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      multiSelect = !multiSelect;
      if (!multiSelect) {
        multiSelectedEls.clear();
        clearMultiBoxes();
      }
      renderPanel();
    });
  }

  const clearAllBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-clear-all');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      for (const el of [...appliedElements]) unapplyElement(el);
      currentAnim = '';
      renderPanel();
    });
  }

  const unapplyBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-unapply');
  if (unapplyBtn) {
    unapplyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selectedEl) {
        unapplyElement(selectedEl);
        currentAnim = '';
        renderPanel();
      }
    });
  }

  const copyBtn = panel.querySelector<HTMLButtonElement>('.da-inspector-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 1500);
      });
    });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Inspector interaction handlers ─────────────────────────────────
function isInspectorElement(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  return !!(
    el.closest('.da-inspector-panel') ||
    el.closest('.da-inspector-toggle') ||
    el.classList.contains('da-inspector-highlight') ||
    el.classList.contains('da-inspector-selected')
  );
}

function onMouseMove(e: MouseEvent): void {
  if (isInspectorElement(e.target)) {
    hideHighlight();
    return;
  }
  const el = e.target as HTMLElement;
  if (el === hoveredEl) return;
  hoveredEl = el;
  showHighlight(el);
}

function onClick(e: MouseEvent): void {
  if (isInspectorElement(e.target)) return;
  e.preventDefault();
  e.stopPropagation();

  const el = e.target as HTMLElement;

  if (multiSelect) {
    if (multiSelectedEls.has(el)) {
      multiSelectedEls.delete(el);
    } else {
      multiSelectedEls.add(el);
    }
    selectedEl = el;
    refreshMultiBoxes();
    renderPanel();
    return;
  }

  if (selectedEl === el) {
    selectedEl = null;
    currentAnim = '';
    hideSelected();
    renderPanel();
    return;
  }

  selectedEl = el;
  currentAnim = el.getAttribute('data-anim') || '';
  currentDuration = el.getAttribute('data-anim-duration') || '800ms';
  currentEasing = el.getAttribute('data-anim-easing') || EASING_PRESETS[0];
  hideHighlight();
  showSelected(el);
  renderPanel();
}

function onScroll(): void {
  if (selectedEl) showSelected(selectedEl);
  refreshAppliedOverlays();
  if (multiSelect) refreshMultiBoxes();
}

// ── Activate / Deactivate ──────────────────────────────────────────
export function activate(): void {
  if (active) return;
  active = true;
  if (!document.getElementById('da-inspector-styles')) injectStyles();
  if (toggleBtn) toggleBtn.dataset.active = 'true';

  panel = document.createElement('div');
  panel.className = 'da-inspector-panel';
  document.body.appendChild(panel);
  renderPanel();

  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  window.addEventListener('scroll', onScroll, true);
}

export function deactivate(): void {
  if (!active) return;
  active = false;
  selectedEl = null;
  hoveredEl = null;
  currentAnim = '';
  multiSelect = false;
  multiSelectedEls.clear();
  clearMultiBoxes();
  if (toggleBtn) toggleBtn.dataset.active = 'false';

  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('click', onClick, true);
  window.removeEventListener('scroll', onScroll, true);

  if (panel) {
    panel.remove();
    panel = null;
  }
  hideHighlight();
  hideSelected();
}

/** Full cleanup — remove all injected DOM and styles. */
export function destroy(): void {
  deactivate();
  if (toggleBtn) {
    toggleBtn.remove();
    toggleBtn = null;
  }
  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }
  if (selectedBox) {
    selectedBox.remove();
    selectedBox = null;
  }
  document.getElementById('da-inspector-styles')?.remove();
  document.getElementById('da-inspector-keyframes')?.remove();
  keyframesInjected = false;
  appliedElements.forEach((el) => unapplyElement(el));
  appliedElements.clear();
  clearAppliedOverlays();
}

export function isActive(): boolean {
  return active;
}

// ── Bootstrap (script-tag mode) ────────────────────────────────────
function bootstrap(): void {
  injectStyles();

  toggleBtn = document.createElement('button');
  toggleBtn.className = 'da-inspector-toggle';
  toggleBtn.dataset.active = 'false';
  toggleBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  toggleBtn.title = 'data-anim Inspector';
  toggleBtn.addEventListener('click', () => {
    if (active) deactivate();
    else activate();
  });
  document.body.appendChild(toggleBtn);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
