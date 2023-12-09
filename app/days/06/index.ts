import type { Task } from '../task';

export class Day6 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  private getVictorySum(times: number[], distances: number[]) {
    let sum = 1;

    for (let raceIndex = 0; raceIndex < times.length; raceIndex++) {
      console.log(`Checking race no. ${raceIndex}`);
      const record = distances[raceIndex];
      const maxTime = times[raceIndex];

      let firstVictory: number | undefined;
      let lastVictory: number | undefined;
      // find the first victory
      for (let btnTime = 0; btnTime < maxTime; btnTime++) {
        const speed = btnTime;
        const time = maxTime - btnTime;
        const distance = speed * time;

        if (distance > record) {
          firstVictory = btnTime;
          console.log(`First victory = ${btnTime}`);
          break;
        }
      }

      for (let btnTime = maxTime; btnTime > 0; btnTime--) {
        const speed = btnTime;
        const time = maxTime - btnTime;
        const distance = speed * time;

        if (distance > record) {
          lastVictory = btnTime;
          console.log(`Last victory = ${btnTime}`);
          break;
        }
      }

      sum *= lastVictory! - firstVictory! + 1;
    }

    return {
      sum,
    };
  }

  private task1(input: string) {
    const [times, distances] = input
      .split('\n')
      .filter((e) => e !== '')
      .map((line) => {
        return line.split(':')[1].replaceAll(/\s+/g, ' ').trim().split(' ').map(Number);
      });

    const sum = this.getVictorySum(times, distances);

    return {
      sum,
    };
  }

  private task2(input: string) {
    const [times, distances] = input
      .split('\n')
      .filter((e) => e !== '')
      .map((line) => {
        return line.split(':')[1].replaceAll(/\s+/g, '').trim().split(' ').map(Number);
      });

    const sum = this.getVictorySum(times, distances);

    return {
      sum,
    };
  }
}
