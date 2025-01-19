import * as Sk from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import * as TetrominoData from '../../Data/Tetrominos.data';
import * as Grid from '../../Domain/Grid.domain';

const getShapePosition = (
  position: Sk.Vector,
  shape: SharedValue<Grid.TetrisGrid>,
  cellSize: number,
) => {
  'worklet';
  const bounds = Sk.bounds(shape.value.cells);
  const shapePos = {
    left: position.x,
    right: Math.ceil(position.x + bounds.width / 2),
    top: position.y,
    bottom: Math.floor(position.y + bounds.height),
  };

  const shapeCoords = {
    left: Math.floor(shapePos.left / cellSize),
    right: Math.floor(shapePos.right / cellSize),
    top: Math.floor(shapePos.top / cellSize),
    bottom: Math.floor(shapePos.bottom / cellSize),
  };

  return {
    shapePos,
    shapeCoords,
  };
};

export const checkCollisions = (
  position: Sk.Vector,
  shape: SharedValue<Grid.TetrisGrid>,
  gridConfig: Grid.GridConfig,
) => {
  'worklet';
  const { shapeCoords, shapePos } = getShapePosition(
    position,
    shape,
    gridConfig.cellContainerSize,
  );

  return {
    shapePos,
    shapeCoords,
    wall: {
      left: shapeCoords.left === 0,
      top: shapeCoords.top === 0,
      right: shapeCoords.right >= gridConfig.columns,
      bottom: shapeCoords.bottom >= gridConfig.rows,
    },
  };
};

export const getAllTetrominos = (gridConfig: Grid.GridConfigInput, cellSize: number) => {
  'worklet';
  return Object.values(TetrominoData.TetrominosData).map((shape) => {
    return mapToTetrisGrid(shape, gridConfig, cellSize, shape._tag);
  });
};

const mapToTetrisGrid = (
  shape: TetrominoData.TetrominoConfig,
  gridConfig: Grid.GridConfigInput,
  cellSize: number,
  name: string,
): Grid.TetrisGrid => {
  'worklet';
  const vectors = shape.value
    .flatMap((_, y) => _.map((col, x) => (col === 1 ? Sk.vec(x, y) : null)))
    .filter((x) => x !== null)
    .sort((v1, v2) => v1.x - v2.x);

  // const rects = vectors.map((vector) => Grid.getCellUIRect(vector, cellSize));

  return {
    name,
    // bounds: Sk.bounds(rects.flat()),
    color: shape.color,
    cells: vectors.map((vector) => Grid.getCellUIRect(vector, cellSize)),
    matrix: shape.value,
    position: Sk.vec(Math.floor((gridConfig.columns * cellSize) / 2), 0),
    // rects,
    vectors,
    // skPath: Grid.createGridUIPath(rects),
  };
};

export const getRandomTetromino = (
  gridConfig: Grid.GridConfigInput,
  cellSize: number,
): Grid.TetrisGrid => {
  'worklet';
  const shape =
    TetrominoData.TetrominosData[
      TetrominoData.TetrominoNames[
        Math.floor(Math.random() * TetrominoData.TetrominoNames.length)
      ]
    ];
  return mapToTetrisGrid(shape, gridConfig, cellSize, shape._tag);
};

// export const mergeTetromino = (merge: {
//   texture: SharedValue<Sk.SkImage | null>;
//   current: SharedValue<Grid.TetrisGrid>;
//   merged: SharedValue<Grid.TetrisGrid[]>;
//   next: Grid.TetrisGrid;
//   config: Grid.GridConfig;
// }) => {
//   'worklet';
//   const surface = Sk.Skia.Surface.MakeOffscreen(merge.config.width, merge.config.width)!;
//   const canvas = surface.getCanvas();

//   const paint = Sk.Skia.Paint();
//   paint.setColor(Sk.Skia.Color(merge.next.color));
//   paint.setStyle(Sk.PaintStyle.Fill);
//   for (const cell of merge.next.vectors.map((x) =>
//     Grid.getCellUIRect(x, merge.config.cellContainerSize),
//   )) {
//     canvas.drawRRect(Sk.rrect(cell, 5, 5), paint);
//   }

//   // for (const shape of merge.merged.value) {
//   //   const skPath = Sk.Skia.Path.Make();
//   //   for (const cell of merge.next.vectors.map((x) =>
//   //     Grid.getCellUIRect(x, merge.config.cellContainerSize),
//   //   )) {
//   //     skPath.addRRect(Sk.rrect(cell, 5, 5));
//   //   }

//   //   // skPath.offset(shape.position.x, shape.position.y);

//   //   const paint = Sk.Skia.Paint();
//   //   paint.setStyle(Sk.PaintStyle.Fill);
//   //   paint.setColor(Sk.Skia.Color(shape.color));
//   //   canvas.drawPath(skPath, paint);
//   // }

//   surface.flush();
//   merge.texture.value = surface.makeImageSnapshot();
//   merge.current.value = merge.next;
// };

// export const drawMergedShapes = (
//   mergedShapes: SharedValue<Grid.TetrisGrid[]>,
//   texture: SharedValue<Sk.SkImage | null>,
//   config: Grid.GridConfig,
// ) => {
//   'worklet';
//   const surface = Sk.Skia.Surface.MakeOffscreen(config.width, config.width)!;
//   const canvas = surface.getCanvas();

//   for (const merged of mergedShapes.value) {
//     const paint = Sk.Skia.Paint();
//     paint.setColor(Sk.Skia.Color(merged.color));
//     paint.setStyle(Sk.PaintStyle.Fill);
//     for (const cell of merged.vectors.map((x) =>
//       Grid.getCellUIRect(x, config.cellContainerSize),
//     )) {
//       canvas.drawRRect(Sk.rrect(cell, 5, 5), paint);
//     }
//   }

//   surface.flush();
//   texture.value = surface.makeImageSnapshot();
// };

// export const tetrominoToUI = (tetromino: Tetromino.Tetromino): Tetromino.UITetromino => {
//   'worklet';
//   const position = Sk.vec(0, 0);
//   const skPath = Sk.Skia.Path.Make();
//   const vectors = tetromino.drawPositions.map(({ x, y }) =>
//     Sk.vec(
//       Math.floor(x * GRID.fullCellSize) + GRID.cellSpacing,
//       Math.floor(y * GRID.fullCellSize) + GRID.cellSpacing,
//     ),
//   );
//   const rects = vectors.map(({ x, y }) => Sk.rect(x, y, GRID.cellSize, GRID.cellSize));
//   for (const square of rects) {
//     skPath.addRRect(Sk.rrect(square, 5, 5));
//   }

//   return {
//     color: tetromino.color,
//     bounds: Sk.bounds(rects),
//     vectors,
//     rects,
//     merged: false,
//     position,
//     skPath,
//   };
// };

// export const getNextTetromino = (): Tetromino.UITetromino => {
//   'worklet';
//   return tetrominoToUI(getRandomTetromino());
// };
