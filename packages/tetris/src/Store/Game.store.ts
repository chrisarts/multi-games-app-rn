import { type CustomStore, createStore } from '@games/shared';
import { HashMap, Option } from 'effect';
import { Dimensions } from 'react-native';
import { defaultCellColor } from '../Domain/Cell.domain';
import type * as GameState from '../Domain/GameState.domain';
import * as Grid from '../Domain/Grid.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

export interface GameStore extends CustomStore<GameState.GameState> {}

export const GameStore: GameStore = createStore<GameState.GameState>({
  game: {
    speed: 800,
    status: 'Stop',
  },
  tetromino: {
    current: Tetromino.getRandomTetromino(),
    next: Tetromino.getRandomTetromino(),
    position: Position.zero(),
  },
  grid: Grid.makeGridState({
    screen: Dimensions.get('screen'),
    size: { rows: 15, columns: 10 },
  }),
});

const makeUnsafeSetter = (f: (state: GameState.GameState) => void) => {
  GameStore.setState((prev) => {
    f(prev);
    return prev;
  });
};

/** @category unsafe setters */
const setCurrentPosition = (newPosition: Position.Position) =>
  makeUnsafeSetter((state) => {
    state.tetromino.position = newPosition;
  });

/** @category unsafe setters */
const setCurrentStatus = (nextStatus: GameState.GameRunState) =>
  makeUnsafeSetter((state) => {
    if (state.game.status === nextStatus) return state;
    state.game.status = nextStatus;
  });

const refreshCurrentCells = (
  tetromino: Tetromino.Tetromino,
  position: Position.Position,
  merged: boolean,
) => {
  for (const drawPos of tetromino.drawPositions) {
    const cell = HashMap.get(
      GameStore.getState().grid.cellsMap,
      Position.sum(drawPos, position),
    );
    if (Option.isNone(cell)) continue;

    cell.value.state = {
      color: tetromino.color,
      merged,
    };
  }
};
const clearCurrentCells = () => {
  for (const drawPos of GameStore.getState().tetromino.current.drawPositions) {
    const cell = HashMap.get(
      GameStore.getState().grid.cellsMap,
      Position.sum(drawPos, GameStore.getState().tetromino.position),
    );
    if (Option.isNone(cell)) continue;

    cell.value.state = {
      color: cell.value.state.merged ? cell.value.state.color : defaultCellColor,
      merged: cell.value.state.merged,
    };
  }
};
const refreshGrid = (nextPosition: Position.Position, merged: boolean) =>
  makeUnsafeSetter((state) => {
    clearCurrentCells();
    refreshCurrentCells(state.tetromino.current, nextPosition, merged);
    state.tetromino.position = nextPosition;
    if (!merged) return;
    const nextTetromino = Tetromino.getRandomTetromino();
    state.tetromino.current = state.tetromino.next;
    state.tetromino.next = nextTetromino;
    const initialPosition = Tetromino.getTetrominoInitialPos(
      state.grid.layout.initialPosition,
      nextTetromino,
    );

    state.tetromino.position = initialPosition;
    refreshCurrentCells(state.tetromino.current, initialPosition, false);
  });

export const StoreActions = {
  setCurrentPosition,
  setCurrentStatus,
  refreshGrid,
  refreshCurrentCells,
};
