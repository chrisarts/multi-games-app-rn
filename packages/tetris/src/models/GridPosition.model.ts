import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import * as Order from 'effect/Order';

export const gridPointOrd = Order.make<GridPosition>((a, b) => {
  if (a.x < b.x) return -1;
  if (a.x === b.x && a.y < b.y) return -1;

  return 1;
});

interface RawPosition {
  /** x axis / row */
  readonly x: number;
  /** y axis / column */
  readonly y: number;
}

export class GridPosition implements Equal.Equal {
  readonly _tag = 'GridPoint';

  get id() {
    return `[${this.x}, ${this.y}]`;
  }

  private constructor(
    /** x axis / row */
    readonly x: number,
    /** y axis / column */
    readonly y: number,
  ) {}

  static create(position: RawPosition) {
    return new GridPosition(position.x, position.y);
  }

  [Equal.symbol](that: unknown): boolean {
    return that instanceof GridPosition && this.id === that.id;
  }
  [Hash.symbol](): number {
    return Hash.string(this.id);
  }
}
