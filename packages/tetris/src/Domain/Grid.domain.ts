import * as HashMap from 'effect/HashMap';
import * as Cell from './Cell.domain';
import * as GridBound from './GridBound.domain';
import * as GridLayout from './Layout.domain';
import * as Position from './Position.domain';

export interface GridState {
  positions: Position.Position[];
  cellsMap: HashMap.HashMap<Position.Position, Cell.Cell>;
  animatedCells: Cell.AnimatedCellState[];
  layout: GridLayout.GridLayout;
  bounds: GridBound.GridBound;
}

export const makeGridState = ({ screen, size }: GridLayout.GridConfig): GridState => {
  const layout = getGridLayout({ screen, size });
  const positions: Position.Position[] = [];
  const cells = GridLayout.makeBy((position): [Position.Position, Cell.Cell] => {
    positions.push(position);
    return [position, Cell.makeCell(position)];
  })(size);

  return {
    positions: positions,
    animatedCells: [],
    cellsMap: HashMap.fromIterable(cells),
    layout,
    bounds: getGridBounds(layout),
  };
};

export const getGridBounds = (layout: GridLayout.GridConfig) =>
  GridBound.of({
    max: Position.of({
      row: layout.size.rows - 1,
      column: layout.size.columns - 1,
    }),
    min: Position.zero(),
  });

export const getGridLayout = ({
  screen,
  size,
}: GridLayout.GridConfig): GridLayout.GridLayout => {
  const { height, width } = screen;

  const spacing = 3;
  const squareContainerSize = width / size.columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = height;
  const canvasHeight = size.rows * squareContainerSize;

  const midX = Math.floor(size.columns / 3);
  return {
    screen,
    size,
    initialPosition: Position.of({ row: 0, column: midX }),
    canvas: { width: canvasWidth, height: canvasHeight },
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};
