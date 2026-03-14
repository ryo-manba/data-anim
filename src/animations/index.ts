import type { AnimationDef } from '../types';
import { fadeAnimations } from './fade';
import { slideAnimations } from './slide';
import { zoomAnimations } from './zoom';
import { bounceAnimations } from './bounce';
import { attentionAnimations } from './attention';
import { rotateAnimations } from './rotate';
import { specialAnimations } from './special';

export const allAnimations: AnimationDef[] = [
  ...fadeAnimations, ...slideAnimations, ...zoomAnimations, ...bounceAnimations,
  ...attentionAnimations, ...rotateAnimations, ...specialAnimations,
];

export const animationMap = new Map<string, AnimationDef>();
allAnimations.forEach(a => animationMap.set(a.name, a));

export function getKeyframesCSS(): string {
  return allAnimations.map(a => a.keyframes).join('');
}
