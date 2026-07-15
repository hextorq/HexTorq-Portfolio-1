import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { CreditCard, Printer, Ticket } from 'lucide-react';
import './ScrollSplitCard.css';

// Component for single floating particle on hover (subtle addition)
function HoverParticle({ id, x, y }) {
  return (
    <motion.span
      className="particle"
      initial={{ x, y, opacity: 0.8, scale: 0.5 }}
      animate={{
        y: y - 100, // Float up
        x: x + (Math.random() * 40 - 20), // Drift horizontally
        opacity: 0,
        scale: Math.random() * 1.5 + 0.5,
      }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
      }}
    />
  );
}

// 3D Card component handling hover tilt, glare, particles, and flip
function ProductCard({ 
  product, 
  translateX, 
  rotateY, 
  rotateZ,
  isFullyFlipped, // true when scroll is near completion (so hover tilt active)
  sliceType
}) {
  const cardRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for smooth 3D tilt reaction on hover
  const tiltX = useSpring(0, { stiffness: 150, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 20 });

  // Handle cursor positioning inside card for glare and 3D tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current || !isFullyFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    
    tiltX.set(-y * 12); // Tilt along X-axis
    tiltY.set(x * 12);  // Tilt along Y-axis

    // Update glare CSS custom properties
    cardRef.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    cardRef.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };

  const handleMouseEnter = () => {
    if (!isFullyFlipped) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(0);
  };

  // Generate particles on interval while card is hovered
  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      const newParticle = {
        id: Math.random(),
        x: Math.random() * 200 + 20, // Inside card width bounds
        y: 400, // Starts near bottom
      };
      setParticles((prev) => [...prev.slice(-10), newParticle]); // Cap at 10 particles
    }, 200);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      className="card-3d-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x: translateX,
        rotateY: rotateY,
        rotateZ: rotateZ,
        z: isHovered ? 30 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="card-3d-inner"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
        }}
      >
        {/* FRONT FACE: clean image slice */}
        <div className={`card-face card-face-front slice-${sliceType}`}>
          <div className={`cover-slice-wrapper slice-${sliceType}`} />
          <div className="card-face-front-glow" />
        </div>

        {/* BACK FACE: clean minimalist content matching reference design */}
        <div className={`card-face card-face-back theme-${product.id}`}>
          {/* Grain texture overlay */}
          <div className="card-noise-overlay" />
          
          {/* Glare reflect layer */}
          <div className="card-glare-effect" />

          {/* Particles wrapper */}
          <div className="card-particles-container">
            <AnimatePresence>
              {particles.map((p) => (
                <HoverParticle key={p.id} id={p.id} x={p.x} y={p.y} />
              ))}
            </AnimatePresence>
          </div>

          {/* Top Icon */}
          <div className="product-icon">{product.icon}</div>

          {/* Bottom Title & Description */}
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollSplitCard() {
  const containerRef = useRef(null);
  const [isFullyFlipped, setIsFullyFlipped] = useState(false);

  // Set up scroll tracking for timeline animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out scroll progress using spring dynamics for silky smooth split and rotation transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.001
  });

  // Track progress status to enable mouse interactions
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      // Once scroll reaches 80% complete, enable hover interaction
      setIsFullyFlipped(latest >= 0.8);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Transform timelines linked to the smooth scroll progress spring
  // Phase 1: Card Spacing / Split Separation (Scroll progress 0.05 to 0.45)
  const splitProgress = useTransform(smoothProgress, [0.05, 0.45], [0, 1]);
  
  // Set Left and Right X translation offsets based on screen width
  const translateXLeft = useTransform(splitProgress, [0, 1], ['0px', '-40px']);
  const translateXRight = useTransform(splitProgress, [0, 1], ['0px', '45px']);

  // Rotate Z (Tilt) for the cards as they split out
  const rotateZLeft = useTransform(splitProgress, [0, 1], [0, -6]);
  const rotateZRight = useTransform(splitProgress, [0, 1], [0, 6]);

  // Phase 2: 3D Y-Axis Card Flips (Scroll progress 0.40 to 0.85, staggered per card)
  const rotateYLeft = useTransform(smoothProgress, [0.40, 0.65], [0, 180]);
  const rotateYCenter = useTransform(smoothProgress, [0.50, 0.75], [0, 180]);
  const rotateYRight = useTransform(smoothProgress, [0.60, 0.85], [0, 180]);

  // Hint Fade (Scroll progress 0.75 to 0.90)
  const hintOpacity = useTransform(smoothProgress, [0.75, 0.90], [1, 0]);

  const productsData = [
    {
      id: 'paypanda',
      name: 'PayPanda',
      description: "A secure, developer-first payment gateway with a clean API, fraud protection and fast settlement.",
      icon: <CreditCard size={24} strokeWidth={2} />,
    },
    {
      id: 'printpanda',
      name: 'PrintPanda',
      description: "Printing, fully automated. Upload files, pay online, and print jobs queue instantly.",
      icon: <Printer size={24} strokeWidth={2} />,
    },
    {
      id: 'ticketspanda',
      name: 'TicketsPanda',
      description: "End-to-end event ticketing. Register events, collect payments, and issue tickets automatically.",
      icon: <Ticket size={24} strokeWidth={2} />,
    },
  ];

  return (
    <div ref={containerRef} className="scroll-split-container">
      <div className="scroll-split-sticky">
        <div className="scroll-split-bg-grid" />

        {/* The Hextorq Stack Header — positioned cleanly above the cards */}
        <div className="scroll-split-header">
          <span className="eyebrow">THE HEXTORQ STACK</span>
          <h2>The Hextorq Stack</h2>
        </div>

        <div className="split-cards-wrapper">
          {/* Core cards container grid */}
          <div className="split-cards-grid">
            <ProductCard
              product={productsData[0]}
              translateX={translateXLeft}
              rotateY={rotateYLeft}
              rotateZ={rotateZLeft}
              isFullyFlipped={isFullyFlipped}
              sliceType="left"
            />
            <ProductCard
              product={productsData[1]}
              translateX="0px"
              rotateY={rotateYCenter}
              rotateZ={0}
              isFullyFlipped={isFullyFlipped}
              sliceType="center"
            />
            <ProductCard
              product={productsData[2]}
              translateX={translateXRight}
              rotateY={rotateYRight}
              rotateZ={rotateZRight}
              isFullyFlipped={isFullyFlipped}
              sliceType="right"
            />
          </div>
        </div>

        {/* Scroll action reminder hint */}
        <motion.div 
          className="scroll-split-hint"
          style={{ opacity: hintOpacity }}
        >
          <span>Scroll to rotate</span>
          <div className="scroll-line" style={{ height: '30px' }} />
        </motion.div>
      </div>
    </div>
  );
}
