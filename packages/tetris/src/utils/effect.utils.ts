import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
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
