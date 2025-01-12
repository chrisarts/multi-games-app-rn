import * as Array from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import * as HashSet from 'effect/HashSet';
import * as Position from '../../Domain/Position.domain';
import * as GridCell from './GridCell.model';
import * as TetrisCell from './internal/Cell.typeclass';

export interface GameBoardConfig {
  screen: {
    width: number;
    height: number;
  };
  config: {
    rows: number;
    columns: number;
  };
}

export interface GameBoardLayout extends GameBoardConfig {
  initialPosition: Position.Position;
  canvas: GameBoardConfig['screen'];
  cell: { size: number; spacing: number; containerSize: number };
}

const createBoardRow = (row: number, size: number) =>
  Array.makeBy(size, (n) => Position.Position({ row, column: n }));


export const makeLayout = ({ screen, config }: GameBoardConfig): GameBoardLayout => {
  const spacing = 3;
  const containerSize = screen.width / config.columns;
  const squareSize = containerSize - spacing;
  const canvasHeight = config.rows * containerSize;

  const rowCenter = Math.floor(config.columns / 3);
  return {
    screen,
    config: { rows: config.rows, columns: config.columns },
    canvas: { width: screen.width, height: canvasHeight },
    initialPosition: Position.of({ row: 0, column: rowCenter }),
    cell: { containerSize, size: squareSize, spacing },
  };
};
