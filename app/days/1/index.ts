import type { Task } from '../task';

export class Day1 implements Task {
  private logs: any[] = [];
  solve(input: string): Record<string, unknown> {
    const task1 = this.task1(input);
    const task2 = this.task2(input);
    return { task1, task2, logs: this.logs };
  }

  private task1(input: string) {
    let sum = 0;
    input.split('\n').forEach((line) => {
      const numbersOnly = line.replaceAll(/[a-zA-Z]/g, '');
      if (numbersOnly.length === 0) {
        return;
      }
      sum += Number(`${numbersOnly[0]}${numbersOnly[numbersOnly.length - 1]}`);
    });
    return sum;
  }

  private task2(input: string) {
    let sum = 0;
    input.split('\n').forEach((line) => {
      let numbersOnly = '';

      for (let i = 0; i < line.length; i++) {
        const sliced = line.slice(i, i + 5);
        switch (true) {
          case sliced.search(/^one|^1/) !== -1:
            numbersOnly += '1';
            break;
          case sliced.search(/^two|^2/) !== -1:
            numbersOnly += '2';
            break;
          case sliced.search(/^three|^3/) !== -1:
            numbersOnly += '3';
            break;
          case sliced.search(/^four|^4/) !== -1:
            numbersOnly += '4';
            break;
          case sliced.search(/^five|^5/) !== -1:
            numbersOnly += '5';
            break;
          case sliced.search(/^six|^6/) !== -1:
            numbersOnly += '6';
            break;
          case sliced.search(/^seven|^7/) !== -1:
            numbersOnly += '7';
            break;
          case sliced.search(/^eight|^8/) !== -1:
            numbersOnly += '8';
            break;
          case sliced.search(/^nine|^9/) !== -1:
            numbersOnly += '9';
            break;
        }
      }

      if (line.length === 0) {
        return;
      }

      const val = Number(`${numbersOnly[0]}${numbersOnly[numbersOnly.length - 1]}`);
      sum += val;
    });
    return sum;
  }
}
