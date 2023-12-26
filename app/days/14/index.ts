import type { Task } from '../task';

export class Day14 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      // task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  task2(input: string) {
    const turtoise = new Platform(input);
    const hare = new Platform(input);

    let stepsPerCycle: number | undefined;
    let currentStep = 0;

    while (!stepsPerCycle) {
      currentStep++;
      hare.tiltInAllDirections();
      hare.tiltInAllDirections();

      turtoise.tiltInAllDirections();

      if (hare.getStringifiedRocks() === turtoise.getStringifiedRocks()) {
        stepsPerCycle = currentStep;
      }
    }

    const totalSteps = 1_000_000_000 % stepsPerCycle;

    const platform = new Platform(input);
    for (let i = 0; i < stepsPerCycle + totalSteps; i++) {
      platform.tiltInAllDirections();
    }

    let totalScore = 0;
    platform.rocks.forEach((row, rowIndex) => {
      const score = platform.rocks.length - rowIndex;
      row.forEach((rock) => {
        if (rock instanceof Rock && rock.isRound) {
          totalScore += score;
        }
      });
    });

    return totalScore;
  }

  task1(input: string) {
    const platform = new Platform(input);

    const directions = ['north', 'west', 'south', 'east'];
    const cycles = 1000;

    for (let cycle = 0; cycle < cycles; cycle++) {
      for (const direction of directions) {
        platform.tilt(direction);
      }
    }

    let totalScore = 0;
    platform.rocks.forEach((row, rowIndex) => {
      const score = platform.rocks.length - rowIndex;
      row.forEach((rock) => {
        if (rock instanceof Rock && rock.isRound) {
          totalScore += score;
        }
      });
    });

    return {
      totalScore,
    };
  }
}

class Platform {
  rocks: (Rock | '.')[][];

  constructor(puzzleInput: string) {
    this.rocks = [];

    puzzleInput
      .trim()
      .split('\n')
      .forEach((row, rowIndex) => {
        const currentRow: (Rock | '.')[] = [];
        for (let i = 0; i < row.length; i++) {
          const val = row[i];
          if (val !== '.') {
            const rock = new Rock({ value: val, row: rowIndex, col: i }, this);
            currentRow.push(rock);
          } else {
            currentRow.push('.');
          }
        }
        this.rocks.push(currentRow);
      });
  }

  tiltInAllDirections() {
    const directions = ['north', 'west', 'south', 'east'];

    for (const direction of directions) {
      this.tilt(direction);
    }
  }

  getStringifiedRocks() {
    return JSON.stringify(this.rocks.map((r) => r.toString()));
  }

  getRock(row: number, col: number) {
    if (row < 0 || row >= this.rocks.length) {
      return undefined;
    }

    if (col < 0 || col >= this.rocks[0].length) {
      return undefined;
    }

    return this.rocks[row][col];
  }

  tilt(direction: string) {
    const rows = this.rocks.length;
    const cols = this.rocks[0].length;

    if (direction === 'north' || direction === 'west') {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const rock = this.getRock(j, i);
          if (rock instanceof Rock && rock.canRoll(direction)) {
            rock.roll(direction);
          }
        }
      }
    } else {
      for (let i = rows - 1; i >= 0; i--) {
        for (let j = cols - 1; j >= 0; j--) {
          const rock = this.getRock(j, i);
          if (rock instanceof Rock && rock.canRoll(direction)) {
            rock.roll(direction);
          }
        }
      }
    }
  }
}

class Rock {
  platform: Platform;
  isRound: boolean;
  row: number;
  col: number;

  constructor({ value, row, col }: { value: string; row: number; col: number }, platform: Platform) {
    this.platform = platform;
    this.isRound = value === 'O';
    this.row = row;
    this.col = col;
  }

  toString() {
    return `${this.row}:${this.col}:${this.isRound}`;
  }

  getAdjacentRock(direction: string) {
    switch (direction) {
      case 'north':
        return this.platform.getRock(this.row - 1, this.col);
      case 'west':
        return this.platform.getRock(this.row, this.col - 1);
      case 'south':
        return this.platform.getRock(this.row + 1, this.col);
      case 'east':
        return this.platform.getRock(this.row, this.col + 1);
      default:
        throw new Error('getAdjacentRock called with bad direction');
    }
  }

  roll(direction: string) {
    const adjacentRock = this.getAdjacentRock(direction);
    if (!adjacentRock) throw new Error('Rock cannot roll');

    if (direction === 'north') {
      this.platform.rocks[this.row - 1][this.col] = this;
      this.platform.rocks[this.row][this.col] = adjacentRock;

      this.row--;
    } else if (direction === 'west') {
      this.platform.rocks[this.row][this.col - 1] = this;
      this.platform.rocks[this.row][this.col] = adjacentRock;

      this.col--;
    } else if (direction === 'south') {
      this.platform.rocks[this.row + 1][this.col] = this;
      this.platform.rocks[this.row][this.col] = adjacentRock;

      this.row++;
    } else {
      this.platform.rocks[this.row][this.col + 1] = this;
      this.platform.rocks[this.row][this.col] = adjacentRock;

      this.col++;
    }

    if (this.canRoll(direction)) {
      this.roll(direction);
    }
  }

  canRoll(direction: string) {
    if (!this.isRound) {
      return false;
    }

    return this.getAdjacentRock(direction) === '.';
  }
}
