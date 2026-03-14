import { getKeyframesCSS } from '../animations/index';
import { setupTrigger } from './triggers';
import { applyStagger } from './stagger';
import { isDisabled, onResize } from './responsive';
import { startMutationObserver } from './mutation';
import { debugLog } from './debug';
import type { DataAnimElement } from '../types';

// Layer 1: Anti-FOUC
export function injectAntifouc(): void {
  const s = document.createElement('style');
  s.textContent = '[data-anim]:not([data-anim-trigger="hover"]):not([data-anim-trigger="click"]){opacity:0;will-change:transform,opacity}@media(prefers-reduced-motion:reduce){[data-anim]{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}}';
  (document.head || document.documentElement).appendChild(s);
}

let injected = false;
function injectKeyframes(): void {
  if (injected) return; injected = true;
  const s = document.createElement('style');
  s.textContent = getKeyframesCSS();
  document.head.appendChild(s);
}

export function initElement(el: HTMLElement): void {
  const d = el as DataAnimElement;
  if (d._daInit) return; d._daInit = true;
  if (isDisabled(el)) { el.style.opacity = '1'; return; }
  if (el.hasAttribute('data-anim-stagger')) applyStagger(el);
  // Above-fold fast reveal
  if ((el.getAttribute('data-anim-trigger') || 'scroll') === 'scroll' && el.getBoundingClientRect().top < window.innerHeight && !el.getAttribute('data-anim-duration'))
    el.setAttribute('data-anim-duration', '800');
  setupTrigger(d);
  debugLog('init:' + el.getAttribute('data-anim'), el);
}

export function init(): void {
  injectKeyframes();
  // Layer 2: noscript fallback (must use innerHTML — dynamic createElement makes noscript content active)
  const ns = document.createElement('div');
  ns.innerHTML = '<noscript><style>[data-anim]{opacity:1!important;transform:none!important}</style></noscript>';
  document.head.appendChild(ns.firstChild!);

  const run = () => {
    document.querySelectorAll<HTMLElement>('[data-anim]').forEach(initElement);
    startMutationObserver();
    // Layer 3: fallback timeout
    setTimeout(() => document.querySelectorAll<HTMLElement>('[data-anim]').forEach(el => {
      if (getComputedStyle(el).opacity === '0') { el.style.opacity = '1'; el.style.transform = 'none'; }
    }), 5e3);
    // Resize handler
    onResize(() => document.querySelectorAll<HTMLElement>('[data-anim]').forEach(el => {
      if (isDisabled(el)) { el.style.opacity = '1'; el.style.animation = 'none'; }
    }));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();
}
