import { HashSet } from 'effect';
import { useMemo } from 'react';
import { View } from 'react-native';
import { GridStore } from '../Store/Grid.store';
import { CellView } from './Cell.view';
import { useRenderCounter } from './hooks/useRenderCounter';

export const GridView = () => {
  useRenderCounter('GridView');
  const boardCells = GridStore.useGrisStore((state) => state.positions);
  const layout = GridStore.useGrisStore((state) => state.layout);

  const cells = useMemo(
    () =>
      HashSet.map(boardCells, (position) => (
        <CellView
          key={`${position.row}-${position.column}`}
          cellLayout={layout.cell}
          position={position}
        />
      )),
    [boardCells, layout.cell],
  );

  return (
    <View
      style={{
        ...layout.canvas,
        backgroundColor: 'black',
      }}
    >
      {cells}
    </View>
  );
};
