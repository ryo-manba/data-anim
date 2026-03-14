import type { AnimationDef } from '../types';
const O = 'opacity:0', T = 'to{opacity:1;transform:none}';
export const slideAnimations: AnimationDef[] = [
  { name: 'slideInUp', keyframes: `@keyframes da-slideInUp{from{opacity:0;transform:translateY(100%)}${T}}`, initialStyle: O },
  { name: 'slideInDown', keyframes: `@keyframes da-slideInDown{from{opacity:0;transform:translateY(-100%)}${T}}`, initialStyle: O },
  { name: 'slideInLeft', keyframes: `@keyframes da-slideInLeft{from{opacity:0;transform:translateX(-100%)}${T}}`, initialStyle: O },
  { name: 'slideInRight', keyframes: `@keyframes da-slideInRight{from{opacity:0;transform:translateX(100%)}${T}}`, initialStyle: O },
];
