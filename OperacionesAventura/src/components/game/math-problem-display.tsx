"use client";

import type { GenerateMathProblemOutput } from '@/ai/flows/generate-math-problem-flow';
import DotPattern from './dot-pattern';

interface MathProblemDisplayProps {
  problem: GenerateMathProblemOutput;
  selectedAnswer: number | null;
  isCorrect: boolean;
  isIncorrect: boolean;
}

export default function MathProblemDisplay({ problem, selectedAnswer, isCorrect, isIncorrect }: MathProblemDisplayProps) {
  const { number1, number2, result, operator, missingPosition } = problem;

  const getDisplayValue = (position: 'first' | 'second' | 'result') => {
    if (missingPosition === position) {
      return selectedAnswer !== null ? selectedAnswer : 'x';
    }
    if (position === 'first') return number1;
    if (position === 'second') return number2;
    return result;
  };

  const getDotValue = (position: 'first' | 'second' | 'result') => {
    if (missingPosition === position) {
        return selectedAnswer;
    }
    if (position === 'first') return number1;
    if (position === 'second') return number2;
    return result;
  }

  const values = {
    first: getDisplayValue('first'),
    second: getDisplayValue('second'),
    result: getDisplayValue('result'),
  };

  const dotValues = {
    first: getDotValue('first'),
    second: getDotValue('second'),
    result: getDotValue('result'),
  };

  const partStyle = "flex flex-col items-center gap-2 min-w-[100px] md:min-w-[150px]";
  const operatorStyle = "text-6xl md:text-8xl font-bold text-primary px-4 md:px-8";
  
  const getBoxStyle = (value: number | 'x', position: 'first' | 'second' | 'result') => {
    let baseStyle = "flex items-center justify-center w-24 h-24 md:w-36 md:h-36 rounded-2xl transition-all duration-300";
    
    if (value === 'x') {
      return `${baseStyle} border-4 border-dashed border-foreground/30 text-foreground/30`;
    }

    if (position === missingPosition) {
      if (isCorrect) {
        return `${baseStyle} bg-green-400 border-4 border-green-600 shadow-lg scale-110`;
      }
      if (isIncorrect) {
        return `${baseStyle} bg-red-400 border-4 border-red-600 shadow-lg animate-[shake_0.5s_ease-in-out]`;
      }
      if (selectedAnswer !== null) {
        return `${baseStyle} bg-muted shadow-md`;
      }
    }

    return `${baseStyle} bg-white shadow-md`;
  }
  
  const getNumberStyle = (value: number | 'x', position: 'first' | 'second' | 'result') => {
     let baseStyle = "text-7xl md:text-9xl font-black transition-all duration-300";

     if (value === 'x') {
        return `${baseStyle} text-foreground/30`;
     }

     if (position === missingPosition) {
        if(isCorrect || isIncorrect) {
          return `${baseStyle} text-white`;
        }
     }
     
     return `${baseStyle} text-foreground`;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center">
        <div className={partStyle}>
          <div className={getBoxStyle(values.first, 'first')}>
            <span className={getNumberStyle(values.first, 'first')}>{values.first}</span>
          </div>
        </div>
        <span className={operatorStyle}>{operator}</span>
        <div className={partStyle}>
          <div className={getBoxStyle(values.second, 'second')}>
            <span className={getNumberStyle(values.second, 'second')}>{values.second}</span>
          </div>
        </div>
        <span className={operatorStyle}>=</span>
        <div className={partStyle}>
          <div className={getBoxStyle(values.result, 'result')}>
            <span className={getNumberStyle(values.result, 'result')}>{values.result}</span>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-center mt-4">
        <div className={partStyle}>
            <DotPattern number={dotValues.first} color="bg-primary"/>
        </div>
        <div className="w-12 md:w-24"/>
        <div className={partStyle}>
            <DotPattern number={dotValues.second} color="bg-primary"/>
        </div>
        <div className="w-12 md:w-24"/>
        <div className={partStyle}>
            <DotPattern number={dotValues.result} color="bg-green-400"/>
        </div>
      </div>
    </div>
  );
}
