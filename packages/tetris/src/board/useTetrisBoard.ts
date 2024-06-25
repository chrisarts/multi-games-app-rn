import { useReducer } from "react";
import { createTetrisBoard, getStartPoint } from "./board.utils";
import { BoardState } from "../models/Board.model";
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

type Action = {
  type: "start" | "drop" | "move" | "commit";
};

const reducer = (state: BoardState, action: Action): BoardState => {
  let newState = { ...state };
  switch (action.type) {
    case "start":
      const firstBlock = getRandomBlock();
      return {
        board: createTetrisBoard(boardConfig),
        dropPosition: getStartPoint(boardConfig.WIDTH),
        droppingShape: firstBlock,
        droppingBlock: firstBlock.name,
      };
    case "drop":
      newState.dropPosition.y++;
      break;
    case "commit":
      newState.dropPosition.y++;
      break;
    case "move":
      newState.dropPosition.y++;
      break;
    default:
      throw new Error("Unhandled action type");
  }

  return state;
};
