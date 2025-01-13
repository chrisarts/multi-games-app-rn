import * as HashMap from 'effect/HashMap';
import * as Option from 'effect/Option';
import { Text, View } from 'react-native';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { GridStore } from '../Store/Grid.store';
import { useGridStore } from './hooks/useStore';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}

export const CellView = ({ position, cellLayout }: CellViewProps) => {
  // useRenderCounter(
  //   `CellView [x: ${position.column}, y: ${position.row}]`,
  //   (count) => count > 2,
  // );

  const cellState = useGridStore((selector) =>
    HashMap.get(selector.cellsMap, position).pipe(
      Option.map((cell) => cell.state),
      Option.getOrElse(() => null),
    ),
  );

  if (!cellState) return null;

  return (
    <View
      style={{
        backgroundColor: cellState.color,
        width: cellLayout.size,
        height: cellLayout.size,
        margin: cellLayout.spacing / 2,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: 'white' }}>{`${position.row},${position.column}`}</Text>
    </View>
  );
};
