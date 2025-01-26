import { processTransform3d, rrect, usePathValue } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { type GridConfig, getCellUIRect } from '../../Domain/Grid.domain';
import type { AnimatedPosition } from '../../Domain/Position.domain';
import type { Tetromino } from '../../Domain/Tetromino.domain';

export const useTetrisGridPath = (
  tetromino: SharedValue<Tetromino>,
  position: AnimatedPosition,
  gridConfig: GridConfig,
) => {
  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of tetromino.value.shape) {
      skPath.addRRect(rrect(getCellUIRect(cell, gridConfig.cell.size), 5, 5));
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            position.x.value * gridConfig.cell.size,
            position.y.value * gridConfig.cell.size,
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
