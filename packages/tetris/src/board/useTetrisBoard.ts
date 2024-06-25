import { useReducer } from "react";
import { createTetrisBoard, getStartPoint } from "./board.utils";
import { BoardMatrix, BoardState } from "../models/Board.model";
import { BlockShapes, getRandomBlock } from "../models/Block.model";

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
  type: "start" | "move" | "drop";
}

interface CommitAction {
  type: "commit";
  newBoard: BoardMatrix;
}

const reducer = (
  state: BoardState,
  action: Action | CommitAction
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
      newState.dropPosition.column++;
      break;
    default:
      throw new Error("Unhandled action type");
  }

  return newState;
};
