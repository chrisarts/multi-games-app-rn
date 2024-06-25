import { useTetrisBoard } from "./useTetrisBoard";
import { usePlayer } from "./usePlayer";
import { useInterval } from "./useInterval";
import { GameState } from "../models";
import { hasCollisions, playerMoves } from "../utils";

export const useTetris = () => {
  const { player, updatePlayerPosition, resetPlayer, movePlayer, rotateShape } =
    usePlayer();
  const { board, startGame, tickSpeed, gameState, setGameState, setTickSpeed } =
    useTetrisBoard(player, resetPlayer);

  const drop = () => {
    const dropMove = playerMoves.down(1);
    if (!hasCollisions(board, player, dropMove)) {
      updatePlayerPosition(dropMove, false);
    } else {
      if (player.position.row < 1) {
        setGameState(GameState.STOP);
        setTickSpeed(null);
      }
      updatePlayerPosition(playerMoves.zero(), true);
    }
  };

  useInterval(() => {
    if (gameState !== GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  return {
    board,
    startGame,
    gameState,
    movePlayer,
    rotateShape,
  };
};
