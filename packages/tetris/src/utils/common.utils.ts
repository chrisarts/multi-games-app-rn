import * as Effect from 'effect/Effect';
import * as LogLevel from 'effect/LogLevel';
import * as Logger from 'effect/Logger';
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
