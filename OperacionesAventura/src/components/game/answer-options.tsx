"use client";

interface AnswerOptionsProps {
  options: number[];
  onSelect: (answer: number) => void;
  selectedAnswer: number | null;
  correctAnswer: number;
  gameState: 'playing' | 'checking' | 'correct' | 'incorrect' | 'level-up' | 'treasure' | 'loading';
}

const colors = [
  'bg-blue-400 hover:bg-blue-500 border-blue-600',
  'bg-green-400 hover:bg-green-500 border-green-600',
  'bg-yellow-400 hover:bg-yellow-500 border-yellow-600',
  'bg-pink-400 hover:bg-pink-500 border-pink-600',
];

export default function AnswerOptions({ options, onSelect, selectedAnswer, correctAnswer, gameState }: AnswerOptionsProps) {
  
  const getButtonClass = (option: number) => {
    const isSelected = option === selectedAnswer;
    const isCorrect = option === correctAnswer;

    let baseClasses = "relative w-full h-24 sm:h-32 text-6xl font-bold text-white rounded-2xl border-b-8 shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2";
    let colorClass = colors[options.indexOf(option) % colors.length];

    if (gameState === 'checking' || gameState === 'correct' || gameState === 'incorrect') {
      if (isCorrect) {
        return `${baseClasses} bg-green-500 border-green-700 scale-105 ring-green-400 ring-4`;
      }
      if (isSelected && !isCorrect) {
        return `${baseClasses} bg-red-500 border-red-700 animate-[shake_0.5s_ease-in-out]`;
      }
      return `${baseClasses} ${colorClass} opacity-50 scale-95`;
    }

    if(isSelected) {
      return `${baseClasses} ${colorClass} scale-105 -translate-y-2 ring-4 ring-primary`;
    }

    return `${baseClasses} ${colorClass} active:scale-95 active:-translate-y-0`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={getButtonClass(option)}
          disabled={gameState === 'checking' || gameState === 'correct' || gameState === 'level-up'}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
