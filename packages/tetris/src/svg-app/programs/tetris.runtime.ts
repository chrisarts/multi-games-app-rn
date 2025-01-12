import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';

export const TetrisMainLayer = TetrisServiceCtxLive.pipe(
  Layer.provideMerge(GameStateCtxLive),
);

export const TetrisRuntime = ManagedRuntime.make(TetrisMainLayer);
