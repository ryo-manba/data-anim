import { DEFAULTS, easings } from './config';
import { animationMap } from '../animations/index';
import { isDisabled, getMobileAnim } from './responsive';
import type { DataAnimElement } from '../types';

const ms = (v: string) => (/^\d+$/.test(v) ? v + 'ms' : v);

export function playAnimation(el: DataAnimElement, isHover = false): void {
  if (isDisabled(el)) {
    el.style.opacity = '1';
    return;
  }
  const n = getMobileAnim(el) || el.getAttribute('data-anim') || '';
  if (!animationMap.has(n)) return;
  const dist = el.getAttribute('data-anim-distance');
  if (dist) el.style.setProperty('--da-distance', dist);
  const e = el.getAttribute('data-anim-easing') || 'ease';
  const dur = ms(el.getAttribute('data-anim-duration') || '' + DEFAULTS.duration);
  // For hover: use fill:none (don't apply from-state) + negative delay to skip initial opacity:0 frame
  const fill = isHover ? 'none' : el.getAttribute('data-anim-fill') || 'both';
  const delay = isHover ? '-100ms' : ms(el.getAttribute('data-anim-delay') || '0');
  el.style.animation = `da-${n} ${dur} ${easings[e] || e} ${delay} ${el.getAttribute('data-anim-iteration') || '1'} ${fill}`;
}

export function resetAnimation(el: DataAnimElement, forHover = false): void {
  el.style.animation = 'none';
  if (forHover) {
    // For hover: just clear animation so it can replay on next hover
    // Don't apply initial hidden styles — hover elements stay visible
    void el.offsetWidth; // force reflow
    return;
  }
  const s = animationMap.get(el.getAttribute('data-anim') || '');
  s?.initialStyle?.split(';').forEach((r) => {
    const [p, v] = r.split(':');
    if (p && v) el.style.setProperty(p.trim(), v.trim());
  });
}

export function createObserver(el: DataAnimElement): void {
  const th = parseFloat(el.getAttribute('data-anim-offset') || '') || DEFAULTS.offset;
  const once = el.hasAttribute('data-anim-once'),
    mirror = el.hasAttribute('data-anim-mirror');
  const o = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          playAnimation(el);
          if (once) o.unobserve(el);
        } else if (mirror && el._daInit) resetAnimation(el);
      });
      el._daInit = true;
    },
    { threshold: th },
  );
  el._daObs = o;
  o.observe(el);
}
