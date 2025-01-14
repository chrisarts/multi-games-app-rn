import * as TetrominoData from '../Data/Tetrominos.data';
import * as Grid from './Grid.domain';
import * as Position from './Position.domain';

export interface Tetromino {
  name: string;
  color: string;
  matrix: TetrominoData.TetrominoMatrix;
  drawPositions: Position.Position[];
  bounds: Grid.GridBound;
}

export const of = (tetromino: Tetromino): Tetromino => tetromino;

export const fromConfig = (config: TetrominoData.TetrominoConfig): Tetromino => {
  const drawPositions = getMatrixPositions(config.value);

  return {
    drawPositions,
    bounds: Grid.gridBoundFromPositions(drawPositions),
    name: config.name,
    color: config.color,
    matrix: config.value,
  };
};

export const mapWithPosition = (tetromino: Tetromino, position: Position.Position) => {
  const positions = tetromino.drawPositions.map((x) => Position.sum(x, position));
  const bounds = Grid.gridBoundFromPositions(positions);
  return {
    positions,
    bounds,
  };
};

export const fromName = (name: TetrominoData.TetrominoConfig['name']): Tetromino =>
  fromConfig(TetrominoData.TetrominosData[name]);

export const getRandomTetromino = (): Tetromino =>
  fromName(
    TetrominoData.TetrominoNames[
      Math.floor(Math.random() * TetrominoData.TetrominoNames.length)
    ],
  );

export const getTetrominoInitialPos = (
  initialPos: Position.Position,
  tetromino: Tetromino,
) => Position.sum(initialPos, tetromino.bounds.min);

export const moveTeTromino = (tetromino: Tetromino, to: Position.Position): Tetromino =>
  of({
    ...tetromino,
    drawPositions: getMatrixPositions(tetromino.matrix, to),
  });

const getMatrixPositions = (
  matrix: TetrominoData.TetrominoConfig['value'],
  sumPos = Position.zero(),
): Position.Position[] =>
  matrix
    .map((rows, x) =>
      rows.map((column, y) => {
        if (column === 0) return null;
        return Position.sum(Position.of({ row: x, column: y }), sumPos);
      }),
    )
    .flatMap((x) => x.filter((y) => y !== null));
