import { useEffect } from 'react';
import { MoveDirection } from '../models/Block.model';
import { GameState, TickSpeed } from '../models/Board.model';
import { hasCollisions, playerMoves } from '../utils';
import { useAnimatedBoard } from './useAnimatedBoard';
import { useAnimatedPlayer } from './useAnimatedPosition';
import { useInterval } from './useInterval';

export const useAnimatedTetris = () => {
  const player = useAnimatedPlayer();
  const {
    animatedBoard,
    gameState,
    resetBoard,
    currentBlock,
    currentShape,
    tickSpeed,
    setTickSpeed,
    setGameState,
    status,
  } = useAnimatedBoard(player);

  useEffect(() => {
    if (status.rows > status.level * 5) {
      status.setLevel((prev) => prev + 1);
      // Also increase speed
      setTickSpeed(TickSpeed.Normal / status.level + 200);
    }
  }, [status, setTickSpeed]);

  const drop = () => {
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
        dropMove,
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
    'worklet';
    if (gameState !== GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  const moveLeft = () => {
    player.movePosition({
      board: animatedBoard.value,
      dir: MoveDirection.LEFT,
      value: -1,
    });
  };

  const moveDown = () => {
    player.movePosition({
      board: animatedBoard.value,
      dir: MoveDirection.DOWN,
      value: 1,
    });
  };

  const moveRight = () => {
    player.movePosition({
      board: animatedBoard.value,
      dir: MoveDirection.RIGHT,
      value: 1,
    });
  };

  const startGame = () => {
    resetBoard();
    player.resetPlayer();
  };

  return {
    startGame,
    animatedBoard,
    player,
    gameState,
    status,
    playerMovements: {
      moveLeft,
      moveDown,
      moveRight,
    },
  };
};
