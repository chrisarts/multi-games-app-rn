import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as PubSub from 'effect/PubSub';
import * as Ref from 'effect/Ref';
import * as Stream from 'effect/Stream';
import * as SubscriptionRef from 'effect/SubscriptionRef';
import { type BoardPosition, TickSpeed } from '../../models/Board.model';
import { GridModel } from '../../models/Grid.model';
import { playerMoves } from '../../utils/player.utils';
import { GameStateCtx, GameStateCtxLive } from './GameState.service';

const make = Effect.gen(function* () {
  const gameState = yield* GameStateCtx;
  const hub = yield* PubSub.unbounded<BoardPosition>();
  const boardRef = yield* Ref.make(new GridModel());

  const listenBoard = yield* Effect.map(subscribe(), (subscription) =>
    subscription.pipe(
      Stream.filterEffect((boardPosition) =>
        Effect.gen(function* () {
          const hasCollide = yield* blockHasCollide(boardPosition);

          if (!hasCollide) return true;

          const board = yield* Ref.get(boardRef);
          const shouldContinue = board.store.getState().currentShape.position.x < 0;
          if (!shouldContinue) {
            yield* Effect.log('STOP_GAME');
            yield* gameState.stopGame;
            yield* Ref.set(gameState.thickRef, TickSpeed.Normal);
            // yield* updatePlayerPosition(playerMoves.zero(), true);
          }
          return shouldContinue;
        }),
      ),
    ),
  );

  return {
    hub,
    board: Ref.get(boardRef),
    boardRef,
    listenBoard,
    move,
    subscribe,
    drop,
  };

  function drop() {
    return Effect.gen(function* () {
      const dropMove = playerMoves.down(1);
      yield* hub.publish(dropMove);
    });
  }

  function move(action: BoardPosition) {
    return Effect.gen(function* () {
      return yield* hub.publish(action);
    });
  }

  function blockHasCollide(movedTo: BoardPosition): Effect.Effect<boolean> {
    return Effect.gen(function* () {
      const boardMatrix = yield* Ref.get(boardRef);
      // for (let row = 0; row < shape.length; row += 1) {
      //   for (let column = 0; column < shape[row].length; column += 1) {
      //     // 1. Check that we're on an actual Tetromino cell
      //     if (shape[row][column] !== 0) {
      //       const rowIndex = row + boardState.position.x + movedTo.x;
      //       const colIndex = column + boardState.position.y + movedTo.y;
      //       const rowCells = boardMatrix[rowIndex];
      //       // 2. Check that our move is inside the game areas height (y)
      //       // That we're not moving through the bottom of the grid
      //       if (!rowCells) {
      //         return true;
      //       }
      //       const cell = rowCells[colIndex];
      //       // 3. Check that our move is inside the game areas width (x)
      //       if (!cell) {
      //         return true;
      //       }
      //       // 4. Check that the cell we're moving to isn't set to clear
      //       if (cell[1] !== CellState.EMPTY) {
      //         return true;
      //       }
      //     }
      //   }
      // }
      return false;
    });
  }

  function subscribe() {
    return PubSub.subscribe(hub).pipe(
      Effect.andThen((_) =>
        Effect.addFinalizer(() => _.shutdown).pipe(Effect.map(() => _)),
      ),
      Effect.tap(() => Effect.logDebug('Subscribe to board state')),
      Effect.map(Stream.fromQueue),
    );
  }
});

export interface BoardStateCtx extends Effect.Effect.Success<typeof make> {}
export const BoardStateCtx = Context.GenericTag<BoardStateCtx>('BoardStateCtx');
export const BoardStateCtxLive = Layer.scoped(BoardStateCtx, make).pipe(
  Layer.provide(GameStateCtxLive),
);
