import { useMemo } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import type { GridConfig } from '../../Domain/Grid.domain';
import { getAllTetrominos, getRandomTetromino } from '../worklets/tetromino.worklet';

export const useCurrentShape = (gridConfig: GridConfig) => {
  const firstShape = useMemo(
    () => getRandomTetromino(gridConfig, gridConfig.cellSize),
    [gridConfig],
  );

  const dropSpeed = useSharedValue(800);
  const allTetrominos = getAllTetrominos(gridConfig, gridConfig.cellContainerSize);
  const currentShape = useSharedValue(firstShape);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const collided = useSharedValue(false);

  const transform = useDerivedValue(() => {
    return [
      {
        translate: [translateX.value, translateY.value] as const,
      },
    ];
  });

  return {
    currentShape,
    translateX,
    transform,
    translateY,
    collided,
    allTetrominos,
    speed: dropSpeed,
  };
};
