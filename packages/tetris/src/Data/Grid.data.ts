import { bounds, rect, vec } from '@shopify/react-native-skia';
import * as Array from 'effect/Array';
import * as HashSet from 'effect/HashSet';
import { Dimensions } from 'react-native';
import * as Position from '../Domain/Position.domain';

export interface GridLayout extends GridConfig {
  initialPosition: Position.Position;
  canvas: GridConfig['screen'];
  cell: {
    spacing: number;
    containerSize: number;
    size: number;
  };
  remainingSpace: number;
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

export const getGridLayout = (
  screen: { width: number; height: number },
  size: { rows: number; columns: number },
): GridLayout => {
  const { height, width } = screen;

  const spacing = 3;
  const squareContainerSize = width / size.columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = width;
  const canvasHeight = size.rows * (squareContainerSize - spacing / 3);

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

export const makeGridState = ({ screen, size }: GridConfig) => {
  const layout = getGridLayout(screen, size);
  const positions: Position.Position[] = [];
  return {
    cellPoints: positions,
    layout,
  };
};

const dims = Dimensions.get('window');

const GRID_SIZE = { columns: 10, rows: 15 };

const TETRIS_GRID = makeGridState({
  screen: dims,
  size: GRID_SIZE,
});

const GRID_CELL = TETRIS_GRID.layout.cell;

const CELL_SPACING = GRID_CELL.spacing / 3;
const CELL_SIZE = Math.floor(GRID_CELL.containerSize - CELL_SPACING);

const GRID_VECTORS = TETRIS_GRID.cellPoints.map(({ x, y }) =>
  vec(
    Math.floor(x * GRID_CELL.containerSize) + CELL_SPACING,
    Math.floor(y * GRID_CELL.containerSize) + CELL_SPACING,
  ),
);
const CELLS = GRID_VECTORS.map(({ x, y }) => rect(x, y, CELL_SIZE, CELL_SIZE));

export const GRID = {
  vectors: GRID_VECTORS,
  cells: CELLS,
  cellSpacing: CELL_SPACING,
  sizePlusSpace: Math.floor(GRID_CELL.containerSize + CELL_SPACING),
  cellSize: CELL_SIZE,
  fullCellSize: GRID_CELL.containerSize,
  gridRect: bounds(CELLS),
  rows: GRID_SIZE.rows,
  columns: GRID_SIZE.columns,
};
