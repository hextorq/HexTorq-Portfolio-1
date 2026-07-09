import { useEffect, useRef } from 'react'
import './Chrome.css'

/** Slim gradient progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const bar = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" ref={bar} />
    </div>
  )
}

/**
 * Kinetic typography marquee — a continuously scrolling strip of large
 * outlined words. `reverse` flips direction; place two for a woven look.
 */
export function Marquee({ words = [], reverse = false, duration = 28 }) {
  const items = [...words, ...words] // duplicate for seamless loop
  return (
    <div className="marquee" aria-hidden="true">
      <div
        className={`marquee-track ${reverse ? 'is-reverse' : ''}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((w, i) => (
          <span className="marquee-word" key={i}>
            {w}
            <i className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
