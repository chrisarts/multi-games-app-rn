import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as HashMap from 'effect/HashMap';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import type * as Cell from '../Domain/Cell.domain';
import type * as Position from '../Domain/Position.domain';
import * as GridStore from '../Store/Grid.store';
import { createEffectStore } from '../utils/effect.utils';

const make = Effect.gen(function* () {
  const gridStore = yield* createEffectStore(GridStore.GridStore);

  const getCellAt = (position: Position.Position) =>
    gridStore.selector((x) => HashMap.get(x.cellsMap, position));

  const mutateCellAt = (position: Position.Position, f: (cell: Cell.Cell) => void) =>
    gridStore.unsafeSetState((state) => {
      HashMap.get(state.cellsMap, position).pipe(Option.map(f));
    });

  const mapCellState = (position: Position.Position, f: (cell: Cell.Cell) => Cell.Cell) =>
    gridStore.unsafeSetState((state) => {
      HashMap.modify(state.cellsMap, position, f);
      return state;
    });

  return {
    gridStore,
    listen: gridStore.listenStateChanges,
    actions: {
      getCellAt,
      mutateCellAt,
      mapCellState,
    },
  };
});

interface GridRepoContext extends Effect.Effect.Success<typeof make> {}
export const GridRepoContext = Context.GenericTag<GridRepoContext>('GridRepoContext');
export const GridRepoContextLive = Layer.effect(GridRepoContext, make);
