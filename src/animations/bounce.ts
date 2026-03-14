import type { AnimationDef } from '../types';
const O = 'opacity:0', T = 'to{opacity:1;transform:none}';
export const bounceAnimations: AnimationDef[] = [
  { name: 'bounce', keyframes: `@keyframes da-bounce{0%,20%,53%,to{transform:none}40%{transform:translateY(-20px)}70%{transform:translateY(-10px)}}` },
  { name: 'bounceIn', keyframes: `@keyframes da-bounceIn{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.05)}70%{transform:scale(.9)}${T}}`, initialStyle: O },
  { name: 'bounceInUp', keyframes: `@keyframes da-bounceInUp{0%{opacity:0;transform:translateY(50px)}60%{opacity:1;transform:translateY(-10px)}80%{transform:translateY(5px)}to{transform:none}}`, initialStyle: O },
  { name: 'bounceInDown', keyframes: `@keyframes da-bounceInDown{0%{opacity:0;transform:translateY(-50px)}60%{opacity:1;transform:translateY(10px)}80%{transform:translateY(-5px)}to{transform:none}}`, initialStyle: O },
];
