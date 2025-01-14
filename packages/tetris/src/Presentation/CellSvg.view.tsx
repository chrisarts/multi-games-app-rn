import { Group, Paragraph, RoundedRect, Skia } from '@shopify/react-native-skia';
import * as HashMap from 'effect/HashMap';
import { useMemo } from 'react';
import * as Cell from '../Domain/Cell.domain';
import type * as Grid from '../Domain/Grid.domain';
import type * as Position from '../Domain/Position.domain';
import { useRenderCounter } from './hooks/useRenderCounter';
import { useGameStore } from './hooks/useStore';
export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Grid.CellLayout;
}

export const TetrisCellSvg = ({ position, cellLayout }: CellViewProps) => {
  // useRenderCounter(`Cell: ${position.row} ${position.column}`)
  const cellState = useGameStore(
    (selector) => HashMap.unsafeGet(selector.grid.cellsMap, position).state,
  );

  const paragraph = useMemo(() => {
    const para = Skia.ParagraphBuilder.Make()
      .addText(`${position.row}:${position.column}`)
      .build();
    para.layout(cellLayout.size);
    return para;
  }, [position, cellLayout]);

  const svg = Cell.getCellSvg(position, cellLayout);
  return (
    <Group>
      <RoundedRect
        height={svg.height}
        width={svg.width}
        r={svg.r}
        x={svg.x}
        y={svg.y}
        style='fill'
        color={cellState.color}
      />
      <Paragraph
        paragraph={paragraph}
        width={cellLayout.size * 0.9}
        x={svg.x + cellLayout.spacing}
        y={svg.y + cellLayout.spacing}
      />
    </Group>
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
