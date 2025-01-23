import { point } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';
import {
  type TetrisAnimatedMatrix,
  matrixToPoints,
  shapeCollisionsAt,
} from '../../Domain/Grid.domain';
import { useGameContext } from '../context/GameContext';

export const useTetromino = (tetrisMatrix: TetrisAnimatedMatrix[][]) => {
  const { allShapes, getRandomShapeIndex } = useGameContext();

  const tetromino = useSharedValue(allShapes[getRandomShapeIndex()]);
  const position = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const rotateTetromino = () => {
    'worklet';
    tetromino.set((prev) => {
      const nextMatrix = tetromino.value.matrix
        .map((_, i) => tetromino.value.matrix.map((column) => column[i]))
        .map((row) => row.reverse());
      const currentPos = point(position.x.value, position.y.value);
      const cells = matrixToPoints(nextMatrix);
      const collisions = shapeCollisionsAt(currentPos, cells, tetrisMatrix);

      if (!collisions.outsideGrid && !collisions.merge) {
        prev.matrix = nextMatrix;
        prev.cells = cells;
      }
      return prev;
    });
  };

  const resetPosition = () => {
    'worklet';
    position.x.value = 0;
    position.y.value = 0;
  };

  return {
    tetromino,
    position,
    rotateTetromino,
    resetPosition,
  };
};
