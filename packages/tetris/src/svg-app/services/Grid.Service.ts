import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Bounds from '../../Domain/GridBound.domain';
import type * as Position from '../../Domain/Position.domain';
import { GridStore } from '../../Store/Grid.store';
import * as BoardModel from '../models/GameBoard';

export const make = Effect.gen(function* () {
  const gridStore = Effect.sync(() => GridStore.selector);

  const getCellAt = (position: Position.Position) => GridStore.getCellAt(position);
  const positionValid = (position: Position.Position) =>
    Effect.map(gridStore, (selector) =>
      Bounds.positionInsideBound(
        selector((x) => x.bounds),
        position,
      ),
    );

  return {
    getCellAt,
    positionValid,
  };
}).pipe(Effect.tap(() => Effect.log('Provided player service ctx')));

export interface PlayerContext extends Effect.Effect.Success<typeof make> {}
export const PlayerContext = Context.GenericTag<PlayerContext>('PlayerContext');
export const PlayerContextLive = Layer.effect(PlayerContext, make);
