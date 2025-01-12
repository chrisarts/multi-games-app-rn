import { createStore } from '@games/shared';
import { useSyncExternalStore } from 'react';
import * as GameState from '../Domain/Game.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

const store = createStore<GameState.GameState>({
  gameStatus: GameState.GameRunState('Stop'),
  currentTetromino: Tetromino.getRandomTetromino(),
  nextTetromino: Tetromino.getRandomTetromino(),
  dropPosition: Position.zero(),
});

const setRunState = (next: GameState.GameRunState) =>
  store.setState((x) => {
    x.gameStatus = next;
    return x;
  });

const setDropPosition = (to: Position.Position) =>
  store.setState((prev) => ({
    ...prev,
    dropPosition: to,
  }));

const resetGame = () => setRunState(GameState.GameRunState('Stop'));

const useGameStore = <Output>(selector: (state: GameState.GameState) => Output): Output =>
  useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const GameStore = {
  store,
  useGameStore,
  setRunState,
  resetGame,
  setDropPosition,
};
