import * as Effect from 'effect/Effect';
import { useState, useSyncExternalStore } from 'react';
import { GameRunState, MoveDirection, PlayerAction } from '../models/Action.model';
import { GameModel } from '../models/Game.model';
import { getTetrisGameHandler } from '../programs/game.program';
import { TetrisRuntime } from '../programs/tetris.runtime';
import {
  TetrisStoreContext,
  TetrisStoreContextLive,
} from '../services/GameStore.service';
import { useRenderCounter } from './useRenderCounter';

const storeContext = Effect.runSync(
  TetrisStoreContext.pipe(Effect.provide(TetrisStoreContextLive)),
);
export const useTetrisGrid = () => {
  useRenderCounter();
  const [gameHandler] = useState(() => TetrisRuntime.runSync(getTetrisGameHandler));

  const gameStore = gameHandler.gameModel.state;

  const canvasSize = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board.layout.canvas,
    () => gameStore.getState().board.layout.canvas,
  );
  const gameState = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().status,
    () => gameStore.getState().status,
  );
  const gridPoints = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board.gridPoints,
    () => gameStore.getState().board.gridPoints,
  );

  const startGame = () =>
    Effect.runFork(
      gameHandler.service.runGame.pipe(Effect.catchAll((x) => Effect.log('ERROR; ', x))),
    );

  const stopGame = () =>
    gameHandler.service
      .publishAction(PlayerAction.runState({ status: GameRunState('Stop') }))
      .pipe(Effect.runPromise);

  const move = (moveTo: MoveDirection) =>
    gameHandler.service
      .publishAction(PlayerAction.move({ direction: moveTo }))
      .pipe(Effect.runPromise);

  const rotate = () =>
    gameHandler.service
      .publishAction(PlayerAction.move({ direction: MoveDirection('rotate') }))
      .pipe(Effect.runPromise);

  return {
    gridPoints,
    canvasSize,
    gameState,
    gameHandler,
    actions: {
      startGame,
      stopGame,
      move,
      rotate,
    },
  };
};

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
