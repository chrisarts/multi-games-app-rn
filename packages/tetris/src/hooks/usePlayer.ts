import { useCallback, useState } from 'react';
import { type BlockShape, MoveDirection, getRandomBlock } from '../models/Block.model';
import type { BoardConfig, BoardMatrix, BoardPosition } from '../models/Board.model';
import type { PlayerMoveAction, PlayerState } from '../models/Player.model';
import { getBlockShape, hasCollisions, playerMoves } from '../utils';

export const usePlayer = () => {
  const [player, setPlayer] = useState({} as PlayerState);

  const updatePlayerPosition = (position: BoardPosition, collided: boolean) => {
    setPlayer((x) => ({
      ...x,
      collided,
      position: {
        column: (x.position.column += position.column),
        row: (x.position.row += position.row),
      },
    }));
  };

  const resetPlayer = useCallback((boardConfig: BoardConfig) => {
    const block = getRandomBlock();
    setPlayer({
      collided: false,
      currentBlock: block,
      position: { row: 0, column: boardConfig.WIDTH / 2 - 2 },
      currentShape: getBlockShape(block),
    });
  }, []);

  const rotateShape = (matrix: BlockShape['shape']) => {
    // Make the rows to become cols (transpose)
    const shape = matrix.map((_, i) => matrix.map((column) => column[i]));
    // Reverse each row to get a rotated matrix
    return shape.map((row) => row.reverse());
  };

  const playerRotate = (board: BoardMatrix) => {
    const clonedPlayer: PlayerState = JSON.parse(JSON.stringify(player));
    clonedPlayer.currentShape.shape = rotateShape(clonedPlayer.currentShape.shape);

    const posX = clonedPlayer.position.column;
    let offset = 1;

    while (hasCollisions(board, clonedPlayer, playerMoves.zero())) {
      clonedPlayer.position.column += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      console.log('POS: ', posX, offset);

      if (offset > clonedPlayer.currentShape.shape[0].length) {
        clonedPlayer.position.column = posX;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const movePlayer = ({ dir, value, board }: PlayerMoveAction) => {
    const newPosition: BoardPosition = playerMoves.zero();
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

    if (!hasCollisions(board, player, newPosition))
      updatePlayerPosition(newPosition, false);
  };

  return {
    player,
    updatePlayerPosition,
    resetPlayer,
    movePlayer,
    rotateShape: playerRotate,
  };
};
