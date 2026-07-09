/**
 * ─────────────────────────────────────────────────────────────
 *  HEXTORQ — SITE CONTENT
 * ─────────────────────────────────────────────────────────────
 *  Single source of truth for all copy. Edit text, links, stats
 *  and lists here — nothing else needs to change.
 *
 *  TODO for Hextorq: replace every `href: '#'` with the real live
 *  URL (Panda product sites + your other published websites), and
 *  tune the stat numbers to real figures.
 * ─────────────────────────────────────────────────────────────
 */

export const brand = {
  name: 'HEXTORQ',
  intro: 'HEXTORQ', // shown building letter-by-letter in the intro
  tagline: 'Code · Innovate · Elevate',
  taglineWords: ['Code', 'Innovate', 'Elevate'],
  email: 'hello@hextorq.tech',
  domain: 'hextorq.tech',
  location: 'India · Remote-first',
  socials: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'X / Twitter', href: '#' },
  ],
}

export const nav = [
  { label: 'About', target: 'story' },
  { label: 'Services', target: 'services' },
  { label: 'Products', target: 'products' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
]

export const hero = {
  eyebrow: 'IT · SOFTWARE · PRODUCTS · INNOVATION',
  title: ['We build the', 'technology that', 'moves the future.'],
  subtitle:
    'Hextorq is a full-spectrum IT-tech company — engineering software, apps and platforms for businesses, shipping our own SaaS products, and powering the next generation of student & IoT innovation.',
  cta: { label: 'Explore Hextorq', target: 'services' },
  scrollHint: 'Scroll to begin',
}

export const story = {
  eyebrow: 'WHO WE ARE',
  heading: 'One company. Three engines of impact.',
  paragraphs: [
    'Hextorq is where ideas are engineered into reality. We design, build and ship technology across the full stack — and we don’t stop at client work.',
    'We run three engines at once: bespoke IT services for businesses, our own family of SaaS products in production, and a hands-on innovation lab that turns students and inventors into builders.',
    'Whatever the domain — web, mobile, ERP, payments, IoT — if it can be built, Hextorq builds it.',
  ],
  stats: [
    { value: '250+', label: 'Projects delivered' },
    { value: '3', label: 'SaaS products live' },
    { value: '500+', label: 'Students mentored' },
    { value: '50+', label: 'Business clients' },
  ],
}

/* ── PILLAR 1 — SERVICES ──────────────────────────────────────── */
export const services = {
  eyebrow: 'PILLAR 01 — WHAT WE DO',
  heading: 'IT services, engineered end-to-end.',
  subheading:
    'From a single landing page to a company-wide ERP — strategy, design, engineering and delivery under one roof.',
  items: [
    {
      id: 'software',
      index: '01',
      title: 'Software Development',
      summary: 'Custom software and platforms built around exactly how your business runs.',
      points: ['Web apps', 'APIs & backends', 'Automation', 'Integrations'],
    },
    {
      id: 'web',
      index: '02',
      title: 'Website Development',
      summary: 'Fast, striking, conversion-focused websites — from marketing sites to portals.',
      points: ['React / Next.js', 'CMS', 'SEO', 'Core Web Vitals'],
    },
    {
      id: 'app',
      index: '03',
      title: 'App Development',
      summary: 'Native-feeling iOS & Android apps your users actually love to use.',
      points: ['React Native', 'Flutter', 'Push & realtime', 'Store delivery'],
    },
    {
      id: 'erp',
      index: '04',
      title: 'ERP Software',
      summary: 'Unify operations — inventory, HR, sales and finance — in one connected system.',
      points: ['Inventory', 'HR & Payroll', 'CRM', 'Dashboards'],
    },
    {
      id: 'billing',
      index: '05',
      title: 'Billing Software',
      summary: 'GST-ready billing and invoicing that’s fast at the counter and clean in the books.',
      points: ['GST invoicing', 'POS', 'Reports', 'Multi-branch'],
    },
    {
      id: 'custom',
      index: '06',
      title: 'Custom Solutions',
      summary: 'Have something unusual in mind? We scope, design and engineer it from scratch.',
      points: ['Consulting', 'Bespoke builds', 'Legacy upgrade', 'Support'],
    },
  ],
}

/* ── PILLAR 2 — PRODUCTS (the Panda suite) ────────────────────── */
export const products = {
  eyebrow: 'PILLAR 02 — BUILT BY HEXTORQ',
  heading: 'The Panda suite. Our products, in production.',
  subheading:
    'A family of SaaS products running for real customers today — each with its own dedicated platform.',
  items: [
    {
      id: 'paypanda',
      name: 'PayPanda',
      category: 'Payment Gateway',
      description:
        'A secure, developer-first payment gateway with a clean API, fraud protection and fast settlement — drop payments into any product in minutes.',
      features: [
        'Unified payments API',
        'PCI-DSS & tokenized',
        'Fraud detection',
        'Instant reporting',
      ],
      accent: '#3d6bff',
      href: '#',
      status: 'Live',
    },
    {
      id: 'printpanda',
      name: 'PrintPanda',
      category: 'Printing Automation',
      description:
        'Printing, fully automated. Users upload their files, pay online, and the print job is queued and ready — no counter, no back-and-forth, no waiting.',
      features: [
        'Upload → pay → print',
        'Automated job queue',
        'Online payments built-in',
        'Pickup notifications',
      ],
      accent: '#6a5cff',
      href: '#',
      status: 'Live',
    },
    {
      id: 'ticketspanda',
      name: 'TicketsPanda',
      category: 'Event Ticketing System',
      description:
        'End-to-end event ticketing. Register an event, collect payments, and issue tickets to attendees automatically — with entry management built in.',
      features: [
        'Event registration',
        'Payment collection',
        'Auto ticket issue',
        'Entry / check-in',
      ],
      accent: '#7c3aed',
      href: '#',
      status: 'Live',
    },
  ],
}

/* ── PILLAR 3 — PROJECTS & INNOVATION ─────────────────────────── */
export const projects = {
  eyebrow: 'PILLAR 03 — INNOVATION LAB',
  heading: 'Where students and ideas become builders.',
  subheading:
    'Beyond business, Hextorq powers real innovation — guiding students, prototyping hardware, and taking on the projects nobody else will.',
  items: [
    {
      id: 'academic',
      title: 'Student & Academic Projects',
      summary:
        'Final-year and academic projects across every domain — with real code, real guidance and documentation that actually holds up.',
      tags: ['All domains', 'Guided', 'Documented', 'Viva-ready'],
    },
    {
      id: 'iot',
      title: 'IoT & Hardware',
      summary:
        'Sensors, embedded systems and connected devices — from prototype on the bench to a working, demoable build.',
      tags: ['Embedded', 'Sensors', 'Automation', 'Prototyping'],
    },
    {
      id: 'custom',
      title: 'Custom Requested Builds',
      summary:
        'Bring us a brief from any field — we take on custom, on-request projects and deliver them end-to-end.',
      tags: ['On-request', 'Any domain', 'End-to-end', 'Delivery'],
    },
  ],
}

/* ── ECOSYSTEM — links out to their other published sites ─────── */
export const ecosystem = {
  eyebrow: 'THE ECOSYSTEM',
  heading: 'Every Hextorq property, one hub.',
  subheading:
    'Hextorq runs a network of dedicated platforms. Jump straight to any of them.',
  links: [
    { label: 'PayPanda', note: 'Payments', href: '#' },
    { label: 'PrintPanda', note: 'Printing', href: '#' },
    { label: 'TicketsPanda', note: 'Ticketing', href: '#' },
    { label: 'Hextorq Main', note: 'Company', href: '#' },
  ],
}

/* ── PROCESS — horizontal pinned storytelling ─────────────────── */
export const process = {
  eyebrow: 'HOW WE WORK',
  heading: 'From idea to impact.',
  steps: [
    {
      no: '01',
      title: 'Discover',
      text: 'We dig into your goals, users and constraints — then map the fastest path to real value.',
    },
    {
      no: '02',
      title: 'Design',
      text: 'Interfaces and architecture designed together, so what looks good also scales well.',
    },
    {
      no: '03',
      title: 'Engineer',
      text: 'Clean, tested, production-grade code shipped in tight iterations you can see every week.',
    },
    {
      no: '04',
      title: 'Launch',
      text: 'We deploy, monitor and harden — a launch that’s an event, not an emergency.',
    },
    {
      no: '05',
      title: 'Elevate',
      text: 'Post-launch we measure, refine and grow the product alongside your business.',
    },
  ],
}

/* Words for the kinetic marquee strip */
export const marqueeWords = [
  'Software',
  'Web',
  'Apps',
  'ERP',
  'Payments',
  'IoT',
  'Automation',
  'Innovation',
]

export const contact = {
  eyebrow: 'LET’S BUILD',
  heading: ['Have something', 'worth building?'],
  subtitle:
    'A product, a platform, an academic project, or an idea on a napkin — tell us what you’re working on and we’ll take it from here.',
  cta: { label: 'Start a conversation', href: 'mailto:hello@hextorq.tech' },
}

export const footer = {
  note: 'Hextorq — IT services, SaaS products and innovation, engineered under one roof.',
  copyright: `© ${new Date().getFullYear()} Hextorq. All rights reserved.`,
}
