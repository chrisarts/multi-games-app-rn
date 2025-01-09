import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Ref from 'effect/Ref';
import { type BoardPosition, GameState, TickSpeed } from '../../models/Board.model';

export const make = Effect.gen(function* () {
  const thickRef = yield* Ref.make<TickSpeed>(TickSpeed.Normal);
  const runStateRef = yield* Ref.make<GameState>(GameState.STOP);

  const startGame = Ref.set(runStateRef, GameState.PLAYING);
  const stopGame = Ref.set(runStateRef, GameState.STOP);
  const isRunning = Ref.get(runStateRef).pipe(Effect.map((x) => x === GameState.PLAYING));

  return {
    thickRef,
    runState: Ref.get(runStateRef),
    startGame,
    stopGame,
    isRunning,
  };
});

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.effect(PlayerContext, make);
