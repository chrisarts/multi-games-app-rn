import { GameState } from "../models";
import { hasCollisions, playerMoves } from "../utils";
import { useAnimatedBoard } from "./useAnimatedBoard";
import { useAnimatedPlayer } from "./useAnimatedPosition";
import { useInterval } from "./useInterval";

export const useAnimatedTetris = () => {
  const player = useAnimatedPlayer();
  const {
    animatedBoard,
    gameState,
    startGame,
    currentBlock,
    currentShape,
    tickSpeed,
    setTickSpeed,
    setGameState,
    status,
  } = useAnimatedBoard(player);

  const drop = () => {
    "worklet";
    const dropMove = playerMoves.down(1);
    player.updatePosition(dropMove, false);
    if (
      !hasCollisions(
        animatedBoard.value,
        {
          collided: false,
          currentBlock: currentBlock.value,
          currentShape: currentShape.value,
          position: player.position.value,
        },
        dropMove
      )
    ) {
      player.updatePosition(dropMove, false);
    } else {
      if (player.position.value.row < 1) {
        setGameState(GameState.STOP);
        setTickSpeed(null);
      }
      player.updatePosition(playerMoves.zero(), true);
    }
  };

  useInterval(() => {
    "worklet";
    if (gameState !== GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  return {
    startGame,
    animatedBoard,
    position: player,
    gameState,
    status,
  };
};
