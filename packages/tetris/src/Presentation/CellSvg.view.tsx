import { Group, Paragraph, RoundedRect, type SkRRect } from '@shopify/react-native-skia';
import * as HashMap from 'effect/HashMap';
import type { CellLayout } from '../Domain/Grid.domain';
import type * as Position from '../Domain/Position.domain';
import { useCellParagraph } from './hooks/useCell';
import { useGameStore } from './hooks/useStore';

interface CellViewProps {
  cell: SkRRect;
  position: Position.Position;
  layout: CellLayout;
}

export const TetrisCellSvg = (props: CellViewProps) => {
  const state = useGameStore(
    (state) => HashMap.unsafeGet(state.grid.cellsMap, props.position).state,
  );
  const paragraph = useCellParagraph(props.position, props.layout);

  return (
    <Group>
      <RoundedRect rect={props.cell} style='fill' color={state.color} />
      <Paragraph
        paragraph={paragraph}
        width={props.cell.rect.width}
        x={props.cell.rect.x}
        y={props.cell.rect.y}
      />
    </Group>
  );
};

// return (
//   <Fill>
//     <RoundedRect rect={props.cell} style='fill' color={cellColor} />
//     {/* <Paragraph
//       paragraph={paragraph}
//       width={props.cellLayout.size * 0.9}
//       x={svg.x + props.cellLayout.spacing}
//       y={svg.y + props.cellLayout.spacing}
//     /> */}
//   </Fill>
// );

// useEffect(() => {
//   const subscription = GameStore.GameStore.subscribe((state) => {
//     'worklet';
//     if (state.tetromino.current.color !== nextColorRef.current.color) {
//       nextColorRef.current = state.tetromino.current;
//     }

//     const includesCell = state.tetromino.current.drawPositions.some((x) =>
//       Position.Eq.equals(props.position, Position.sum(state.tetromino.position, x)),
//     );
//     if (
//       props.position.row <= state.grid.bounds.max.row &&
//       includesCell &&
//       cellObject.mergeColor.value === 0
//     ) {
//       cellObject.mergeColor.value = withSpring(includesCell ? 1 : 0, {
//         duration: 100,
//         reduceMotion: ReduceMotion.Never,
//         dampingRatio: 50,
//       });
//     } else if (
//       cellObject.mergeColor.value === 1 &&
//       props.position.row <= state.grid.bounds.max.row
//     ) {
//       cellObject.mergeColor.value = withSpring(includesCell ? 1 : 0, {
//         duration: 100,
//         reduceMotion: ReduceMotion.Never,
//         stiffness: 100,
//         dampingRatio: 500,
//         restDisplacementThreshold: 10,
//       });
//     }
//   });

//   return () => {
//     subscription();
//   };
// }, [props.position]);

// const cellColor = useDerivedValue(() => {
//   return interpolateColors(
//     cellObject.mergeColor.value,
//     [0, 1],
//     [defaultCellColor, nextColorRef.current.color],
//   );
// });
// const opacity = useDerivedValue(() => {
//   return interpolate(
//     cellObject.mergeColor.value,
//     [0, 0.5, 0],
//     [1, 0.5, 1],
//     Extrapolate.CLAMP,
//   );
// });

// const useCellSvgState = (cell: CellViewProps) => {
//   // useRenderCounter(`Cell: ${position.row} ${position.column}`)
//   const cellState = useGameStore(
//     (selector) => HashMap.unsafeGet(selector.grid.cellsMap, cell.position).state,
//   );

//   const paragraph = useMemo(() => {
//     const para = Skia.ParagraphBuilder.Make()
//       .addText(`${cell.position.row}:${cell.position.column}`)
//       .build();
//     para.layout(cell.cellLayout.size);
//     return para;
//   }, [cell]);

//   const svg = Cell.getCellSvg(cell.position, cell.cellLayout);

//   return {
//     svg,
//     paragraph,
//     cellState,
//   };
// };
