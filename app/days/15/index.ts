import type { Task } from '../task';

export class Day15 implements Task {
  solve(input: string): Record<string, unknown> {
    const sum = input
      .replaceAll('\n', '')
      .split(',')
      .map(hash)
      .reduce((prev, cur) => prev + cur, 0);
    return {
      sum,
    };
  }
}

function hash(input: string) {
  let currentValue = 0;

  for (let i = 0; i < input.length; i++) {
    currentValue += input.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}
