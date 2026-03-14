import type { AnimationDef } from '../types';
export const attentionAnimations: AnimationDef[] = [
  {
    name: 'shake',
    keyframes: `@keyframes da-shake{0%,to{transform:none}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}`,
  },
  {
    name: 'pulse',
    keyframes: `@keyframes da-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.15)}}`,
  },
  {
    name: 'wobble',
    keyframes: `@keyframes da-wobble{0%,to{transform:none}15%{transform:translateX(-15px) rotate(-5deg)}30%{transform:translateX(10px) rotate(3deg)}45%{transform:translateX(-5px) rotate(-2deg)}}`,
  },
  {
    name: 'flip',
    keyframes: `@keyframes da-flip{from{transform:perspective(400px) rotateY(0)}to{transform:perspective(400px) rotateY(360deg)}}`,
  },
  {
    name: 'swing',
    keyframes: `@keyframes da-swing{0%,to{transform:none}20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}}`,
  },
  {
    name: 'rubberBand',
    keyframes: `@keyframes da-rubberBand{0%,to{transform:scale(1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}}`,
  },
];
