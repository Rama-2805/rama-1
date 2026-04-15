// Smooth animated number transitions
import { useState, useEffect, useRef } from 'react';

export function useAnimatedValue(targetValue, duration = 800) {
  const [value, setValue] = useState(targetValue);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(targetValue);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = fromRef.current + (targetValue - fromRef.current) * eased;
      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, duration]);

  return value;
}

export default useAnimatedValue;
