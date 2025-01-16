import * as Array from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import * as HashSet from 'effect/HashSet';
import * as Cell from './Cell.domain';
import * as Position from './Position.domain';

export interface GridState {
  positions: Position.Position[];
  cellsMap: HashMap.HashMap<Position.Position, Cell.Cell>;
  layout: GridLayout;
  bounds: GridBound;
}

export interface GridBound {
  max: Position.Position;
  min: Position.Position;
}
export interface GridConfig {
  screen: {
    width: number;
    height: number;
  };
  size: {
    rows: number;
    columns: number;
  };
}

export interface CellLayout {
  size: number;
  spacing: number;
  containerSize: number;
}

export interface GridLayout extends GridConfig {
  initialPosition: Position.Position;
  canvas: GridConfig['screen'];
  cell: CellLayout;
  remainingSpace: number;
}

/**
 * GridLayout
 */

const createGridColumns = (atRow: number, size: number) =>
  Array.makeBy(size, (n) => Position.make({ y: atRow, x: n }));

const createGridRows = (rows: number, columns: number): Position.Position[][] =>
  Array.makeBy(rows, (n) => createGridColumns(n, columns));

export const makeGridPositions = (size: GridConfig['size']) =>
  HashSet.fromIterable(Array.flatten(createGridRows(size.rows, size.columns)));

export const makeGridByBy =
  <A>(f: (position: Position.Position) => A) =>
  (size: GridConfig['size']): A[] =>
    Array.flatMap(
      Array.makeBy(size.rows, (n) => createGridColumns(n, size.columns)),
      (rows) => rows.map(f),
    );

export const makeGridState = ({ screen, size }: GridConfig): GridState => {
  const layout = getGridLayout({ screen, size });
  const positions: Position.Position[] = [];
  const cells = makeGridByBy((position): [Position.Position, Cell.Cell] => {
    positions.push(position);
    return [position, Cell.makeCell(position)];
  })(size);

  return {
    positions: positions,
    cellsMap: HashMap.fromIterable(cells),
    layout,
    bounds: getGridBounds(layout),
  };
};

export const getGridBounds = (layout: GridConfig) =>
  gridBoundOf({
    max: Position.of({
      y: layout.size.rows - 1,
      x: layout.size.columns - 1,
    }),
    min: Position.zero(),
  });

export const getGridLayout = ({ screen, size }: GridConfig): GridLayout => {
  const { height, width } = screen;

  const spacing = 3;
  const squareContainerSize = width / size.columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = width;
  const canvasHeight = size.rows * squareContainerSize;

  const remainingSpace = height - canvasHeight;

  const midX = Math.floor(size.columns / 3);
  return {
    screen,
    size,
    initialPosition: Position.of({ y: 0, x: midX }),
    canvas: { width: canvasWidth, height: canvasHeight },
    remainingSpace,
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};

/**
 * BOUNDS
 */

export const gridBoundOf = (bounds: GridBound): GridBound => bounds;

export const makeBound = (min: Position.Position, max: Position.Position) =>
  gridBoundOf({
    min: {
      x: min.x,
      y: min.y,
    },
    max: {
      x: max.x,
      y: max.y,
    },
  });

export const zeroBound = (): GridBound =>
  gridBoundOf({ max: Position.zero(), min: Position.zero() });

export const sumBounds = (self: GridBound, that: GridBound) =>
  gridBoundOf({
    max: Position.sum(self.max, that.max),
    min: Position.sum(self.min, that.min),
  });

export const minusBound = (self: GridBound, that: GridBound) =>
  gridBoundOf({
    max: Position.minus(self.max, that.max),
    min: Position.minus(self.min, that.min),
  });

export const boundDistanceFrom = (toBound: GridBound) => (from: Position.Position) =>
  Position.minus(toBound.max, from);

export const columnBoundValid = (bounds: GridBound, position: Position.Position) =>
  position.x >= bounds.min.x && position.x <= bounds.max.x;
export const rowBoundValid = (bounds: GridBound, position: Position.Position) =>
  position.y >= bounds.min.y && position.y <= bounds.max.y;

export const bothRowBoundsValid = (self: GridBound, that: GridBound) =>
  rowBoundValid(self, that.max) && rowBoundValid(self, that.min);

export const bothColBoundsValid = (self: GridBound, that: GridBound) =>
  columnBoundValid(self, that.max) && columnBoundValid(self, that.min);

export const validateBounds = (self: GridBound, that: GridBound) =>
  bothRowBoundsValid(self, that) && bothColBoundsValid(self, that);

export const positionInsideBound = (bounds: GridBound, position: Position.Position) =>
  columnBoundValid(bounds, position) && rowBoundValid(bounds, position);

export const gridBoundFromPositions = (positions: Position.Position[]): GridBound => {
  const bounds = positions.reduce(
    (prev, current) => {
      const { column, row } = prev;
      if (current.y > row.max) row.max = current.y;
      if (current.y < row.min) row.min = current.y;
      if (current.x > column.max) column.max = current.x;
      if (current.x < column.min) column.min = current.x;
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
  return gridBoundOf({
    min: Position.of({ y: bounds.row.min, x: bounds.column.min }),
    max: Position.of({ y: bounds.row.max, x: bounds.column.max }),
  });
};
