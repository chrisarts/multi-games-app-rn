import * as Effect from 'effect/Effect';
import { useState, useSyncExternalStore } from 'react';
import { useRenderCounter } from '../../App/Presentation/hooks/useRenderCounter';
import { GameRunState, MoveDirection, PlayerAction } from '../../models/Action.model';
import { getTetrisGameHandler } from '../programs/game.program';
import { TetrisRuntime } from '../programs/tetris.runtime';
import {
  TetrisStoreContext,
  TetrisStoreContextLive,
} from '../services/GameStore.service';

const storeContext = Effect.runSync(
  TetrisStoreContext.pipe(Effect.provide(TetrisStoreContextLive)),
);
export const useTetrisGrid = () => {
  useRenderCounter();
  const [gameHandler] = useState(() => TetrisRuntime.runSync(getTetrisGameHandler));

  const gameStore = gameHandler.gameModel.state;

  const canvasSize = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board.state.board.layout.canvas,
    () => gameStore.getState().board.state.board.layout.canvas,
  );
  const gameState = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().status,
    () => gameStore.getState().status,
  );
  const gridPoints = useSyncExternalStore(
    gameStore.subscribe,
    () => gameStore.getState().board.state.board.cellsMap,
    () => gameStore.getState().board.state.board.cellsMap,
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

const root = {
  id: 1,
  render: () => `<h1 id=${'asdads'}><div><spinner /></h1>`,
  children: {
    id: 2,
    isLoading: false,
    children: [
      {
        id: 3,
      },
      {
        id: 4,
      },
    ],
  },
};
