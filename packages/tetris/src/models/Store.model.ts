import { createStore } from "@games/shared";
import { BoardCell, BoardMatrix, CellState } from "./Board.model";
import { BoardPosition } from "./Point.model";
import { Block, BlockShape, BlockShapes, MoveDirection } from "./Block.model";

export enum GameState {
  PLAYING,
  STOP,
}

export enum TickSpeed {
  Normal = 800,
  Sliding = 200,
}

interface TetrisStore {
  state: GameState;
  dropPosition: BoardPosition;
  droppingBlock: Block;
  droppingShape: BlockShape;
  tickSpeed: TickSpeed | null;
  board: BoardMatrix;
}

export const store = createStore<TetrisStore>({
  board: [],
  state: GameState.STOP,
  dropPosition: { column: 3, row: 0 },
  droppingBlock: Block.I,
  droppingShape: BlockShapes.I,
  tickSpeed: null,
});

const positionToKey = (position: BoardPosition) => {
  return `${position.column}-${position.row}`;
};

export const registerCells = (matrix: BoardMatrix) => {
  const initialCells = {} as Record<string, BoardCell>;
  matrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const key = positionToKey({ column: colIndex, row: rowIndex });
      initialCells[key] = col;
    });
  });
  store.setState((x) => {
    return { ...x, cells: initialCells };
  });
};

export const getGameCell = (position: BoardPosition) => {
  const cell = store.getState().board[position.row]?.[position.column];
  return cell ?? CellState.EMPTY;
};

export const updateCell = (position: BoardPosition, cell: BoardCell) => {
  const key = positionToKey(position);
  // store.setState((x) => {
  //   Object.assign(x.cells, { [key]: cell });
  //   return x;
  // });
};

export const setGameState = (state: GameState) => {
  store.setState((x) => {
    x.state = state;
    return x;
  });
};

export const setGameSpeed = (speed: TickSpeed | null) => {
  store.setState((x) => {
    x.tickSpeed = speed;
    return x;
  });
};

export const moveBoardBlock = (move: MoveDirection) => {
  store.setState((x) => {
    x.dropPosition = {
      ...x.dropPosition,
      row: x.dropPosition.row + 1,
    };

    x.droppingShape.shape
      .filter((row) => row.some((x) => x === 1))
      .forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          const position = {
            column: colIndex + x.dropPosition.column,
            row: rowIndex + x.dropPosition.row,
          };
          if (value === 1) {
            x.board[position.row][position.column] = x.droppingBlock;
          } else {
            x.board[position.row][position.column] = CellState.EMPTY;
          }
        });
      });

    console.log("BOARD: ", x.board);
    return x;
  });
};
