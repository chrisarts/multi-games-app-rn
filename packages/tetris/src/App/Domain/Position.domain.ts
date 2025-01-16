import * as Data from 'effect/Data';
import * as Equal from 'effect/Equal';
import * as Equivalence from 'effect/Equivalence';
import * as Ord from 'effect/Order';

export interface Position {
  row: number;
  column: number;
}
export const Position = Data.struct<Position>;
export const of = Position;
export const zero = () => Position({ row: 0, column: 0 });

// export const reduce = (position: Position, collection: Position[]) =>
//   collection.reduce(sum, position);

export const sum = (self: Position, that: Position): Position =>
  of({ row: self.row + that.row, column: self.column + that.column });

export const minus = (self: Position, that: Position): Position =>
  of({ row: self.row - that.row, column: self.column - that.column });

const getRow = (position: Position): number => position.row;
const getColumn = (position: Position): number => position.column;

const ordRow = Ord.mapInput(Ord.number, getRow);
const ordColumn = Ord.mapInput(Ord.number, getColumn);
const sort: Ord.Order<Position> = Ord.make<Position>((a, b) => {
  if (a.row < b.row) return -1;
  if (a.row === b.row && a.column < b.column) return -1;

  return 1;
});
export const Order = {
  sort,
  lessThan: Ord.lessThan(sort),
  graterThan: Ord.greaterThan(sort),
  rowLessThan: Ord.lessThan(ordRow),
  columnLessThan: Ord.lessThan(ordColumn),
  rowGreatThan: Ord.greaterThan(ordRow),
  rowGreatThanOrEquals: Ord.greaterThanOrEqualTo(ordRow),
  colGreatThanOrEquals: Ord.greaterThanOrEqualTo(ordRow),
  columnGreatThan: Ord.greaterThan(ordColumn),
};

/** Equalities */
export const Eq = {
  eqRow: Equivalence.mapInput(Equivalence.number, getRow),
  eqColumn: Equivalence.mapInput(Equivalence.number, getColumn),
  equals: Equivalence.make<Position>(
    (self, that) =>
      Equal.equals(self, that) || (self.row === that.row && self.column === that.column),
  ),
};

export const max = (self: Position, that: Position) =>
  sort(self, that) === 1 ? self : that;

export const min = (self: Position, that: Position) =>
  sort(self, that) === -1 ? self : that;

// const minRowSemiGroup = SemiGroup.min(positionRowOrd);
// const maxRowSemiGroup = SemiGroup.max(positionRowOrd);
// const minColumnSemiGroup = SemiGroup.min(positionColumnOrd);
// const maxColumnSemiGroup = SemiGroup.max(positionColumnOrd);
