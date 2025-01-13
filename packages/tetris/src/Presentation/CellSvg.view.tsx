import { RoundedRect } from '@shopify/react-native-skia';
import * as HashMap from 'effect/HashMap';
import * as Cell from '../Domain/Cell.domain';
import type * as Layout from '../Domain/Layout.domain';
import type * as Position from '../Domain/Position.domain';
import { useGameStore } from './hooks/useStore';
export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Layout.CellLayout;
}

export const TetrisCellSvg = ({ position, cellLayout }: CellViewProps) => {
  // useRenderCounter(`Cell: ${position.row} ${position.column}`)
  const cellState = useGameStore(
    (selector) => HashMap.unsafeGet(selector.grid.cellsMap, position).state,
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
