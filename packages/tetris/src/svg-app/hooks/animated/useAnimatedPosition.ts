import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { type BlockShape, MoveDirection, getRandomBlock } from '../../old-models/Block.model';
import { type BoardMatrix, type BoardPosition, CellState } from '../../old-models/Board.model';
import type { PlayerMoveAction } from '../../old-models/Player.model';
import { createTetrisBoard, getBlockShape, hasCollisions, playerMoves } from '../../utils';

const firstBlock = getRandomBlock();
const firstShape = getBlockShape(firstBlock);
const config = {
  WIDTH: 4,
  HEIGHT: 4,
};

export const useAnimatedPlayer = () => {
  const position = useSharedValue(playerMoves.right(3));
  const currentBlock = useSharedValue(firstBlock);
  const currentShape = useSharedValue(firstShape);
  const nextShapeBoard = useSharedValue(createTetrisBoard(config));
  const nextBlock = useSharedValue(getRandomBlock());
  const nextShape = useSharedValue(getBlockShape(nextBlock.value));
  const collided = useSharedValue(false);

  /**
   * @memberof `worklet`
   */
  const updatePosition = (nextPosition: BoardPosition, hasCollided: boolean) => {
    'worklet';
    position.value = {
      y: position.value.y + nextPosition.y,
      x: position.value.x + nextPosition.x,
    };
    collided.value = hasCollided;
  };

  const rotateShape = (matrix: BlockShape['shape']) => {
    // Make the rows to become cols (transpose)
    const shape = matrix.map((_, i) => matrix.map((column) => column[i]));
    // Reverse each row to get a rotated matrix
    return shape.map((row) => row.reverse());
  };

  const playerRotate = (board: BoardMatrix) => {
    const clonedShape: BlockShape = JSON.parse(JSON.stringify(currentShape.value));
    clonedShape.shape = rotateShape(clonedShape.shape);

    const posX = position.value.y;
    let offset = 1;

    const clonedPosition: BoardPosition = JSON.parse(JSON.stringify(position.value));

    while (
      hasCollisions(
        board,
        {
          collided: collided.value,
          currentBlock: currentBlock.value,
          currentShape: clonedShape,
          position: position.value,
        },
        playerMoves.zero(),
      )
    ) {
      clonedPosition.y += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > clonedShape.shape[0].length) {
        clonedPosition.y = posX;
        return;
      }
    }

    position.value = clonedPosition;
    currentShape.value = clonedShape;
  };

  /**
   * @memberof `worklet`
   */
  const movePosition = ({ dir, value, board }: PlayerMoveAction) => {
    'worklet';
    const newPosition: BoardPosition = playerMoves.zero();
    switch (dir) {
      case MoveDirection.LEFT:
      case MoveDirection.RIGHT:
        newPosition.y = value;
        break;
      case MoveDirection.DOWN:
      case MoveDirection.UP:
        newPosition.x = value;
        break;
      case MoveDirection.ROTATE:
    }

    if (
      !hasCollisions(
        board,
        {
          collided: collided.value,
          currentBlock: currentBlock.value,
          currentShape: currentShape.value,
          position: position.value,
        },
        newPosition,
      )
    ) {
      updatePosition(newPosition, false);
    }
  };

  const nextShapeMatrix = useDerivedValue(() => {
    const newBoard: BoardMatrix = nextShapeBoard.value.map((row) =>
      row.map((cell) => (cell[1] === CellState.EMPTY ? [null, CellState.EMPTY] : cell)),
    );

    nextShape.value.shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col !== 0) {
          newBoard[rowIndex][colIndex] = [nextBlock.value, CellState.EMPTY];
        }
      });
    });

    return newBoard;
  });

  const resetPlayer = () => {
    const block = getRandomBlock();
    currentBlock.value = block;
    currentShape.value = getBlockShape(block);
    collided.value = false;
    position.value = { y: 3, x: 0 };
    nextBlock.value = getRandomBlock();
    nextShape.value = getBlockShape(nextBlock.value);
  };

  return {
    position,
    updatePosition,
    collided,
    currentBlock,
    currentShape,
    playerRotate,
    movePosition,
    resetPlayer,
    nextBlock,
    nextShape,
    nextShapeBoard: nextShapeMatrix,
  };
};
