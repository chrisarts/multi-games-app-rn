import {
  Skia,
  processTransform2d,
  rect,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import {
  Easing,
  ReduceMotion,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TetrominoNames } from '../../Data/Tetrominos.data';
import { createCellUIRect } from '../../Domain/Cell.domain';
import type { GridState } from '../../Domain/Grid.domain';
import type { Position } from '../../Domain/Position.domain';
import type { GridCellLayout } from '../../svg-app/models/GridCell.model';
import { useGameStore } from './useStore';

export const useTetrominoPath = (grid: GridState) => {
  const cellLayout = grid.layout.cell;
  const tetromino = useGameStore((state) => state.tetromino.current);
  const dropPosition = useGameStore((state) => state.tetromino.position);

  const animatedPosition = useSharedValue({
    columnX: grid.layout.initialPosition.column,
    rowY: grid.layout.initialPosition.row,
  });

  const tetrominoPath = useMemo(
    () => createTetrominoPath(tetromino.drawPositions, cellLayout),
    [tetromino, cellLayout],
  );

  const transforms = useDerivedValue(() => [
    {
      translate: [animatedPosition.value.columnX, animatedPosition.value.rowY] as const,
    },
  ]);

  useEffect(() => {
    animatedPosition.value = withTiming(
      {
        columnX: dropPosition.column * cellLayout.containerSize + cellLayout.spacing / 2,
        rowY: dropPosition.row * cellLayout.containerSize + cellLayout.spacing / 2,
      },
      {
        duration: dropPosition.row === 0 ? 0 : 100,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      },
    );
  }, [dropPosition, animatedPosition, cellLayout]);

  return {
    tetrominoPath,
    tetromino,
    transforms,
  };
};

const createTetrominoPath = (positions: Position[], grid: GridCellLayout) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of positions) {
    const cell = createCellUIRect(position, grid);
    path.addRRect(rrect(rect(cell.x, cell.y, cell.width, cell.height), 5, 5));
  }
  path.close();
  return path;
};
