import {
  PaintStyle,
  type SkImage,
  type SkPoint,
  Skia,
  point,
} from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as Constants from '../../Data/Grid.data';
import * as Grid from '../../Domain/Grid.domain';
import type * as Tetromino from '../../Domain/Tetromino.domain';
import { createTetrominoPath } from './tetromino.worklet';

export const inclusiveClamp = (value: number, min: number, max: number) => {
  'worklet';
  return value < min ? min : value > max ? max : value;
};

export const drawMergedTetrominos = (
  position: SkPoint,
  tetromino: Tetromino.MergedTetromino,
  mergedShapes: SharedValue<Tetromino.MergedTetromino[]>,
  image: SharedValue<SkImage | null>,
) => {
  'worklet';
  image.value?.dispose();
  mergedShapes.set((prev) => {
    prev.push({
      color: tetromino.color,
      drawPoints: tetromino.drawPoints,
      // rRects: tetromino.rRects,
      sweep: false,
      position,
      path: tetromino.path.copy(),
    });
    return prev;
  });
  const surface = Skia.Surface.MakeOffscreen(
    Constants.GRID.gridRect.width,
    Constants.GRID.gridRect.height,
  )!;

  const canvas = surface.getCanvas();
  for (const shape of mergedShapes.value) {
    const paint = Skia.Paint();
    paint.setStyle(PaintStyle.Fill);
    paint.setColor(Skia.Color(shape.color));
    canvas.drawPath(shape.path, paint);
  }
  surface.flush();
  image.value = surface.makeImageSnapshot();
};

export const getMergeableTetromino = (
  current: Tetromino.Tetromino,
  position: SkPoint,
) => {
  'worklet';
  const shape = createTetrominoPath(
    current.drawPositions.map((x) => point(x.x + position.x, x.y + position.y)),
  );
  const rects = current.drawPositions.map((x) => Grid.createCellUIRRect(x));

  for (const rrect of rects) {
    shape.addRRect(rrect);
  }

  return { shapePath: shape, rects };
};

export function getCurrentDropPoints(
  position: SharedValue<SkPoint>,
  cellSize: number,
  maxBound: number,
) {
  'worklet';
  const currentCellY = Math.floor((position.value.y + maxBound) / cellSize);
  const currentCellX = Math.floor(position.value.x / cellSize);

  return {
    currentCellX,
    currentCellY,
  };
}
