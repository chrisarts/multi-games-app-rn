import { point } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';
import type { TetrisAnimatedMatrix } from '../../Domain/Grid.domain';
import { useGameContext } from '../context/GameContext';
import { useTetromino } from './useTetromino';

export const useTetrisGame = () => {
  const { tetrisGrid } = useGameContext();
  const tetrisMatrix: TetrisAnimatedMatrix[][] = tetrisGrid.matrix.map((row, iy) =>
    row.map((column, ix) => ({
      point: point(ix, iy),
      value: useSharedValue(column),
      color: useSharedValue('rgba(131, 126, 126, 0.3)'),
    })),
  );

  const { position, tetromino: currentShape, resetPosition, rotateTetromino } =
    useTetromino(tetrisMatrix);

  const speed = useSharedValue(800);
  const startTime = useSharedValue(Date.now());

  const gameOver = useSharedValue(false);
  const running = useSharedValue(true);
  const moves = {
    moveX: useSharedValue(0),
    movingX: useSharedValue(false),
    turbo: useSharedValue(false),
  };

  return {
    gameState: {
      speed,
      gameOver,
      startTime,
      running,
    },
    moves,
    tetromino: {
      rotateTetromino,
      resetPosition,
      currentShape,
      position,
    },
    tetrisMatrix,
  };
};
