import type { SkPoint } from '@shopify/react-native-skia';
import * as Equal from 'effect/Equal';
import * as Equivalence from 'effect/Equivalence';
import * as Ord from 'effect/Order';

export interface Position extends SkPoint {}
export const make = (point: Position) => {
  'worklet';
  return point;
};
export const of = make;
export const zero = () => make({ y: 0, x: 0 });

// export const reduce = (position: Position, collection: Position[]) =>
//   collection.reduce(sum, position);

export const sum = (self: Position, that: Position): Position => {
  'worklet';
  return of({ y: self.y + that.y, x: self.x + that.x });
};

export const minus = (self: Position, that: Position): Position =>
  of({ y: self.y - that.y, x: self.x - that.x });

const getRow = (position: Position): number => position.y;
const getColumn = (position: Position): number => position.x;

const ordRow = Ord.mapInput(Ord.number, getRow);
const ordColumn = Ord.mapInput(Ord.number, getColumn);
const sort: Ord.Order<Position> = Ord.make<Position>((a, b) => {
  if (a.y < b.y) return -1;
  if (a.y === b.y && a.x < b.x) return -1;

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
    (self, that) => Equal.equals(self, that) || (self.y === that.y && self.x === that.x),
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
