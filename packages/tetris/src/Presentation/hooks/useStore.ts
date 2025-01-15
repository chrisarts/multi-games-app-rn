import type { CustomStore } from '@games/shared';
import { useSyncExternalStore } from 'react';
import type * as GameState from '../../Domain/GameState.domain';
import * as GameStore from '../../Store/Game.store';

export const useStore = <StoreShape, Output>(
  store: CustomStore<StoreShape>,
  selector: (state: StoreShape) => Output,
): Output => useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const useGameStore = <Output>(f: (state: GameState.GameState) => Output) =>
  useStore(GameStore.GameStore, f);
