import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const directionOffset = {
  up:    { y: 40, x: 0 },
  down:  { y: -40, x: 0 },
  left:  { x: 50, y: 0 },
  right: { x: -50, y: 0 },
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  style = {},
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  const offset = directionOffset[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: 'easeOut' }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
