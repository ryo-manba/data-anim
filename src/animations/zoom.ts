import type { AnimationDef } from '../types';
const D = '--da-distance,30px', O = 'opacity:0', T = 'to{opacity:1;transform:none}';
export const zoomAnimations: AnimationDef[] = [
  { name: 'zoomIn', keyframes: `@keyframes da-zoomIn{from{opacity:0;transform:scale(.5)}${T}}`, initialStyle: O, supportsScale: true },
  { name: 'zoomOut', keyframes: `@keyframes da-zoomOut{from{opacity:0;transform:scale(1.5)}${T}}`, initialStyle: O, supportsScale: true },
  { name: 'zoomInUp', keyframes: `@keyframes da-zoomInUp{from{opacity:0;transform:scale(.9) translateY(var(${D}))}${T}}`, initialStyle: O, supportsDistance: true, supportsScale: true },
  { name: 'zoomInDown', keyframes: `@keyframes da-zoomInDown{from{opacity:0;transform:scale(.9) translateY(calc(var(${D})*-1))}${T}}`, initialStyle: O, supportsDistance: true, supportsScale: true },
];
