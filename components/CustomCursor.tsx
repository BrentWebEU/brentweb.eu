'use client';

import { useEffect, useState, useCallback, memo } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = memo(() => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 500, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button'], .hoverable, input, textarea, select")) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a, button, [role='button'], .hoverable, input, textarea, select")) {
      setIsHovering(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [moveCursor, handleMouseOver, handleMouseOut, handleMouseLeave, handleMouseEnter]);

  return (
    <motion.div
      className="custom-cursor"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        className={isHovering ? "custom-cursor__dot custom-cursor__dot--hover" : "custom-cursor__dot custom-cursor__dot--default"}
        animate={{
          width: isHovering ? 48 : 12,
          height: isHovering ? 48 : 12,
          backgroundColor: isHovering ? "rgba(235, 74, 76, 0.2)" : "hsl(var(--primary))",
          borderWidth: isHovering ? 2 : 0,
          borderColor: "hsl(var(--primary))",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ borderStyle: "solid" }}
      />
    </motion.div>
  );
});