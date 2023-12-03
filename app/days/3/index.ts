import type { Task } from '../task';

export class Day3 implements Task {
  solve(input: string): Record<string, unknown> {
    const schematics = new EngineSchematics(input);

    let sum = 0;
    let gearValue = 0;

    schematics.schematicsMap.forEach((row) => {
      row.forEach((node) => {
        if (node.isSymbolNode()) {
          const adjacentNumbers = Array.from(node.getAdjacentNumberNodes().values());
          sum += adjacentNumbers.reduce((prev, cur) => prev + cur.getFullValue(), 0);

          // Gear check!
          if (node.val === '*' && adjacentNumbers.length === 2) {
            gearValue += Array.from(adjacentNumbers.values()).reduce((prev, curr) => {
              return prev * curr.getFullValue();
            }, 1);
          }
        }
      });
    });
    return {
      sum,
      gearValue,
    };
  }
}

class EngineSchematics {
  schematicsMap: SchematicNode[][] = [];

  constructor(input: string) {
    const rows = input.split('\n').filter((val) => val !== '');

    rows.forEach((row, rowIndex) => {
      const currentRow: SchematicNode[] = [];
      this.schematicsMap.push(currentRow);
      row.split('').forEach((entry, colIndex) => {
        const node = new SchematicNode(rowIndex, colIndex, entry, this);
        currentRow.push(node);
      });
    });
  }

  getNode(row: number, col: number): SchematicNode | undefined {
    if (row > this.schematicsMap.length - 1 || row < 0) {
      return;
    }

    const requestedRow = this.schematicsMap[row];
    if (col > requestedRow.length - 1 || col < 0) {
      return;
    }

    return requestedRow[col];
  }
}

class SchematicNode {
  schematics: EngineSchematics;
  row: number;
  col: number;
  val: string;

  constructor(row: number, col: number, val: string, schematics: EngineSchematics) {
    this.schematics = schematics;
    this.row = row;
    this.col = col;
    this.val = val;
  }

  getAdjacentNumberNodes(): Set<SchematicNode> {
    const adjacentNumberNodes = new Set<SchematicNode>();

    // Get all the adjacent nodes
    const topLeft = this.schematics.getNode(this.row - 1, this.col - 1);
    const top = this.schematics.getNode(this.row - 1, this.col);
    const topRight = this.schematics.getNode(this.row - 1, this.col + 1);
    const left = this.schematics.getNode(this.row, this.col - 1);
    const right = this.schematics.getNode(this.row, this.col + 1);
    const bottomLeft = this.schematics.getNode(this.row + 1, this.col - 1);
    const bottom = this.schematics.getNode(this.row + 1, this.col);
    const bottomRight = this.schematics.getNode(this.row + 1, this.col + 1);

    if (topLeft?.isNumberNode()) {
      adjacentNumberNodes.add(topLeft.getLeftMostNumberNode());
    }
    if (top?.isNumberNode()) {
      adjacentNumberNodes.add(top.getLeftMostNumberNode());
    }
    if (topRight?.isNumberNode()) {
      adjacentNumberNodes.add(topRight.getLeftMostNumberNode());
    }

    if (left?.isNumberNode()) {
      adjacentNumberNodes.add(left.getLeftMostNumberNode());
    }

    if (right?.isNumberNode()) {
      adjacentNumberNodes.add(right.getLeftMostNumberNode());
    }

    if (bottomLeft?.isNumberNode()) {
      adjacentNumberNodes.add(bottomLeft.getLeftMostNumberNode());
    }
    if (bottom?.isNumberNode()) {
      adjacentNumberNodes.add(bottom.getLeftMostNumberNode());
    }
    if (bottomRight?.isNumberNode()) {
      adjacentNumberNodes.add(bottomRight.getLeftMostNumberNode());
    }

    return adjacentNumberNodes;
  }

  getLeftMostNumberNode(): SchematicNode {
    const leftNode = this.schematics.getNode(this.row, this.col - 1);
    if (leftNode?.isNumberNode()) {
      return leftNode.getLeftMostNumberNode();
    } else {
      return this;
    }
  }

  getFullValue(current: string = ''): number {
    const rightNode = this.schematics.getNode(this.row, this.col + 1);
    if (!rightNode || !rightNode.isNumberNode()) {
      return Number(current + this.val);
    }
    return rightNode.getFullValue(current + this.val);
  }

  isNumberNode(): boolean {
    return /[0-9]/.test(this.val);
  }

  isSymbolNode(): boolean {
    return !/\.|[0-9]/.test(this.val);
  }
}
