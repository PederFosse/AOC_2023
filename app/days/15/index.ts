import type { Task } from '../task';

export class Day15 implements Task {
  solve(input: string): Record<string, unknown> {
    const steps = input.replaceAll('\n', '').split(',');

    return {
      task1: this.task1(steps),
      task2: this.task2(steps),
    };
  }

  task1(steps: string[]) {
    return steps.map(hash).reduce((prev, cur) => prev + cur, 0);
  }

  task2(steps: string[]) {
    const allBoxes = [...Array(256).keys()].map((_, index) => new Box(index));
    steps.forEach((step) => {
      if (step.search(/=/) > 0) {
        const [label, focalLength] = step.split('=');
        allBoxes[hash(label)].add({ label, focalLength: Number(focalLength) });
      } else {
        const label = step.replace('-', '');
        allBoxes[hash(label)].remove(label);
      }
    });

    return allBoxes.reduce((prev, cur) => prev + cur.totalFocusPower(), 0);
  }
}

class Box {
  lenses: { label: string; focalLength: number }[] = [];
  boxNumber: number;

  constructor(boxNum: number) {
    this.boxNumber = boxNum;
  }

  add(lens: { label: string; focalLength: number }) {
    const existing = this.lenses.findIndex((l) => l.label === lens.label);
    if (existing >= 0) {
      this.lenses[existing] = lens;
    } else {
      this.lenses.push(lens);
    }
  }

  remove(label: string) {
    const existing = this.lenses.findIndex((l) => l.label === label);
    if (existing >= 0) {
      this.lenses.splice(existing, 1);
    }
  }

  totalFocusPower() {
    return this.lenses.reduce((prev, curr, index) => {
      return prev + (1 + this.boxNumber) * (index + 1) * curr.focalLength;
    }, 0);
  }
}

function hash(input: string) {
  let currentValue = 0;

  for (let i = 0; i < input.length; i++) {
    currentValue += input.charCodeAt(i);
    currentValue *= 17;
    currentValue %= 256;
  }

  return currentValue;
}
