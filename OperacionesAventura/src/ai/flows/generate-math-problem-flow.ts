'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate math problems (addition and subtraction)
 * for the 'Aventura de Números' game. It handles different difficulty levels, missing number positions,
 * and generates four answer options including one correct answer and three close distractors.
 *
 * - generateMathProblem - The main function to generate a math problem.
 * - GenerateMathProblemInput - The input type for the generateMathProblem function.
 * - GenerateMathProblemOutput - The return type for the generateMathProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMathProblemInputSchema = z.object({
  level: z.number().int().min(1).max(4).describe('The current game level (1-4).'),
  operationType: z.enum(['addition', 'subtraction']).describe('The type of math operation to generate.'),
});
export type GenerateMathProblemInput = z.infer<typeof GenerateMathProblemInputSchema>;

const GenerateMathProblemOutputSchema = z.object({
  problem: z.string().describe('The math problem string, e.g., "6 + x = 10".'),
  number1: z.number().int().describe('The first number in the operation.'),
  number2: z.number().int().describe('The second number in the operation.'),
  result: z.number().int().describe('The result of the operation.'),
  operator: z.enum(['+', '-']).describe('The operator used in the problem.'),
  missingPosition: z.enum(['first', 'second', 'result']).describe('The position of the missing number (x).'),
  options: z.array(z.number().int()).length(4).describe('An array of four answer options, including the correct one.'),
  correctAnswer: z.number().int().describe('The correct numerical answer for x.'),
});
export type GenerateMathProblemOutput = z.infer<typeof GenerateMathProblemOutputSchema>;

// Helper function to get a random integer within a range [min, max]
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const generateMathProblemFlow = ai.defineFlow(
  {
    name: 'generateMathProblemFlow',
    inputSchema: GenerateMathProblemInputSchema,
    outputSchema: GenerateMathProblemOutputSchema,
  },
  async (input) => {
    const { level, operationType } = input;

    let maxNum: number;
    switch (level) {
      case 1:
        maxNum = 5;
        break;
      case 2:
        maxNum = 10;
        break;
      case 3:
        maxNum = 15;
        break;
      case 4:
        maxNum = 20;
        break;
      default:
        maxNum = 5; // Default for safety, though schema restricts input
    }

    let number1: number;
    let number2: number;
    let result: number;
    let operator: '+' | '-';

    const MAX_OPERATION_RESULT = 20;
    const MIN_NUMBER = 0;

    if (operationType === 'addition') {
      operator = '+';
      do {
        number1 = getRandomInt(MIN_NUMBER, maxNum);
        number2 = getRandomInt(MIN_NUMBER, maxNum);
        result = number1 + number2;
      } while (result > MAX_OPERATION_RESULT);
    } else { // subtraction
      operator = '-';
      do {
        result = getRandomInt(MIN_NUMBER, maxNum);
        number1 = getRandomInt(result, maxNum); // number1 must be >= result to avoid negative numbers when finding number2
        number2 = number1 - result;
        // Ensure number2 is also within maxNum if it was generated indirectly through number1 - result
      } while (number2 > maxNum);
    }

    const missingPositions: Array<GenerateMathProblemOutput['missingPosition']> = ['first', 'second', 'result'];
    const missingPosition = missingPositions[getRandomInt(0, 2)];

    let problemString: string;
    let correctAnswer: number;

    switch (missingPosition) {
      case 'first':
        problemString = `x ${operator} ${number2} = ${result}`;
        correctAnswer = number1;
        break;
      case 'second':
        problemString = `${number1} ${operator} x = ${result}`;
        correctAnswer = number2;
        break;
      case 'result':
        problemString = `${number1} ${operator} ${number2} = x`;
        correctAnswer = result;
        break;
    }

    // Generate answer options
    const options: Set<number> = new Set();
    options.add(correctAnswer);

    // Add distractors close to the correct answer
    const potentialDistractors: number[] = [
      correctAnswer - 2,
      correctAnswer - 1,
      correctAnswer + 1,
      correctAnswer + 2,
    ];

    const filteredDistractors = potentialDistractors.filter(
      (num) => num >= MIN_NUMBER && num <= MAX_OPERATION_RESULT && num !== correctAnswer
    );

    shuffleArray(filteredDistractors);

    for (const distractor of filteredDistractors) {
      if (options.size < 4) {
        options.add(distractor);
      }
    }

    // If not enough distractors from the close range, add random ones
    while (options.size < 4) {
      let randomDistractor: number;
      do {
        randomDistractor = getRandomInt(MIN_NUMBER, MAX_OPERATION_RESULT);
      } while (options.has(randomDistractor));
      options.add(randomDistractor);
    }

    const finalOptions = shuffleArray(Array.from(options));

    return {
      problem: problemString,
      number1,
      number2,
      result,
      operator,
      missingPosition,
      options: finalOptions,
      correctAnswer,
    };
  }
);

export async function generateMathProblem(input: GenerateMathProblemInput): Promise<GenerateMathProblemOutput> {
  return generateMathProblemFlow(input);
}
