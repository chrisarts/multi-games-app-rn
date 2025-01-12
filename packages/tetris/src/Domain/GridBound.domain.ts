import * as Position from './Position.domain';

export interface GridBound {
  max: Position.Position;
  min: Position.Position;
}

export const of = (bounds: GridBound): GridBound => bounds;
export const make = (min: Position.Position, max: Position.Position) => of({ min, max });

export const zero = (): GridBound => of({ max: Position.zero(), min: Position.zero() });

export const sum = (self: GridBound, that: GridBound) =>
  of({
    max: Position.sum(self.max, that.max),
    min: Position.sum(self.min, that.min),
  });

export const minus = (self: GridBound, that: GridBound) =>
  of({
    max: Position.minus(self.max, that.max),
    min: Position.minus(self.min, that.min),
  });

export const distanceFrom = (toBound: GridBound) => (from: Position.Position) =>
  Position.minus(toBound.max, from);

export const columnBoundValid = (bounds: GridBound, position: Position.Position) =>
  position.column >= bounds.min.column && position.column <= bounds.max.column;
export const rowBoundValid = (bounds: GridBound, position: Position.Position) =>
  position.row >= bounds.min.row && position.row <= bounds.max.row;

export const positionInsideBound = (bounds: GridBound, position: Position.Position) =>
  columnBoundValid(bounds, position) && rowBoundValid(bounds, position);

export const getFromPositions = (positions: Position.Position[]): GridBound => {
  const bounds = positions.reduce(
    (prev, current) => {
      const { column, row } = prev;
      if (current.row > row.max) row.max = current.row;
      if (current.row < row.min) row.min = current.row;
      if (current.column > column.max) column.max = current.column;
      if (current.column < column.min) column.min = current.column;
      return prev;
    },
    {
      row: {
        min: 0,
        max: 0,
      },
      column: {
        min: 0,
        max: 0,
      },
    },
  );
  return of({
    min: Position.of({ column: bounds.column.min, row: bounds.column.min }),
    max: Position.of({ column: bounds.column.max, row: bounds.column.max }),
  });
};
