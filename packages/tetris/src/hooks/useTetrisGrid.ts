import * as Effect from 'effect/Effect';
import { useState, useSyncExternalStore } from 'react';
import { TetrisRuntime, runTetris } from '../programs/game.program';
import { BoardStateCtx } from '../programs/services/BoardState.service';

export const useTetrisGrid = () => {
  const [gridModel] = useState(() =>
    TetrisRuntime.runSync(
      BoardStateCtx.pipe(
        Effect.andThen((x) => x.board),
        Effect.tap((x) => x.updateBoard(false)),
      ),
    ),
  );

  const grid = useSyncExternalStore(
    gridModel.store.subscribe,
    () => gridModel.store.getState().gridPoints,
    () => gridModel.store.getState().gridPoints,
  );

  const startGame = () => TetrisRuntime.runFork(runTetris.pipe(Effect.forkDaemon));

  return {
    grid,
    gridModel,
    actions: {
      startGame,
    },
  };
};
