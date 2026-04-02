'use client';

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
const logo = "/logo.svg";

interface IntroScreenProps {
  onEnter: () => void;
}

interface BinaryParticle {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  baseOpacity: number;
  hue: number;
  size: number;
  column: number;
  targetY: number;
}

type BootStatus = "INITIALIZING" | "LOADING_ASSETS" | "MOUNTING" | "READY";

export const IntroScreen = ({ onEnter }: IntroScreenProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [bootStatus, setBootStatus] = useState<BootStatus>("INITIALIZING");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<BinaryParticle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const transitionProgressRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const timeRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: BinaryParticle[] = [];
    const columnWidth = 28;
    const columns = Math.ceil(width / columnWidth);
    
    for (let col = 0; col < columns; col++) {
      const particlesInColumn = 3 + Math.floor(Math.random() * 3);
      const columnX = col * columnWidth + Math.random() * 10;
      
      for (let i = 0; i < particlesInColumn; i++) {
        const y = Math.random() * height * 1.5 - height * 0.25;
        const baseOpacity = 0.12 + Math.random() * 0.18;
        const isPrimary = Math.random() > 0.55;
        
        particles.push({
          x: columnX,
          y,
          char: Math.random() > 0.5 ? '1' : '0',
          speed: 1.5 + Math.random() * 2,
          opacity: baseOpacity,
          baseOpacity,
          hue: isPrimary ? 4 + Math.random() * 8 : 0,
          size: 11 + Math.random() * 5,
          column: col,
          targetY: height + 100,
        });
      }
    }
    
    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const progress = transitionProgressRef.current;
    const transitioning = isTransitioningRef.current;
    
    timeRef.current += 0.016;
    const time = timeRef.current;

    if (transitioning) {
      ctx.clearRect(0, 0, width, height);
      const bgOpacity = Math.max(0, 0.9 - progress * 2);
      if (bgOpacity > 0) {
        ctx.fillStyle = `hsla(240, 10%, 4%, ${bgOpacity})`;
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = 'hsla(240, 10%, 4%, 0.08)';
      ctx.fillRect(0, 0, width, height);
    }

    particlesRef.current.forEach((particle) => {
      const isPrimary = particle.hue > 0;
      const color = isPrimary
        ? `hsla(${particle.hue}, 90%, 58%, `
        : `hsla(0, 0%, 75%, `;

      if (transitioning) {
        const acceleration = 1 + progress * 20;
        particle.y += particle.speed * acceleration;
        
        const fadeProgress = Math.min(1, progress * 2);
        particle.opacity = particle.baseOpacity * (1 - fadeProgress);
        
        if (particle.opacity > 0.01 && particle.y < height + 50) {
          ctx.font = `bold ${particle.size}px monospace`;
          ctx.shadowColor = `${color}${particle.opacity * 0.5})`;
          ctx.shadowBlur = isPrimary ? 6 : 3;
          ctx.fillStyle = `${color}${particle.opacity})`;
          ctx.fillText(particle.char, particle.x, particle.y);
          ctx.shadowBlur = 0;
        }
      } else {
        particle.y += particle.speed;
        
        if (particle.y > height + 30) {
          particle.y = -30 - Math.random() * 50;
          particle.char = Math.random() > 0.5 ? '1' : '0';
        }
        
        if (Math.random() > 0.995) {
          particle.char = Math.random() > 0.5 ? '1' : '0';
        }
        
        const pulse = Math.sin(time * 2 + particle.column * 0.5) * 0.2 + 0.8;
        
        ctx.font = `${particle.size}px monospace`;
        ctx.shadowColor = `${color}${particle.baseOpacity * 0.35})`;
        ctx.shadowBlur = isPrimary ? 4 : 2;
        ctx.fillStyle = `${color}${particle.baseOpacity * pulse})`;
        ctx.fillText(particle.char, particle.x, particle.y);
        ctx.shadowBlur = 0;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 2000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const naturalProgress = Math.min(elapsed / minLoadTime, 1);
      const easedProgress = 1 - Math.pow(1 - naturalProgress, 3);
      const progress = Math.round(easedProgress * 100);
      setLoadProgress(progress);
      
      if (progress < 25) {
        setBootStatus("INITIALIZING");
      } else if (progress < 50) {
        setBootStatus("LOADING_ASSETS");
      } else if (progress < 75) {
        setBootStatus("MOUNTING");
      } else if (progress < 100) {
        setBootStatus("READY");
      }
      
      if (naturalProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setIsTransitioning(true), 300);
      }
    };
    
    if (document.readyState === 'complete') {
      updateProgress();
    } else {
      window.addEventListener('load', updateProgress);
      setTimeout(updateProgress, 100);
      return () => window.removeEventListener('load', updateProgress);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'hsl(240, 10%, 4%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, animate]);

  useEffect(() => {
    if (!isTransitioning) return;

    isTransitioningRef.current = true;
    const startTime = Date.now();
    const duration = 800;

    const updateTransition = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      transitionProgressRef.current = easedProgress;
      
      if (progress < 0.15) {
        setContentOpacity(1 - (progress / 0.15));
      } else {
        setContentOpacity(0);
      }
      
      setOverlayOpacity(1 - easedProgress);

      if (progress < 1) {
        requestAnimationFrame(updateTransition);
      } else {
        onEnter();
      }
    };

    updateTransition();
  }, [isTransitioning, onEnter]);

  const getBootStatusText = () => {
    switch (bootStatus) {
      case "INITIALIZING":    return "INITIALIZING...";
      case "LOADING_ASSETS":  return "LOADING ASSETS...";
      case "MOUNTING":        return "MOUNTING COMPONENTS...";
      case "READY":           return "READY";
      default:                return "LOADING...";
    }
  };

  return (
    <motion.div
      className="intro"
      style={{ 
        opacity: overlayOpacity,
        pointerEvents: isTransitioning ? 'none' : 'auto',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div 
        className="intro__background"
        style={{ opacity: overlayOpacity }}
      />
      
      <canvas 
        ref={canvasRef} 
        className="intro__canvas"
      />

      <div 
        className="intro__vignette"
        style={{ 
          opacity: isTransitioning ? 0 : 0.9 
        }}
      />

      <div
        className="intro__content"
        style={{ 
          opacity: contentOpacity,
          transform: `scale(${0.95 + contentOpacity * 0.05}) translateY(${(1 - contentOpacity) * 20}px)`,
        }}
      >
        <motion.div
          className="intro__logo-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 150 }}
        >
          <img
            src={logo}
            alt="Brent Schoenmakers"
            className="intro__logo"
          />
        </motion.div>

        <motion.p
          className="intro__status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {getBootStatusText()}
        </motion.p>

        <motion.div
          className="intro__progress-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="intro__progress-bar">
            <motion.div
              className="intro__progress-fill"
              style={{ width: `${loadProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="intro__progress-text">
            {loadProgress}%
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
