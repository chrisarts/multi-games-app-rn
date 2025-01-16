import { type CustomStore, createStore } from '@games/shared';
import { Array } from 'effect';
import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import { xor } from 'effect/Predicate';
import { Dimensions } from 'react-native';
import * as Cell from '../Domain/Cell.domain';
import * as GameAction from '../Domain/GameAction.domain';
import type * as GameState from '../Domain/GameState.domain';
import * as Grid from '../Domain/Grid.domain';
import * as Position from '../Domain/Position.domain';
import * as Tetromino from '../Domain/Tetromino.domain';

export interface GameStore extends CustomStore<GameState.GameState> {}

const createState = (): GameState.GameState => {
  const grid = Grid.makeGridState({
    screen: Dimensions.get('screen'),
    size: { rows: 15, columns: 10 },
  });
  return {
    game: {
      speed: 800,
      status: 'Stop',
      lines: 0,
    },
    tetromino: {
      current: Tetromino.getRandomTetromino(),
      next: Tetromino.getRandomTetromino(),
      position: grid.layout.initialPosition,
    },
    grid,
    debug: true,
  };
};
export const GameStore: GameStore = createStore<GameState.GameState>(createState());

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

const sweepRowAndMoveDown = (row: Cell.Cell[]) => {
  for (const cell of row) {
    cell.state = {
      color: Cell.defaultCellColor,
      merged: false,
    };
  }
};

const moveDownFrom = (
  grid: Grid.GridState,
  matrix: { rowIndex: number; cells: Cell.Cell[] }[],
  rowIndex: number,
) => {
  for (const row of matrix.filter((x) => x.rowIndex <= rowIndex)) {
    const sumPos = Position.of({ row: -1, column: 0 });
    for (const cell of row.cells) {
      const nextPos = Position.sum(cell.position, sumPos);
      const nextCell = HashMap.get(grid.cellsMap, nextPos);
      if (Option.isNone(nextCell)) continue;
      cell.state = {
        color: nextCell.value.state.color,
        merged: nextCell.value.state.merged,
      };
    }
  }
};

const refreshGrid = (
  tetromino: Tetromino.Tetromino,
  nextPosition: Position.Position,
  merged: boolean,
) =>
  makeUnsafeSetter((state) => {
    if (tetromino !== state.tetromino.current) {
      state.tetromino.current = tetromino;
    }

    if (!merged) {
      state.tetromino.position = nextPosition;
      return;
    }

    const currentTetromino = state.tetromino.current;

    const nextTetromino = Tetromino.getRandomTetromino();
    const initialPosition = Tetromino.getTetrominoInitialPos(
      state.grid.layout.initialPosition,
      nextTetromino,
    );

    const nextDrawPositions = currentTetromino.drawPositions.map((drawPos) =>
      Position.sum(state.tetromino.position, drawPos),
    );

    const allCells = Array.fromIterable(HashMap.values(state.grid.cellsMap));

    for (const drawPos of nextDrawPositions) {
      const cell = HashMap.get(state.grid.cellsMap, drawPos);
      if (Option.isNone(cell)) continue;
      cell.value.state = {
        color: state.tetromino.current.color,
        merged: true,
      };
    }

    const rowCellsMatrix = Array.range(0, state.grid.layout.size.rows - 1)
      .reverse()
      .map((index) => ({
        rowIndex: index,
        cells: allCells.filter((cell) => cell.position.row === index),
      }));

    for (const row of rowCellsMatrix) {
      if (row.cells.every((x) => x.state.merged)) {
        console.log('SWEEP: ', row.rowIndex);
        sweepRowAndMoveDown(row.cells);
        moveDownFrom(state.grid, rowCellsMatrix, row.rowIndex);
      }
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
