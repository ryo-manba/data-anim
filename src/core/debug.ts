import { getConfig } from './config';

export function debugLog(msg: string, el?: Element): void {
  if (getConfig().debug) console.log('[da]', msg, el || '');
}

export function debugOutline(el: HTMLElement): void {
  if (getConfig().debug) el.style.outline = '2px dashed red';
}
