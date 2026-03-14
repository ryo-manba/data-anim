import type { AnimationDef } from '../types';
const D = '--da-distance,30px', O = 'opacity:0', T = 'to{opacity:1;transform:none}';
export const fadeAnimations: AnimationDef[] = [
  { name: 'fadeIn', keyframes: `@keyframes da-fadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:none}}`, initialStyle: O },
  { name: 'fadeOut', keyframes: `@keyframes da-fadeOut{from{opacity:1}to{opacity:0}}` },
  { name: 'fadeInUp', keyframes: `@keyframes da-fadeInUp{from{opacity:0;transform:translateY(var(${D}))}${T}}`, initialStyle: O, supportsDistance: true },
  { name: 'fadeInDown', keyframes: `@keyframes da-fadeInDown{from{opacity:0;transform:translateY(calc(var(${D})*-1))}${T}}`, initialStyle: O, supportsDistance: true },
  { name: 'fadeInLeft', keyframes: `@keyframes da-fadeInLeft{from{opacity:0;transform:translateX(calc(var(${D})*-1))}${T}}`, initialStyle: O, supportsDistance: true },
  { name: 'fadeInRight', keyframes: `@keyframes da-fadeInRight{from{opacity:0;transform:translateX(var(${D}))}${T}}`, initialStyle: O, supportsDistance: true },
];
