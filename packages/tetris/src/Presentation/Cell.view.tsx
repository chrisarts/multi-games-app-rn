import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import { View } from 'react-native';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { GridStore } from '../Store/Grid.store';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}

export const CellView = ({ position, cellLayout }: CellViewProps) => {
  const tetrisCell = GridStore.useGrisStore((state) =>
    HashMap.get(state.cellsMap, position),
  );

  return Option.map(tetrisCell, (cell) => (
    <View
      style={{
        backgroundColor: cell.state.color,
        width: cellLayout.size,
        height: cellLayout.size,
        borderRadius: 5,
        padding: cellLayout.spacing,
      }}
    />
  )).pipe(
    Option.getOrElse(() => (
      <View
        style={{
          backgroundColor: 'red',
          width: cellLayout.size,
          height: cellLayout.size,
          borderRadius: 5,
          padding: cellLayout.spacing,
        }}
      />
    )),
  );
};
