import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import * as Tetris from '../../Domain/AnimatedTetris';
import * as Grid from '../../Domain/Grid.domain';

export const useGrid = () => {
  const dims = useWindowDimensions();

  const grid = useMemo(
    () =>
      Grid.makeGridState({
        screen: { height: dims.height, width: dims.width },
        size: { columns: 10, rows: 15 },
      }),
    [dims],
  );

  const gridPath = useMemo(() => Tetris.createCanvasUIPath_(grid), [grid]);

  return {
    cellsLayout: grid.layout.cell,
    gridSize: grid.layout.size,
    gridBounds: grid.bounds,
    gridPath,
    canvasSize: { width: dims.width, height: dims.height },
  };
};
