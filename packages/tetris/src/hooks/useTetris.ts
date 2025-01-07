import { GameState } from '../models/Board.model';
import { hasCollisions, playerMoves } from '../utils';
import { useGameStatus } from './useGameStatus';
import { useInterval } from './useInterval';
import { usePlayer } from './usePlayer';
import { useTetrisBoard } from './useTetrisBoard';

export const useTetris = () => {
  const { player, updatePlayerPosition, resetPlayer, movePlayer, rotateShape } =
    usePlayer();
  const {
    board,
    startGame,
    rowsCleared,
    tickSpeed,
    gameState,
    setGameState,
    setTickSpeed,
  } = useTetrisBoard(player, resetPlayer);
  const status = useGameStatus(rowsCleared);

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
    status,
  };
};
