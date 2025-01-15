import { Canvas, Fill, Rect, Shader, useClock, vec } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { TetrisCellSvg } from './CellSvg.view';
import { SpaceShader, TetrisShader } from './Shader';
import { TetrominoView } from './Tetromino.view';
import { useRRectGrid } from './hooks/useGrid';
import { useGameStore } from './hooks/useStore';

export const GameCanvas = () => {
  const clock = useClock();
  const grid = useGameStore((state) => state.grid);
  const { cellRects } = useRRectGrid(grid);
  const uniforms = useDerivedValue(() => {
    return {
      iResolution: vec(grid.layout.canvas.width, grid.layout.canvas.height),
      iTime: clock.value * 0.0005,
    };
  });
  return (
    <Canvas
      style={{
        width: grid.layout.canvas.width,
        height: grid.layout.canvas.height,
        backgroundColor: 'black',
      }}
      mode='continuous'
    >
      <Fill />
      <Rect
        x={0}
        y={0}
        width={grid.layout.canvas.width}
        height={grid.layout.canvas.height}
      >
        <Shader source={TetrisShader} uniforms={uniforms} />
      </Rect>
      {cellRects.map(([cell, position]) => (
        <TetrisCellSvg
          key={`${cell.rect.x},${cell.rect.y}`}
          position={position}
          cell={cell}
          layout={grid.layout.cell}
        />
      ))}
      <TetrominoView grid={grid} />
    </Canvas>
  );
};
