# HexTorq Portfolio 1

Production portfolio template for HexTorq.

Live site: https://portfolio-1.hextorq.tech/

## Website Overview

HexTorq Portfolio 1 presents the company as a premium technology studio with a cinematic, high-contrast interface. The experience is built around a branded intro, animated hero section, dark visual depth, scroll-based reveals, and polished service and product sections.

This version is best suited when the website needs to feel bold, futuristic, and highly visual while still explaining what HexTorq builds.

## Page Flow

- Home: branded hero with the main HexTorq positioning.
- About: company story and credibility context.
- Services: software, websites, apps, ERP, billing, and custom digital solutions.
- Products: product ecosystem presentation.
- Projects: innovation, academic, IoT, and custom engineering work.
- Process: how the team moves from idea to launch.
- Contact: final conversion section for inquiries.

## UI Direction

- Dark cinematic technology aesthetic.
- Large hero typography and glowing accent details.
- Smooth scroll movement and section reveal animations.
- Product and service cards styled like premium digital panels.
- Small template-switch control for moving to another HexTorq portfolio style while keeping the same route.

## Static Build And SEO

The project uses Vite with a prerender step. Running the build generates static HTML route folders in `dist/`, so deployed pages can be served directly as HTML, CSS, and JavaScript.

```bash
npm install
npm run build
```

The generated output includes prerendered pages such as `/about/`, `/services/`, `/products/`, `/projects/`, `/process/`, and `/contact/`.

## Deployment Notes

This site is intended for Vercel static deployment. The included `vercel.json` allows cross-origin asset loading and iframe embedding from HexTorq domains so the portfolio mix website can preload and display this template.

The frame policy explicitly allows the production mix domains `https://hextorq.tech`, `https://www.hextorq.tech`, and HexTorq subdomains. After changing `vercel.json`, redeploy the Vercel project so the new response headers are applied in production.

## Content Editing

Most public-facing content is in `src/content.js`. Update that file for service text, product names, stats, links, social profiles, and contact details.
