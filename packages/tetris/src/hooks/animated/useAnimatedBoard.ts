import { useState } from 'react';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { getRandomBlock } from '../../models/Block.model';
import { type BoardMatrix, CellState, GameState, TickSpeed } from '../../models/Board.model';
import type { AnimatedPlayerState } from '../../models/Player.model';
import { getBlockShape } from '../../utils';
import { BOARD_CONFIG, createTetrisBoard } from '../../utils/board.utils';
import { useGameStatus } from '../useGameStatus';

const firstBoard = createTetrisBoard(BOARD_CONFIG);

export const useAnimatedBoard = ({
  position,
  currentBlock,
  collided,
  currentShape,
  nextBlock,
  nextShape,
}: AnimatedPlayerState) => {
  const boardValue = useSharedValue(firstBoard);
  const [tickSpeed, setTickSpeed] = useState<null | TickSpeed>(null);
  const [gameState, setGameState] = useState(GameState.STOP);
  const [rowsCleared, setRowsCleared] = useState(0);
  const status = useGameStatus(rowsCleared);

  const animatedBoard = useDerivedValue(() => {
    if (gameState === GameState.STOP) return boardValue.value;
    const newBoard: BoardMatrix = boardValue.value.map((row) =>
      row.map((cell) => (cell[1] === CellState.EMPTY ? [null, CellState.EMPTY] : cell)),
    );

    currentShape.value.shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col !== 0) {
          newBoard[rowIndex + position.value.x][colIndex + position.value.y] = [
            currentBlock.value,
            collided.value ? CellState.MERGED : CellState.EMPTY,
          ];
        }
      });
    });

    const sweepRows = (newStage: BoardMatrix) => {
      let cleared = 0;
      const newMatrix: BoardMatrix = newStage.reduce((ack, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (row.findIndex((cell) => cell[0] === null) === -1) {
          cleared += 1;
          /* Create an empty row at the beginning of the array 
          to push the Tetrominos down instead of returning the cleared row */
          ack.unshift(new Array(newStage[0].length).fill([null, CellState.EMPTY]));
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as BoardMatrix);

      return { newMatrix, cleared };
    };

    if (collided.value) {
      position.value = { y: 3, x: 0 };
      currentBlock.value = nextBlock.value;
      currentShape.value = nextShape.value;
      collided.value = false;
      const result = sweepRows(newBoard);
      boardValue.value = result.newMatrix;
      nextBlock.value = getRandomBlock();
      nextShape.value = getBlockShape(nextBlock.value);
      runOnJS(setRowsCleared)(result.cleared);
      return result.newMatrix;
    }

    return newBoard;
  });

  const resetBoard = () => {
    boardValue.value = createTetrisBoard(BOARD_CONFIG);
    status.setLevel(1);
    status.setRows(0);
    status.setScore(0);
    setTickSpeed(TickSpeed.Normal);
    setGameState(GameState.PLAYING);
  };

  return {
    animatedBoard,
    gameState,
    boardValue,
    currentBlock,
    currentShape,
    tickSpeed,
    setTickSpeed,
    setGameState,
    status,
    resetBoard,
  };
};
