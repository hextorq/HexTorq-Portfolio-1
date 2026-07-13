import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity } from 'lucide-react';
import './IntroAnimation.css';

export default function IntroAnimation({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [step, setStep] = useState(0);

  const bootLogs = [
    'INIT: HEXTORQ FOUNDRY SEED-CORE v2.06',
    'SECURE: Handshaking with secure container cluster...',
    'RESOLVED: Host mapping 0.0.0.0:3000 -> Active',
    'LOAD: Initializing WebGL Three.js constellation pipeline...',
    'SYS: Calibrating high-availability latency maps (12ms SLA)...',
    'SECURITY: Encrypted keys dispatched to client state storage...',
    'FOUNDRY: Active compiling loops initialized successfully.',
    'STATUS: CORE ONLINE. PRE-FLIGHT CHECKS CLEAR.',
  ];

  useEffect(() => {
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setStep(1), 500);
      }
    }, 220);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (step === 1) {
      const endTimer = setTimeout(() => {
        setStep(2);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }, 2600);

      return () => clearTimeout(endTimer);
    }
  }, [step, onComplete]);

  const letters = 'HEXTORQ'.split('');

  return (
    <AnimatePresence>
      {step < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -100,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="intro-container"
        >
          <div className="intro-bg-grid" />
          
          <div className="intro-blob-cyan" />
          <div className="intro-blob-purple" />

          <div className="intro-content-wrapper">
            {step === 0 ? (
              <div className="intro-terminal">
                <div className="intro-terminal-header">
                  <span className="intro-terminal-header-title">
                    <Terminal className="intro-terminal-icon" />
                    <span>HEXTORQ CORE INITIALIZATION</span>
                  </span>
                  <span className="intro-terminal-status-ok">CONNECTING</span>
                </div>

                <div className="intro-terminal-logs">
                  {logs.map((log, index) => {
                    let logClass = '';
                    if (log && (log.includes('STATUS') || log.includes('RESOLVED'))) {
                      logClass = 'intro-log-highlight';
                    } else if (log && log.includes('INIT')) {
                      logClass = 'intro-log-white';
                    }
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className="intro-log-line"
                      >
                        <span className="intro-log-index">[{index + 1}]</span>
                        <span className={logClass}>{log}</span>
                      </motion.div>
                    );
                  })}
                  {logs.length < bootLogs.length && (
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="intro-cursor"
                    />
                  )}
                </div>

                <div className="intro-terminal-footer">
                  <span>SECURE CHANNEL TUNNELED</span>
                  <span>LATENCY: 12MS</span>
                </div>
              </div>
            ) : (
              <div className="intro-brand-container">
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="intro-brand-indicator"
                >
                  <Activity className="intro-brand-indicator-icon" />
                  <span>FOUNDRY COGNITIVE ONLINE</span>
                </motion.div>

                <div className="intro-brand-letters">
                  {letters.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ 
                        opacity: 0, 
                        y: 40, 
                        filter: 'blur(10px)',
                        scale: 0.6 
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        filter: 'blur(0px)',
                        scale: 1 
                      }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.08, 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="intro-brand-letter"
                    >
                      <span>{char}</span>
                      <span className="intro-brand-letter-glow" />
                    </motion.span>
                  ))}
                </div>

                <div className="intro-progress-bar">
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="intro-progress-fill"
                  />
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="intro-brand-text"
                >
                  Launching system control interface and cognitive diagnostic tools.
                </motion.p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
