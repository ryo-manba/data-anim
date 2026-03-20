/**
 * All available animation names in data-anim.
 * This const array is the single source of truth — the type is derived from it.
 */
export const ANIMATION_NAMES = [
  'fadeIn',
  'fadeOut',
  'fadeInUp',
  'fadeInDown',
  'fadeInLeft',
  'fadeInRight',
  'slideInUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'zoomIn',
  'zoomOut',
  'zoomInUp',
  'zoomInDown',
  'bounce',
  'bounceIn',
  'bounceInUp',
  'bounceInDown',
  'shake',
  'pulse',
  'wobble',
  'flip',
  'swing',
  'rubberBand',
  'rotateIn',
  'rotateInDownLeft',
  'rotateInDownRight',
  'blur',
  'clipReveal',
  'typewriter',
] as const;

export type DataAnimName = (typeof ANIMATION_NAMES)[number];

/**
 * Trigger types for data-anim animations.
 */
export const TRIGGER_TYPES = ['scroll', 'load', 'click', 'hover'] as const;
export type DataAnimTrigger = (typeof TRIGGER_TYPES)[number];

/**
 * Easing function presets.
 */
export const EASING_PRESETS = ['ease', 'ease-out-expo', 'ease-out-back', 'spring'] as const;
export type DataAnimEasing = (typeof EASING_PRESETS)[number] | (string & {});

/**
 * Stagger direction options.
 */
export const STAGGER_DIRECTIONS = ['start', 'end', 'center', 'edges'] as const;
export type DataAnimStaggerFrom = (typeof STAGGER_DIRECTIONS)[number];

/**
 * Device targets for disabling animations.
 */
export const DISABLE_TARGETS = ['mobile', 'tablet', 'desktop'] as const;
export type DataAnimDisable = (typeof DISABLE_TARGETS)[number] | (string & {});

/**
 * data-anim HTML attributes for animation control.
 */
export interface DataAnimAttributes {
  /** Animation name to apply */
  'data-anim'?: DataAnimName | (string & {});
  /** Trigger event: scroll (default), load, click, hover */
  'data-anim-trigger'?: DataAnimTrigger;
  /** Animation duration (e.g., "800ms", "1.2s") */
  'data-anim-duration'?: string;
  /** Delay before animation (e.g., "200ms", "200") */
  'data-anim-delay'?: string;
  /** Easing function */
  'data-anim-easing'?: DataAnimEasing;
  /** IntersectionObserver threshold (0-1, default: 0.2) */
  'data-anim-offset'?: string;
  /** Translation distance (e.g., "30px", "50px") */
  'data-anim-distance'?: string;
  /** CSS animation fill-mode (default: "both") */
  'data-anim-fill'?: string;
  /** Animation iteration count (default: 1) */
  'data-anim-iteration'?: string;
  /** Play animation only once */
  'data-anim-once'?: string | boolean;
  /** Reverse animation on scroll out */
  'data-anim-mirror'?: string | boolean;
  /** Delay between child animations in ms (e.g., "100") */
  'data-anim-stagger'?: string;
  /** Stagger direction */
  'data-anim-stagger-from'?: DataAnimStaggerFrom;
  /** Disable animation on specific devices */
  'data-anim-disable'?: DataAnimDisable;
  /** Alternative animation for mobile */
  'data-anim-mobile'?: DataAnimName | (string & {});
}

// React JSX support
declare global {
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface HTMLAttributes<T> extends DataAnimAttributes {}
  }
}

