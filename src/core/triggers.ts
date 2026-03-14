import { createObserver, playAnimation, resetAnimation } from './observer';
import type { DataAnimElement } from '../types';

export function setupTrigger(el: DataAnimElement): void {
  const t = el.getAttribute('data-anim-trigger') || 'scroll';
  if (t === 'load') {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', () => playAnimation(el), {
        once: true,
      });
    else playAnimation(el);
  } else if (t === 'click') {
    el.addEventListener('click', () => {
      el.style.animation = 'none';
      void el.offsetWidth;
      playAnimation(el);
    });
  } else if (t === 'hover') {
    let animating = false;
    el.addEventListener('mouseenter', () => {
      if (animating) return;
      animating = true;
      el.style.animation = 'none';
      void el.offsetWidth;
      playAnimation(el, true);
      el.addEventListener(
        'animationend',
        () => {
          animating = false;
          if (!el.matches(':hover')) resetAnimation(el, true);
        },
        { once: true },
      );
    });
    el.addEventListener('mouseleave', () => {
      if (!animating) resetAnimation(el, true);
    });
    el.addEventListener('focus', () => {
      if (el.matches(':focus-visible') && !animating) {
        animating = true;
        el.style.animation = 'none';
        void el.offsetWidth;
        playAnimation(el, true);
        el.addEventListener(
          'animationend',
          () => {
            animating = false;
            if (!el.matches(':focus-visible')) resetAnimation(el, true);
          },
          { once: true },
        );
      }
    });
    el.addEventListener('blur', () => {
      if (!animating) resetAnimation(el, true);
    });
  } else {
    createObserver(el);
  }
}
