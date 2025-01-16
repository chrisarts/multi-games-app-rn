import { Path } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import {
  Easing,
  ReduceMotion,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
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
  const speed = useGameStore((x) => x.game.speed);
  const cellLayout = useGameStore((x) => x.grid.layout.cell);

  const celPos = useMemo(
    () => calculateUICellDraw(drawPosition, cellLayout),
    [drawPosition, cellLayout],
  );
  const animatedPosition = useSharedValue({
    x: initialPosition.column,
    y: initialPosition.row,
  });

  useEffect(() => {
    animatedPosition.value = withRepeat(
      withTiming(
        {
          x: celPos.x - cellLayout.spacing / 2,
          y: celPos.y - cellLayout.spacing / 2,
        },
        {
          duration: drawPosition.row === 0 ? 0 : speed,
          reduceMotion: ReduceMotion.Never,
          easing: Easing.in(Easing.linear),
        },
      ),
      -1,
      false,
    );
  }, [drawPosition, animatedPosition, cellLayout, speed, celPos]);

  return (
    <TetrominoView
      color={tetromino.color}
      layout={cellLayout}
      position={animatedPosition}
      tetromino={tetromino}
    />
  );
};
