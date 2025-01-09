import {
  type CustomStore,
  createStore,
  getDeviceDimensions,
  keysOf,
} from '@games/shared';
import * as RA from 'effect/Array';
import * as HashMap from 'effect/HashMap';
import * as HashSet from 'effect/HashSet';
import * as SortedSet from 'effect/SortedSet';
import { BOARD_CONFIG } from '../utils/board.utils';
import type { BoardPosition } from './Board.model';
import { GridBlock, GridBlockShapes } from './GridBlock.model';
import { GridCell, type GridCellLayout, GridPoint } from './GridCell.model';

interface GridStore {
  collided: boolean;
  grid: HashMap.HashMap<GridPoint, GridCell>;
  gridPoints: SortedSet.SortedSet<GridPoint>;
  currentShape: GridBlock;
  nextShape: GridBlock;
  droppingBlockPosition: GridPoint;
}

export interface GridLayout {
  initialPosition: [x: number, y: number];
  cell: GridCellLayout;
  canvas: {
    width: number;
    height: number;
  };
}

export class GridModel {
  store: CustomStore<GridStore>;
  readonly layout: GridLayout;
  static blockNames = keysOf(GridBlockShapes);

  constructor(
    readonly config: { width: number; height: number } = {
      width: BOARD_CONFIG.WIDTH,
      height: BOARD_CONFIG.HEIGHT,
    },
  ) {
    this.layout = getGridLayout(config.width, config.height);

    const grid = createGrid({
      ...config,
      layout: this.layout,
    });
    this.store = createStore<GridStore>({
      grid,
      gridPoints: SortedSet.fromIterable(HashMap.keySet(grid), GridCell.order),
      currentShape: this.getRandomShape(),
      nextShape: this.getRandomShape(),
      droppingBlockPosition: GridPoint.create(...this.layout.initialPosition),
      collided: false,
    });
  }

  getRandomShape(): GridBlock {
    const randomKey =
      GridModel.blockNames[Math.floor(Math.random() * GridModel.blockNames.length)];
    return new GridBlock(randomKey, this.layout.initialPosition);
  }

  updateBoard(collide: boolean) {
    const { currentShape, grid, droppingBlockPosition } = this.store.getState();

    HashMap.forEach(grid, (cell) => cell.clear());
    currentShape.shape.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col !== 0) {
          const searchRow = rowIndex + droppingBlockPosition.x;
          const searchCol = colIndex + droppingBlockPosition.y;
          const cell = this.findBlockByPoint({
            x: searchRow,
            y: searchCol,
          });
          cell.setColorFor(currentShape);
        }
      });
    });

    this.store.setState((prev) => prev);
  }

  moveCurrentBlock(position: BoardPosition, collide: boolean) {
    this.store.setState((prev) => {
      prev.droppingBlockPosition = GridPoint.create(
        prev.droppingBlockPosition.x + position.x,
        prev.droppingBlockPosition.y + position.y,
      );
      return prev;
    });
    this.updateBoard(collide);
  }

  findBlockByPoint(point: Pick<GridPoint, 'x' | 'y'>) {
    return HashMap.unsafeGet(
      this.store.getState().grid,
      GridPoint.create(point.x, point.y),
    );
  }
}

const createGrid = (config: {
  width: number;
  height: number;
  layout: GridLayout;
}) =>
  HashSet.fromIterable(
    RA.flatten(
      RA.makeBy(config.width, (col) =>
        RA.makeBy(
          config.height,
          (row) => new GridCell(GridPoint.create(row, col), config.layout.cell),
        ),
      ),
    ),
  ).pipe(
    HashSet.map((cell) => [cell.point, cell] as const),
    HashMap.fromIterable,
  );

const getGridLayout = (colsNumber: number, rowsNumber: number): GridLayout => {
  const { HEIGHT, WIDTH } = getDeviceDimensions();

  const spacing = 3;
  const squareContainerSize = WIDTH / colsNumber;
  const squareSize = squareContainerSize - spacing;

  const canvasWidth = HEIGHT;
  const canvasHeight = rowsNumber * squareContainerSize;

  return {
    initialPosition: [0, Math.floor(colsNumber / 3)],
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
    },
    cell: {
      containerSize: squareContainerSize,
      size: squareSize,
      spacing,
    },
  };
};
