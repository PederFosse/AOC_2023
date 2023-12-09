import type { Task } from '../task';

export class Day5 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  private task1(input: string): number {
    const lines = input.split('\n');
    const almanac = new Almanac();

    lines.forEach((line) => {
      switch (true) {
        case line.startsWith('seeds: '):
          return almanac.addSeedsTask1(line);
        case Map.isMapLine(line):
          return almanac.addMap(new Map(line));
        case line !== '':
          return almanac.addRangeToCurrentMap(line);
      }
    });

    return almanac.getClosestLocation();
  }

  private task2(input: string) {
    const lines = input.split('\n');
    const almanac = new Almanac();

    lines.forEach((line) => {
      switch (true) {
        case line.startsWith('seeds: '):
          return almanac.addSeeds(line);
        case Map.isMapLine(line):
          return almanac.addMap(new Map(line));
        case line !== '':
          return almanac.addRangeToCurrentMap(line);
      }
    });

    return almanac.getClosestLocation();
  }
}

class Almanac {
  seedRanges: { start: number; length: number }[] = [];
  maps: Map[] = [];

  addSeedsTask1(line: string) {
    line
      .replace('seeds: ', '')
      .split(' ')
      .forEach((seed) => {
        const numSeeds = Number(seed);
        this.seedRanges.push({ start: numSeeds, length: 1 });
      });
  }

  addSeeds(line: string) {
    let start: number | undefined;

    line
      .replace('seeds: ', '')
      .split(' ')
      .forEach((seed, index) => {
        const numSeeds = Number(seed);
        if (start) {
          this.seedRanges.push({ start, length: numSeeds });
          start = undefined;
        } else {
          start = numSeeds;
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
    let distances: number[] = [];

    this.seedRanges.forEach((range, index) => {
      // This console log is something to keep me from going instane while waiting for the result
      console.log(`Checking range ${index + 1}: ${range.start}, ${range.length} seeds`);
      let currentClosest: number | undefined;
      for (let seed = range.start; seed < range.start + range.length; seed++) {
        let current = seed;
        this.maps.forEach((map) => {
          current = map.convertItem(current);
        });
        if (!currentClosest || currentClosest > current) {
          currentClosest = current;
        }
      }
      distances.push(currentClosest as number);
    });

    return Math.min(...(distances as number[]));
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
    let converted = item;
    this.ranges.forEach((range) => {
      if (item >= range.src && item < range.src + range.len) {
        converted = item + (range.dest - range.src);
      }
    });
    return converted;
  }
}
