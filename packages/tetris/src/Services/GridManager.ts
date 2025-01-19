import * as Sk from '@shopify/react-native-skia';
import { Dimensions } from 'react-native';
import type * as Grid from '../Domain/Grid.domain';

export class GridManager {
  private layout: Grid.GridLayout;
  constructor() {
    this.layout = getGridLayout();
  }

  get cellSize() {
    return this.layout.cell.size;
  }
  get bounds() {
    return {
      topLeft: Sk.vec(0, 0),
      topRight: Sk.vec(this.layout.canvas.width, 0),
      bottomLeft: Sk.vec(0, this.layout.canvas.height),
      bottomRight: Sk.vec(this.layout.canvas.width, this.layout.canvas.height),
    };
  }
}

export const getGridLayout = (size = { rows: 15, columns: 10 }) => {
  const { width, height } = Dimensions.get('window');

  const spacing = 3;
  const squareContainerSize = width / size.columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = width;
  const canvasHeight = size.rows * (squareContainerSize - spacing / 3);

  const remainingSpace = height - canvasHeight;

  const midX = Math.floor(size.columns / 3);
  return {
    screen,
    size,
    initialPosition: Sk.point(midX, 0),
    canvas: { width: canvasWidth, height: canvasHeight },
    remainingSpace,
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};
