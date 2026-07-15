# Hextorq — Portfolio Website

A premium, dark-futuristic portfolio for **Hextorq**, an IT tech solutions company.
Built around a fixed WebGL background and scroll-triggered 3D animation that tells
the story of who Hextorq is, the services they offer, and their in-house products.

## Highlights

- **Intro load animation** — the company name reveals letter-by-letter with a
  "systems online" counter, then wipes up to reveal the site.
- **Fixed 3D scene** (React Three Fiber) — a glowing wireframe torus-knot core and
  drifting particle field that move, morph, shift hue and accelerate as you scroll.
- **Smooth scroll** — Lenis synced with GSAP ScrollTrigger for buttery motion and
  scroll-linked reveals.
- **Sections** — Hero → Story → Services → Products → Contact/Footer.
- Fully responsive, respects `prefers-reduced-motion`.

## Tech stack

| Purpose        | Library                         |
| -------------- | ------------------------------- |
| Framework      | React + Vite                    |
| 3D / WebGL     | three, @react-three/fiber, drei |
| Animation      | GSAP + ScrollTrigger            |
| Smooth scroll  | Lenis                           |

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing content

**All copy lives in one file:** [`src/content.js`](src/content.js).
Change the brand name, tagline, story, stats, service cards, product details,
contact info and social links there — no other files need to be touched.

Placeholder copy is written to feel real; swap it for Hextorq's final wording,
live product URLs, and social links.

## Project structure

```
src/
├─ content.js            # ← all editable text/links (single source of truth)
├─ App.jsx               # composition + scroll→3D wiring
├─ three/
│  ├─ Scene.jsx          # WebGL scene (core object + particles + lights)
│  └─ scrollStore.js     # shared scroll progress / pointer state
├─ components/
│  ├─ Preloader.jsx      # intro load animation
│  ├─ Navbar.jsx         # sticky navigation
│  └─ Sections.jsx       # Hero, Story, Services, Products, Contact
├─ hooks/
│  ├─ useSmoothScroll.js # Lenis + GSAP ticker sync
│  └─ useReveal.js       # scroll-reveal for .reveal elements
└─ styles/global.css     # theme tokens + base styles
```

## Customizing the look

Theme colors and fonts are CSS variables at the top of
[`src/styles/global.css`](src/styles/global.css) (`--cyan`, `--purple`, `--bg`, …).
The 3D object's shape and motion live in
[`src/three/Scene.jsx`](src/three/Scene.jsx).
# HexTorq-Portfolio-1
