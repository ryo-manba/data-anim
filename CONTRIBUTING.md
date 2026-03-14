# Contributing

## Prerequisites

- Node.js 24+
- [pnpm](https://pnpm.io/) 10+

## Setup

```bash
git clone https://github.com/ryo-manba/data-anim.git
cd data-anim
pnpm install
```

## Development

```bash
pnpm dev          # Watch mode (auto-rebuild on change)
pnpm build        # Production build
```

## Testing

```bash
pnpm test         # Run tests once
pnpm test:watch   # Watch mode
```

## Linting & Formatting

```bash
pnpm lint         # Run oxlint
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format with oxfmt
pnpm format:check # Check formatting
```

## Pre-submit Check

Run all checks before submitting a PR:

```bash
pnpm check        # lint + format:check + test + build
```

## Submitting a PR

1. Fork the repository
2. Create a branch (`git checkout -b my-feature`)
3. Make your changes
4. Add or update tests for your changes
5. Run `pnpm check` to verify everything passes
6. Commit and push
7. Open a Pull Request
