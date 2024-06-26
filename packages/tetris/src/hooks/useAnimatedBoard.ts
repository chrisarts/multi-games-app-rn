import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { BOARD_CONFIG, createTetrisBoard } from "../utils/board.utils";
import { useAnimatedPosition } from "./useAnimatedPosition";
import { BoardMatrix, CellState, GameState, getRandomBlock } from "../models";
import { getBlockShape } from "../utils";

export const useAnimatedBoard = ({
  animated: position,
  playerCollide,
}: ReturnType<typeof useAnimatedPosition>) => {
  const boardValue = useSharedValue(createTetrisBoard(BOARD_CONFIG));
  const gameState = useSharedValue(GameState.STOP);
  const currentBlock = useSharedValue(getRandomBlock());
  const currentShape = useSharedValue(getBlockShape(currentBlock.value));

  const startGame = () => {
    "worklet";
    gameState.value = GameState.PLAYING;
  };

  const animatedBoard = useDerivedValue(() => {
    if (gameState.value === GameState.STOP) return boardValue.value;
    const newBoard: BoardMatrix = boardValue.value.map((row) =>
      row.map((cell) =>
        cell[1] === CellState.EMPTY ? [null, CellState.EMPTY] : cell
      )
    );

    currentShape.value.shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col !== 0) {
          newBoard[rowIndex + position.value.row][
            colIndex + position.value.column
          ] = [
            currentBlock.value,
            playerCollide.value ? CellState.MERGED : CellState.EMPTY,
          ];
        }
      });
    });

    const sweepRows = (newStage: BoardMatrix): BoardMatrix => {
      return newStage.reduce((ack, row) => {
        // If we don't find a 0 it means that the row is full and should be cleared
        if (row.findIndex((cell) => cell[0] === null) === -1) {
          // setRowsCleared((prev) => prev + 1);
          /* Create an empty row at the beginning of the array 
          to push the Tetrominos down instead of returning the cleared row */
          ack.unshift(
            new Array(newStage[0].length).fill([null, CellState.EMPTY])
          );
          return ack;
        }

        ack.push(row);
        return ack;
      }, [] as BoardMatrix);
    };

    if (playerCollide.value) {
      position.value = { column: 3, row: 0 };
      currentBlock.value = getRandomBlock();
      currentShape.value = getBlockShape(currentBlock.value);
      playerCollide.value = false;
      const result = sweepRows(newBoard);
      boardValue.value = newBoard;
      return result;
    }

    return newBoard;
  });

  return {
    animatedBoard,
    gameState,
    startGame,
    currentBlock,
    currentShape,
    playerCollide,
  };
};
