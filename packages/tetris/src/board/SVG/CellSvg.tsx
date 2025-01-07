import { RoundedRect,vec } from '@shopify/react-native-skia';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { BoardMatrix, BoardPosition } from '../../models';
import { getBlockShape } from '../../utils';

interface TetrisCellSvgProps {
  board: SharedValue<BoardMatrix>;
  coords: BoardPosition;
  size?: 'small' | 'normal';
}

export const cellDefaultColor = 'rgba(131, 126, 126, 0.3)';

export const TetrisCellSvg = ({
  board,
  coords,
  height,
  width,
  x,
  y,
}: TetrisCellSvgProps & {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  
  const color = useDerivedValue(() => {
    const cell = board.value[coords.row][coords.column];
    if (cell[0]) {
      return getBlockShape(cell[0]).color;
    }
    return cellDefaultColor;
  });

  return <RoundedRect x={x} y={y} width={width} height={height} color={color} r={5} />;
};

interface TetrisShapeCellSvgProps {
  position: SharedValue<BoardPosition>;
  width: number;
  height: number;
  color: SharedValue<string>;
  containerSize: number;
  padding: number;
  coords: BoardPosition;
}
export const TetrisShapeCellSvg = ({
  coords,
  color,
  height,
  width,
  position,
  containerSize,
  padding,
}: TetrisShapeCellSvgProps) => {
  const coordinate = useDerivedValue(() => {
    return {
      x: (coords.column + position.value.column) * containerSize + padding / 2,
      y: (coords.row + position.value.row) * containerSize + padding / 2,
    };
  });
  const x = useDerivedValue(() => coordinate.value.x);
  const y = useDerivedValue(() => coordinate.value.y);

  return <RoundedRect x={x} y={y} width={width} height={height} color={color} r={5} />;
};
