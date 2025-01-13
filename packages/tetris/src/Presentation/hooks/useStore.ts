import type { CustomStore } from '@games/shared';
import { useSyncExternalStore } from 'react';
import type { GameState } from '../../Domain/Game.domain';
import type { GridState } from '../../Domain/Grid.domain';
import { GameStore } from '../../Store/Game.store';
import { GridStore } from '../../Store/Grid.store';

export const useStore = <StoreShape, Output>(
  store: CustomStore<StoreShape>,
  selector: (state: StoreShape) => Output,
): Output => useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const useGridStore = <Output>(f: (state: GridState) => Output) =>
  useStore(GridStore, f);

export const useGameStore = <Output>(f: (state: GameState) => Output) =>
  useStore(GameStore, f);
