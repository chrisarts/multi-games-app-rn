import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import type { MoveDirection } from '../models/Action.model';
import {
  TetrisStoreContext,
  TetrisStoreContextLive,
} from '../services/GameStore.service';

export const tetrisContext = Effect.gen(function* () {
  const { controls, store } = yield* TetrisStoreContext;

  const runTetrisTicks = Effect.gen(function* () {
    controls.refreshBoard();
    const latch = yield* Deferred.make<boolean>();
    const gameQueue = yield* Queue.unbounded<MoveDirection>();

    yield* Queue.take(gameQueue).pipe(
      Effect.map((move) => Effect.sync(() => controls.runMoveTo(move))),
      Effect.flatten,
      Effect.forever,
      Effect.fork,
    );

    // yield* Queue.offer(gameQueue, MoveDirection('down')).pipe(
    //   Effect.delay(Duration.millis(store.selectState((x) => x.player.speed))),
    //   Effect.repeat({
    //     while: () =>
    //       Effect.sync(() =>
    //         store.selectState((x) => x.player.runState === GameRunState('Play')),
    //       ),
    //   }),
    // );

    yield* Effect.addFinalizer(() =>
      Deferred.complete(latch, Effect.succeed(true)).pipe(
        Effect.andThen((completed) => Effect.log('completed_ ', completed)),
      ),
    );

    yield* Deferred.await(latch);
  });

  return {
    controls,
    store,
    runTetrisTicks,
  };
}).pipe(Effect.provide(TetrisStoreContextLive), Effect.runSync);
