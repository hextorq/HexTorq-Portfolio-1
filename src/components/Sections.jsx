import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hero, story, services, products, projects, process, ecosystem, contact, footer, brand } from '../content'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import { useTilt } from '../hooks/useTilt'
import './Sections.css'

gsap.registerPlugin(ScrollTrigger)

/* Splits a string into word spans wrapped in overflow-hidden masks,
   so each word can slide up from behind a clip edge. */
function MaskWords({ text, className = '' }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span className="word-mask" key={i}>
          <span className={`word ${className}`}>{w}</span>
        </span>
      ))}
    </>
  )
}

/* A heading whose words rise from behind a clip edge when scrolled
   into view — the signature reveal used across every section. */
function MaskHeading({ text, className = '', as = 'h2' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.word'), {
        yPercent: 118,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [text])
  const Tag = as
  return (
    <Tag ref={ref} className={`mask-head h-display ${className}`}>
      <MaskWords text={text} />
    </Tag>
  )
}

/* ── HERO ─────────────────────────────────────────────────────── */
export function Hero({ lenisRef, ready }) {
  const root = useRef(null)

  const go = (target) => {
    const el = document.getElementById(target)
    if (el && lenisRef?.current) lenisRef.current.scrollTo(el, { duration: 1.4 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }
  const ctaRef = useMagnetic(0.5)

  // Intro choreography — runs once the preloader hands off.
  useEffect(() => {
    if (!ready || !root.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero .eyebrow', { y: 24, opacity: 0, duration: 0.8 })
        .from(
          '.hero .word',
          { yPercent: 115, duration: 1.1, stagger: 0.06 },
          '-=0.5'
        )
        .from('.hero-sub', { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
        .from('.hero-actions', { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
        .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.4')

      // Parallax: hero content drifts up + fades as you scroll away.
      gsap.to('.hero-inner', {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero section" id="top" ref={root}>
      <div className="container hero-inner">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="hero-title h-display">
          {hero.title.map((line, i) => (
            <span className={`hero-line ${i === hero.title.length - 1 ? 'is-accent' : ''}`} key={i}>
              <MaskWords text={line} />
            </span>
          ))}
        </h1>
        <p className="hero-sub">{hero.subtitle}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" ref={ctaRef} onClick={() => go(hero.cta.target)}>
            {hero.cta.label}
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      <div className="scroll-hint">
        <span>{hero.scrollHint}</span>
        <span className="scroll-line" />
      </div>
    </section>
  )
}

/* ── STORY ────────────────────────────────────────────────────── */
export function Story() {
  const scope = useReveal('.reveal')
  const statsRef = useRef(null)

  // Count-up animation for the stat numbers.
  useEffect(() => {
    if (!statsRef.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat-value').forEach((el) => {
        const raw = el.dataset.value || ''
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
        if (isNaN(num)) return
        const suffix = raw.replace(/[0-9.,]/g, '')
        const obj = { v: 0 }
        gsap.to(obj, {
          v: num,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v) + suffix
          },
        })
      })
    }, statsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="story section" id="story" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{story.eyebrow}</span>
        <MaskHeading text={story.heading} className="story-heading" />

        <div className="story-grid">
          <div className="story-copy">
            {story.paragraphs.map((p, i) => (
              <p className="story-p reveal" key={i}>
                {p}
              </p>
            ))}
          </div>

          <div className="story-stats" ref={statsRef}>
            {story.stats.map((s, i) => (
              <div className="stat reveal" key={i}>
                <div className="stat-value text-gradient" data-value={s.value}>
                  {s.value}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SERVICES ─────────────────────────────────────────────────── */
export function Services() {
  const scope = useReveal('.reveal')
  return (
    <section className="services section" id="services" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{services.eyebrow}</span>
        <MaskHeading text={services.heading} className="section-heading" />
        <p className="section-sub reveal">{services.subheading}</p>

        <div className="svc-grid">
          {services.items.map((s) => (
            <article className="svc-card reveal" key={s.id}>
              <div className="svc-index">{s.index}</div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-summary">{s.summary}</p>
              <ul className="svc-points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="svc-glow" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PRODUCTS ─────────────────────────────────────────────────── */
export function Products() {
  const scope = useReveal('.reveal')

  // Parallax the glowing orb + product name inside each visual for depth.
  useEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray(scope.current.querySelectorAll('.prod-visual')).forEach((visual) => {
        const orb = visual.querySelector('.prod-orb')
        const name = visual.querySelector('.prod-name')
        if (orb)
          gsap.fromTo(
            orb,
            { yPercent: -14 },
            {
              yPercent: 14,
              ease: 'none',
              scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        if (name)
          gsap.fromTo(
            name,
            { yPercent: 8 },
            {
              yPercent: -8,
              ease: 'none',
              scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="products section" id="products" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{products.eyebrow}</span>
        <MaskHeading text={products.heading} className="section-heading" />
        <p className="section-sub reveal">{products.subheading}</p>

        <div className="prod-list">
          {products.items.map((p, i) => (
            <article
              className={`prod-card reveal ${i % 2 ? 'is-reverse' : ''}`}
              key={p.id}
              style={{ '--accent': p.accent }}
            >
              <div className="prod-visual">
                <div className="prod-badge">{p.status}</div>
                <div className="prod-orb" />
                <div className="prod-name">{p.name}</div>
              </div>

              <div className="prod-body">
                <span className="prod-category">{p.category}</span>
                <h3 className="prod-title">{p.name}</h3>
                <p className="prod-desc">{p.description}</p>
                <ul className="prod-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <span className="prod-tick">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a className="prod-link" href={p.href}>
                  Visit {p.name} <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PROJECTS & INNOVATION ────────────────────────────────────── */
export function Projects() {
  const scope = useReveal('.reveal')
  return (
    <section className="projects section" id="projects" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{projects.eyebrow}</span>
        <MaskHeading text={projects.heading} className="section-heading" />
        <p className="section-sub reveal">{projects.subheading}</p>

        <div className="proj-grid">
          {projects.items.map((p) => (
            <article className="proj-card reveal" key={p.id}>
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-summary">{p.summary}</p>
              <ul className="proj-tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PROCESS — horizontal pinned storytelling ─────────────────── */
export function Process() {
  const section = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (!section.current || !track.current) return
    const mm = gsap.matchMedia()

    // Pin + scroll horizontally on larger screens; stack on mobile.
    mm.add('(min-width: 860px)', () => {
      const getScroll = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="process" id="process" ref={section}>
      <div className="process-track" ref={track}>
        <div className="process-intro">
          <span className="eyebrow">{process.eyebrow}</span>
          <h2 className="process-heading h-display">{process.heading}</h2>
          <p className="process-hint">
            <span className="process-hint-line" /> Scroll to explore
          </p>
        </div>

        {process.steps.map((s) => (
          <article className="process-step" key={s.no} data-cursor="step">
            <div className="process-no">{s.no}</div>
            <h3 className="process-title">{s.title}</h3>
            <p className="process-text">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ── ECOSYSTEM (outbound links to the other Hextorq sites) ─────── */
export function Ecosystem() {
  const scope = useReveal('.reveal')
  return (
    <section className="ecosystem section" id="ecosystem" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{ecosystem.eyebrow}</span>
        <MaskHeading text={ecosystem.heading} className="section-heading" />
        <p className="section-sub reveal">{ecosystem.subheading}</p>

        <div className="eco-grid">
          {ecosystem.links.map((l) => (
            <a className="eco-link reveal" href={l.href} key={l.label}>
              <span className="eco-name">{l.label}</span>
              <span className="eco-note">{l.note}</span>
              <span className="eco-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CONTACT + FOOTER ─────────────────────────────────────────── */
export function Contact() {
  const scope = useReveal('.reveal')
  const ctaRef = useMagnetic(0.5)
  return (
    <section className="contact section" id="contact" ref={scope}>
      <div className="container contact-inner">
        <span className="eyebrow reveal">{contact.eyebrow}</span>
        <h2 className="contact-heading h-display reveal">
          {contact.heading.map((l, i) => (
            <span className="reveal" key={i}>
              {l}
            </span>
          ))}
        </h2>
        <p className="contact-sub reveal">{contact.subtitle}</p>
        <a className="btn btn-primary btn-lg reveal" ref={ctaRef} href={contact.cta.href}>
          {contact.cta.label}
          <span className="btn-arrow">→</span>
        </a>

        <div className="contact-meta reveal">
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <span>{brand.location}</span>
        </div>
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="nav-logo-mark" />
            {brand.name}
          </div>
          <p className="footer-note">{footer.note}</p>
          <div className="footer-socials">
            {brand.socials.map((s) => (
              <a key={s.label} href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="footer-copy">{footer.copyright}</div>
        </div>
      </footer>
    </section>
  )
}
