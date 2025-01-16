import { type SkPoint, Skia } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import type * as Grid from '../../Domain/Grid.domain';
import type * as Position from '../../Domain/Position.domain';
import type * as Tetromino from '../../Domain/Tetromino.domain';
import { createCellUIRRect } from './cell.worklet';

export interface TetrominoWorklet {
  /**
   * 0 - `Free`
   * 1 - `Collided`
   */
  collided: SharedValue<number>;
  /**
   * trigger rotation
   */
  rotate: SharedValue<boolean>;
  position: SharedValue<SkPoint>;
  shape: Tetromino.Tetromino;
}

export const createTetrominoPath = (
  positions: Position.Position[],
  grid: Grid.CellLayout,
) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of positions) {
    path.addRRect(createCellUIRRect(position, grid));
  }
  return path;
};
