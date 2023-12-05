import type { Task } from '../task';

export class Day5 implements Task {
  solve(input: string): Record<string, unknown> {
    const lines = input.split('\n');
    const almanac = new Almanac();

    lines.forEach((line) => {
      switch (true) {
        case line.startsWith('seeds: '):
          return almanac.addSeedsRange(line);
        case Map.isMapLine(line):
          return almanac.addMap(new Map(line));
        case line !== '':
          return almanac.addRangeToCurrentMap(line);
      }
    });

    return {
      closest: almanac.getClosestLocation(),
    };
  }
}

class Almanac {
  seeds: number[] = [];
  maps: Map[] = [];

  addSeeds(line: string) {
    line
      .replace('seeds: ', '')
      .split(' ')
      .forEach((seed) => {
        this.seeds.push(Number(seed));
      });
  }

  addSeedsRange(line: string) {
    let start: number | undefined;
    line
      .replace('seeds: ', '')
      .split(' ')
      .forEach((seed, index) => {
        const seedVal = Number(seed);
        if (start) {
          const startVal = start;
          this.seeds.push(...Array.from({ length: seedVal }).map((_, i) => startVal + i));
          start = undefined;
        } else {
          start = Number(seed);
        }
      });
  }

  addMap(map: Map) {
    this.maps.push(map);
  }

  addRangeToCurrentMap(input: string) {
    if (this.maps.length === 0) {
      throw new Error('No maps exists');
    }

    this.maps[this.maps.length - 1].addRange(input);
  }

  getClosestLocation() {
    let closest: number | undefined;

    this.seeds.forEach((seed) => {
      let currentVal = seed;
      this.maps.forEach((map) => {
        currentVal = map.convertItem(currentVal);
      });
      if (!closest || (currentVal && closest > currentVal)) {
        closest = currentVal;
      }
    });

    return closest;
  }
}

class Map {
  from: string;
  to: string;

  ranges: { src: number; dest: number; len: number }[] = [];

  constructor(line: string) {
    const [from, to] = line.split(' ')[0].split('-to-');
    this.from = from;
    this.to = to;
  }

  static isMapLine(line: string): boolean {
    return /map:$/.test(line);
  }

  addRange(input: string) {
    const [dest, src, len] = input.split(' ').map((e) => Number(e));
    this.ranges.push({ src, dest, len });
  }

  convertItem(item: number): number {
    console.log('Converting item:', item);
    let converted = item;
    this.ranges.forEach((range) => {
      if (item >= range.src && item < range.src + range.len) {
        converted = item + (range.dest - range.src);
      }
    });
    return converted;
  }
}
