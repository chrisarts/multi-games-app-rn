import { useEffect, useState } from "react";
import { createTetrisBoard } from "../utils";
import { GameState, TickSpeed } from "../models/Store.model";
import { BlockShapes } from "../models/Block.model";
import { BoardMatrix, CellState } from "../models/Board.model";
import { PlayerState } from "../hooks/usePlayer";
import { BOARD_CONFIG } from "../utils/board.utils";

export const useTetrisBoard = (
  player: PlayerState,
  resetPlayer: () => void
) => {
  const [board, setBoard] = useState(createTetrisBoard(BOARD_CONFIG));
  const [gameState, setGameState] = useState(GameState.STOP);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  useEffect(() => {
    if (!player.position) return;
    const sweepRows = (newStage: BoardMatrix): BoardMatrix => {
      return newStage.reduce((ack, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (row.findIndex((cell) => cell[0] === null) === -1) {
          // setRowsCleared((prev) => prev + 1);
          // Create an empty row at the beginning of the array to push the Tetrominos down
          // instead of returning the cleared row
          ack.unshift(
            new Array(newStage[0].length).fill([null, CellState.EMPTY])
          );
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as BoardMatrix);
    };

    const updateBoard = (prevBoard: BoardMatrix): BoardMatrix => {
      const newBoard: BoardMatrix = prevBoard.map((row) =>
        row.map((cell) =>
          cell[1] === CellState.EMPTY ? [null, CellState.EMPTY] : cell
        )
      );

      BlockShapes[player.currentShape].shape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          console.log("UPDATE_ROW ", rowIndex + player.position.row);
          console.log("UPDATE_COL ", colIndex + player.position.column);
          if (col !== 0) {
            newBoard[rowIndex + player.position.row][
              colIndex + player.position.column
            ] = [
              player.currentShape,
              player.collided ? CellState.MERGED : CellState.EMPTY,
            ];
          }
        });
      });

      if (player.collided) {
        resetPlayer();
        return sweepRows(newBoard);
      }

      return newBoard;
    };
    setBoard((x) => updateBoard(x));
  }, [
    player.position?.column,
    player.position?.row,
    player.currentShape,
    player.collided,
    player.position,
    resetPlayer,
  ]);

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setTickSpeed(TickSpeed.Normal);
    resetPlayer();
  };

  const stopGame = () => {
    setGameState(GameState.STOP);
  };

  return {
    board,
    gameState,
    startGame,
    stopGame,
    tickSpeed,
  };
};
