import { type CustomStore, createStore } from '@games/shared';
import { HashMap, Option } from 'effect';
import { Dimensions } from 'react-native';
import { defaultCellColor } from '../Domain/Cell.domain';
import type * as GameState from '../Domain/GameState.domain';
import * as Grid from '../Domain/Grid.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

export interface GameStore extends CustomStore<GameState.GameState> {}

const grid = Grid.makeGridState({
  screen: Dimensions.get('screen'),
  size: { rows: 15, columns: 10 },
});

export const GameStore: GameStore = createStore<GameState.GameState>({
  game: {
    speed: 800,
    status: 'Stop',
  },
  tetromino: {
    current: Tetromino.getRandomTetromino(),
    next: Tetromino.getRandomTetromino(),
    position: grid.layout.initialPosition,
  },
  grid,
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

const refreshGrid = (
  tetromino: Tetromino.Tetromino,
  nextPosition: Position.Position,
  merged: boolean,
) =>
  makeUnsafeSetter((state) => {
    // clearCurrentCells();
    // refreshCurrentCells(state.tetromino.current, nextPosition, merged);
    if (tetromino !== state.tetromino.current) {
      console.log('DIFF');
      state.tetromino.current = tetromino;
    }

    if (!merged) {
      state.tetromino.position = nextPosition;
      return;
    }
    const nextTetromino = Tetromino.getRandomTetromino();
    const initialPosition = Tetromino.getTetrominoInitialPos(
      state.grid.layout.initialPosition,
      nextTetromino,
    );

    for (const drawPos of state.tetromino.current.drawPositions) {
      const cell = HashMap.get(
        GameStore.getState().grid.cellsMap,
        Position.sum(drawPos, state.tetromino.position),
      );
      if (Option.isNone(cell)) continue;

      cell.value.state = {
        color: state.tetromino.current.color,
        merged: true,
      };
    }

    state.tetromino.current = state.tetromino.next;
    state.tetromino.next = nextTetromino;

    state.tetromino.position = initialPosition;
  });

export const StoreActions = {
  setCurrentPosition,
  setCurrentStatus,
  refreshGrid,
};
