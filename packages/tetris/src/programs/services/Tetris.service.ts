import { Ref } from 'effect';
import * as Context from 'effect/Context';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Stream from 'effect/Stream';
import { BoardStateCtx, BoardStateCtxLive } from './BoardState.service';
import { GameStateCtx, GameStateCtxLive } from './GameState.service';

const make = Effect.gen(function* () {
  const { listenBoard, drop, boardRef } = yield* BoardStateCtx;
  const { isRunning, startGame, thickRef } = yield* GameStateCtx;

  const runGame = Ref.get(thickRef).pipe(
    Effect.flatMap((thick) => drop().pipe(Effect.delay(Duration.millis(thick)))),
    Effect.repeat({
      while: () => isRunning.pipe(Effect.tap((x) => Effect.logDebug('CONTINUE?: ', x))),
    }),
  );

  const tetrisRunner = listenBoard.pipe(
    Stream.runForEach((position) =>
      Ref.get(boardRef).pipe(
        Effect.andThen((board) => board.moveCurrentBlock(position, false)),
        // Effect.tap(() => Effect.log('Update board')),
      ),
    ),
    Effect.fork,
  );

  const runTetris = Effect.zipRight(
    tetrisRunner,
    startGame.pipe(Effect.andThen(() => runGame)),
  );

  return {
    runTetris,
  };
});

export interface TetrisServiceCtx extends Effect.Effect.Success<typeof make> {}
export const TetrisServiceCtx = Context.GenericTag<TetrisServiceCtx>('TetrisServiceCtx');
export const TetrisServiceCtxLive = Layer.effect(TetrisServiceCtx, make).pipe(
  Layer.provide(GameStateCtxLive),
  Layer.provide(BoardStateCtxLive),
);
