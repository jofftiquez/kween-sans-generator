# ✨ Kween Yasmin Generator

A beautiful word-to-PNG generator built with Next.js, Tailwind CSS, and shadcn/ui.

![Kween Yasmin Generator](https://github.com/user-attachments/assets/30bcb2bf-81e7-4db8-afe3-2778789a8287)

## Features

- 🎨 **Light Blue & Pink Theme** - Beautiful gradient design
- 📝 **Alphanumeric Support** - Enter letters (a-z, A-Z) and numbers (0-9)
- 🖼️ **Live Preview** - See your creation before generating
- 📥 **PNG Download** - Generate and download your image instantly
- 📱 **Mobile Friendly** - Fully responsive design
- 🔍 **SEO Optimized** - Proper meta tags and semantic HTML

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons
- [html-to-image](https://github.com/bubkoo/html-to-image) - Image generation

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Type your message in the input field (a-z, A-Z, 0-9 only)
2. See the live preview of your text as images
3. Click "Generate & Download PNG" to download your creation

## Adding Custom Letter Images

Replace the SVG files in the `/public/letters/` directory with your own PNG images:

- `A.png`, `B.png`, ... `Z.png` for uppercase letters
- `a.png`, `b.png`, ... `z.png` for lowercase letters
- `0.png`, `1.png`, ... `9.png` for numbers

Then update the image paths in `src/components/word-generator.tsx` to use `.png` instead of `.svg`.

## Build

```bash
npm run build
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

---

Made with 💖 for Kween Yasmin
