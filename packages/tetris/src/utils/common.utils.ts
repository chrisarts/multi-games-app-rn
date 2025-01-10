import * as Effect from 'effect/Effect';
import * as HashSet from 'effect/HashSet';
import * as LogLevel from 'effect/LogLevel';
import * as Logger from 'effect/Logger';
import * as Ref from 'effect/Ref';
import * as Runtime from 'effect/Runtime';
import * as Stream from 'effect/Stream';

export const debugEffect = <A, E, C>(span: string, message: string) => {
  return (effect: Effect.Effect<A, E, C>) =>
    effect.pipe(
      Effect.tap((value) => Effect.logDebug(message, value)),
      Effect.withLogSpan(span),
      Logger.withMinimumLogLevel(LogLevel.Debug),
    );
};

export const listenStreamChanges = <A, E, R>(
  stream: Stream.Stream<A, E>,
  f: (data: A) => Effect.Effect<void, never, R>,
): Effect.Effect<void, never, R> =>
  Effect.flatMap(Effect.runtime<R>(), (runtime) => {
    const run = Runtime.runFork(runtime);
    return stream.pipe(
      Stream.mapEffect(f),
      Stream.runDrain,
      Effect.catchAllCause((_) =>
        Effect.logError('unhandled defect in stream listener', _),
      ),
      run,
    );
  });

export const listenForkedStreamChanges = <A, E, R>(
  stream: Stream.Stream<A, E>,
  f: (data: A) => Effect.Effect<void, never, R>,
) => Effect.forkScoped(listenStreamChanges(stream, f));

export const createStoreContext = <StoreShape>(
  initialState: StoreShape,
): Effect.Effect<{
  subscribe: (listener: (state: StoreShape) => void) => () => void;
  getState: () => StoreShape;
  setState: (cb: (prev: StoreShape) => StoreShape) => void;
  selector: <Selected>(cb: (state: StoreShape) => Selected) => Selected;
}> =>
  Effect.gen(function* () {
    const subscriptionsRef = yield* Ref.make(
      HashSet.empty<(state: StoreShape) => void>(),
    );
    const storeRef = yield* Ref.make<StoreShape>(initialState);

    const subscribe = (listener: (state: StoreShape) => void) => {
      Effect.runSync(Ref.update(subscriptionsRef, (set) => HashSet.add(set, listener)));
      return () => {
        Effect.runSync(
          Ref.update(subscriptionsRef, (set) => HashSet.remove(set, listener)),
        );
      };
    };

    return {
      subscribe,
      getState: () => Effect.runSync(Ref.get(storeRef)),
      setState: (f: (currentState: StoreShape) => StoreShape) =>
        Effect.zip(Ref.updateAndGet(storeRef, f), Ref.get(subscriptionsRef)).pipe(
          Effect.andThen(([state, listeners]) =>
            Effect.forEach(listeners, (emit) => Effect.sync(() => emit(state)), {
              concurrency: 'inherit',
            }),
          ),
          Effect.runSync,
        ),
      selector: <Value>(f: (state: StoreShape) => Value) =>
        Effect.runSync(Ref.get(storeRef).pipe(Effect.map(f))),
    };
  });
