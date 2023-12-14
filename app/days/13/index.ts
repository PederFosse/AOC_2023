import type { Task } from '../task';

export class Day13 implements Task {
  solve(input: string): Record<string, unknown> {
    let sum = 0;

    input
      .trim()
      .split('\n\n')
      .forEach((pattern, i) => {
        const rows = pattern.split('\n');

        let horisontalMirrors: number[] | undefined;
        rows.forEach((row) => {
          const indices = mirrorIndices(row);
          if (!horisontalMirrors) {
            horisontalMirrors = indices;
          } else {
            horisontalMirrors = horisontalMirrors.filter((val) => indices.includes(val));
          }
        });

        // Find vertical Mirrors
        let verticalMirrors: number[] | undefined;
        for (let colIdx = 0; colIdx < rows[0].length; colIdx++) {
          let currentRow = '';
          for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
            currentRow += rows[rowIdx][colIdx];
          }
          const indices = mirrorIndices(currentRow);
          if (!verticalMirrors) {
            verticalMirrors = indices;
          } else {
            verticalMirrors = verticalMirrors.filter((val) => indices.includes(val));
          }
        }

        if (horisontalMirrors && horisontalMirrors.length === 1) {
          sum += horisontalMirrors[0];
        } else {
          sum += verticalMirrors![0] * 100;
        }
      });

    return {
      task1: sum,
    };
  }
}

function mirrorIndices(row: string): number[] {
  const indices: number[] = [];
  for (let colIdx = 1; colIdx < row.length; colIdx++) {
    let left = colIdx - 1;
    let right = colIdx;
    let isMirror = true;
    while (left >= 0 && right < row.length) {
      if (row[left] !== row[right]) {
        isMirror = false;
      }
      left--;
      right++;
    }
    if (isMirror) {
      indices.push(colIdx);
    }
  }
  return indices;
}
