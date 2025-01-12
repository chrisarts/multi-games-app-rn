import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import { View } from 'react-native';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { GridStore } from '../Store/Grid.store';
import { useRenderCounter } from './hooks/useRenderCounter';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}


export const CellView = ({ position, cellLayout }: CellViewProps) => {
  useRenderCounter(
    `CellView [x: ${position.column}, y: ${position.row}]`,
    (count) => count > 2,
  );

  const tetrisCell = GridStore.useGrisStore((state) =>
    HashMap.get(state.cellsMap, position),
  );

  return Option.map(tetrisCell, (cell) => (
    <View
      style={{
        backgroundColor: cell.state.color,
        width: cellLayout.size,
        height: cellLayout.size,
        margin: cellLayout.spacing / 2,
        borderRadius: 5,
      }}
    />
  )).pipe(
    Option.getOrElse(() => (
      <View
        style={{
          backgroundColor: 'red',
          borderWidth: 1,
          borderColor: 'gray',
          width: cellLayout.size,
          height: cellLayout.size,
          borderRadius: 5,
          padding: cellLayout.spacing,
        }}
      />
    )),
  );
};
