import { Layer } from 'effect';
import * as Effect from 'effect/Effect';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import { BoardStateCtx, BoardStateCtxLive } from './services/BoardState.service';
import { TetrisServiceCtx, TetrisServiceCtxLive } from './services/Tetris.service';

const MainLayer = TetrisServiceCtxLive.pipe(Layer.provideMerge(BoardStateCtxLive));
export const TetrisRuntime = ManagedRuntime.make(MainLayer);

export const runTetris = Effect.gen(function* () {
  const { runTetris } = yield* TetrisServiceCtx;

  yield* runTetris;
}).pipe(Effect.scoped);

export const runTetrisDrop = Effect.gen(function* () {
  const { drop, boardRef } = yield* BoardStateCtx;
});
