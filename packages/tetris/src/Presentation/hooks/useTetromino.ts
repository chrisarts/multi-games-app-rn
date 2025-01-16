import { useState } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import type * as Grid from '../../Domain/Grid.domain';
import * as Tetromino from '../../Domain/Tetromino.domain';
import { createTetrominoPath } from '../worklets/tetromino.worklet';

export const useTetromino = (layout: Grid.CellLayout) => {
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const [tetromino] = useState(() =>
    createRandom(layout, { x: positionX, y: positionY }),
  );

  return {
    tetromino,
  };
};

const createRandom = (
  layout: Grid.CellLayout,
  sharedVals: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  },
): Tetromino.Tetromino_ => {
  const tetromino = Tetromino.getRandomTetromino();
  return {
    bounds: tetromino.bounds,
    cells: tetromino.drawPositions,
    color: tetromino.color,
    layout,
    matrix: tetromino.matrix,
    name: tetromino.name,
    positionX: sharedVals.x,
    positionY: sharedVals.y,
    skPath: createTetrominoPath(tetromino.drawPositions, layout),
  };
};
