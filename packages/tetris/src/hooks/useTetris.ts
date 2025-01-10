import { MoveDirection } from '../old-models/Block.model';
import { _GameState } from '../old-models/Board.model';
import { hasCollisions, playerMoves } from '../old-models/board.utils';
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
      if (player.position.x < 1) {
        setGameState(_GameState.STOP);
        setTickSpeed(null);
      }
      updatePlayerPosition(playerMoves.zero(), true);
    }
  };

  useInterval(() => {
    if (gameState !== _GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  const moveLeft = () => {
    movePlayer({
      board: board,
      dir: MoveDirection.LEFT,
      value: -1,
    });
  };

  const moveDown = () => {
    movePlayer({
      board: board,
      dir: MoveDirection.DOWN,
      value: 1,
    });
  };

  const moveRight = () => {
    movePlayer({
      board: board,
      dir: MoveDirection.RIGHT,
      value: 1,
    });
  };

  return {
    board,
    startGame,
    gameState,
    movePlayer,
    rotateShape,
    status,
    player,
    playerMovements: {
      moveLeft,
      moveDown,
      moveRight,
    },
  };
};
