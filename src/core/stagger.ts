export function applyStagger(el: HTMLElement): void {
  const v = el.getAttribute('data-anim-stagger');
  if (!v) return;
  const delay = parseInt(v) || 100,
    from = el.getAttribute('data-anim-stagger-from') || 'start';
  const ch = Array.from(el.querySelectorAll<HTMLElement>('[data-anim]')),
    n = ch.length,
    mid = (n - 1) / 2;
  ch.forEach((c, i) => {
    const idx =
      from === 'end'
        ? n - 1 - i
        : from === 'center'
          ? Math.abs(i - mid)
          : from === 'edges'
            ? mid - Math.abs(i - mid)
            : i;
    c.style.animationDelay = `${(parseInt(c.getAttribute('data-anim-delay') || '0') || 0) + idx * delay}ms`;
  });
}
