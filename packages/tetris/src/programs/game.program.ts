import * as Effect from 'effect/Effect';
import * as Ref from 'effect/Ref';
import { GameStateCtx } from './services/GameState.service';
import { TetrisServiceCtx } from './services/Tetris.service';

// export const runTetris = TetrisServiceCtx.pipe(
//   Effect.andThen((tetris) => tetris.runGame),
//   Effect.scoped,
//   Effect.forkDaemon,
// );

// export const publishTetrisAction = TetrisServiceCtx.pipe(
//   Effect.andThen((game) => game.publishAction),
// );

// export const getGameStoreSync = GameStateCtx.pipe(
//   Effect.andThen((x) => Ref.get(x.gameRef)),
//   Effect.andThen((game) => Effect.sync(() => game.state)),
// );

export const getTetrisGameHandler = Effect.gen(function* () {
  const { runGame, publishAction } = yield* TetrisServiceCtx;
  const { gameRef, isRunning } = yield* GameStateCtx;
  return {
    service: {
      runGame,
      publishAction,
    },
    game: {
      isRunning,
      gameRef,
    },
  };
});
