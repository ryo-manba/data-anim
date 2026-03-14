import type { AnimationDef } from '../types';
const O = 'opacity:0';
export const specialAnimations: AnimationDef[] = [
  {
    name: 'blur',
    keyframes: `@keyframes da-blur{from{opacity:0;filter:blur(10px)}to{opacity:1;filter:blur(0)}}`,
    initialStyle: O + ';filter:blur(10px)',
  },
  {
    name: 'clipReveal',
    keyframes: `@keyframes da-clipReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}`,
    initialStyle: 'clip-path:inset(0 100% 0 0)',
  },
  {
    name: 'typewriter',
    keyframes: `@keyframes da-typewriter{from{max-width:0}to{max-width:100%}}`,
    initialStyle: 'max-width:0;overflow:hidden;white-space:nowrap',
  },
];
