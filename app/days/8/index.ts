import type { Task } from '../task';

export class Day8 implements Task {
  solve(input: string): Record<string, unknown> {
    const [directions, nodes] = input.trim().split('\n\n');
    const map = new DesertMap(nodes);

    const startingNode = map.getNode('AAA');

    return {
      task1: map.traversePath(directions),
    };
  }
}

class DesertMap {
  nodes = new Map<string, DesertNode>();

  constructor(nodes: string) {
    let firstVal: string | undefined;

    nodes.split('\n').forEach((node) => {
      const [identifier] = node.split(' = ');
      this.nodes.set(identifier, new DesertNode(identifier, this));
      if (!firstVal) {
        firstVal = identifier;
      }
    });

    if (!firstVal) {
      throw new Error();
    }

    // When all nodes are added, we can add the relations between the nodes
    nodes.split('\n').forEach((node) => {
      const [identifier, pointers] = node.split(' = ');
      const [left, right] = pointers.replaceAll(/[()]/g, '').split(', ');
      const leftNode = this.getNode(left);
      const rightNode = this.getNode(right);

      this.getNode(identifier).addNodes(leftNode, rightNode);
    });
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
    let currentNode = this.getNode('AAA');
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
  left?: DesertNode;
  right?: DesertNode;

  constructor(id: string, map: DesertMap) {
    this.map = map;
    this.id = id;
  }

  addNodes(left: DesertNode, right: DesertNode) {
    this.left = left;
    this.right = right;
  }

  traverse(direction: string) {
    if (direction === 'L') {
      return this.left!;
    }
    return this.right!;
  }
}
