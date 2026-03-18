/**
 * data-anim Inspector Plugin
 *
 * Drop this script onto any website to interactively click elements
 * and apply data-anim animations. Works standalone — no other dependencies needed.
 *
 * Usage:
 *   <script src="data-anim-inspector.min.js"><\/script>
 */

import { allAnimations, getKeyframesCSS } from '../animations/index';
import { EASING_PRESETS } from '../attributes';
import { easings } from '../core/config';

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

// ── State ──────────────────────────────────────────────────────────
let active = false;
let selectedEl: HTMLElement | null = null;
let hoveredEl: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let toggleBtn: HTMLElement | null = null;
let currentAnim = '';
let currentDuration = '800ms';
let currentEasing: string = EASING_PRESETS[0];

// ── Keyframes injection ────────────────────────────────────────────
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

    .da-inspector-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483644;
      pointer-events: none;
    }

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

    .da-inspector-close {
      border: none;
      background: none;
      font-size: 18px;
      cursor: pointer;
      color: #71717a;
      padding: 0 4px;
      line-height: 1;
    }
    .da-inspector-close:hover { color: #18181b; }

    .da-inspector-hint {
      padding: 16px;
      color: #71717a;
      text-align: center;
      line-height: 1.5;
    }

    .da-inspector-section {
      padding: 8px 16px;
    }

    .da-inspector-section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a1a1aa;
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

    .da-inspector-code {
      padding: 8px 16px 16px;
      border-top: 1px solid #e4e4e7;
    }

    .da-inspector-code-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a1a1aa;
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

    .da-inspector-tag { padding: 12px 16px; border-top: 1px solid #e4e4e7; }
    .da-inspector-tag-name {
      font-size: 12px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      color: #2563eb;
      background: #eff6ff;
      padding: 2px 6px;
      border-radius: 4px;
    }

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

// ── Play animation on element ──────────────────────────────────────
function playOnElement(el: HTMLElement, animName: string): void {
  ensureKeyframes();
  const def = allAnimations.find((a) => a.name === animName);
  if (!def) return;

  // Save original styles to restore
  const origAnim = el.style.animation;
  const origOpacity = el.style.opacity;
  const origTransform = el.style.transform;
  const origFilter = el.style.filter;
  const origClipPath = el.style.clipPath;

  // Reset
  el.style.animation = 'none';
  void el.offsetWidth;

  const easingVal = easings[currentEasing] || currentEasing;
  el.style.animation = `da-${animName} ${currentDuration} ${easingVal} 0s 1 both`;

  const onEnd = () => {
    el.removeEventListener('animationend', onEnd);
    // Restore to original style after a beat
    setTimeout(() => {
      el.style.animation = origAnim;
      el.style.opacity = origOpacity;
      el.style.transform = origTransform;
      el.style.filter = origFilter;
      el.style.clipPath = origClipPath;
      if (selectedEl === el) showSelected(el);
    }, 600);
  };
  el.addEventListener('animationend', onEnd);
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

  if (!selectedEl) {
    panel.innerHTML = `
      <div class="da-inspector-header">
        <span>data-anim Inspector</span>
        <button class="da-inspector-close" title="Close">&times;</button>
      </div>
      <div class="da-inspector-hint">
        Click any element on the page<br>to select it and try animations.
      </div>
    `;
    panel.querySelector('.da-inspector-close')!.addEventListener('click', deactivate);
    return;
  }

  const tag = describeEl(selectedEl);
  const code = generateCode();

  let html = `
    <div class="da-inspector-header">
      <span>data-anim Inspector</span>
      <button class="da-inspector-close" title="Close">&times;</button>
    </div>
    <div class="da-inspector-tag">
      <span class="da-inspector-tag-name">&lt;${tag}&gt;</span>
    </div>
  `;

  // Animation categories
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

  // Controls
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
      <button class="da-inspector-replay" ${!currentAnim ? 'disabled' : ''}>Replay Animation</button>
    </div>
  `;

  // Code output
  if (code) {
    html += `
      <div class="da-inspector-code">
        <div class="da-inspector-code-title">
          <span>HTML Attributes</span>
          <button class="da-inspector-copy">Copy</button>
        </div>
        <pre>${escapeHtml(code)}</pre>
      </div>
    `;
  }

  panel.innerHTML = html;

  // Event listeners
  panel.querySelector('.da-inspector-close')!.addEventListener('click', deactivate);

  panel.querySelectorAll<HTMLButtonElement>('.da-inspector-anim-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.animName!;
      currentAnim = name;
      if (selectedEl) playOnElement(selectedEl, name);
      renderPanel();
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
      if (selectedEl && currentAnim) playOnElement(selectedEl, currentAnim);
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
  selectedEl = el;
  currentAnim = '';
  hideHighlight();
  showSelected(el);
  renderPanel();
}

function onScroll(): void {
  if (selectedEl) showSelected(selectedEl);
}

// ── Activate / Deactivate ──────────────────────────────────────────
function activate(): void {
  if (active) return;
  active = true;
  if (toggleBtn) toggleBtn.dataset.active = 'true';

  // Create panel
  panel = document.createElement('div');
  panel.className = 'da-inspector-panel';
  document.body.appendChild(panel);
  renderPanel();

  // Listen
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  window.addEventListener('scroll', onScroll, true);
}

function deactivate(): void {
  if (!active) return;
  active = false;
  selectedEl = null;
  hoveredEl = null;
  currentAnim = '';
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

// ── Bootstrap ──────────────────────────────────────────────────────
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
