import type { Task } from '../task';

export class Day1 implements Task {
  readonly name = 'day1';

  solve(input: string) {
    const split = input.split('\n');

    let highestValue = 0;
    let currentValue = 0;
    split.forEach((caloryInput) => {
      if (caloryInput === '') {
        if (currentValue > highestValue) {
          highestValue = currentValue;
        }
        currentValue = 0;
        return;
      }
      const calory = parseInt(caloryInput);
      currentValue += calory;
    });

    return {
      message: 'Result of day 1 task',
      highestValue,
    };
  }
}
