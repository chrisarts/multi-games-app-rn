import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import type * as Cell from './Cell.domain';
import * as Grid from './Grid.domain';
import * as Position from './Position.domain';
import type * as Tetromino from './Tetromino.domain';

export interface GameState {
  tetromino: {
    current: Tetromino.Tetromino;
    next: Tetromino.Tetromino;
    position: Position.Position;
  };
  game: {
    status: GameRunState;
    lines: number;
    speed: number;
  };
  grid: Grid.GridState;
  debug: boolean;
}

export type GameRunState = 'InProgress' | 'GameOver' | 'Stop';

export const collisionChecker = (check: {
  tetromino: Tetromino.Tetromino;
  position: Position.Position;
  grid: Grid.GridState;
}) => {
  const drawPositions = [] as Position.Position[];
  const invalidPositions = [] as Position.Position[];
  const drawCells = [] as Cell.Cell[];
  const mergedCells = [] as Cell.Cell[];
  const nextBounds = Grid.makeBound(
    check.tetromino.bounds.min,
    check.tetromino.bounds.max,
  );

  for (const drawPos of check.tetromino.drawPositions) {
    const pos = Position.sum(check.position, drawPos);
    drawPositions.push(pos);

    if (pos.x > nextBounds.max.x)
      nextBounds.max = Position.of({ y: nextBounds.max.y, x: pos.x });
    if (pos.x < nextBounds.min.x) 
      nextBounds.min = Position.of({ y: nextBounds.min.y, x: pos.x });
    if (pos.y > nextBounds.max.y) 
      nextBounds.max = Position.of({ y: pos.y, x: nextBounds.min.x });
    if (pos.y < nextBounds.min.y) 
      nextBounds.min = Position.of({ y: pos.y, x: nextBounds.min.x });

    const cell = Option.getOrNull(HashMap.get(check.grid.cellsMap, pos));
    if (cell) drawCells.push(cell);
    if (cell && cell.state.merged) mergedCells.push(cell);
    if (!cell) invalidPositions.push(pos);
  }

  const hasInvalidPosition = invalidPositions.length > 0;
  const hasCellCollisions = mergedCells.length > 0;
  const isGameOver = hasCellCollisions && drawPositions.some((x) => x.y <= 1);
  const isBeyondOrAtMaxRow = Position.Order.rowGreatThanOrEquals(
    check.grid.bounds.max,
    check.position,
  );
  return {
    checks: {
      hasInvalidPosition,
      hasCellCollisions,
      isGameOver,
      isBeyondOrAtMaxRow,
    },
    data: {
      drawPositions,
      invalidPositions,
      drawCells,
      mergedCells,
      nextBounds,
    },
  };
};
