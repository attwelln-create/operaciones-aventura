"use client";

import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GameHeaderProps {
  level: number;
  stars: number;
  progress: number;
}

export default function GameHeader({ level, stars, progress }: GameHeaderProps) {
  return (
    <header className="w-full max-w-4xl p-1 bg-white/50 backdrop-blur-sm rounded-lg shadow-md border border-white/80 mb-4 sm:mb-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-center px-1">
          <div className="text-[10px] font-medium text-foreground/70 leading-none">Nivel</div>
          <div className="text-base font-bold text-primary animate-pop-in leading-none" style={{animationDelay: '100ms'}}>{level}</div>
        </div>
        
        <div className="flex-grow mx-2">
            <Progress value={progress} className="h-1.5 border border-primary/20 bg-primary/10" />
        </div>

        <div className="flex items-center gap-1 py-0.5 px-1.5 rounded-full bg-primary/20">
          <Star className="w-3.5 h-3.5 text-primary fill-primary animate-pop-in" style={{animationDelay: '200ms'}} />
          <span className="text-base font-bold text-primary animate-pop-in leading-none" style={{animationDelay: '300ms'}}>{stars}</span>
        </div>
      </div>
    </header>
  );
}
