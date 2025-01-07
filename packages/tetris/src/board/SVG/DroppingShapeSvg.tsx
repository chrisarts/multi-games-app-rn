import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import type { BlockShape } from '../../models/Block.model';
import type { BoardPosition } from '../../models/Board.model';
import { TetrisShapeCellSvg } from './CellSvg';

interface DroppingShapeProps {
  shape: SharedValue<BlockShape>;
  position: SharedValue<BoardPosition>;
  size: number;
  padding: number;
  containerSize: number;
}
export const DroppingShape = ({
  position,
  shape,
  size,
  containerSize,
  padding,
}: DroppingShapeProps) => {
  useDerivedValue(() => {
    console.log('SHAPE: ', console.log('SHAPE: ', shape));
  });
  const color = useDerivedValue(() => shape.value.color);
  return shape.value.shape.map((row, rowIndex) => {
    return row.map((col, colIndex) => {
      if (col !== 0) {
        return (
          <TetrisShapeCellSvg
            key={`shape-${rowIndex}-${colIndex}`}
            height={size}
            width={size}
            coords={{ column: colIndex, row: rowIndex }}
            color={color}
            position={position}
            containerSize={containerSize}
            padding={padding}
          />
        );
      }
    });
  });
};
