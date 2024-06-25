import { useCallback, useState } from "react";
import { useTetrisBoard } from "./useTetrisBoard";
import { useInterval } from "./useInterval";
import { addShapeToBoard, hasCollisions, structuredClone } from "./board.utils";
import { MoveDirection } from "../models/Block.model";

enum TickSpeed {
  Normal = 800,
  Sliding = 200,
}

export const useTetris = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [
    { board, dropPosition, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (
      !hasCollisions({
        board,
        droppingShape,
        droppingBlock,
        dropPosition: { ...dropPosition, row: dropPosition.row + 1 },
      })
    ) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }
    const newBoard = structuredClone(board);
    addShapeToBoard({
      board: newBoard,
      droppingBlock,
      droppingShape,
      dropPosition,
    });
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: "commit", newBoard });
    setIsCommitting(true);
  }, [board, droppingShape, droppingBlock, dropPosition, dispatchBoardState]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions({
        board,
        droppingShape,
        droppingBlock,
        dropPosition: { ...dropPosition, row: dropPosition.row + 1 },
      })
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [
    isCommitting,
    board,
    droppingShape,
    droppingBlock,
    dropPosition,
    commitPosition,
    dispatchBoardState,
  ]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);

  const moveBlock = useCallback(
    (direction: MoveDirection) => {
      dispatchBoardState({ type: "move", direction });
    },
    [dispatchBoardState]
  );

  const renderedBoard = structuredClone(board);

  if (isPlaying) {
    addShapeToBoard({
      board: renderedBoard,
      droppingBlock,
      droppingShape,
      dropPosition,
    });
  }

  return { board: renderedBoard, startGame, moveBlock };
};
