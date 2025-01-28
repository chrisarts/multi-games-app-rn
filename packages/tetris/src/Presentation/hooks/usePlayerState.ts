import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import {
  type Tetromino,
  generateBag,
  getRandomTetromino,
} from '../../Domain/Tetromino.domain';

export const usePlayerState = () => {
  const tetrominosBag = useSharedValue<Tetromino[]>(generateBag());
  const tetromino = useSharedValue(getRandomTetromino());
  const position = {
    x: useSharedValue(tetromino.value.position.x),
    y: useSharedValue(tetromino.value.position.y),
  };
  const lastTouchedX = useSharedValue<number | null>(null);

  const resetPosition = () => {
    'worklet';
    position.x.value = tetromino.value.position.x;
    position.y.value = tetromino.value.position.y;
  };

  const reset = () => {
    'worklet';
    tetrominosBag.value = generateBag();
    tetromino.value = getRandomTetromino();
    resetPosition();
  };

  const nextTetromino = () => {
    'worklet';
    tetrominosBag.modify((prev) => {
      'worklet';
      prev.push(getRandomTetromino());
      return prev;
    });
    tetromino.value = tetrominosBag.value.shift()!;
    resetPosition();
  };

  const tetrominoMaxY = useDerivedValue(
    () => tetromino.value.shape.sort((a, b) => b.y - a.y)[0].y,
  );

  return {
    tetrominosBag,
    tetrominoMaxY,
    tetromino,
    position,
    lastTouchedX,
    reset,
    resetPosition,
    nextTetromino,
  };
};
