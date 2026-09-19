'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  padZero?: boolean;
  className?: string;
}

export default function AnimatedNumber({
  value,
  padZero = true,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 80,
  });
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const rounded = Math.max(0, Math.round(latest));
        ref.current.textContent = padZero
          ? String(rounded).padStart(2, '0')
          : String(rounded);
      }
    });
    return () => unsubscribe();
  }, [springValue, padZero]);

  return (
    <span ref={ref} className={className}>
      {padZero ? String(value).padStart(2, '0') : String(value)}
    </span>
  );
}
