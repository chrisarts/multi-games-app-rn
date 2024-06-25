import { useCallback, useState } from "react";
import { BoardPosition } from "../models/Point.model";
import { Block, getRandomBlock } from "../models/Block.model";

export interface PlayerState {
  position: BoardPosition;
  currentShape: Block;
  collided: boolean;
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

  return {
    player,
    updatePlayerPosition,
    resetPlayer,
  };
};
