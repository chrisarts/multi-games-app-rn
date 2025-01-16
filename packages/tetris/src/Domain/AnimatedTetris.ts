import { type SkPoint, type SkRRect, rect, rrect } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import type * as Grid from './Grid.domain';

export interface TetrisCell_ {
  position: SharedValue<SkPoint>;
  rRect: SkRRect;
  merged: SharedValue<0 | 1>;
  color: SharedValue<number>;
}

export const createTetrisCellRRect = (layout: Grid.CellLayout, position: SkPoint) => {
  'worklet';
  const { height, width, x, y } = calculateUICellDraw_(position, layout);
  return rrect(rect(x, y, width, height), 5, 5);
};

const calculateUICellDraw_ = (position: SkPoint, cellLayout: Grid.CellLayout) => {
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
