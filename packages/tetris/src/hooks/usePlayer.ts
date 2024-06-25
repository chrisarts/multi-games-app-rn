import { useCallback, useState } from "react";
import {
  BoardPosition,
  Block,
  getRandomBlock,
  MoveDirection,
  BoardMatrix,
} from "../models";
import { hasCollisions } from "../utils";

export interface PlayerState {
  position: BoardPosition;
  currentShape: Block;
  collided: boolean;
}
interface PlayerMoveAction {
  dir: MoveDirection;
  value: number;
  board: BoardMatrix;
}
export const usePlayer = () => {
  const [player, setPlayer] = useState({} as PlayerState);

  const updatePlayerPosition = (position: BoardPosition, collided: boolean) => {
    setPlayer((x) => ({
      ...x,
      collided,
      position: {
        column: (x.position.column += position.column),
        row: (x.position.row += position.row),
      },
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      collided: false,
      currentShape: getRandomBlock(),
      position: { row: 0, column: 3 },
    });
  }, []);

  const movePlayer = ({ dir, value, board }: PlayerMoveAction) => {
    let newPosition: BoardPosition = {
      column: 0,
      row: 0,
    };
    switch (dir) {
      case MoveDirection.LEFT:
      case MoveDirection.RIGHT:
        newPosition.column = value;
        break;
      case MoveDirection.DOWN:
      case MoveDirection.UP:
        newPosition.row = value;
        break;
      case MoveDirection.ROTATE:
    }

    if (!hasCollisions(board, player, newPosition))
      updatePlayerPosition(newPosition, false);
  };

  return {
    player,
    updatePlayerPosition,
    resetPlayer,
    movePlayer,
  };
};
