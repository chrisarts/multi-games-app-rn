import * as Equal from 'effect/Equal';
import * as Equivalence from 'effect/Equivalence';
import * as Hash from 'effect/Hash';
import * as Order from 'effect/Order';

// OLD API
const rowOrder = Order.reverse(
  Order.mapInput(Order.number, (position: GridPosition) => position.row),
);
const columnOrder = Order.reverse(
  Order.mapInput(Order.number, (position: GridPosition) => position.column),
);
const rowEqual = Equivalence.mapInput(
  Equivalence.number,
  (position: GridPosition) => position.row,
);
const colEqual = Equivalence.mapInput(
  Equivalence.number,
  (position: GridPosition) => position.column,
);
const positionOrder = Order.make<GridPosition>((a, b) => {
  if (a.row < b.row) return -1;
  if (a.row === b.row && a.column < b.column) return -1;

  return 1;
});

export class GridPosition implements Equal.Equal {
  readonly _tag = 'GridPoint';

  get id() {
    return `[${this.row}, ${this.column}]`;
  }

  private constructor(
    /** x axis / row */
    readonly row: number,
    /** y axis / column */
    readonly column: number,
  ) {}

  static create(position: {
    /** x axis / row */
    readonly row: number;
    /** y axis / column */
    readonly column: number;
  }) {
    return new GridPosition(position.row, position.column);
  }

  lessThan = {
    row: Order.lessThan(rowOrder)(this),
    column: Order.lessThan(columnOrder)(this),
    that: Order.lessThan(positionOrder)(this),
  };
  greatThan = {
    row: Order.greaterThan(rowOrder)(this),
    column: Order.greaterThan(columnOrder)(this),
    that: Order.greaterThan(positionOrder)(this),
  };
  equalTo = {
    row: (that: GridPosition) => rowEqual(this, that),
    column: (that: GridPosition) => colEqual(this, that),
    that: (that: GridPosition) =>
      Equivalence.combine(this.equalTo.row, this.equalTo.column)(this, that),
  };
  lessThanOrEquals = {
    row: Order.lessThanOrEqualTo(rowOrder)(this),
    column: Order.lessThanOrEqualTo(columnOrder)(this),
    that: Order.lessThanOrEqualTo(positionOrder)(this),
  };
  greatThanOrEquals = {
    row: Order.greaterThanOrEqualTo(rowOrder)(this),
    column: Order.greaterThanOrEqualTo(columnOrder)(this),
    that: Order.greaterThanOrEqualTo(positionOrder)(this),
  };
  // rowGreaterThan = Order.greaterThan(rowOrder)(this);
  // rowLessThan = Order.lessThan(rowOrder)(this);
  // rowEquals = (that: GridPosition) => rowEqual(this, that);

  // colGreaterThan = Order.lessThan(columnOrder)(this);
  // colLessThan = Order.lessThan(columnOrder)(this);
  // colEquals = (that: GridPosition) => colEqual(this, that);

  equivalence(that: GridPosition) {
    return positionOrder(this, that);
  }

  sum(that: GridPosition): GridPosition {
    return GridPosition.create({
      row: this.row + that.row,
      column: this.column + that.column,
    });
  }

  [Equal.symbol](that: unknown): boolean {
    return that instanceof GridPosition && this.id === that.id;
  }
  [Hash.symbol](): number {
    return Hash.string(this.id);
  }
}
