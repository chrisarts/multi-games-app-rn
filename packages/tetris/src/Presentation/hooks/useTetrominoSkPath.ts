import { processTransform3d, rrect, usePathValue } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { type GridConfig, getCellUIRect } from '../../Domain/Grid.domain';
import type { AnimatedPosition } from '../../Domain/Position.domain';
import type { Tetromino } from '../../Domain/Tetromino.domain';

export const useTetrominoSkPath = (
  tetromino: SharedValue<Tetromino>,
  position: AnimatedPosition,
  cellConfig: GridConfig['cell'],
) => {
  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of tetromino.value.shape) {
      skPath.addRRect(rrect(getCellUIRect(cell, cellConfig.size), 5, 5));
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            position.x.value * cellConfig.size,
            position.y.value * cellConfig.size,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  return {
    skShapePath,
  };
};
