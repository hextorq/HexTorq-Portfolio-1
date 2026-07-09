import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

/**
 * Interactive custom cursor — a precise dot plus a trailing ring that
 * lags behind with easing. The ring grows and the label appears when
 * hovering interactive elements ([data-cursor], a, button). Disabled
 * on touch devices, where the native cursor is fine.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('has-custom-cursor')

    const dotX = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const overInteractive = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      if (!el) return
      ring.current.classList.add('is-active')
      const text = el.getAttribute('data-cursor')
      if (text && label.current) {
        label.current.textContent = text
        ring.current.classList.add('has-label')
      }
    }
    const outInteractive = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      if (!el) return
      ring.current.classList.remove('is-active', 'has-label')
    }
    const down = () => ring.current.classList.add('is-down')
    const up = () => ring.current.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', overInteractive)
    document.addEventListener('pointerout', outInteractive)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', overInteractive)
      document.removeEventListener('pointerout', outInteractive)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="cursor-label" ref={label} />
      </div>
    </>
  )
}
