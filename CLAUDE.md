# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Architecture

A Next.js 16 application that converts text input into PNG images using custom letter graphics.

### Core Flow
1. User types alphanumeric text in `WordGenerator` component (auto-converted to uppercase)
2. Each character maps to a PNG file in `/public/letters/` (A-Z.png, 0-9.png)
3. Live preview renders using Next.js `Image` component with `unoptimized` flag
4. `html-to-image` library captures the preview div and generates downloadable PNG

### Key Files
- `src/components/word-generator.tsx` - Main component with input, preview, and PNG generation logic
- `src/app/page.tsx` - Simple wrapper that renders WordGenerator
- `src/app/layout.tsx` - Root layout with SEO metadata
- `src/app/opengraph-image.tsx` - Dynamic OG image generation using Next.js ImageResponse
- `src/app/twitter-image.tsx` - Dynamic Twitter card image
- `public/letters/` - Character PNG assets: `A-Z.png`, `0-9.png`

### UI Components
Uses shadcn/ui pattern with components in `src/components/ui/`. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes via `clsx` + `tailwind-merge`.

### Styling
Tailwind CSS 4 with a pink (#e91e8b) primary color theme. Styles are defined inline in components rather than in globals.css.

## Notes

- All input is auto-converted to uppercase
- All character images are PNG files (A-Z, 0-9)
- Character images are rendered at 50px height with auto width, spaces at 25px width
- PNG export uses 2x pixel ratio for retina quality (or 1x for social media size presets) with 100ms render delay
