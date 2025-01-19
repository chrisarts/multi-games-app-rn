import { Skia, rect, rrect } from '@shopify/react-native-skia';
import { GRID } from '../Data/Grid.data';
import type * as Position from './Position.domain';


export const defaultCellColor: string = 'rgba(131, 126, 126, 0.3)';

export const calculateUICellDraw = (position: Position.Position) => {
  'worklet';
  const x = position.x * GRID.cellSize;
  const y = position.y * GRID.cellSize;
  const width = GRID.cellSize;
  const height = GRID.cellSize;
  return {
    x,
    y,
    width,
    height,
  };
};

export const createCellUIRect = (position: Position.Position) => {
  'worklet';
  const { x, y, width, height } = calculateUICellDraw(position);
  return rect(x, y, width, height);
};

export const createCellUIRRect = (position: Position.Position) => {
  'worklet';
  return rrect(createCellUIRect(position), 5, 5);
};

export const createCanvasUIPath = () => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of GRID.cells) {
    const cell = createCellUIRect(position);
    path.addRRect(rrect(cell, 5, 5));
  }
  return path;
};
