import type { Task } from '../task';

export class Day2 implements Task {
  solve(input: string): Record<string, unknown> {
    const lines = input.split('\n');

    let sumOfValidIds = 0;
    let sumOfPowers = 0;

    lines.forEach((line) => {
      if (line.length === 0) {
        return;
      }
      const game = new Game(line);

      if (game.isValidGame(12, 13, 14)) {
        sumOfValidIds += game.id;
      }

      sumOfPowers += game.powerOfFewestCubesNeeded();
    });

    return {
      sumOfValidIds,
      sumOfPowers
    };
  }
}

class Game {
  id: number;
  sets: {
    blue: number;
    red: number;
    green: number;
  }[] = [];

  constructor(line: string) {
    const [name, setsString] = line.split(': ');
    this.id = Number(name.replace('Game ', ''));
    const sets = setsString.split('; ').map((set) => set.split(', '));
    sets.forEach((set) => {
      const currentSet = {
        red: 0,
        green: 0,
        blue: 0,
      };
      set.forEach((cube) => {
        const [val, color] = cube.split(' ');
        switch (color) {
          case 'red':
            currentSet.red += Number(val);
            break;
          case 'green':
            currentSet.green += Number(val);
            break;
          case 'blue':
            currentSet.blue += Number(val);
            break;
        }
      });
      this.sets.push(currentSet);
    });
  }

  isValidGame(actualRed: number, actualGreen: number, actualBlue: number) {
    return this.sets.every((set) => {
      return set.red <= actualRed && set.green <= actualGreen && set.blue <= actualBlue;
    });
  }

  powerOfFewestCubesNeeded(): number {
    const cubes = { red: 0, green: 0, blue: 0 };
    this.sets.forEach((set) => {
      if (set.red > cubes.red) cubes.red = set.red;
      if (set.green > cubes.green) cubes.green = set.green;
      if (set.blue > cubes.blue) cubes.blue = set.blue;
    });

    return cubes.red * cubes.green * cubes.blue;
  }
}
