import type { Task } from '../task';

export class Day16 implements Task {
  solve(input: string): Record<string, unknown> {
    return {
      task1: this.task1(input),
      task2: this.task2(input),
    };
  }

  task1(input: string) {
    const tileMap = new TileMap(input.trim());
    const firstNode = tileMap.getTile(0, 0)!;
    const beam = new Beam('right', firstNode);
    beam.move();
    return tileMap.getEnergizedTiles();
  }

  task2(input: string) {
    const tileMap = new TileMap(input.trim());

    let mostEnergizedTiles = 0;

    for (let i = 0; i < tileMap.tiles.length; i++) {
      const leftMostNode = tileMap.getTile(i, 0)!;
      const leftStartingBeam = new Beam('right', leftMostNode);
      leftStartingBeam.move();
      const leftEnergized = tileMap.getEnergizedTiles();
      if (leftEnergized > mostEnergizedTiles) {
        mostEnergizedTiles = leftEnergized;
      }
      tileMap.reset();

      const rightMostNode = tileMap.getTile(i, tileMap.tiles[0].length - 1)!;
      const rightStartingBeam = new Beam('left', rightMostNode);
      rightStartingBeam.move();
      const rightEnergized = tileMap.getEnergizedTiles();
      if (rightEnergized > mostEnergizedTiles) {
        mostEnergizedTiles = rightEnergized;
      }
      tileMap.reset();
    }

    for (let i = 0; i < tileMap.tiles[0].length; i++) {
      const topNode = tileMap.getTile(0, i)!;
      const topBeam = new Beam('down', topNode);
      topBeam.move();
      const topEnergized = tileMap.getEnergizedTiles();
      if (topEnergized > mostEnergizedTiles) {
        mostEnergizedTiles = topEnergized;
      }
      tileMap.reset();

      const bottomNode = tileMap.getTile(tileMap.tiles.length - 1, i)!;
      const bottomBeam = new Beam('up', bottomNode);
      bottomBeam.move();
      const bottomEnergized = tileMap.getEnergizedTiles();
      if (bottomEnergized > mostEnergizedTiles) {
        mostEnergizedTiles = bottomEnergized;
      }
      tileMap.reset();
    }

    return mostEnergizedTiles;
  }
}

class Beam {
  heading: 'right' | 'left' | 'up' | 'down';
  tile?: Tile;

  constructor(heading: 'right' | 'left' | 'up' | 'down', tile: Tile) {
    this.heading = heading;
    this.tile = tile;
  }

  move() {
    while (this.tile) {
      const nextHeading = this.tile.beam(this);
      switch (nextHeading) {
        case 'up':
          this.goUp();
          break;
        case 'down':
          this.goDown();
          break;
        case 'left':
          this.goLeft();
          break;
        case 'right':
          this.goRight();
          break;
        case 'split horisontally':
          this.splitHorisontally();
          break;
        case 'split vertically':
          this.splitVertically();
          break;
        default:
          return;
      }
    }
  }

  private splitHorisontally() {
    const leftTile = this.tile?.left;
    if (leftTile) {
      new Beam('left', leftTile).move();
    }

    this.goRight();
  }

  private splitVertically() {
    const topTile = this.tile?.top;
    if (topTile) {
      new Beam('up', topTile).move();
    }

    this.goDown();
  }

  private setHeading(heading: 'up' | 'down' | 'right' | 'left') {
    this.heading = heading;
  }

  private goUp() {
    this.tile = this.tile?.top;
    this.setHeading('up');
  }

  private goDown() {
    this.tile = this.tile?.bottom;
    this.setHeading('down');
  }

  private goLeft() {
    this.tile = this.tile?.left;
    this.setHeading('left');
  }

  private goRight() {
    this.tile = this.tile?.right;
    this.setHeading('right');
  }
}

class Tile {
  value: string;
  energized: boolean;

  constructor(value: string) {
    this.value = value;
    this.energized = false;
  }

  visitedByHeading = new Set<string>();

  top?: Tile;
  bottom?: Tile;
  left?: Tile;
  right?: Tile;

  beam(beam: Beam): Heading | undefined | 'split vertically' | 'split horisontally' {
    if (this.visitedByHeading.has(beam.heading)) {
      return;
    }

    this.energized = true;
    this.visitedByHeading.add(beam.heading);

    if (beam.heading === 'right') {
      if (this.value === '/') return 'up';
      else if (this.value === '\\') return 'down';
      else if (this.value === '.') return 'right';
      else if (this.value === '-') return 'right';
      else return 'split vertically';
    } else if (beam.heading === 'left') {
      if (this.value === '/') return 'down';
      else if (this.value === '\\') return 'up';
      else if (this.value === '.') return 'left';
      else if (this.value === '-') return 'left';
      else return 'split vertically';
    } else if (beam.heading === 'up') {
      if (this.value === '/') return 'right';
      else if (this.value === '\\') return 'left';
      else if (this.value === '.') return 'up';
      else if (this.value === '|') return 'up';
      else return 'split horisontally';
    } else {
      // beam.direction = down
      if (this.value === '/') return 'left';
      else if (this.value === '\\') return 'right';
      else if (this.value === '.') return 'down';
      else if (this.value === '|') return 'down';
      else return 'split horisontally';
    }
  }

  reset() {
    this.visitedByHeading.clear();
    this.energized = false;
  }

  toString() {
    return {
      value: this.value,
      top: this.top?.value,
      bottom: this.bottom?.value,
      left: this.left?.value,
      right: this.right?.value,
    };
  }
}

type Heading = 'up' | 'down' | 'left' | 'right';

class TileMap {
  tiles: Tile[][] = [];

  constructor(input: string) {
    input.split('\n').forEach((row) => {
      const currentRow: Tile[] = [];
      this.tiles.push(currentRow);
      row.split('').forEach((character) => {
        const tile = new Tile(character);
        currentRow.push(tile);
      });
    });

    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[0].length; j++) {
        const tile = this.getTile(i, j)!;

        tile.top = this.getTile(i - 1, j);
        tile.bottom = this.getTile(i + 1, j);
        tile.left = this.getTile(i, j - 1);
        tile.right = this.getTile(i, j + 1);
      }
    }
  }

  toString() {
    let output = '';
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        output += tile.value;
      });
      output += '\n';
    });
    return output;
  }

  reset() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.reset();
      });
    });
  }

  showEnergizedMap() {
    let output = '';
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        output += tile.energized ? '#' : '.';
      });
      output += '\n';
    });
    return output;
  }

  getEnergizedTiles() {
    let energized = 0;
    this.tiles.forEach((row) => {
      energized += row.reduce((prev, cur) => prev + (cur.energized ? 1 : 0), 0);
    });
    return energized;
  }

  getTile(row: number, col: number) {
    if (row < 0 || row >= this.tiles.length) return undefined;
    if (col < 0 || col >= this.tiles[0].length) return undefined;
    return this.tiles[row][col];
  }
}
