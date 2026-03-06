"use client";

import { motion, AnimatePresence } from 'framer-motion';

interface DotPatternProps {
  number: number | null;
  color?: string;
}

export default function DotPattern({ number, color = 'bg-foreground/50' }: DotPatternProps) {
  
  if (number === null || typeof number === 'undefined' || number < 1 || number > 20) {
    return <div className="h-28 w-24" />;
  }

  const getGridInfo = (n: number) => {
    if (n <= 1) return { class: 'grid-cols-1', gap: 'gap-2' };
    if (n <= 4) return { class: 'grid-cols-2', gap: 'gap-2' };
    if (n <= 6) return { class: 'grid-cols-3', gap: 'gap-2' };
    if (n <= 9) return { class: 'grid-cols-3', gap: 'gap-1.5' };
    if (n <= 12) return { class: 'grid-cols-4', gap: 'gap-1.5' };
    if (n <= 15) return { class: 'grid-cols-5', gap: 'gap-1.5' };
    if (n <= 20) return { class: 'grid-cols-5', gap: 'gap-1' };
    return { class: 'grid-cols-5', gap: 'gap-1' };
  };

  const gridInfo = getGridInfo(number);
  const dotSize = number > 15 ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`grid ${gridInfo.class} ${gridInfo.gap} w-24 h-28 content-center justify-items-center`}>
      <AnimatePresence>
        {Array.from({ length: number }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }}
            className={`${dotSize} rounded-full ${color}`}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
