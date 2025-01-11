import { getDeviceDimensions } from '@games/shared';
import * as RA from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import * as HashSet from 'effect/HashSet';
import type { BoardConfig } from '../models/BoardGrid.model';
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

export const getRandomShape = (): GridBlock =>
  new GridBlock(GridBlockNames[Math.floor(Math.random() * GridBlockNames.length)]);

export const createGrid = ({ config, cell }: GridLayout) =>
  HashSet.fromIterable(
    RA.flatten(
      RA.makeBy(config.columns, (col) =>
        RA.makeBy(
          config.rows,
          (row) => new GridCell(GridPosition.create({ row: row, column: col }), cell),
        ),
      ),
    ),
  ).pipe(
    HashSet.map((cell) => [cell.point, cell] as const),
    HashMap.fromIterable,
  );

export const getGridLayout = (config: BoardConfig): GridLayout => {
  const { HEIGHT, WIDTH } = getDeviceDimensions();

  const spacing = 3;
  const squareContainerSize = WIDTH / config.columns;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = HEIGHT;
  const canvasHeight = config.rows * squareContainerSize;

  return {
    initialPosition: GridPosition.create({
      row: 0,
      column: Math.floor(config.columns / 3),
    }),
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
    config: { rows: config.rows, columns: config.columns },
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};
