// import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
// import type { BlockShape } from '../../models/Block.model';
// import type { GridPosition } from '../../models/GridPosition.model';

// interface TetrisShapeCellSvgProps {
//   position: SharedValue<GridPosition>;
//   width: number;
//   height: number;
//   color: SharedValue<string>;
//   containerSize: number;
//   padding: number;
//   coords: GridPosition;
// }

// interface DroppingShapeProps {
//   shape: SharedValue<BlockShape>;
//   position: SharedValue<GridPosition>;
//   size: number;
//   padding: number;
//   containerSize: number;
// }
// export const DroppingShape = ({
//   position,
//   shape,
//   size,
//   containerSize,
//   padding,
// }: DroppingShapeProps) => {
//   useDerivedValue(() => {
//     console.log('SHAPE: ', console.log('SHAPE: ', shape));
//   });
//   const color = useDerivedValue(() => shape.value.color);
//   return shape.value.shape.map((row, rowIndex) => {
//     return row.map((col, colIndex) => {
//       if (col !== 0) {
//         return (
//           <TetrisShapeCellSvg
//             key={`shape-${rowIndex}-${colIndex}`}
//             height={size}
//             width={size}
//             coords={{ y: colIndex, x: rowIndex }}
//             color={color}
//             position={position}
//             containerSize={containerSize}
//             padding={padding}
//           />
//         );
//       }
//     });
//   });
// };
