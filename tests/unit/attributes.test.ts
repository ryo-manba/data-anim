import { describe, expect, it } from 'vitest';
import { allAnimations } from '../../src/animations/index';
import { easings } from '../../src/core/config';
import {
  ANIMATION_NAMES,
  TRIGGER_TYPES,
  EASING_PRESETS,
  STAGGER_DIRECTIONS,
  DISABLE_TARGETS,
} from '../../src/attributes';

/**
 * These tests verify that the const arrays in src/attributes.ts (which are
 * the single source of truth for both runtime values and TypeScript types)
 * stay in sync with the actual implementation.
 *
 * Adding a new animation/easing/trigger without updating the const array
 * will cause these tests to fail.
 */

describe('Type definitions match implementation', () => {
  describe('ANIMATION_NAMES vs allAnimations', () => {
    it('every implemented animation is listed in ANIMATION_NAMES', () => {
      for (const anim of allAnimations) {
        expect(
          ANIMATION_NAMES.includes(anim.name as (typeof ANIMATION_NAMES)[number]),
          `Animation "${anim.name}" is implemented but missing from ANIMATION_NAMES`,
        ).toBe(true);
      }
    });

    it('every entry in ANIMATION_NAMES has a matching implementation', () => {
      const implNames = allAnimations.map((a) => a.name);
      for (const name of ANIMATION_NAMES) {
        expect(
          implNames.includes(name),
          `"${name}" is in ANIMATION_NAMES but not implemented in allAnimations`,
        ).toBe(true);
      }
    });

    it('counts match exactly (no duplicates)', () => {
      expect(new Set(ANIMATION_NAMES).size).toBe(ANIMATION_NAMES.length);
      expect(ANIMATION_NAMES.length).toBe(allAnimations.length);
    });
  });

  describe('EASING_PRESETS vs easings config', () => {
    it('every easing in config is listed in EASING_PRESETS', () => {
      for (const key of Object.keys(easings)) {
        expect(
          EASING_PRESETS.includes(key as (typeof EASING_PRESETS)[number]),
          `Easing "${key}" is in config but missing from EASING_PRESETS`,
        ).toBe(true);
      }
    });

    it('every entry in EASING_PRESETS has a matching config', () => {
      for (const name of EASING_PRESETS) {
        expect(
          name in easings,
          `"${name}" is in EASING_PRESETS but not in easings config`,
        ).toBe(true);
      }
    });

    it('counts match exactly', () => {
      expect(EASING_PRESETS.length).toBe(Object.keys(easings).length);
    });
  });

  describe('TRIGGER_TYPES', () => {
    // Triggers handled in src/core/triggers.ts: scroll (default/else), load, click, hover
    it('contains all implemented triggers', () => {
      const expected = ['scroll', 'load', 'click', 'hover'];
      expect([...TRIGGER_TYPES].sort()).toEqual(expected.sort());
    });
  });

  describe('STAGGER_DIRECTIONS', () => {
    // Directions handled in src/core/stagger.ts: start (default), end, center, edges
    it('contains all implemented stagger directions', () => {
      const expected = ['start', 'end', 'center', 'edges'];
      expect([...STAGGER_DIRECTIONS].sort()).toEqual(expected.sort());
    });
  });

  describe('DISABLE_TARGETS', () => {
    // Device names used in src/core/responsive.ts: mobile, tablet, desktop
    it('contains all implemented device targets', () => {
      const expected = ['mobile', 'tablet', 'desktop'];
      expect([...DISABLE_TARGETS].sort()).toEqual(expected.sort());
    });
  });
});
