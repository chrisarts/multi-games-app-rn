import { useEffect, useState } from 'react';
import {
  type BoardConfig,
  type BoardMatrix,
  CellState,
  GameState,
  TickSpeed,
} from '../models/Board.model';
import type { PlayerState } from '../models/Player.model';
import { createTetrisBoard } from '../utils';
import { BOARD_CONFIG } from '../utils/board.utils';

export const useTetrisBoard = (
  player: PlayerState,
  resetPlayer: (boardConfig: BoardConfig) => void,
) => {
  const [boardConfig] = useState(BOARD_CONFIG);
  const [board, setBoard] = useState(createTetrisBoard(boardConfig));
  const [gameState, setGameState] = useState(GameState.STOP);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    if (!player.position) return;
    setRowsCleared(0);

    const sweepRows = (newStage: BoardMatrix): BoardMatrix => {
      return newStage.reduce((ack, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (row.findIndex((cell) => cell[0] === null) === -1) {
          setRowsCleared((prev) => prev + 1);
          /* Create an empty row at the beginning of the array 
          to push the Tetrominos down instead of returning the cleared row */
          ack.unshift(new Array(newStage[0].length).fill([null, CellState.EMPTY]));
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as BoardMatrix);
    };

    const updateBoard = (prevBoard: BoardMatrix): BoardMatrix => {
      const newBoard: BoardMatrix = prevBoard.map((row) =>
        row.map((cell) => (cell[1] === CellState.EMPTY ? [null, CellState.EMPTY] : cell)),
      );

      player.currentShape.shape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col !== 0) {
            newBoard[rowIndex + player.position.row][colIndex + player.position.column] =
              [player.currentBlock, player.collided ? CellState.MERGED : CellState.EMPTY];
          }
        });
      });

      if (player.collided) {
        resetPlayer(boardConfig);
        return sweepRows(newBoard);
      }

      return newBoard;
    };
    setBoard((x) => updateBoard(x));
  }, [
    player.position?.column,
    player.position?.row,
    player.currentBlock,
    player.collided,
    player.position,
    resetPlayer,
    player.currentShape?.shape,
    boardConfig,
  ]);

  const startGame = () => {
    setBoard(createTetrisBoard(boardConfig));
    setGameState(GameState.PLAYING);
    setTickSpeed(TickSpeed.Normal);
    resetPlayer(boardConfig);
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
    setGameState,
    setTickSpeed,
    boardConfig,
    rowsCleared,
  };
};
