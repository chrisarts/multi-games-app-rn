import { processTransform2d, usePathValue } from '@shopify/react-native-skia';
import { createCanvasUIPath, createCellUIRRect } from '../../Domain/Cell.domain';
import type { GridState } from '../../Domain/Grid.domain';

export const useRRectGrid = (grid: GridState) => {
  const cellLayout = grid.layout.cell;

  const cellRects = grid.positions.map(
    (position) => [createCellUIRRect(position, cellLayout), position] as const,
  );

  return { cellRects };
};

export const useGridPath = (grid: GridState) => {
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
