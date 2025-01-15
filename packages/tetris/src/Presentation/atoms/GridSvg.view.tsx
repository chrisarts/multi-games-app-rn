import { Canvas } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { createCellUIRRect } from '../../Domain/Cell.domain';
import { TetrisCellSvg } from '../CellSvg.view';
import { useRenderCounter } from '../hooks/useRenderCounter';
import { useGameStore } from '../hooks/useStore';

export const GridView = () => {
  useRenderCounter('GridView');
  const grid = useGameStore((state) => state.grid);

  const gridCells = useMemo(
    () =>
      grid.positions.map((gridPoint) => (
        <TetrisCellSvg
          key={`[${gridPoint.row},${gridPoint.column}]`}
          cell={createCellUIRRect(gridPoint, grid.layout.cell)}
          position={gridPoint}
          layout={grid.layout.cell}
        />
      )),
    [grid.positions, grid.layout],
  );

  return (
    <Canvas
      style={{
        maxWidth: grid.layout.canvas.width,
        maxHeight: grid.layout.canvas.height,
        flex: 1,
      }}
      mode='continuous'
    >
      {gridCells}
    </Canvas>
  );
};
