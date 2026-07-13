import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { brand } from '../content'
import './Preloader.css'

/* Diagnostic boot logs — cycle as the progress bar fills. */
const BOOT_LOGS = [
  'INITIALIZING SYSTEM CORE...',
  'LOADING WEBGL RENDERING SHADERS...',
  'SPINNING UP GEOMETRIC TORQUE MATRIX...',
  'SYNCHRONIZING ENTERPRISE CRM & ERP CORES...',
  'SPAWNING AI CHATBOTS & INTELLIGENT NEURAL AGENTS...',
  'ORCHESTRATING INDUSTRIAL IOT SENSOR MESHES...',
  'FORMATTING IEEE GRADUATION RESEARCH TEMPLATES...',
  'ESTABLISHING PRINTPANDA RENDER NODES...',
  'CONFIGURING PAYPANDA TRANSACTION GATEWAYS...',
  'MOUNTING TICKETSPANDA EVENT QUEUES...',
  'SECURE HANDSHAKE SUCCESSFUL.',
  'HEXTORQ ECOSYSTEM INSTANTIATED.',
]

/**
 * Intro loader — a spinning hexagonal core, the HEXTORQ wordmark
 * revealing letter-by-letter, a progress bar and cycling diagnostic
 * boot logs. Wipes up when the boot completes, then calls onDone().
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)

  const letters = brand.intro.split('') // H E X T O R Q
  const xIndex = brand.intro.indexOf('X')

  // Drive the progress bar with a randomized step speed.
  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4
      if (current >= 100) {
        current = 100
        clearInterval(interval)
      }
      setProgress(current)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Map progress → current boot-log line.
  useEffect(() => {
    const segment = 100 / BOOT_LOGS.length
    setLogIndex(Math.min(Math.floor(progress / segment), BOOT_LOGS.length - 1))
  }, [progress])

  // Staggered letter reveal on mount.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pre-letter', {
        y: 44,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.15,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // When boot completes, hold briefly then wipe the overlay up.
  useEffect(() => {
    if (progress < 100) return
    const t = setTimeout(() => {
      const tl = gsap.timeline({ onComplete: () => onDone?.() })
      tl.to('.pre-inner', { opacity: 0, y: -20, duration: 0.45, ease: 'power2.in' })
      tl.to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
    }, 600)
    return () => clearTimeout(t)
  }, [progress, onDone])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pre-inner">
        {/* Spinning hexagonal core */}
        <div className="hex-logo">
          <svg className="hex-outer" viewBox="0 0 100 100">
            <polygon
              points="50,3 93,28 93,78 50,97 7,78 7,28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="10, 10"
            />
          </svg>
          <svg className="hex-inner" viewBox="0 0 100 100">
            <polygon
              points="50,15 80,32 80,68 50,85 20,68 20,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
          </svg>
          <span className="hex-core" />
        </div>

        {/* Wordmark */}
        <div className="pre-word">
          {letters.map((ch, i) => (
            <span className={`pre-letter ${i === xIndex ? 'is-x' : ''}`} key={i}>
              {ch}
            </span>
          ))}
        </div>

        {/* Progress + diagnostics */}
        <div className="pre-readout">
          <div className="pre-bar">
            <div className="pre-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="pre-meta">
            <span className="pre-meta-label">SYSTEM CORE SEED</span>
            <span className="pre-meta-pct">{progress}%</span>
          </div>
          <div className="pre-log" key={logIndex}>{BOOT_LOGS[logIndex]}</div>
        </div>
      </div>
    </div>
  )
}
