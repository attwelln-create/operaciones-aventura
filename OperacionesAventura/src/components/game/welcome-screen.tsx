"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface WelcomeScreenProps {
  onStartGame: () => void;
}

const BackgroundStar = ({ i }: { i: number }) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        setStyle({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random()}s`,
        });
    }, []);

    return (
        <Star
            key={i}
            className="absolute text-primary/20"
            style={style}
        />
    );
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 overflow-hidden font-headline bg-background text-foreground">
        {/* Background decoration */}
        {Array.from({ length: 15 }).map((_, i) => (
            <BackgroundStar key={i} i={i} />
        ))}

        <div className="relative z-10 text-center flex flex-col items-center">
            <h1 className="text-6xl sm:text-8xl font-black text-primary drop-shadow-lg animate-pop-in">
                Operaciones para Genios
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-foreground/80 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                ¡Embárcate en una aventura matemática y conviértete en un genio de los números!
            </p>
            <Button
                onClick={onStartGame}
                className="mt-12 h-16 text-3xl font-bold rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform transition-transform active:scale-95 animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}
                size="lg"
            >
                Jugar
            </Button>
        </div>
    </div>
  );
}
