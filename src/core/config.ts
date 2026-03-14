import type { DataAnimConfig } from '../types';

export const DEFAULTS: DataAnimConfig = {
  offset: .2, duration: 1600,
  easing: 'cubic-bezier(0.25,0.1,0.25,1)',
  once: false, debug: false,
  breakpoints: { mobile: 768, tablet: 1024 },
};

export const easings: Record<string, string> = {
  ease: DEFAULTS.easing,
  'ease-out-expo': 'cubic-bezier(0.16,1,0.3,1)',
  'ease-out-back': 'cubic-bezier(0.34,1.56,0.64,1)',
  spring: 'cubic-bezier(0.175,0.885,0.32,1.275)',
};

export const getConfig = (): DataAnimConfig => ({ ...DEFAULTS, ...window.__dataAnim });
