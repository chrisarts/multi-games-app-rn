import {
  BlockShape,
  BoardMatrix,
  BoardPosition,
  GameState,
  MoveDirection,
  PlayerMoveAction,
} from "../models";
import { hasCollisions, playerMoves } from "../utils";
import { useAnimatedBoard } from "./useAnimatedBoard";
import { useAnimatedPosition } from "./useAnimatedPosition";
import { useInterval } from "./useInterval";

export const useAnimatedTetris = () => {
  const position = useAnimatedPosition();
  const { animatedBoard, gameState, startGame, currentBlock, currentShape } =
    useAnimatedBoard(position);

  const drop = () => {
    "worklet";
    const dropMove = playerMoves.down(1);
    position.updatePosition(dropMove, false);
    if (
      !hasCollisions(
        animatedBoard.value,
        {
          collided: false,
          currentBlock: currentBlock.value,
          currentShape: currentShape.value,
          position: position.animated.value,
        },
        dropMove
      )
    ) {
      position.updatePosition(dropMove, false);
    } else {
      if (position.animated.value.row < 1) {
        gameState.value = GameState.STOP;
        // setTickSpeed(null);
      }
      position.updatePosition(playerMoves.zero(), true);
    }
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
          collided: position.playerCollide.value,
          currentBlock: currentBlock.value,
          currentShape: currentShape.value,
          position: position.animated.value,
        },
        newPosition
      )
    ) {
      position.updatePosition(newPosition, false);
    }
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

    const posX = position.animated.value.column;
    let offset = 1;

    const clonedPosition: BoardPosition = JSON.parse(
      JSON.stringify(position.animated.value)
    );

    while (
      hasCollisions(
        board,
        {
          collided: position.playerCollide.value,
          currentBlock: currentBlock.value,
          currentShape: clonedShape,
          position: position.animated.value,
        },
        playerMoves.zero()
      )
    ) {
      clonedPosition.column += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      console.log("POS: ", posX, offset);

      if (offset > clonedShape.shape[0].length) {
        clonedPosition.column = posX;
        return;
      }
    }

    position.animated.value = clonedPosition;
    currentShape.value = clonedShape;
  };

  useInterval(() => {
    "worklet";
    if (gameState.value !== GameState.PLAYING) return;
    drop();
  }, 800);

  return {
    startGame,
    animatedBoard,
    position,
    gameState,
    currentBlock,
    currentShape,
    movePosition,
    playerRotate,
  };
};
