import { initElement } from './init';

export function startMutationObserver(): void {
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(nd => {
    if (nd.nodeType !== 1) return;
    const e = nd as HTMLElement;
    if (e.hasAttribute('data-anim')) initElement(e);
    e.querySelectorAll?.('[data-anim]').forEach(c => initElement(c as HTMLElement));
  }))).observe(document.body, { childList: true, subtree: true });
}
