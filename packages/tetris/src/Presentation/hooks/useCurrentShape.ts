import { processTransform3d, rrect, usePathValue } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { type GridConfig, getCellUIRect } from '../../Domain/Grid.domain';
import { getAllTetrominos, getRandomTetromino } from '../../Domain/Tetromino.domain';

export const useCurrentShape = (gridConfig: GridConfig) => {
  const firstShape = useMemo(
    () => getRandomTetromino(gridConfig, gridConfig.cellContainerSize),
    [gridConfig],
  );

  const shape = useSharedValue(firstShape);
  const allTetrominos = getAllTetrominos(gridConfig, gridConfig.cellContainerSize);
  // const translateX = useSharedValue(0);
  // const translateY = useSharedValue(0);
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

  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of shape.value.cells) {
      if (cell.value === 0) continue;
      skPath.addPath;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, gridConfig.cellContainerSize), 5, 5),
      );
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            position.x.value * gridConfig.cellContainerSize,
            position.y.value * gridConfig.cellContainerSize,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  return {
    position,
    shape: shape,
    moveTo,
    color: currentTetrominoColor,
    collided,
    skShapePath,
    allTetrominos,
    nextTetromino,
  };
};
