import { createStore } from '@games/shared';
import { useSyncExternalStore } from 'react';
import * as GameState from '../Domain/Game.domain';

const store = createStore<GameState.GameState>({
  gameStatus: GameState.GameRunState('Stop'),
});

const setRunState = (next: GameState.GameRunState) =>
  store.setState((x) => {
    x.gameStatus = next;
    return x;
  });

const resetGame = () => setRunState(GameState.GameRunState('Stop'));

const useGameStore = <Output>(selector: (state: GameState.GameState) => Output): Output =>
  useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const GameStore = {
  useGameStore,
  setRunState,
  resetGame,
};
