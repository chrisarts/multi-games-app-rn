import { Canvas, Fill } from '@shopify/react-native-skia';
import { TetrisCellSvg } from './CellSvg.view';
import { TetrominoView } from './Tetromino.view';
import { useRRectGrid } from './hooks/useGrid';
import { useGameStore } from './hooks/useStore';

export const GameCanvas = () => {
  const grid = useGameStore((state) => state.grid);
  const { cellRects } = useRRectGrid(grid);
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
