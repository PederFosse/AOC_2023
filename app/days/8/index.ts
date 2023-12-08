import type { Task } from '../task';

export class Day8 implements Task {
  solve(input: string): Record<string, unknown> {
    const [directions, nodes] = input.trim().split('\n\n');
    const map = new DesertMap(nodes);

    return {
      task1: map.traversePath(directions),
    };
  }
}

class DesertMap {
  nodes = new Map<string, DesertNode>();
  firstNode: DesertNode;

  constructor(nodes: string) {
    let firstVal: string | undefined;

    nodes.split('\n').forEach((node) => {
      const [identifier, pointers] = node.split(' = ');
      const [left, right] = pointers.replaceAll(/[()]/g, '').split(', ');
      this.nodes.set(identifier, new DesertNode(left, right, identifier, this));
      if (!firstVal) {
        firstVal = identifier;
      }
    });

    if (!firstVal) {
      throw new Error();
    }

    const firstNode = this.nodes.get(firstVal);
    if (!firstNode) {
      throw new Error();
    }

    this.firstNode = firstNode;
  }

  getNode(id: string) {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error();
    }
    return node;
  }

  traversePath(path: string) {
    let steps = 0;
    let currentNode = this.firstNode;
    while (currentNode.id !== 'ZZZ') {
      currentNode = currentNode.traverse(path[steps % path.length]);
      steps++;
    }
    return steps;
  }
}

class DesertNode {
  map: DesertMap;
  id: string;
  left: string;
  right: string;

  constructor(left: string, right: string, id: string, map: DesertMap) {
    this.right = right;
    this.left = left;
    this.map = map;
    this.id = id;
  }

  traverse(direction: string) {
    if (direction === 'L') {
      return this.map.getNode(this.left);
    } else {
      return this.map.getNode(this.right);
    }
  }
}
