import { Fiber, Ref } from 'effect';
import * as Effect from 'effect/Effect';
import { useEffect, useSyncExternalStore } from 'react';
import type { MoveDirection } from '../models/Block.model';
import { GameState } from '../models/Board.model';
import { GameModel } from '../models/Game.model';
import { getTetrisGameHandler } from '../programs/game.program';
import { TetrisRuntime } from '../programs/tetris.runtime';

const gameHandler = TetrisRuntime.runSync(getTetrisGameHandler);
const gameStore = Effect.runSync(
  gameHandler.game.gameRef.pipe(Effect.map((x) => x.state)),
);

export const useTetrisGrid = () => {
  const gridModel = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board,
    () => gameStore.getState().board,
  );
  const gameState = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().status,
    () => gameStore.getState().status,
  );
  const gridPoints = useSyncExternalStore(
    gameStore.subscribe,
    () => gridModel.gridPoints,
    () => gridModel.gridPoints,
  );

  // useEffect(() => {
  //   console.log('HANDLER: ', Effect.runSync(gameHandler.game.isRunning));
  //   console.log('STATE: ', gameState);
  //   if (gameState === GameState.PLAYING) {
  //     console.log('PLAYING: ', gameState);
  //     const fiber = Effect.runFork(gameHandler.service.runGame.pipe(Effect.scoped));
  //     return () => {
  //       const logFiber = fiber.status.pipe(
  //         Effect.tap((x) => Effect.log('FIBER_STATE', x)),
  //       );
  //       Effect.runPromise(Effect.zipRight(logFiber, Fiber.interrupt(fiber)));
  //     };
  //   }
  // }, [gameState]);

  const startGame = () =>
    Effect.runFork(
      gameHandler.service.runGame.pipe(Effect.catchAll((x) => Effect.log('ERROR; ', x))),
    );

  const stopGame = () =>
    gameHandler.service
      .publishAction(GameModel.playerActions.stop)
      .pipe(Effect.runPromise);

  const move = (moveTo: MoveDirection) =>
    gameHandler.service
      .publishAction(GameModel.playerActions.move(moveTo))
      .pipe(Effect.runPromise);

  return {
    gridPoints,
    gridModel,
    gameState,
    gameStore,
    gameHandler,
    actions: {
      startGame,
      stopGame,
      move,
    },
  };
};
