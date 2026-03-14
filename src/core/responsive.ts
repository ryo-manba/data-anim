import { getConfig } from './config';

let dt: ReturnType<typeof setTimeout>;

export const getDevice = (): string => {
  const w = window.innerWidth,
    b = getConfig().breakpoints;
  return w < b.mobile ? 'mobile' : w < b.tablet ? 'tablet' : 'desktop';
};

export const isDisabled = (el: HTMLElement): boolean => {
  const d = el.getAttribute('data-anim-disable');
  if (!d) return false;
  if (d === getDevice()) return true;
  const p = parseInt(d);
  return !isNaN(p) && window.innerWidth < p;
};

export const getMobileAnim = (el: HTMLElement): string | null =>
  getDevice() === 'mobile' ? el.getAttribute('data-anim-mobile') : null;

export const onResize = (cb: () => void): void => {
  window.addEventListener('resize', () => {
    clearTimeout(dt);
    dt = setTimeout(cb, 250);
  });
};
