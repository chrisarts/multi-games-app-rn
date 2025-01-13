import { RoundedRect } from '@shopify/react-native-skia';
import { HashMap } from 'effect';
import * as Option from 'effect/Option';
import { useDerivedValue } from 'react-native-reanimated';
import * as Cell from '../Domain/Cell.domain';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { GridStore } from '../Store/Grid.store';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGridStore } from './hooks/useStore';
export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}

export const TetrisCellSvg = ({ position, cellLayout }: CellViewProps) => {
  // useRenderCounter(`Cell: ${position.row} ${position.column}`)
  const cellState = useGridStore(
    (selector) => HashMap.unsafeGet(selector.cellsMap, position).state,
  );

  const svg = Cell.getCellSvg(position, cellLayout);
  return (
    <RoundedRect
      height={svg.height}
      width={svg.width}
      r={svg.r}
      x={svg.x}
      y={svg.y}
      style='fill'
      color={cellState.color}
    />
  );
};

// interface TetrisShapeCellSvgProps {
//   position: SharedValue<BoardPosition>;
//   width: number;
//   height: number;
//   color: SharedValue<string>;
//   containerSize: number;
//   padding: number;
//   coords: BoardPosition;
// }
// export const TetrisShapeCellSvg = ({
//   coords,
//   color,
//   height,
//   width,
//   position,
//   containerSize,
//   padding,
// }: TetrisShapeCellSvgProps) => {
//   const coordinate = useDerivedValue(() => {
//     return {
//       x: (coords.y + position.value.y) * containerSize + padding / 2,
//       y: (coords.x + position.value.x) * containerSize + padding / 2,
//     };
//   });
//   const x = useDerivedValue(() => coordinate.value.x);
//   const y = useDerivedValue(() => coordinate.value.y);

//   return <RoundedRect x={x} y={y} width={width} height={height} color={color} r={5} />;
// };
