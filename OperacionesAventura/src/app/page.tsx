"use client";

import { useState } from 'react';
import GameScreen from '@/components/game/game-screen';
import WelcomeScreen from '@/components/game/welcome-screen';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <main className="min-h-screen w-full">
      {gameStarted ? <GameScreen /> : <WelcomeScreen onStartGame={startGame} />}
    </main>
  );
}
