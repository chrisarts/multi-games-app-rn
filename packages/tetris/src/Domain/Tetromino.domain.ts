import * as Data from 'effect/Data';
import * as TetrominoData from '../Data/Tetrominos.data';
import * as Bound from './GridBound.domain';
import * as Position from './Position.domain';

export interface Tetromino {
  name: string;
  color: string;
  matrix: TetrominoData.TetrominoMatrix;
  drawPositions: Position.Position[];
  zeroBounds: Bound.GridBound;
}

export const fromConfig = (config: TetrominoData.TetrominoConfig): Tetromino => {
  const drawPositions = getMatrixPositions(config.value);

  return {
    drawPositions,
    zeroBounds: Bound.getFromPositions(drawPositions),
    name: config.name,
    color: config.color,
    matrix: config.value,
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
