import { getDeviceDimensions } from '@games/shared';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Ref from 'effect/Ref';
import * as BoardModel from '../models/GameBoard';

export const make = Effect.gen(function* () {
  const screen = yield* Effect.sync(() => getDeviceDimensions());
  const layout = yield* Ref.make<BoardModel.GameBoardLayout>(
    BoardModel.makeLayout({
      config: { columns: 10, rows: 15 },
      screen: { height: screen.HEIGHT, width: screen.WIDTH },
    }),
  );

  return {
    layout,
  };
}).pipe(Effect.tap(() => Effect.log('Provided player service ctx')));

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.effect(PlayerContext, make)
