import { processTransform2d, usePathValue } from '@shopify/react-native-skia';
import type * as Grid from '../../../Domain/Grid.domain';
import { createCanvasUIPath, createCellUIRRect } from '../../worklets/cell.worklet';

export const useRRectGrid = (grid: Grid.GridState) => {
  const cellLayout = grid.layout.cell;

  const cellRects = grid.cellPoints.map(
    (position) => [createCellUIRRect(position, cellLayout), position] as const,
  );

  return { cellRects };
};

export const useGridPath = (grid: Grid.GridState) => {
  const gridPath = createCanvasUIPath(grid);

  const clip = usePathValue((path) => {
    'worklet';
    path.transform(processTransform2d([]));
  }, gridPath);

  return {
    gridPath,
    clip,
  };
};
