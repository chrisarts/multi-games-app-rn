import { type SkPoint, Skia, rect, rrect } from '@shopify/react-native-skia';
import * as Array from 'effect/Array';
import { Dimensions } from 'react-native';

export const makeGridPoints = (rows: number, columns: number) => {
  'worklet';
  const { width, height } = Dimensions.get('window');
  const spacing = 3;
  const squareContainerSize = width / columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = height;
  const canvasHeight = rows * squareContainerSize;
  const cells = Array.makeBy(rows, (y) =>
    Array.makeBy(columns, (x) => {
      return createCellUIRRect(Skia.Point(x, y), {
        containerSize: squareContainerSize,
        size: squareSize,
        spacing,
      });
    }),
  ).flat();
  return {
    cells,
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
  };
};

export const calculateUICellDraw = (position: SkPoint, cellLayout: any) => {
  'worklet';
  const x = position.x * cellLayout.containerSize + cellLayout.spacing / 2;
  const y = position.y * cellLayout.containerSize + cellLayout.spacing / 2;
  const width = cellLayout.containerSize - cellLayout.spacing / 2;
  const height = cellLayout.containerSize - cellLayout.spacing / 2;
  return {
    x,
    y,
    width,
    height,
  };
};

export const createCellUIRect = (position: SkPoint, cell: any) => {
  'worklet';
  const { x, y, width, height } = calculateUICellDraw(position, cell);
  return rect(x, y, width, height);
};

export const createCellUIRRect = (position: SkPoint, cellLayout: any) => {
  'worklet';
  return rrect(createCellUIRect(position, cellLayout), 5, 5);
};
