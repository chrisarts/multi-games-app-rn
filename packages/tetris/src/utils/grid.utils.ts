import { getDeviceDimensions } from '@games/shared';
import * as RA from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import * as HashSet from 'effect/HashSet';
import { GridBlock } from '../models/GridBlock.model';
import { GridCell, type GridCellLayout } from '../models/GridCell.model';
import { GridPosition } from '../models/GridPosition.model';
import { GridBlockNames } from './constants.utils';

export interface GridLayout {
  initialPosition: GridPosition;
  cell: GridCellLayout;
  canvas: {
    width: number;
    height: number;
  };
  config: {
    rows: number;
    columns: number;
  };
}

export const getRandomShape = (initialPosition: { x: number; y: number }): GridBlock =>
  new GridBlock(
    GridBlockNames[Math.floor(Math.random() * GridBlockNames.length)],
    GridPosition.create(initialPosition),
  );

export const createGrid = ({ config, cell }: GridLayout) =>
  HashSet.fromIterable(
    RA.flatten(
      RA.makeBy(config.columns, (col) =>
        RA.makeBy(
          config.rows,
          (row) => new GridCell(GridPosition.create({ x: row, y: col }), cell),
        ),
      ),
    ),
  ).pipe(
    HashSet.map((cell) => [cell.point, cell] as const),
    HashMap.fromIterable,
  );

export const getGridLayout = (colsNumber: number, rowsNumber: number): GridLayout => {
  const { HEIGHT, WIDTH } = getDeviceDimensions();

  const spacing = 3;
  const squareContainerSize = WIDTH / colsNumber;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = HEIGHT;
  const canvasHeight = rowsNumber * squareContainerSize;

  return {
    initialPosition: GridPosition.create({
      x: 0,
      y: Math.floor(colsNumber / 3),
    }),
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
    config: { rows: rowsNumber, columns: colsNumber },
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};
