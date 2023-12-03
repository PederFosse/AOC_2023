import {
  Day1,
  Day2,
  Day3,
  Day4,
  Day5,
  Day6,
  Day7,
  Day8,
  Day9,
  Day10,
  Day11,
  Day12,
  Day13,
  Day14,
  Day15,
  Day16,
  Day17,
  Day18,
  Day19,
  Day20,
  Day21,
  Day22,
  Day23,
  Day24,
} from '.';
import type { Task } from './task';

let instance: TaskSolver | undefined = undefined;

export class TaskSolver {
  private tasks: Map<string, Task>;
  private instance: TaskSolver | undefined;

  private constructor() {
    this.tasks = new Map();
    this.tasks.set('1', new Day1());
    this.tasks.set('2', new Day2());
    this.tasks.set('3', new Day3());
    this.tasks.set('4', new Day4());
    this.tasks.set('5', new Day5());
    this.tasks.set('6', new Day6());
    this.tasks.set('7', new Day7());
    this.tasks.set('8', new Day8());
    this.tasks.set('9', new Day9());
    this.tasks.set('10', new Day10());
    this.tasks.set('11', new Day11());
    this.tasks.set('12', new Day12());
    this.tasks.set('13', new Day13());
    this.tasks.set('14', new Day14());
    this.tasks.set('15', new Day15());
    this.tasks.set('16', new Day16());
    this.tasks.set('17', new Day17());
    this.tasks.set('18', new Day18());
    this.tasks.set('19', new Day19());
    this.tasks.set('20', new Day20());
    this.tasks.set('21', new Day21());
    this.tasks.set('22', new Day22());
    this.tasks.set('23', new Day23());
    this.tasks.set('24', new Day24());
  }

  getTask(name: string): Task | undefined {
    const task = this.tasks.get(name);
    return task;
  }

  static getInstance(): TaskSolver {
    if (!instance) {
      instance = new TaskSolver();
    }

    return instance;
  }
}
