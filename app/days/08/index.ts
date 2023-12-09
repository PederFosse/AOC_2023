import type { Task } from '../task';

export class Day8 implements Task {
  solve(input: string): Record<string, unknown> {
    const [directions, nodes] = input.trim().split('\n\n');
    const map = new DesertMap(nodes);

    const distancesTask2 = map.traversePathTask2(directions);

    return {
      task1: map.traversePathTask1(directions),
      task2: findlcm(distancesTask2, distancesTask2.length),
    };
  }
}

class DesertMap {
  nodes = new Map<string, DesertNode>();
  startingNodes: DesertNode[] = [];

  constructor(nodes: string) {
    nodes.split('\n').forEach((node) => {
      const [identifier] = node.split(' = ');
      const desertNode = new DesertNode(identifier, this);
      if (/A$/.test(identifier)) {
        this.startingNodes.push(desertNode);
      }
      this.nodes.set(identifier, desertNode);
    });

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

  traversePathTask1(path: string) {
    let steps = 0;
    let currentNode = this.getNode('AAA');
    while (currentNode.id !== 'ZZZ') {
      currentNode = currentNode.traverse(path[steps % path.length]);
      steps++;
    }
    return steps;
  }

  traversePathTask2(path: string) {
    return this.startingNodes.map((node) => {
      let steps = 0;
      let currentNode = node;
      while (!/Z$/.test(currentNode.id)) {
        currentNode = currentNode.traverse(path[steps % path.length]);
        steps++;
      }
      return steps;
    });
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
// Utility function to find
// GCD of 'a' and 'b'
function gcd(a: number, b: number) {
  if (b == 0) return a;
  return gcd(b, a % b);
}

// Returns LCM of array elements
function findlcm(arr: number[], n: number) {
  // Initialize result
  let ans = arr[0];

  // ans contains LCM of arr[0], ..arr[i]
  // after i'th iteration,
  for (let i = 1; i < n; i++) ans = (arr[i] * ans) / gcd(arr[i], ans);

  return ans;
}
