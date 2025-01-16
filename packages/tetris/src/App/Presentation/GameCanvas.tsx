import {
  Canvas,
  Fill,
  Group,
  Rect,
  Shader,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BoardHeader } from './BoardHeader';
import { TetrisCellSvg } from './CellSvg.view';
import { TetrisShader } from './Shader';
import { CurrentTetromino } from './Tetromino.view';
import { useRRectGrid } from './hooks/useGrid';
import { useGameStore } from './hooks/useStore';

export const GameCanvas = () => {
  const clock = useClock();
  const grid = useGameStore((state) => state.grid);
  const insets = useSafeAreaInsets();
  const { cellRects } = useRRectGrid(grid);
  const uniforms = useDerivedValue(() => {
    return {
      iResolution: vec(grid.layout.screen.width, grid.layout.screen.height),
      iTime: clock.value * 0.0005,
    };
  });
  return (
    <Canvas style={{ flex: 1 }} mode='continuous'>
      <Fill />
      <Rect
        x={0}
        y={0}
        width={grid.layout.canvas.width}
        height={grid.layout.screen.height}
      >
        <Shader source={TetrisShader} uniforms={uniforms} />
      </Rect>
      <BoardHeader insets={insets} />
      <Group
        transform={[
          {
            translateY: insets.top - grid.layout.cell.containerSize + grid.layout.remainingSpace / 2,
          },
        ]}
      >
        {cellRects.map(([cell, position]) => (
          <TetrisCellSvg
            key={`${cell.rect.x},${cell.rect.y}`}
            position={position}
            cell={cell}
            layout={grid.layout.cell}
          />
        ))}
        <CurrentTetromino />
      </Group>
    </Canvas>
  );
};
