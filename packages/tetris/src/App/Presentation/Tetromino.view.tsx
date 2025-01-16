import { Path } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import {
  Easing,
  ReduceMotion,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type * as GridState from '../Domain/Grid.domain';
import type * as Tetromino from '../Domain/Tetromino.domain';
import { useGameStore } from './hooks/useStore';
import { calculateUICellDraw } from './worklets/cell.worklet';
import { createTetrominoPath } from './worklets/tetromino.worklet';

interface TetrominoViewProps {
  color: string;
  tetromino: Tetromino.Tetromino;
  layout: GridState.CellLayout;
  position: SharedValue<{ x: number; y: number }>;
}

export const TetrominoView = ({ tetromino, layout, position }: TetrominoViewProps) => {
  const tetrominoPath = useMemo(
    () => createTetrominoPath(tetromino.drawPositions, layout),
    [tetromino, layout],
  );

  const transforms = useDerivedValue(() => [
    {
      translate: [position.value.x, position.value.y] as const,
    },
  ]);

  return <Path path={tetrominoPath} color={tetromino.color} transform={transforms} />;
};

export const NextTetromino = () => {
  const tetromino = useGameStore((x) => x.tetromino.next);

  const animatedPosition = useSharedValue({
    x: 0,
    y: 0,
  });

  return (
    <TetrominoView
      color={tetromino.color}
      layout={{
        containerSize: 10,
        size: 8,
        spacing: 1,
      }}
      position={animatedPosition}
      tetromino={tetromino}
    />
  );
};

export const CurrentTetromino = () => {
  const initialPosition = useGameStore((x) => x.grid.layout.initialPosition);
  const tetromino = useGameStore((x) => x.tetromino.current);
  const drawPosition = useGameStore((x) => x.tetromino.position);
  const cellLayout = useGameStore((x) => x.grid.layout.cell);

  const animatedPosition = useSharedValue({
    x: initialPosition.column,
    y: initialPosition.row,
  });

  useEffect(() => {
    const celPos = calculateUICellDraw(drawPosition, cellLayout);
    animatedPosition.value = withTiming(
      {
        x: celPos.x,
        y: celPos.y,
      },
      {
        duration: drawPosition.row === 0 ? 0 : 100,
        reduceMotion: ReduceMotion.Never,
        easing: Easing.steps(1000, true),
      },
    );
  }, [drawPosition, animatedPosition, cellLayout]);

  return (
    <TetrominoView
      color={tetromino.color}
      layout={cellLayout}
      position={animatedPosition}
      tetromino={tetromino}
    />
  );
};
