import * as Sk from '@shopify/react-native-skia';

export interface TetrisGrid {
  name: string;
  position: Sk.Vector;
  color: string;
  vectors: Sk.Vector[];
  cells: Sk.SkRect[];
  matrix: number[][];
}

export interface GridConfigInput {
  rows: number;
  columns: number;
}
export interface GridConfig extends GridConfigInput {
  width: number;
  height: number;
  midX: number;
  cellSpacing: number;
  cellSize: number;
  cellContainerSize: number;
}

const vectorIdent = (vector: Sk.Vector) => {
  'worklet';
  return vector;
};

export const matrixToPoints = (matrix: number[][], mapVector = vectorIdent) => {
  'worklet';
  return matrix.flatMap((_, row) => _.map((_, column) => mapVector(Sk.vec(column, row))));
};

export const getCellUIRect = (position: Sk.Vector, cellSize: number): Sk.SkRect => {
  'worklet';
  const x = position.x * cellSize;
  const y = position.y * cellSize;
  const width = cellSize - 1;
  const height = cellSize - 1;
  return Sk.rect(x, y, width, height);
};

export const getGridConfig = (width: number, config: GridConfigInput): GridConfig => {
  'worklet';
  const spacing = 3;
  const cellContainerSize = Math.floor(width / config.columns);
  const cellSize = cellContainerSize - spacing / 3;
  const canvasWidth = width;
  const canvasHeight = config.rows * (cellContainerSize - spacing);
  const midX = Math.floor(config.columns / 3);
  return {
    cellSize,
    cellContainerSize,
    width: canvasWidth,
    height: canvasHeight,
    midX,
    cellSpacing: spacing,
    ...config,
  };
};

export const getGridLayout = (
  { columns, rows }: GridConfigInput,
  cellSize: GridConfig,
): TetrisGrid => {
  'worklet';

  const matrix: number[][] = Array(rows)
    .fill(0)
    .map(() => Array(columns).fill(0));
  const vectors = matrixToPoints(matrix);
  const cells = vectors.map((vector) => getCellUIRect(vector, cellSize.cellContainerSize));

  return {
    vectors,
    matrix,
    cells,
    color: 'rgba(131, 126, 126, 0.3)',
    position: { y: 0, x: Math.floor(columns / 3) },
    name: 'Grid',
  };
};

export const createGridUIPath = (cells: Sk.SkRect[]) => {
  'worklet';
  const path = Sk.Skia.Path.Make();
  for (const rect of cells) {
    const cell = getCellUIRect(rect, rect.width);
    path.addRRect(Sk.rrect(cell, 5, 5));
  }
  return path;
};
