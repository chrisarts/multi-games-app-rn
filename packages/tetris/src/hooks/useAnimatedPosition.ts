import { useSharedValue } from "react-native-reanimated";
import {
  BlockShape,
  BoardMatrix,
  BoardPosition,
  getRandomBlock,
  MoveDirection,
  PlayerMoveAction,
} from "../models";
import { getBlockShape, hasCollisions, playerMoves } from "../utils";

const firstBlock = getRandomBlock();
const firstShape = getBlockShape(firstBlock);

export const useAnimatedPlayer = () => {
  const position = useSharedValue(playerMoves.left(3));
  const currentBlock = useSharedValue(firstBlock);
  const currentShape = useSharedValue(firstShape);
  const collided = useSharedValue(false);

  const updatePosition = (
    nextPosition: BoardPosition,
    hasCollided: boolean
  ) => {
    "worklet";
    position.value = {
      column: position.value.column + nextPosition.column,
      row: position.value.row + nextPosition.row,
    };
    collided.value = hasCollided;
  };

  const rotateShape = (matrix: BlockShape["shape"]) => {
    // Make the rows to become cols (transpose)
    const shape = matrix.map((_, i) => matrix.map((column) => column[i]));
    // Reverse each row to get a rotated matrix
    return shape.map((row) => row.reverse());
  };

  const playerRotate = (board: BoardMatrix) => {
    const clonedShape: BlockShape = JSON.parse(
      JSON.stringify(currentShape.value)
    );
    clonedShape.shape = rotateShape(clonedShape.shape);

    const posX = position.value.column;
    let offset = 1;

    const clonedPosition: BoardPosition = JSON.parse(
      JSON.stringify(position.value)
    );

    while (
      hasCollisions(
        board,
        {
          collided: collided.value,
          currentBlock: currentBlock.value,
          currentShape: clonedShape,
          position: position.value,
        },
        playerMoves.zero()
      )
    ) {
      clonedPosition.column += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > clonedShape.shape[0].length) {
        clonedPosition.column = posX;
        return;
      }
    }

    position.value = clonedPosition;
    currentShape.value = clonedShape;
  };

  const movePosition = ({ dir, value, board }: PlayerMoveAction) => {
    "worklet";
    let newPosition: BoardPosition = playerMoves.zero();
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

    if (
      !hasCollisions(
        board,
        {
          collided: collided.value,
          currentBlock: currentBlock.value,
          currentShape: currentShape.value,
          position: position.value,
        },
        newPosition
      )
    ) {
      updatePosition(newPosition, false);
    }
  };

  return {
    position,
    updatePosition,
    collided,
    currentBlock,
    currentShape,
    playerRotate,
    movePosition,
  };
};
