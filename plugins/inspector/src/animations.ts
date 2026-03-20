/**
 * Animation definitions inlined from data-anim.
 * Kept as a standalone copy so this repo has zero runtime dependency on data-anim.
 */

export interface AnimationDef {
  name: string;
  keyframes: string;
}

const D = '--da-distance,30px';
const O_T = 'to{opacity:1;transform:none}';

export const allAnimations: AnimationDef[] = [
  // ── Fade ──
  { name: 'fadeIn', keyframes: `@keyframes da-fadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:none}}` },
  { name: 'fadeOut', keyframes: `@keyframes da-fadeOut{from{opacity:1}to{opacity:0}}` },
  { name: 'fadeInUp', keyframes: `@keyframes da-fadeInUp{from{opacity:0;transform:translateY(var(${D}))}${O_T}}` },
  { name: 'fadeInDown', keyframes: `@keyframes da-fadeInDown{from{opacity:0;transform:translateY(calc(var(${D})*-1))}${O_T}}` },
  { name: 'fadeInLeft', keyframes: `@keyframes da-fadeInLeft{from{opacity:0;transform:translateX(calc(var(${D})*-1))}${O_T}}` },
  { name: 'fadeInRight', keyframes: `@keyframes da-fadeInRight{from{opacity:0;transform:translateX(var(${D}))}${O_T}}` },
  // ── Slide ──
  { name: 'slideInUp', keyframes: `@keyframes da-slideInUp{from{opacity:0;transform:translateY(100%)}${O_T}}` },
  { name: 'slideInDown', keyframes: `@keyframes da-slideInDown{from{opacity:0;transform:translateY(-100%)}${O_T}}` },
  { name: 'slideInLeft', keyframes: `@keyframes da-slideInLeft{from{opacity:0;transform:translateX(-100%)}${O_T}}` },
  { name: 'slideInRight', keyframes: `@keyframes da-slideInRight{from{opacity:0;transform:translateX(100%)}${O_T}}` },
  // ── Zoom ──
  { name: 'zoomIn', keyframes: `@keyframes da-zoomIn{from{opacity:0;transform:scale(.5)}${O_T}}` },
  { name: 'zoomOut', keyframes: `@keyframes da-zoomOut{from{opacity:0;transform:scale(1.5)}${O_T}}` },
  { name: 'zoomInUp', keyframes: `@keyframes da-zoomInUp{from{opacity:0;transform:scale(.9) translateY(var(${D}))}${O_T}}` },
  { name: 'zoomInDown', keyframes: `@keyframes da-zoomInDown{from{opacity:0;transform:scale(.9) translateY(calc(var(${D})*-1))}${O_T}}` },
  // ── Bounce ──
  { name: 'bounce', keyframes: `@keyframes da-bounce{0%,20%,53%,to{transform:none}40%{transform:translateY(-20px)}70%{transform:translateY(-10px)}}` },
  { name: 'bounceIn', keyframes: `@keyframes da-bounceIn{0%{opacity:0;transform:scale(.3)}50%{transform:scale(1.05)}70%{transform:scale(.9)}${O_T}}` },
  { name: 'bounceInUp', keyframes: `@keyframes da-bounceInUp{0%{opacity:0;transform:translateY(50px)}60%{opacity:1;transform:translateY(-10px)}80%{transform:translateY(5px)}to{transform:none}}` },
  { name: 'bounceInDown', keyframes: `@keyframes da-bounceInDown{0%{opacity:0;transform:translateY(-50px)}60%{opacity:1;transform:translateY(10px)}80%{transform:translateY(-5px)}to{transform:none}}` },
  // ── Attention ──
  { name: 'shake', keyframes: `@keyframes da-shake{0%,to{transform:none}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}` },
  { name: 'pulse', keyframes: `@keyframes da-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.15)}}` },
  { name: 'wobble', keyframes: `@keyframes da-wobble{0%,to{transform:none}15%{transform:translateX(-15px) rotate(-5deg)}30%{transform:translateX(10px) rotate(3deg)}45%{transform:translateX(-5px) rotate(-2deg)}}` },
  { name: 'flip', keyframes: `@keyframes da-flip{from{transform:perspective(400px) rotateY(0)}to{transform:perspective(400px) rotateY(360deg)}}` },
  { name: 'swing', keyframes: `@keyframes da-swing{0%,to{transform:none}20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}}` },
  { name: 'rubberBand', keyframes: `@keyframes da-rubberBand{0%,to{transform:scale(1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}}` },
  // ── Rotate ──
  { name: 'rotateIn', keyframes: `@keyframes da-rotateIn{from{opacity:0;transform:rotate(-200deg)}${O_T}}` },
  { name: 'rotateInDownLeft', keyframes: `@keyframes da-rotateInDownLeft{from{opacity:0;transform:rotate(-90deg)}${O_T}}` },
  { name: 'rotateInDownRight', keyframes: `@keyframes da-rotateInDownRight{from{opacity:0;transform:rotate(90deg)}${O_T}}` },
  // ── Special ──
  { name: 'blur', keyframes: `@keyframes da-blur{from{opacity:0;filter:blur(10px)}to{opacity:1;filter:blur(0)}}` },
  { name: 'clipReveal', keyframes: `@keyframes da-clipReveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}` },
  { name: 'typewriter', keyframes: `@keyframes da-typewriter{from{max-width:0}to{max-width:100%}}` },
];

export function getKeyframesCSS(): string {
  return allAnimations.map((a) => a.keyframes).join('');
}

export const EASING_PRESETS = ['ease', 'ease-out-expo', 'ease-out-back', 'spring'] as const;

export const easings: Record<string, string> = {
  ease: 'cubic-bezier(0.25,0.1,0.25,1)',
  'ease-out-expo': 'cubic-bezier(0.16,1,0.3,1)',
  'ease-out-back': 'cubic-bezier(0.34,1.56,0.64,1)',
  spring: 'cubic-bezier(0.175,0.885,0.32,1.275)',
};
