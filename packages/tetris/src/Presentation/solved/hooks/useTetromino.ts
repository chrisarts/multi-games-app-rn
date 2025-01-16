import { useEffect, useMemo } from 'react';
import {
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type * as Grid from '../../../Domain/Grid.domain';
import type { Position } from '../../../Domain/Position.domain';
import type { Tetromino } from '../../../Domain/Tetromino.domain';
import { calculateUICellDraw } from '../../worklets/cell.worklet';
import { createTetrominoPath } from '../../worklets/tetromino.worklet';

export const useTetrominoPath = ({
  layout,
  tetromino,
  position,
}: { layout: Grid.CellLayout; tetromino: Tetromino; position: Position }) => {
  const animatedPosition = useSharedValue({
    columnX: position.x,
    rowY: position.y,
  });

  const tetrominoPath = useMemo(
    () => createTetrominoPath(tetromino.drawPositions, layout),
    [tetromino, layout],
  );

  const transforms = useDerivedValue(() => [
    {
      translate: [animatedPosition.value.columnX, animatedPosition.value.rowY] as const,
    },
  ]);

  useEffect(() => {
    const celPos = calculateUICellDraw(position, layout);
    animatedPosition.value = withTiming(
      {
        columnX: celPos.x,
        rowY: celPos.y,
      },
      {
        duration: position.y === 0 ? 0 : 100,
        reduceMotion: ReduceMotion.Never,
        easing: Easing.steps(1000, true),
      },
    );
  }, [position, animatedPosition, layout]);

  return {
    tetrominoPath,
    tetromino,
    transforms,
  };
};
