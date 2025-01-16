import { Skia, rect, rrect } from '@shopify/react-native-skia';
import type * as Grid from '../../Domain/Grid.domain';
import type * as Position from '../../Domain/Position.domain';

export const calculateUICellDraw = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  'worklet';
  const x = position.column * cellLayout.containerSize + cellLayout.spacing / 2;
  const y = position.row * cellLayout.containerSize + cellLayout.spacing / 2;
  const width = cellLayout.containerSize - cellLayout.spacing / 2;
  const height = cellLayout.containerSize - cellLayout.spacing / 2;
  return {
    x,
    y,
    width,
    height,
  };
};

export const createCellUIRect = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  'worklet';
  const { x, y, width, height } = calculateUICellDraw(position, cellLayout);
  return rect(x, y, width, height);
};

export const createCellUIRRect = (
  position: Position.Position,
  cellLayout: Grid.CellLayout,
) => {
  'worklet';
  return rrect(createCellUIRect(position, cellLayout), 5, 5);
};

export const createCanvasUIPath = (grid: Grid.GridState) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of grid.positions) {
    const cell = createCellUIRect(position, grid.layout.cell);
    path.addRRect(rrect(rect(cell.x, cell.y, cell.width, cell.height), 5, 5));
  }
  path.close();
  return path;
};
