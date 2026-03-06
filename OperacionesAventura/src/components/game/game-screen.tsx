"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateMathProblem, type GenerateMathProblemOutput } from '@/ai/flows/generate-math-problem-flow';
import GameHeader from '@/components/game/game-header';
import MathProblemDisplay from '@/components/game/math-problem-display';
import AnswerOptions from '@/components/game/answer-options';
import CelebrationOverlay from '@/components/game/celebration-overlay';
import { Button } from '@/components/ui/button';
import { useGameSounds } from '@/hooks/use-game-sounds';
import { Loader2 } from 'lucide-react';

type GameState = 'loading' | 'playing' | 'checking' | 'correct' | 'incorrect' | 'level-up' | 'treasure';
const CORRECT_ANSWERS_FOR_LEVEL_UP = 5;
const STARS_FOR_TREASURE = 10;
const PROBLEM_CYCLE_LENGTH = 10;

export default function GameScreen() {
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<GenerateMathProblemOutput | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('loading');
  const [hasInteracted, setHasInteracted] = useState(false);

  const { playCorrectSound, playIncorrectSound, playLevelUpSound, startAudioContext } = useGameSounds();

  const fetchNewProblem = useCallback(async () => {
    setGameState('loading');
    setSelectedAnswer(null);
    const operationType = problemCount < (PROBLEM_CYCLE_LENGTH / 2) ? 'addition' : 'subtraction';
    try {
      const problem = await generateMathProblem({ level, operationType });
      setCurrentProblem(problem);
      setGameState('playing');
    } catch (error) {
      console.error("Failed to generate math problem:", error);
    }
  }, [level, problemCount]);

  useEffect(() => {
    fetchNewProblem();
  }, [fetchNewProblem]);

  const handleSelectAnswer = (answer: number) => {
    if (!hasInteracted) {
      startAudioContext();
      setHasInteracted(true);
    }
    if (gameState === 'playing' || gameState === 'incorrect') {
      setSelectedAnswer(answer);
      setGameState('playing'); // Reset from incorrect state
    }
  };

  const handleVerify = () => {
    if (selectedAnswer === null) return;
    setGameState('checking');

    setTimeout(() => {
      if (selectedAnswer === currentProblem?.correctAnswer) {
        setGameState('correct');
        playCorrectSound();
        const newStars = stars + 1;
        setStars(newStars);
        const newCorrectInLevel = correctAnswersInLevel + 1;
        setCorrectAnswersInLevel(newCorrectInLevel);

        if (newStars % STARS_FOR_TREASURE === 0 && newStars > 0) {
          setTimeout(() => setGameState('treasure'), 500);
        } else if (newCorrectInLevel >= CORRECT_ANSWERS_FOR_LEVEL_UP) {
          setTimeout(() => setGameState('level-up'), 500);
        } else {
          setTimeout(handleNextProblem, 2000);
        }
      } else {
        setGameState('incorrect');
        playIncorrectSound();
      }
    }, 500);
  };
  
  const handleNextProblem = useCallback(() => {
    setProblemCount(prev => (prev + 1) % PROBLEM_CYCLE_LENGTH);
    fetchNewProblem();
  }, [fetchNewProblem]);

  const handleLevelUp = () => {
    playLevelUpSound();
    if (level < 4) {
      setLevel(prev => prev + 1);
    }
    setCorrectAnswersInLevel(0);
    setTimeout(handleNextProblem, 3000);
  };

  const handleTreasureAck = () => {
     if (correctAnswersInLevel >= CORRECT_ANSWERS_FOR_LEVEL_UP) {
        setGameState('level-up');
     } else {
        handleNextProblem();
     }
  }

  useEffect(() => {
    if (gameState === 'level-up') {
      handleLevelUp();
    }
  }, [gameState]);


  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen p-4 sm:p-6 md:p-8 overflow-hidden font-headline">
      <GameHeader level={level} stars={stars} progress={(correctAnswersInLevel / CORRECT_ANSWERS_FOR_LEVEL_UP) * 100} />
      
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl">
        {gameState === 'loading' && (
          <div className="flex flex-col items-center justify-center h-64 text-foreground/80">
            <Loader2 className="w-16 h-16 animate-spin text-primary" />
            <p className="mt-4 text-2xl font-semibold">Generando problema...</p>
          </div>
        )}
        {currentProblem && gameState !== 'loading' && (
          <>
            <MathProblemDisplay
              problem={currentProblem}
              selectedAnswer={selectedAnswer}
              isCorrect={gameState === 'correct'}
              isIncorrect={gameState === 'incorrect'}
            />
            <div className="mt-8 sm:mt-12 w-full">
              <AnswerOptions
                options={currentProblem.options}
                onSelect={handleSelectAnswer}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentProblem.correctAnswer}
                gameState={gameState}
              />
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-md mt-8 sm:mt-12">
        <Button
          onClick={handleVerify}
          disabled={selectedAnswer === null || gameState === 'checking' || gameState === 'correct'}
          className="w-full h-16 text-3xl font-bold rounded-2xl bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform transition-transform active:scale-95"
          size="lg"
        >
          {gameState === 'checking' ? <Loader2 className="w-8 h-8 animate-spin" /> : 'Verificar'}
        </Button>
      </div>
      
      <CelebrationOverlay
        show={gameState === 'correct' || gameState === 'level-up' || gameState === 'treasure'}
        type={gameState as 'correct' | 'level-up' | 'treasure'}
        onTreasureAcknowledge={handleTreasureAck}
      />
    </div>
  );
}
