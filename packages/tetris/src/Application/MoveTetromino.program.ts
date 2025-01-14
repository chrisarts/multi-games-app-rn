import * as Effect from 'effect/Effect';
import type * as GameAction from '../Domain/GameAction.domain';
import * as GameState from '../Domain/GameState.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';
import * as GameStore from '../Store/Game.store';
import { debugObjectLog } from '../utils/log.utils';

export const MoveTetrominoProgram = (nextMove: GameAction.MoveAction) =>
  Effect.gen(function* () {
    const store = GameStore.GameStore;

    const currentPosition = store.getState().tetromino.position;
    const currentShape = store.getState().tetromino.current;
    const gridBounds = store.getState().grid.bounds;
    const cellsMap = store.getState().grid.cellsMap;

    const nextPos = Position.sum(nextMove, currentPosition);
    console.log('NEXT_POS: ', nextPos);
    const nextDrawAndBounds = Tetromino.mapWithPosition(currentShape, nextPos);

    const collisions = GameState.collisionChecker({
      grid: gridBounds,
      tetromino: nextDrawAndBounds.bounds,
    });

    if (collisions.gameOver) {
      debugObjectLog('GAME_OVER', nextDrawAndBounds.bounds);
      return 'game over';
    }

    if (collisions.shouldMerge) {
      debugObjectLog('MERGE: ', nextDrawAndBounds.bounds);
      yield* Effect.sync(() => GameStore.StoreActions.refreshGrid(currentPosition, true));
      return 'merge shape';
    }

    if (!collisions.insideGrid) {
      console.log('INVALID_NEXT_POS: ', {
        collisions,
        bounds: nextDrawAndBounds.bounds,
        pos: nextPos,
      });
      return 'invalid position';
    }

    const siblingCollision = GameState.checkMergedSiblings({
      cells: cellsMap,
      position: nextPos,
      tetromino: currentShape,
    });

    if (siblingCollision.siblings) {
      GameStore.StoreActions.refreshGrid(currentPosition, siblingCollision.merge);
      return 'sibling collide';
    }

    // const { positions } = Tetromino.mapWithPosition(tetromino, currentPos);

    // yield* gameRepo.unsafeUpdateBoard({
    //   tetromino: currentBlock,
    //   updatedPosition: collisions.shouldMerge ? currentPos : nextPos,
    //   fromPositions: currentBlock.drawPositions.map((x) => Position.sum(x, currentPos)),
    //   toPositions: nextBlockPos.positions,
    //   merge: collisions.shouldMerge,
    // });
    
    GameStore.StoreActions.refreshGrid(nextPos, false);
    return 'normal refresh';
  });
