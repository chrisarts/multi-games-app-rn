import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { useEffect, useSyncExternalStore } from 'react';
import { GameRunState, type MoveDirection } from '../models/Action.model';
import { _GameState } from '../old-models/Board.model';
import { tetrisContext } from '../programs/game.program';
import { useRenderCounter } from './useRenderCounter';

export const useTetrisStore = () => {
  useRenderCounter();

  const canvasSize = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.board.layout.canvas),
  );
  const gameState = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.game.status),
  );
  const gridPoints = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.board.points),
  );

  const startGame = () => tetrisContext.controls.changeRunState(GameRunState('Play'));

  const stopGame = () => tetrisContext.controls.changeRunState(GameRunState('Stop'));

  const move = (moveTo: MoveDirection) => tetrisContext.controls.runMoveTo(moveTo);

  const rotate = () => tetrisContext.controls.runRotate();

  useEffect(() => {
    if (gameState === GameRunState('Play')) {
      console.log('PLAYING: ', gameState);
      const fiber = tetrisContext.runTetrisTicks.pipe(
        Effect.tap(() => Effect.log('Ticks started')),
        Effect.scoped,
        Effect.runFork,
      );
      return () => {
        Effect.runPromise(
          Fiber.interrupt(fiber).pipe(Effect.tap(() => Effect.log('Ticks stopped'))),
        );
      };
    }
  }, [gameState]);

  return {
    gridPoints,
    canvasSize,
    gameState,
    actions: {
      startGame,
      stopGame,
      move,
      rotate,
    },
  };
};
