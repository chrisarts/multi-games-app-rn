import { useReducer } from "react";
import { createTetrisBoard, getStartPoint } from "./board.utils";
import { BoardMatrix, BoardState } from "../models/Board.model";
import {
  BlockShapes,
  getRandomBlock,
  MoveDirection,
} from "../models/Block.model";

const boardConfig = {
  HEIGHT: 15,
  WIDTH: 10,
};

export const useTetrisBoard = () => {
  const [board, dispatch] = useReducer(
    reducer,
    {
      board: [],
      dropPosition: getStartPoint(boardConfig.WIDTH),
      droppingBlock: "I",
      droppingShape: BlockShapes.I,
    } as BoardState,
    (emptyState) => ({
      ...emptyState,
      board: createTetrisBoard(boardConfig),
    })
  );

  return [board, dispatch] as const;
};

interface Action {
  type: "start" | "drop";
}

interface MoveAction {
  type: "move";
  direction: MoveDirection;
}

interface CommitAction {
  type: "commit";
  newBoard: BoardMatrix;
}

const reducer = (
  state: BoardState,
  action: Action | CommitAction | MoveAction
): BoardState => {
  let newState = { ...state };
  switch (action.type) {
    case "start":
      const firstBlock = getRandomBlock();
      return {
        board: createTetrisBoard(boardConfig),
        dropPosition: getStartPoint(boardConfig.WIDTH),
        droppingShape: BlockShapes[firstBlock],
        droppingBlock: firstBlock,
      };
    case "drop":
      newState.dropPosition.row += 1;
      break;
    case "commit":
      const nextBlock = getRandomBlock();
      return {
        board: [...action.newBoard],
        droppingBlock: nextBlock,
        droppingShape: BlockShapes[nextBlock],
        dropPosition: getStartPoint(boardConfig.WIDTH),
      };
    case "move":
      if (action.direction === MoveDirection.LEFT) {
        newState.dropPosition.column -= 1;
      } else if (action.direction === MoveDirection.RIGHT) {
        newState.dropPosition.column += 1;
      } else if (action.direction === MoveDirection.DOWN) {
        newState.dropPosition.row += 1;
      } else if (action.direction === MoveDirection.UP) {
        newState.dropPosition.row -= 1;
      } else if (action.direction === MoveDirection.ROTATE) {
        const rotated = [...newState.droppingShape.shape].map((_, index) => {
          return [...newState.droppingShape.shape].map((col) => col[index]);
        });
        newState.droppingShape.shape = rotated.map((x) => x.reverse());
        // newState.droppingShape.shape = [...newState.droppingShape.shape].map(x => x.reverse());
        // newState.droppingShape = {
        //   ...newState.droppingShape,
        //   shape: newState.droppingShape.shape.reverse(),
        // };
      }
      break;
    default:
      throw new Error("Unhandled action type");
  }

  return newState;
};
