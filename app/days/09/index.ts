import type { Task } from '../task';

export class Day9 implements Task {
  solve(input: string): Record<string, unknown> {
    const lines = input.split('\n');

    const sum = lines
      .map((val) => {
        const values = val.split(' ').map(Number);
        return getNextNumber(values);
      })
      .reduce((prev, cur) => prev + cur, 0);

    const reversed = lines
      .map((val) => {
        const values = val.split(' ').map(Number).reverse();
        return getNextNumber(values);
      })
      .reduce((prev, cur) => prev + cur, 0);

    return {
      task1: sum,
      task2: reversed,
    };
  }
}

function getNextNumber(sequence: number[]): number {
  if (sequence.every((val) => val === 0)) {
    return 0;
  }

  const nextSequence: number[] = [];
  sequence.forEach((item, index) => {
    if (index !== 0) {
      const x = item - sequence[index - 1];
      nextSequence.push(x);
    }
  });

  return sequence[sequence.length - 1] + getNextNumber(nextSequence);
}
