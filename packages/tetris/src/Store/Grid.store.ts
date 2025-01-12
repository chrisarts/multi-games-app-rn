import { createStore } from '@games/shared';
import { HashMap } from 'effect';
import type * as Option from 'effect/Option';
import { useSyncExternalStore } from 'react';
import { Dimensions } from 'react-native';
import type * as CellDomain from '../Domain/Cell.domain';
import * as GridDomain from '../Domain/Grid.domain';
import type * as Position from '../Domain/Position.domain';

const store = createStore<GridDomain.GridState>(
  GridDomain.makeGridState({
    screen: Dimensions.get('screen'),
    size: { rows: 15, columns: 10 },
  }),
);

const selector = <Output>(f: (state: GridDomain.GridState) => Output): Output =>
  f(store.getState());

const getCellAt = (position: Position.Position): Option.Option<CellDomain.Cell> =>
  selector((x) => HashMap.get(x.cellsMap, position));

const mutateCellAt = (
  position: Position.Position,
  f: (cell: Option.Option<CellDomain.Cell>) => void,
) => f(getCellAt(position));

const mapCellState = (
  position: Position.Position,
  f: (cell: CellDomain.Cell) => CellDomain.Cell,
) =>
  store.setState((state) => {
    state.cellsMap = HashMap.modify(state.cellsMap, position, f);
    return state;
  });

const useGrisStore = <Output>(
  selector: (state: GridDomain.GridState) => Output,
): Output => useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const GridStore = {
  useGrisStore,
  selector,
  getCellAt,
  mutateCellAt,
  mapCellState,
};
