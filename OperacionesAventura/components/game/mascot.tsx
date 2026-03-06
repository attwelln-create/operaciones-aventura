"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MascotProps {
  message: string;
  gameState: string;
}

const AstronautSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Helmet */}
    <circle cx="50" cy="40" r="25" fill="#E0E0E0" />
    <circle cx="50" cy="40" r="22" fill="#FFFFFF" />
    {/* Visor */}
    <path d="M 35 40 Q 50 55 65 40" fill="#212121" stroke="#424242" strokeWidth="2" />
    {/* Body */}
    <path d="M 30 65 L 25 95 L 75 95 L 70 65 Z" fill="#F5F5F5" />
    {/* Backpack */}
    <rect x="25" y="60" width="50" height="20" rx="5" fill="#BDBDBD" />
    {/* Stripe on body */}
    <rect x="45" y="70" width="10" height="15" fill="#FBAC24" />
  </svg>
)

export default function Mascot({ message, gameState }: MascotProps) {
  const [displayMessage, setDisplayMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const mascotImage = PlaceHolderImages.find(img => img.id === 'astronaut-mascot');


  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setShowBubble(true);
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, gameState]);

  return (
    <div className="fixed bottom-4 left-4 w-24 h-24 sm:w-32 sm:h-32 z-30">
        <div className="relative w-full h-full animate-float">
          {mascotImage ? (
            <Image 
                src={mascotImage.imageUrl} 
                alt={mascotImage.description} 
                data-ai-hint={mascotImage.imageHint}
                width={300}
                height={300}
                className="drop-shadow-lg"
            />
          ) : (
            <AstronautSVG />
          )}
        </div>
        {showBubble && (
            <div className="absolute bottom-full mb-2 w-48 bg-white p-3 rounded-xl rounded-bl-none shadow-lg animate-fade-in-up">
                <p className="text-center text-sm font-semibold text-foreground">{displayMessage}</p>
                <div className="absolute left-0 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-white"></div>
            </div>
        )}
    </div>
  );
}
