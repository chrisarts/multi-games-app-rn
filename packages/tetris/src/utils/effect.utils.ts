import type { CustomStore, StoreSelectorFn, StoreUnsafeSet } from '@games/shared';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import * as Ref from 'effect/Ref';
import * as Runtime from 'effect/Runtime';
import * as Stream from 'effect/Stream';

const listenStreamChanges = <A, E, R>(
  stream: Stream.Stream<A, E>,
  f: (data: A) => Effect.Effect<void, never, R>,
): Effect.Effect<void, never, R> => {
  return Effect.flatMap(Effect.runtime<R>(), (runtime) => {
    const run = Runtime.runFork(runtime);
    const fiber = stream.pipe(
      Stream.runForEach(f),
      Effect.catchAllCause((_) => Effect.log('unhandled defect in event listener', _)),
      run,
    );
    return Fiber.interrupt(fiber);
  });
};

export const listenForkedStreamChanges = <A, E, R>(
  stream: Stream.Stream<A, E>,
  f: (data: A) => Effect.Effect<void, never, R>,
) => Effect.forkScoped(listenStreamChanges(stream, f));

export const createEffectStore = <State>(fromStore: CustomStore<State>) =>
  Effect.gen(function* () {
    const storeRef = yield* Ref.make<CustomStore<State>>(fromStore);

    const selector = <Out>(f: (state: State) => Out): Effect.Effect<Out> =>
      Ref.get(storeRef).pipe(Effect.map((x) => f(x.getState())));

    const unsafeSetState = (f: StoreUnsafeSet<State>): Effect.Effect<void> =>
      Ref.get(storeRef).pipe(
        Effect.tap((store) => Effect.sync(() => f(store.getState()))),
      );

    const listenStateChanges = (f: <E>(state: State) => Effect.Effect<void, E>) =>
      Ref.get(storeRef).pipe(
        Effect.map((currentStore) =>
          Stream.async<State>((emit) => {
            const subscriber = currentStore.subscribe((nextState) =>
              Effect.runSync(Effect.sync(() => emit.single(nextState))),
            );

            return Effect.sync(() => subscriber()).pipe(
              Effect.tap((r) => Effect.log(`Store Unsubscribed - removed: ${r}`)),
            );
          }),
        ),
        Stream.unwrap,
        (stream) => listenForkedStreamChanges(stream, f),
      );

    return {
      store: Ref.get(storeRef),
      selector,
      unsafeSetState,
      listenStateChanges,
    };
  });
