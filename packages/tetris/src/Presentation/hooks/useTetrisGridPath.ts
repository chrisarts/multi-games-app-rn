import { processTransform3d, rrect, usePathValue } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { type TetrisGrid, getCellUIRect } from '../../Domain/Grid.domain';
import type { AnimatedPosition } from '../../Domain/Position.domain';
import { useGameContext } from '../context/GameContext';

export const useTetrisGridPath = (
  grid: SharedValue<TetrisGrid>,
  position: AnimatedPosition,
) => {
  const { gridConfig } = useGameContext();
  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of grid.value.cellsMatrix.flat()) {
      if (cell.value === 0) continue;
      skPath.addRRect(rrect(getCellUIRect(cell.point, gridConfig.cell.size), 5, 5));
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
