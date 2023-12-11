import type { Task } from '../task';

export class Day10 implements Task {
  solve(input: string): Record<string, unknown> {
    const map = new PipeMap(input);
    const totalSteps = map.traverse();
    console.log(totalSteps);
    return {
      steps: totalSteps && totalSteps / 2,
    };
  }
}

class PipeMap {
  pipes = new Map<string, Pipe>();
  start?: Pipe;

  constructor(puzzleInput: string) {
    puzzleInput
      .trim()
      .split('\n')
      .forEach((row, rowIndex) => {
        row.split('').forEach((value, colIndex) => {
          const created = this.setPipe(rowIndex, colIndex, value);
          if (created.value === 'S') {
            this.start = created;
          }
        });
      });
  }

  traverse() {
    const start = this.start;
    if (!start) {
      throw new Error('Cannot find start node');
    }

    const totalSteps = start.traverse();
    return totalSteps;
  }

  private setPipe(row: number, col: number, value: string) {
    const pipe = new Pipe(row, col, value, this);
    this.pipes.set(`${row}:${col}`, pipe);
    return pipe;
  }

  getPipe(row: number, col: number): Pipe | undefined {
    const pipe = this.pipes.get(`${row}:${col}`);
    return pipe;
  }
}

class Pipe {
  row: number;
  col: number;
  value: string;
  map: PipeMap;

  constructor(row: number, col: number, value: string, map: PipeMap) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.map = map;
  }

  traverse(): number {
    let steps = 0;
    let current: { nextNode: Pipe; prevPos: 'top' | 'bottom' | 'left' | 'right' } | undefined;
    try {
      console.log('Top pipe');
      const topPipe = this.topNode();
      if (['|', 'F', '7'].includes(topPipe.value)) {
        current = {
          nextNode: topPipe,
          prevPos: 'bottom',
        };
      }
    } catch (err) {
      console.log(err);
    }

    try {
      console.log('Left pipe');
      const leftPipe = this.leftNode();
      if (['-', 'F', 'L'].includes(leftPipe.value)) {
        current = {
          nextNode: leftPipe,
          prevPos: 'right',
        };
      }
    } catch (err) {
      console.log(err);
    }
    try {
      const bottomPipe = this.bottomNode();
      if (['|', 'J', 'L'].includes(bottomPipe.value)) {
        current = {
          nextNode: bottomPipe,
          prevPos: 'top',
        };
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const rightPipe = this.rightNode();
      if (['-', 'J', '7'].includes(rightPipe.value)) {
        current = {
          nextNode: rightPipe,
          prevPos: 'left',
        };
      }
    } catch (err) {
      console.log(err);
    }

    while (current !== undefined) {
      current = current.nextNode.next(current.prevPos);
      steps++;
    }

    return steps;
  }

  private topNode() {
    const node = this.map.getPipe(this.row - 1, this.col);
    if (!node) {
      throw new Error('topNode does not exist');
    }
    return node;
  }

  private leftNode() {
    const node = this.map.getPipe(this.row, this.col - 1);
    if (!node) {
      throw new Error('leftNode does not exist');
    }
    return node;
  }

  private bottomNode() {
    const node = this.map.getPipe(this.row + 1, this.col);
    if (!node) {
      throw new Error('bottomNode does not exist');
    }
    return node;
  }

  private rightNode() {
    const node = this.map.getPipe(this.row, this.col + 1);
    if (!node) {
      throw new Error('rightNode does not exist');
    }
    return node;
  }

  next(
    prevPosition: 'top' | 'bottom' | 'left' | 'right'
  ): { nextNode: Pipe; prevPos: 'top' | 'bottom' | 'left' | 'right' } | undefined {
    if (this.value === 'S') return;
    if (prevPosition === 'top') {
      switch (this.value) {
        case '|':
          return { nextNode: this.bottomNode(), prevPos: 'top' };
        case 'L':
          return { nextNode: this.rightNode(), prevPos: 'left' };
        case 'J':
          return { nextNode: this.leftNode(), prevPos: 'right' };
      }
    } else if (prevPosition === 'left') {
      switch (this.value) {
        case '-':
          return { nextNode: this.rightNode(), prevPos: 'left' };
        case 'J':
          return { nextNode: this.topNode(), prevPos: 'bottom' };
        case '7':
          return { nextNode: this.bottomNode(), prevPos: 'top' };
      }
    } else if (prevPosition === 'bottom') {
      switch (this.value) {
        case '|':
          return { nextNode: this.topNode(), prevPos: 'bottom' };
        case '7':
          return { nextNode: this.leftNode(), prevPos: 'right' };
        case 'F':
          return { nextNode: this.rightNode(), prevPos: 'left' };
      }
    } else if (prevPosition === 'right') {
      switch (this.value) {
        case '-':
          return { nextNode: this.leftNode(), prevPos: 'right' };
        case 'F':
          return { nextNode: this.bottomNode(), prevPos: 'top' };
        case 'L':
          return { nextNode: this.topNode(), prevPos: 'bottom' };
      }
    }
    throw new Error('Unexpectedly came here');
  }

  stepsToEnd(prevPosition: 'top' | 'bottom' | 'left' | 'right'): number {
    if (this.value === 'S') return 1;
    if (prevPosition === 'top') {
      switch (this.value) {
        case '|':
          return 1 + this.bottomNode().stepsToEnd('top');
        case 'L':
          return 1 + this.rightNode().stepsToEnd('left');
        case 'J':
          return 1 + this.leftNode().stepsToEnd('right');
      }
    } else if (prevPosition === 'left') {
      switch (this.value) {
        case '-':
          return 1 + this.rightNode().stepsToEnd('left');
        case 'J':
          return 1 + this.topNode().stepsToEnd('bottom');
        case '7':
          return 1 + this.bottomNode().stepsToEnd('top');
      }
    } else if (prevPosition === 'bottom') {
      switch (this.value) {
        case '|':
          return 1 + this.topNode().stepsToEnd('bottom');
        case '7':
          return 1 + this.leftNode().stepsToEnd('right');
        case 'F':
          return 1 + this.rightNode().stepsToEnd('left');
      }
    } else if (prevPosition === 'right') {
      switch (this.value) {
        case '-':
          return 1 + this.leftNode().stepsToEnd('right');
        case 'F':
          return 1 + this.bottomNode().stepsToEnd('top');
        case 'L':
          return 1 + this.topNode().stepsToEnd('bottom');
      }
    }

    throw new Error(`unexpectedly came here. (${this.row}, ${this.col}. value:${this.value}, prev:${prevPosition})`);
  }
}
