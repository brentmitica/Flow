// FLOW Animation System
// Philosophy: "Precision Instrument" — spring physics, purposeful motion
// Every animation has exactly one purpose. No decorative motion.

export const DURATIONS = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.35,
  verySlow: 0.5,
} as const;

export const EASINGS = {
  enter: [0.0, 0.0, 0.2, 1.0],
  exit: [0.4, 0.0, 1.0, 1.0],
  snappy: [0.2, 0.0, 0.0, 1.0],
  spring: [0.34, 1.56, 0.64, 1],
} as const;

export const SPRING = {
  snappy: { type: 'spring', stiffness: 500, damping: 30, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 300, damping: 25, mass: 1 },
  bouncy: { type: 'spring', stiffness: 400, damping: 20, mass: 0.8 },
} as const;

// Page transition
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};
export const pageTransition = {
  duration: DURATIONS.slow,
  ease: EASINGS.enter,
};

// Modal
export const modalVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 4 },
};
export const modalTransition = {
  duration: DURATIONS.normal,
  ease: EASINGS.enter,
};

// Sidebar slide
export const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -240, opacity: 0 },
};

// Right panel slide
export const rightPanelVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: 380, opacity: 0 },
};

// List item stagger
export const listContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const listItemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.normal, ease: EASINGS.enter } },
  exit: { opacity: 0, x: 10, height: 0, marginBottom: 0, transition: { duration: DURATIONS.normal } },
};

// Sidebar active indicator
export const sidebarIndicatorVariants = {
  initial: { scaleY: 0, opacity: 0 },
  animate: { scaleY: 1, opacity: 1 },
  exit: { scaleY: 0, opacity: 0 },
};

// Fade in
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATIONS.normal } },
  exit: { opacity: 0, transition: { duration: DURATIONS.fast } },
};

// Scale in
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: SPRING.snappy },
  exit: { opacity: 0, scale: 0.9, transition: { duration: DURATIONS.fast } },
};

// Slide up
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.normal, ease: EASINGS.enter } },
  exit: { opacity: 0, y: 10, transition: { duration: DURATIONS.fast } },
};

// Completion animation (task check)
export const completionVariants = {
  idle: { scale: 1 },
  completing: { scale: [1, 1.4, 1], transition: { duration: 0.3, times: [0, 0.4, 1] } },
};

// Number ticker
export const numberTickerVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: DURATIONS.slow, ease: EASINGS.enter } },
};

// Stagger container for analytics cards
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATIONS.slow, ease: EASINGS.enter } },
};
