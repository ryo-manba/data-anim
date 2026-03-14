import type { AnimationDef } from '../types';
const O = 'opacity:0',
  T = 'to{opacity:1;transform:none}';
export const rotateAnimations: AnimationDef[] = [
  {
    name: 'rotateIn',
    keyframes: `@keyframes da-rotateIn{from{opacity:0;transform:rotate(-200deg)}${T}}`,
    initialStyle: O,
  },
  {
    name: 'rotateInDownLeft',
    keyframes: `@keyframes da-rotateInDownLeft{from{opacity:0;transform:rotate(-90deg)}${T}}`,
    initialStyle: O + ';transform-origin:left bottom',
  },
  {
    name: 'rotateInDownRight',
    keyframes: `@keyframes da-rotateInDownRight{from{opacity:0;transform:rotate(90deg)}${T}}`,
    initialStyle: O + ';transform-origin:right bottom',
  },
];
