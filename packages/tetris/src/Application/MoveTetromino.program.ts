import * as Effect from 'effect/Effect';
import type * as GameAction from '../Domain/GameAction.domain';
import * as GameState from '../Domain/GameState.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import * as GameStore from '../Store/Game.store';

export const MoveTetrominoProgram = (nextMove: GameAction.MoveAction) =>
  Effect.gen(function* () {
    const store = GameStore.GameStore;
    const currentPosition = store.getState().tetromino.position;
    const nextPos = Position.sum(nextMove, currentPosition);

    const prevShape = store.getState().tetromino.current;
    const currentShape = yield* Effect.sync(() => {
      const current = store.getState().tetromino.current;
      if (nextMove._tag !== 'rotate') return current;
      return Tetromino.rotateTetromino(current);
    });

    const gridState = store.getState().grid;
    const collisions = GameState.collisionChecker({
      grid: gridState,
      tetromino: currentShape,
      position: nextPos,
    });

    const debugData = {
      collisions: collisions.checks,
      currentPosition,
      nextPosition: nextPos,
      tetrominoBounds: currentShape.bounds,
      move: nextMove,
    };

    if (collisions.checks.isGameOver) {
      GameStore.StoreActions.setCurrentStatus('GameOver');
      return {
        run: 'GameOver',
        debugData,
      };
    }

    if (collisions.checks.hasCellCollisions) {
      if (nextMove._tag === 'down') {
        GameStore.StoreActions.refreshGrid(currentShape, currentPosition, true);
      }
      return {
        run: 'MergeWithSiblings',
        debugData,
      };
    }

    if (collisions.checks.hasInvalidPosition && collisions.checks.isBeyondOrAtMaxRow) {
      if (nextMove._tag === 'down') {
        GameStore.StoreActions.refreshGrid(currentShape, currentPosition, true);
      }
      return {
        run: 'BlockShapeOrMergeDown',
        debugData,
      };
    }

    if (collisions.checks.hasInvalidPosition) {
      return {
        run: 'InvalidPosition',
        debugData,
      };
    }

    GameStore.StoreActions.refreshGrid(currentShape, nextPos, false);
    return {
      run: 'MoveTetromino',
      debugData,
    };
  }).pipe(
    Effect.catchAll((x) =>
      Effect.succeed({
        run: 'Failed',
        debugData: x,
      }),
    ),
  );
