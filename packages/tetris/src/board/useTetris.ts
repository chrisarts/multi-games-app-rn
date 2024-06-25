import { useCallback, useState } from "react";
import { useTetrisBoard } from "./useTetrisBoard";
import { CellState } from "../models/Board.model";

enum TickSpeed {
  Normal = 800,
}
export const useTetris = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [
    { board, dropPosition, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const renderedBoard = [...board];

  if (isPlaying) {
    console.log("SHAPE: ", droppingShape);
    droppingShape.shape
      .filter((row) => row.some((x) => x === 1))
      .forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col === 1) {
            const cell =
              renderedBoard[dropPosition.x + rowIndex][
                dropPosition.y + colIndex
              ];
            renderedBoard[dropPosition.x + rowIndex][
              dropPosition.y + colIndex
            ] = {
              ...cell,
              state: CellState.MERGED,
              color: droppingShape.color,
            };
          }
        });
      });
  }

  return { board: renderedBoard, startGame };
};
