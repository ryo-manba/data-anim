import { injectAntifouc, init } from './core/init';

// Layer 1: Inject anti-FOUC styles immediately (before DOM ready)
injectAntifouc();

// Initialize when ready
init();
