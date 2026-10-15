import { destinationOrder, letters, questions, type Answer, type DestinationCode } from './content.ts';

export function isAnswer(value: unknown): value is Answer {
  return typeof value === 'string' && letters.includes(value as Answer);
}
export function calculateDestination(answers: readonly unknown[]): DestinationCode {
  if (answers.length !== 5 || !Array.from(answers).every(isAnswer)) throw new Error('Five valid answers are required.');
  const scores = Object.fromEntries(destinationOrder.map(code => [code, 0])) as Record<DestinationCode, number>;
  const primary = answers.map((answer, i) => {
    const option = questions[i].options[letters.indexOf(answer as Answer)];
    scores[option[2]] += 2;
    scores[option[3]] += 1;
    return option[2];
  });
  const max = Math.max(...Object.values(scores));
  const tied = destinationOrder.filter(code => scores[code] === max);
  return primary.reverse().find(code => tied.includes(code)) ?? tied[0];
}

export type Screen = 'welcome' | 'quiz' | 'sorting' | 'result' | 'error';
export interface QuizState { screen: Screen; current: number; answers: Answer[] }
export const initialState: QuizState = { screen: 'welcome', current: 0, answers: [] };
export const SESSION_KEY = 'discover-your-seoul:v1';
export function restoreState(raw: string | null): QuizState {
  if (!raw) return { ...initialState, answers: [] };
  try {
    const data = JSON.parse(raw);
    if (!data || !['welcome', 'quiz', 'sorting', 'result', 'error'].includes(data.screen) || !Array.isArray(data.answers) || data.answers.length > 5 || !Array.from(data.answers).every(isAnswer) || !Number.isInteger(data.current) || data.current < 0 || data.current > 4) throw new Error();
    if (data.screen === 'welcome') return { ...initialState, answers: [] };
    if (['sorting', 'result'].includes(data.screen)) calculateDestination(data.answers);
    if (data.screen === 'quiz' && data.answers.length < data.current) throw new Error();
    return { screen: data.screen, current: data.current, answers: data.answers };
  } catch { return { screen: 'error', current: 0, answers: [] }; }
}
