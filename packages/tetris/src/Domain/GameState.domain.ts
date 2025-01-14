import * as HashMap from 'effect/HashMap';
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

export const collisionChecker = (bounds: {
  tetromino: Grid.GridBound;
  grid: Grid.GridBound;
}) => {
  return {
    /** Tetromino min row position is less than grid min row position  */
    gameOver: Position.Order.rowGreatThan(bounds.tetromino.min, bounds.grid.min),
    /** the tetromino bounds are valid grid bounds  */
    insideGrid: Grid.validateBounds(bounds.grid, bounds.tetromino),
    /** Tetromino is beyond the last row  */
    shouldMerge: Position.Order.rowGreatThan(bounds.tetromino.max, bounds.grid.max),
  };
};

export const checkMergedSiblings = (state: {
  cells: Grid.GridState['cellsMap'];
  tetromino: Tetromino.Tetromino;
  /** This position must be valid or this method will throw */
  position: Position.Position;
}) => {
  let siblings = false;
  const positionBounds = {
    max: Position.sum(state.tetromino.bounds.max, state.position),
    min: Position.sum(state.tetromino.bounds.min, state.position),
  };
  for (const drawPos of state.tetromino.drawPositions) {
    const nextPos = Position.sum(drawPos, state.position);
    const cell = HashMap.unsafeGet(state.cells, nextPos);
    const isBellow = Position.Order.rowGreatThan(positionBounds.max, cell.position);
    if (!siblings) siblings = cell.state.merged;
    if (cell.state.merged && isBellow) {
      console.log('BOUNDS: ', {
        positionBounds,
        sibling: cell.position,
      });
      return {
        merge: true,
        siblings,
      };
    }
  }

  return {
    merge: false,
    siblings,
  };
};
