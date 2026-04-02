import { motion } from "framer-motion";
import { memo } from "react";

export const DoodleArrow = memo(({ className = "" }: { className?: string }) => (
  <motion.svg
    initial={{ opacity: 0, pathLength: 0 }}
    whileInView={{ opacity: 0.6, pathLength: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
    className={className}
    width="100"
    height="60"
    viewBox="0 0 100 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M5 30 Q 30 10, 50 25 T 85 30"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    />
    <motion.path
      d="M75 22 L85 30 L78 38"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
    />
  </motion.svg>
));

export const DoodleCircle = memo(({ className = "" }: { className?: string }) => (
  <motion.svg
    initial={{ opacity: 0, rotate: -10 }}
    whileInView={{ opacity: 0.4, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className={className}
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.circle
      cx="40"
      cy="40"
      r="30"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="2 4"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </motion.svg>
));

export const DoodleUnderline = memo(({ className = "" }: { className?: string }) => (
  <motion.svg
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.7 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className={className}
    width="120"
    height="12"
    viewBox="0 0 120 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M2 8 Q30 4, 60 8 T118 8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  </motion.svg>
));

export const DoodleStar = memo(({ className = "" }: { className?: string }) => (
  <motion.svg
    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
    whileInView={{ opacity: 0.5, scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "backOut" }}
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2 L23 15 L36 15 L26 23 L30 36 L20 28 L10 36 L14 23 L4 15 L17 15 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </motion.svg>
));

export const DoodleScribble = memo(({ className = "" }: { className?: string }) => (
  <motion.svg
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 0.3 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    className={className}
    width="60"
    height="40"
    viewBox="0 0 60 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M5 20 Q15 5, 25 20 Q35 35, 45 20 Q55 10, 55 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </motion.svg>
));
