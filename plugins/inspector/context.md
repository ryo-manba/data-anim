# data-anim Inspector — Development Context

## What was done

### Build environment fix
- Vite 8 requires Node.js 20.19+, but Volta had pinned pnpm to Node v20.17.0
- Fix: `volta install pnpm@latest` to re-pin pnpm to the current default Node

### SVG icons
- Replaced lightning bolt icons with data-anim's favicon design (dark navy + purple/pink gradient motion blur squares)
- Files: `extension/icons/icon-{16,48,128}.svg`
- Source: `docs/public/favicon.svg` from data-anim repo

### Features added (from original basic inspector)

1. **Preview area** — Panel top with 44x44px purple gradient box. Hover animation buttons to preview
2. **Apply mode** — Clicking animation buttons sets `data-anim`, `data-anim-duration`, `data-anim-easing` attributes on the actual element (persistent, not temporary)
3. **Applied element overlays** — Purple dashed outlines + animation name badges on applied elements. Toggle visibility with eye icon
4. **Replay All** — Button at top of panel, replays all applied animations. Shows count
5. **Multi-select** — Grid icon toggle. Click elements to add/remove (green outlines). Apply animation to all at once
6. **Clear All** — Trash icon, removes all applied animations
7. **Element deselection** — Click same element again to deselect
8. **SVG logo in header** — data-anim favicon, links to https://ryo-manba.github.io/data-anim/
9. **Toolbar tooltips** — Hover icon buttons to see labels (Multi-select, Clear all, Show/Hide overlays)
10. **Always-visible controls** — "Remove from this element" and "HTML Attributes" sections always shown (disabled state when not applicable)
11. **Contrast improvements** — Text colors adjusted from #a1a1aa → #52525b for better readability
12. **Animation replay fix** — Changed from `void el.offsetWidth` reflow trick to `requestAnimationFrame` for reliable animation restart (fixes bounce/attention animations)

### Release-please config
- Created `release-please-config.json` with `exclude-paths: ["data-anim-inspector", "docs", "examples"]`
- Created `.release-please-manifest.json` with current version "1.0.0"
- Updated `.github/workflows/release-please.yml` to use config-file + manifest-file

### Files modified/created
```
data-anim-inspector/
├── spec.md                    # Full feature spec (Japanese)
├── context.md                 # This file
├── src/
│   ├── inspector.ts           # Main inspector (heavily modified)
│   ├── animations.ts          # No changes from original
│   └── extension-content.ts   # No changes from original
├── extension/
│   ├── manifest.json          # Added homepage_url
│   ├── background.js          # No changes
│   └── icons/                 # Replaced with data-anim SVG icons
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vite.config.extension.ts

release-please-config.json     # NEW — exclude-paths for inspector/docs/examples
.release-please-manifest.json  # NEW — version tracking
.github/workflows/release-please.yml  # MODIFIED — config-file reference
```

## Known issues / TODOs
- bounce/attention animations: `requestAnimationFrame` fix applied but not fully verified in all browsers
- `gallery.html` was created in sandbox but NOT copied to data-anim (standalone demo page, not part of extension)
- `data-anim-inspector` is not in `pnpm-workspace.yaml` — it's a standalone directory, not a workspace package
- Extension icons are SVG but Chrome Web Store may require PNG for submission

## Build commands
```bash
cd data-anim-inspector
pnpm install
pnpm build           # Both standalone + extension
pnpm build:script    # Standalone only → dist/data-anim-inspector.min.js
pnpm build:extension # Extension only → extension/content.js
pnpm dev             # Watch mode
```

## Test the extension
1. Chrome → `chrome://extensions` → Developer mode ON
2. "Load unpacked" → select `data-anim-inspector/extension/`
3. Click extension icon on any page to toggle
