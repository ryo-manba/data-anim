import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { activate, deactivate, destroy, isActive, onDestroy } from '../../plugins/inspector/src/inspector';

afterEach(() => {
  destroy();
});

describe('activate / deactivate', () => {
  it('isActive returns false by default', () => {
    expect(isActive()).toBe(false);
  });

  it('activate creates the panel and injects styles', () => {
    activate();
    expect(isActive()).toBe(true);
    expect(document.querySelector('.da-inspector-panel')).not.toBeNull();
    expect(document.getElementById('da-inspector-styles')).not.toBeNull();
  });

  it('activate is idempotent — calling twice does not create two panels', () => {
    activate();
    activate();
    expect(document.querySelectorAll('.da-inspector-panel').length).toBe(1);
  });

  it('deactivate removes the panel', () => {
    activate();
    deactivate();
    expect(isActive()).toBe(false);
    expect(document.querySelector('.da-inspector-panel')).toBeNull();
  });
});

describe('panel content', () => {
  it('shows hint text when no element is selected', () => {
    activate();
    const panel = document.querySelector('.da-inspector-panel')!;
    expect(panel.querySelector('.da-inspector-hint')).not.toBeNull();
    expect(panel.textContent).toContain('Click any element');
  });

  it('renders header with logo link', () => {
    activate();
    const logo = document.querySelector('.da-inspector-logo') as HTMLAnchorElement;
    expect(logo).not.toBeNull();
    expect(logo.textContent).toContain('data-anim Inspector');
  });

  it('renders topbar with Replay All button in unselected state', () => {
    activate();
    const replayBtn = document.querySelector('.da-inspector-replay') as HTMLButtonElement;
    expect(replayBtn).not.toBeNull();
    expect(replayBtn.textContent).toContain('Replay All');
    expect(replayBtn.disabled).toBe(true);
  });

  it('renders topbar icon buttons in unselected state', () => {
    activate();
    expect(document.querySelector('.da-inspector-multi-toggle')).not.toBeNull();
    expect(document.querySelector('.da-inspector-clear-all')).not.toBeNull();
    expect(document.querySelector('.da-inspector-overlay-toggle')).not.toBeNull();
  });

  it('renders footer with GitHub link', () => {
    activate();
    const footer = document.querySelector('.da-inspector-footer');
    expect(footer).not.toBeNull();
    const link = footer!.querySelector('a') as HTMLAnchorElement;
    expect(link.href).toContain('github.com/ryo-manba/data-anim');
    expect(link.textContent).toContain('GitHub');
  });
});

describe('close button', () => {
  it('clicking close deactivates the inspector', () => {
    activate();
    const closeBtn = document.querySelector('.da-inspector-close') as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();
    closeBtn.click();
    expect(isActive()).toBe(false);
  });
});

describe('topbar buttons in unselected state', () => {
  it('overlay toggle changes active state on click', () => {
    activate();
    const btn = document.querySelector('.da-inspector-overlay-toggle') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    // Default is inactive (showOverlays = false)
    expect(btn.classList.contains('da-inspector-btn-active')).toBe(false);
    btn.click();
    // After click, should re-render with active state
    const btn2 = document.querySelector('.da-inspector-overlay-toggle') as HTMLButtonElement;
    expect(btn2.classList.contains('da-inspector-btn-active')).toBe(true);
  });

  it('multi-select toggle changes active state on click', () => {
    activate();
    const btn = document.querySelector('.da-inspector-multi-toggle') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.classList.contains('da-inspector-btn-active')).toBe(false);
    btn.click();
    const btn2 = document.querySelector('.da-inspector-multi-toggle') as HTMLButtonElement;
    expect(btn2.classList.contains('da-inspector-btn-active')).toBe(true);
  });
});

describe('element selection', () => {
  it('clicking a page element selects it and shows animation controls', () => {
    activate();
    const target = document.createElement('div');
    target.textContent = 'Test element';
    document.body.appendChild(target);

    // Simulate click on the target (inspector listens in capture phase)
    target.click();

    const panel = document.querySelector('.da-inspector-panel')!;
    // Should now show animation buttons instead of hint
    expect(panel.querySelector('.da-inspector-hint')).toBeNull();
    expect(panel.querySelector('.da-inspector-anim-btn')).not.toBeNull();

    target.remove();
  });

  it('shows animation categories (Fade, Slide, etc.)', () => {
    activate();
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.click();

    const sectionTitles = document.querySelectorAll('.da-inspector-section-title');
    const titles = Array.from(sectionTitles).map((el) => el.textContent);
    expect(titles).toContain('Fade');
    expect(titles).toContain('Slide');
    expect(titles).toContain('Bounce');

    target.remove();
  });

  it('clicking an animation button applies data-anim attribute to selected element', async () => {
    // Mock rAF to run callbacks synchronously
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 0; });

    activate();
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.click();

    const animBtn = document.querySelector('.da-inspector-anim-btn') as HTMLButtonElement;
    const animName = animBtn.dataset.animName!;
    animBtn.click();

    expect(target.getAttribute('data-anim')).toBe(animName);
    expect(target.getAttribute('data-anim-duration')).toBe('800ms');

    target.remove();
    vi.unstubAllGlobals();
  });
});

describe('destroy', () => {
  it('removes all injected DOM elements', () => {
    activate();
    destroy();
    expect(isActive()).toBe(false);
    expect(document.querySelector('.da-inspector-panel')).toBeNull();
    expect(document.getElementById('da-inspector-styles')).toBeNull();
    expect(document.getElementById('da-inspector-preview-keyframes')).toBeNull();
  });

  it('reopen after destroy creates exactly one panel', () => {
    activate();
    destroy();
    activate();
    expect(document.querySelectorAll('.da-inspector-panel').length).toBe(1);
  });

  it('fires onDestroy callback', () => {
    const cb = vi.fn();
    onDestroy(cb);
    activate();
    destroy();
    expect(cb).toHaveBeenCalledOnce();
    onDestroy(() => {}); // reset
  });
});

describe('minimize', () => {
  it('minimize button switches to minimized view', () => {
    activate();
    const minBtn = document.querySelector('.da-inspector-minimize') as HTMLButtonElement;
    expect(minBtn).not.toBeNull();
    minBtn.click();
    // Minimized view shows expand button and replay, no header
    expect(document.querySelector('.da-inspector-minimized')).not.toBeNull();
    expect(document.querySelector('.da-inspector-header')).toBeNull();
  });

  it('expand button restores full panel from minimized state', () => {
    activate();
    (document.querySelector('.da-inspector-minimize') as HTMLButtonElement).click();
    (document.querySelector('.da-inspector-expand') as HTMLButtonElement).click();
    expect(document.querySelector('.da-inspector-header')).not.toBeNull();
    expect(document.querySelector('.da-inspector-minimized')).toBeNull();
  });

  it('minimize works in selected-element state', () => {
    activate();
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.click();
    // Should have minimize button in selected state too
    const minBtn = document.querySelector('.da-inspector-minimize') as HTMLButtonElement;
    expect(minBtn).not.toBeNull();
    minBtn.click();
    expect(document.querySelector('.da-inspector-minimized')).not.toBeNull();
    target.remove();
  });
});

describe('drag handle', () => {
  it('renders drag handle in header', () => {
    activate();
    expect(document.querySelector('.da-inspector-drag-handle')).not.toBeNull();
  });

  it('renders drag handle in minimized state', () => {
    activate();
    (document.querySelector('.da-inspector-minimize') as HTMLButtonElement).click();
    expect(document.querySelector('.da-inspector-drag-handle')).not.toBeNull();
  });
});
