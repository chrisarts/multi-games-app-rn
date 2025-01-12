import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { useEffect, useSyncExternalStore } from 'react';
import { GameRunState } from '../../Domain/Game.domain';
import { useRenderCounter } from '../../Presentation/hooks/useRenderCounter';
import type { MoveDirection } from '../models/Action.model';
import { _GameState } from '../old-models/Board.model';
import { tetrisContext } from '../programs/game.program';

export const useTetrisStore = () => {
  useRenderCounter('asd');

  const canvasSize = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.board.layout.canvas),
  );
  const gameState = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.player.runState),
  );
  const gridPoints = useSyncExternalStore(tetrisContext.store.subscribe, () =>
    tetrisContext.store.selectState((state) => state.board.gridPositions),
  );

  const startGame = () => tetrisContext.controls.setRunState(GameRunState('InProgress'));

  const stopGame = () => tetrisContext.controls.setRunState(GameRunState('Stop'));

  const move = (moveTo: MoveDirection) => tetrisContext.controls.runMoveTo(moveTo);

  const rotate = () => tetrisContext.controls.runRotate();

  useEffect(() => {
    if (gameState === GameRunState('InProgress')) {
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
