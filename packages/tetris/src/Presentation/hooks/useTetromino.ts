import { Skia, rect, rrect } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import {
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Cell from '../../Domain/Cell.domain';
import type * as Grid from '../../Domain/Grid.domain';
import type * as Position from '../../Domain/Position.domain';
import { useGameStore } from './useStore';

export const useTetrominoPath = (grid: Grid.GridState) => {
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
    const position = Cell.calculateUICellDraw(dropPosition, cellLayout);
    animatedPosition.value = withSpring(
      {
        columnX: position.x,
        rowY: position.y,
      },
      {
        duration: dropPosition.row === 0 ? 0 : 100,
        dampingRatio: 10,
        restSpeedThreshold: 0.5,
        reduceMotion: ReduceMotion.Never,
        stiffness: 500,
        velocity: 5
      },
    );
  }, [dropPosition, animatedPosition, cellLayout]);

  return {
    tetrominoPath,
    tetromino,
    transforms,
  };
};

const createTetrominoPath = (positions: Position.Position[], grid: Grid.CellLayout) => {
  'worklet';
  const path = Skia.Path.Make();
  for (const position of positions) {
    const cell = Cell.createCellUIRect(position, grid);
    path.addRRect(rrect(rect(cell.x, cell.y, cell.width, cell.height), 5, 5));
  }
  path.close();
  return path;
};
