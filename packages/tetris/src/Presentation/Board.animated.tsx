import { Canvas, Fill, Group, Path, type SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  ReduceMotion,
  type SharedValue,
  useDerivedValue,
  useFrameCallback,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Cell from '../Domain/Cell.domain';
import type * as Grid from '../Domain/Grid.domain';
import { useGameState } from './hooks/useGameState';
import { useGrid } from './hooks/useGrid';
import { useTetromino } from './hooks/useTetromino';

export const AnimatedBoard = () => {
  const insets = useSafeAreaInsets();
  const { cellsLayout, gridBounds, canvasSize, gridPath, gridSize } = useGrid();
  const { dropPosition } = useGameState();
  const { tetromino } = useTetromino(cellsLayout);

  const gesture = Gesture.Pan().onChange((e) => {
    const cellSize = cellsLayout.containerSize;
    let movedCells = Math.floor(Math.abs(e.x) / cellSize);

    if (movedCells >= gridBounds.max.x - 1) {
      movedCells -= tetromino.bounds.max.x;
    }

    dropPosition.x.value = movedCells;
  });

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    if (Math.floor(frame.timeSinceFirstFrame % 800) === 0) {
      dropPosition.y.value = withTiming(dropPosition.y.value + 1, {
        duration: 790,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      });
    }
  });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={canvasSize}>
        <Group
          transform={[
            {
              translateY: (cellsLayout.containerSize * gridSize.columns) / 2 - insets.top,
            },
          ]}
        >
          <Fill />
          <Path path={gridPath} style='fill' color={Cell.defaultCellColor} />
          <TetrominoView
            color={tetromino.color}
            dropPosition={{
              x: dropPosition.x,
              y: dropPosition.y,
            }}
            path={tetromino.skPath}
            layout={cellsLayout}
          />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};

interface TetrominoProps {
  path: SkPath;
  layout: Grid.CellLayout;
  color: string;
  dropPosition: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
}

const TetrominoView = ({ dropPosition, layout, path, color }: TetrominoProps) => {
  const transform = useDerivedValue(() => [
    {
      translate: [
        dropPosition.x.value * layout.containerSize,
        dropPosition.y.value * layout.containerSize,
      ] as const,
    },
  ]);
  return <Path path={path} transform={transform} style='fill' color={color} />;
};
