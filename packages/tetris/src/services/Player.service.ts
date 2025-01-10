import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Ref from 'effect/Ref';
import { GameRunState, TickSpeed } from '../models/Action.model';

export const make = Effect.gen(function* () {
  const thickRef = yield* Ref.make(TickSpeed.Normal);
  const runStateRef = yield* Ref.make(GameRunState('Stop'));

  const startGame = Ref.set(runStateRef, GameRunState('Play'));
  const stopGame = Ref.set(runStateRef, GameRunState('Stop'));
  const isRunning = Ref.get(runStateRef).pipe(
    Effect.map((x) => x === GameRunState('Play')),
  );

  return {
    thickRef,
    runState: Ref.get(runStateRef),
    startGame,
    stopGame,
    isRunning,
  };
}).pipe(Effect.tap(() => Effect.log('Provided player service ctx')));

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.effect(PlayerContext, make);
