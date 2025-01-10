import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import * as Order from 'effect/Order';

export class GridPosition implements Equal.Equal {
  readonly _tag = 'GridPoint';

  get id() {
    return `[${this.x}, ${this.y}]`;
  }

  static ord = ord;

  static create(position: {
    /** x axis / row */
    readonly x: number;
    /** y axis / column */
    readonly y: number;
  }) {
    return new GridPosition(position.x, position.y);
  }

  sum(that: GridPosition): GridPosition {
    return GridPosition.create({
      x: this.x + that.x,
      y: this.y + that.y,
    });
  }

  private constructor(
    /** x axis / row */
    readonly x: number,
    /** y axis / column */
    readonly y: number,
  ) {}

  [Equal.symbol](that: unknown): boolean {
    return that instanceof GridPosition && this.id === that.id;
  }
  [Hash.symbol](): number {
    return Hash.string(this.id);
  }
}

function ord() {
  return Order.make<GridPosition>((a, b) => {
    if (a.x < b.x) return -1;
    if (a.x === b.x && a.y < b.y) return -1;

    return 1;
  });
}
