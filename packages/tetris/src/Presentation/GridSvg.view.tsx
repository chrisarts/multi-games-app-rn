import { Canvas } from '@shopify/react-native-skia';
import * as HashSet from 'effect/HashSet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { runForkedTetris } from '../Application/RunGame';
import { TetrisRuntime } from '../Services/Runtime.layers';
import { TetrisCellSvg } from './CellSvg.view';
import { GridControls } from './GameControls.view';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGridStore } from './hooks/useStore';

TetrisRuntime.runFork(runForkedTetris);

export const GridView = () => {
  useRenderCounter('GridView');
  const boardCells = useGridStore((state) => state.positions);
  const layout = useGridStore((state) => state.layout);

  const gridCells = useMemo(
    () =>
      HashSet.map(boardCells, (gridPoint) => (
        <TetrisCellSvg
          key={`[${gridPoint.row},${gridPoint.column}]`}
          position={gridPoint}
          cellLayout={layout.cell}
        />
      )),
    [boardCells, layout],
  );

  return (
    <View style={styles.container}>
      <Canvas style={layout.canvas} mode='continuous'>
        {gridCells}
      </Canvas>
      <GridControls />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: 'center' },
});
