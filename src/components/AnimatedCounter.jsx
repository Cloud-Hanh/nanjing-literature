import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ numericPart, suffix = '', duration = 2000, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * numericPart));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(numericPart);
    };
    requestAnimationFrame(animate);
  }, [inView, numericPart, duration]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}
