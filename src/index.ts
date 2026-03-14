import { injectAntifouc, init } from './core/init';
import './attributes';

export {
  ANIMATION_NAMES,
  TRIGGER_TYPES,
  EASING_PRESETS,
  STAGGER_DIRECTIONS,
  DISABLE_TARGETS,
} from './attributes';
export type {
  DataAnimName,
  DataAnimTrigger,
  DataAnimEasing,
  DataAnimStaggerFrom,
  DataAnimDisable,
  DataAnimAttributes,
} from './attributes';

// Layer 1: Inject anti-FOUC styles immediately (before DOM ready)
injectAntifouc();

// Initialize when ready
init();
