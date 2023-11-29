import { Day1 } from './1';
import { Day2 } from './2';
import type { Task } from './task';

let instance: TaskSolver | undefined = undefined;

export class TaskSolver {
  private tasks: Map<string, Task>;
  private instance: TaskSolver | undefined;

  private constructor() {
    this.tasks = new Map();
    this.tasks.set('day1', new Day1());
    this.tasks.set('day2', new Day2());
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
