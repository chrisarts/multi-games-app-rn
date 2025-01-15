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
    speed: number;
  };
  grid: Grid.GridState;
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

    if (pos.column > nextBounds.max.column) nextBounds.max.column = pos.column;
    if (pos.column < nextBounds.min.column) nextBounds.min.column = pos.column;
    if (pos.row > nextBounds.max.row) nextBounds.max.row = pos.row;
    if (pos.row < nextBounds.min.row) nextBounds.min.row = pos.row;

    const cell = Option.getOrNull(HashMap.get(check.grid.cellsMap, pos));
    if (cell) drawCells.push(cell);
    if (cell && cell.state.merged) mergedCells.push(cell);
    if (!cell) invalidPositions.push(pos);
  }

  const hasInvalidPosition = invalidPositions.length > 0;
  const hasCellCollisions = mergedCells.length > 0;
  const isGameOver = hasCellCollisions && drawPositions.some((x) => x.row <= 1);
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

// export const checkMergedSiblings = (state: {
//   cells: Grid.GridState['cellsMap'];
//   tetromino: Tetromino.Tetromino;
//   /** This position must be valid or this method will throw */
//   position: Position.Position;
// }) => {
//   let collided = false;
//   let overlaps = false;
//   const positionBounds = {
//     max: Position.sum(state.tetromino.bounds.max, state.position),
//     min: Position.sum(state.tetromino.bounds.min, state.position),
//   };
//   for (const drawPos of state.tetromino.drawPositions) {
//     const nextPos = Position.sum(drawPos, state.position);
//     const cell = HashMap.unsafeGet(state.cells, nextPos);
//     const isBellow = Position.Order.rowGreatThan(positionBounds.max, cell.position);
//     const isSamePos = Position.Eq.equals(cell.position, nextPos);

//     collided = collided || (cell.state.merged && isBellow);
//     overlaps = overlaps || (cell.state.merged && isSamePos);
//   }

//   return {
//     overlaps,
//     collided,
//     mergeCurrentPos: collided && overlaps,
//   };
// };
