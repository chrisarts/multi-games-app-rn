import * as Effect from 'effect/Effect';
import { PlayerContext, PlayerContextLive } from '../Services/Player.service';
import { TetrisLayer } from '../Services/Runtime.layers';

export const playerContextLive = Effect.gen(function* () {
  const { playerActions, publishAction } = yield* PlayerContext;

  return {
    playerActions,
    publishAction,
  };
}).pipe(Effect.provide(TetrisLayer));
