import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import { GameStateCtxLive } from './services/GameState.service';
import { TetrisServiceCtxLive } from './services/Tetris.service';

export const TetrisMainLayer = TetrisServiceCtxLive.pipe(
  Layer.provideMerge(GameStateCtxLive),
);

export const TetrisRuntime = ManagedRuntime.make(TetrisMainLayer);
