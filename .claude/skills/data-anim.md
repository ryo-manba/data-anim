---
name: data-anim
description: Generate HTML with data-anim animation attributes. Use when building pages, components, or layouts that need scroll/load/click/hover animations.
trigger: When the user asks to add animations to HTML, create animated landing pages, or use data-anim library.
---

# data-anim Skill

You are an expert at using the data-anim animation library. When generating HTML with animations, follow these rules:

## Setup

Always include the script in `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/data-anim@1/dist/data-anim.min.js"></script>
```

For local development:
```html
<script src="./dist/data-anim.min.js"></script>
```

## Available Animations

**Fade:** fadeIn, fadeOut, fadeInUp, fadeInDown, fadeInLeft, fadeInRight
**Slide:** slideInUp, slideInDown, slideInLeft, slideInRight
**Zoom:** zoomIn, zoomOut, zoomInUp, zoomInDown
**Bounce:** bounce, bounceIn, bounceInUp, bounceInDown
**Attention:** shake, pulse, wobble, flip, swing, rubberBand
**Rotate:** rotateIn, rotateInDownLeft, rotateInDownRight
**Special:** blur, clipReveal, typewriter

## Trigger Types

- `data-anim-trigger="scroll"` (default) — viewport entry
- `data-anim-trigger="load"` — page load
- `data-anim-trigger="click"` — click to replay
- `data-anim-trigger="hover"` — mouseenter (stays visible, no opacity:0)

## Key Attributes

```html
<div
  data-anim="fadeInUp"
  data-anim-duration="500"
  data-anim-delay="200"
  data-anim-easing="ease-out-expo"
  data-anim-once
>
```

## Stagger Pattern

```html
<div data-anim-stagger="100" data-anim-stagger-from="center">
  <div data-anim="fadeInUp" data-anim-once>Item 1</div>
  <div data-anim="fadeInUp" data-anim-once>Item 2</div>
  <div data-anim="fadeInUp" data-anim-once>Item 3</div>
</div>
```

## Common Patterns

**Hero section:**
```html
<h1 data-anim="fadeIn" data-anim-trigger="load">Title</h1>
<p data-anim="fadeInUp" data-anim-trigger="load" data-anim-delay="200">Subtitle</p>
<button data-anim="fadeInUp" data-anim-trigger="load" data-anim-delay="400">CTA</button>
```

**Feature cards with stagger:**
```html
<div data-anim-stagger="100" data-anim-stagger-from="center">
  <div data-anim="fadeInUp" data-anim-once>Feature 1</div>
  <div data-anim="fadeInUp" data-anim-once>Feature 2</div>
  <div data-anim="fadeInUp" data-anim-once>Feature 3</div>
</div>
```

**Interactive hover element:**
```html
<div data-anim="pulse" data-anim-trigger="hover">Hover me</div>
```

**Mobile-optimized:**
```html
<div data-anim="slideInLeft" data-anim-mobile="fadeIn">Responsive</div>
```

## Rules

1. Use `data-anim-once` for scroll content (prevents re-triggering)
2. Max 2-3 animation types per visual section
3. Use `data-anim-trigger="load"` only for above-fold hero content
4. Use attention seekers (shake, pulse, wobble) only for hover/click
5. Add `data-anim-mobile="fadeIn"` to horizontal slide animations
6. Keep delays under 1000ms
7. Avoid `data-anim-iteration="infinite"` on content elements
