# data-anim

[![npm version](https://img.shields.io/npm/v/data-anim.svg)](https://www.npmjs.com/package/data-anim)
[![gzip size](https://img.shields.io/badge/gzip-<3KB-brightgreen.svg)](https://bundlephobia.com/package/data-anim)
[![license](https://img.shields.io/npm/l/data-anim.svg)](LICENSE)

Zero-JS animation library powered by data attributes. Add scroll, load, click, and hover animations to any HTML element without writing a single line of JavaScript.

## Quick Start

```html
<!-- 1. Add the script -->
<script src="https://unpkg.com/data-anim/dist/data-anim.min.js"></script>

<!-- 2. Add data-anim to any element -->
<h1 data-anim="fadeInUp">Hello World</h1>

<!-- 3. That's it! -->
```

## Features

- 30+ built-in animations (fade, slide, zoom, bounce, rotate, attention, special)
- 4 triggers: scroll, load, click, hover
- Stagger support with directional control
- Anti-FOUC protection (3-layer defense)
- Responsive controls (disable/swap per device)
- `prefers-reduced-motion` respected by default
- Dynamic element support via MutationObserver
- GPU-accelerated (transform + opacity only)
- Under 3KB gzipped

## Attribute Reference

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-anim` | Animation name | — | Animation to play |
| `data-anim-trigger` | scroll, load, click, hover | scroll | When to trigger |
| `data-anim-duration` | ms value | 500ms | Animation duration |
| `data-anim-delay` | ms value | 0 | Delay before animation |
| `data-anim-easing` | ease, ease-out-expo, ease-out-back, spring | ease | Easing function |
| `data-anim-offset` | 0-1 | 0.2 | IntersectionObserver threshold |
| `data-anim-distance` | px value | 30px | Translation distance |
| `data-anim-once` | (boolean) | false | Play only once |
| `data-anim-mirror` | (boolean) | false | Reverse on scroll out |
| `data-anim-fill` | CSS fill-mode | both | Animation fill mode |
| `data-anim-iteration` | number | 1 | Iteration count |
| `data-anim-stagger` | ms value | — | Delay between children |
| `data-anim-stagger-from` | start, end, center, edges | start | Stagger direction |
| `data-anim-disable` | mobile, tablet, desktop, px | — | Disable on device |
| `data-anim-mobile` | Animation name | — | Swap animation on mobile |

## Animations (30)

**Fade:** fadeIn, fadeOut, fadeInUp, fadeInDown, fadeInLeft, fadeInRight
**Slide:** slideInUp, slideInDown, slideInLeft, slideInRight
**Zoom:** zoomIn, zoomOut, zoomInUp, zoomInDown
**Bounce:** bounce, bounceIn, bounceInUp, bounceInDown
**Attention:** shake, pulse, wobble, flip, swing, rubberBand
**Rotate:** rotateIn, rotateInDownLeft, rotateInDownRight
**Special:** blur, clipReveal, typewriter

## Comparison

| Feature | data-anim | AOS | animate.css |
|---------|-----------|-----|-------------|
| Zero JS setup | Yes | No | No |
| Bundle size | <3KB | 14KB | 80KB |
| Scroll trigger | Yes | Yes | No |
| Click/Hover trigger | Yes | No | Manual |
| Stagger | Yes | Manual | No |
| Anti-FOUC | Yes | Yes | No |
| MutationObserver | Yes | No | No |

## License

[MIT](LICENSE)
