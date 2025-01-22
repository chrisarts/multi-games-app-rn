import { point } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { GridConfig } from '../../Domain/Grid.domain';
import { getAllTetrominos, getRandomTetromino } from '../../Domain/Tetromino.domain';

export const useCurrentShape = (gridConfig: GridConfig) => {
  const firstShape = useMemo(
    () => getRandomTetromino(gridConfig, gridConfig.cellContainerSize),
    [gridConfig],
  );

  const shape = useSharedValue(firstShape);
  const allTetrominos = getAllTetrominos(gridConfig, gridConfig.cellContainerSize);
  const position = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  const collided = useSharedValue(false);

  const currentTetrominoColor = useDerivedValue(() => shape.value.color);

  const nextTetromino = () => {
    'worklet';
    const nextShape = allTetrominos[Math.floor(Math.random() * allTetrominos.length)];
    shape.value = nextShape;
  };

  const moveTo = (direction: 'up' | 'left' | 'right' | 'down' | 'up') => {
    'worklet';
    switch (direction) {
      case 'up':
      case 'down':
        return {
          x: position.x.value,
          y: position.y.value + (direction === 'up' ? -1 : 1),
        };
      case 'left':
      case 'right':
        return {
          x: position.x.value + (direction === 'left' ? -1 : 1),
          y: position.y.value,
        };
    }
  };

  const currentPosition = useDerivedValue(() =>
    point(position.x.value, position.y.value),
  );

  const rotateShape = () => {
    'worklet';
    const nextMatrix = shape.value.matrix
      .map((_, i) => shape.value.matrix.map((column) => column[i]))
      .map((row) => row.reverse());
    const currentPos = point(currentPosition.value.x, currentPosition.value.y);
    return {
      nextMatrix,
      currentPos,
    };
  };

  return {
    position,
    currentPosition,
    shape: shape,
    rotateShape,
    moveTo,
    color: currentTetrominoColor,
    collided,
    allTetrominos,
    nextTetromino,
  };
};
