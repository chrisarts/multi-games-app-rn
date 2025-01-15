import { processTransform2d, usePathValue } from '@shopify/react-native-skia';
import * as Cell from '../../Domain/Cell.domain';
import type * as Grid from '../../Domain/Grid.domain';

export const useRRectGrid = (grid: Grid.GridState) => {
  const cellLayout = grid.layout.cell;

  const cellRects = grid.positions.map(
    (position) => [Cell.createCellUIRRect(position, cellLayout), position] as const,
  );

  return { cellRects };
};

export const useGridPath = (grid: Grid.GridState) => {
  const gridPath = Cell.createCanvasUIPath(grid);

  const clip = usePathValue((path) => {
    'worklet';
    path.transform(processTransform2d([]));
  }, gridPath);

  return {
    gridPath,
    clip,
  };
};
