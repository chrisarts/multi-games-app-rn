import * as Sk from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { GRID } from '../../Data/Grid.data';
import * as TetrominoData from '../../Data/Tetrominos.data';
import * as Grid from '../../Domain/Grid.domain';
import * as Position from '../../Domain/Position.domain';
import type * as Tetromino from '../../Domain/Tetromino.domain';
import type { TetrominoTexture } from './textures.worklet';

const getShapePosition = (
  position: Position.Position,
  shape: SharedValue<TetrominoTexture>,
) => {
  'worklet';
  const shapePos = {
    left: position.x,
    right: Math.ceil(position.x + shape.value.bounds.width / 2),
    top: position.y,
    bottom: position.y + shape.value.bounds.height,
  };

  const shapeCoords = {
    left: Math.floor(shapePos.left / GRID.fullCellSize),
    right: Math.floor(shapePos.right / GRID.fullCellSize),
    top: Math.floor(shapePos.top / GRID.fullCellSize),
    bottom: Math.floor(shapePos.bottom / GRID.fullCellSize),
  };

  return {
    shapePos,
    shapeCoords,
  };
};

export const checkCollisions = (
  position: Position.Position,
  shape: SharedValue<TetrominoTexture>,
) => {
  'worklet';
  // const xSize = shape.value.bounds.width;
  // const left = Sk.sub(Sk.vec(position.x), Sk.vec(xSize / 2, 0)).x;
  // const right = Sk.sub(Sk.vec(GRID.gridRect.width - xSize / 2, 0), Sk.vec(position.x)).x;
  const { shapeCoords } = getShapePosition(position, shape);

  // const ySize = shape.value.bounds.height;

  return {
    wall: {
      left: shapeCoords.left === 0,
      top: shapeCoords.top === 0,
      right: shapeCoords.right >= GRID.columns,
      bottom: shapeCoords.bottom === GRID.rows,
    },
  };
};

const getMatrixPositions = (
  matrix: TetrominoData.TetrominoConfig['value'],
  sumPos = Position.zero(),
): Position.Position[] => {
  'worklet';
  return matrix
    .map((rows, x) => {
      'worklet';
      return rows.map((column, y) => {
        'worklet';
        if (column === 0) return null;
        return Position.sum(Position.of({ y: x, x: y }), sumPos);
      });
    })
    .flatMap((x) => x.filter((y) => y !== null));
};

const fromConfig = (config: TetrominoData.TetrominoConfig): Tetromino.Tetromino => {
  'worklet';
  const drawPositions = getMatrixPositions(config.value);

  return {
    drawPositions,
    name: config.name,
    color: config.color,
    matrix: config.value,
  };
};

export const getTetrominoByName = (
  name: TetrominoData.TetrominoConfig['name'],
): Tetromino.Tetromino => {
  'worklet';
  return fromConfig(TetrominoData.TetrominosData[name]);
};

export const getRandomTetromino = (): Tetromino.Tetromino => {
  'worklet';
  return getTetrominoByName(
    TetrominoData.TetrominoNames[
      Math.floor(Math.random() * TetrominoData.TetrominoNames.length)
    ],
  );
};

export const createTetrominoPath = (positions: Sk.SkPoint[]) => {
  'worklet';
  const path = Sk.Skia.Path.Make();
  for (const position of positions) {
    path.addRRect(Grid.createCellUIRRect(position));
  }
  return path;
};

export const tetrominoToUI = (tetromino: Tetromino.Tetromino): Tetromino.UITetromino => {
  'worklet';
  const position = Sk.vec(0, 0);
  const skPath = Sk.Skia.Path.Make();
  const vectors = tetromino.drawPositions.map(({ x, y }) =>
    Sk.vec(
      Math.floor(x * GRID.fullCellSize) + GRID.cellSpacing,
      Math.floor(y * GRID.fullCellSize) + GRID.cellSpacing,
    ),
  );
  const rects = vectors.map(({ x, y }) => Sk.rect(x, y, GRID.cellSize, GRID.cellSize));
  for (const square of rects) {
    skPath.addRRect(Sk.rrect(square, 5, 5));
  }

  return {
    color: tetromino.color,
    bounds: Sk.bounds(rects),
    vectors,
    rects,
    merged: false,
    position,
    skPath,
  };
};

export const getAllTetrominos = () => {
  'worklet';
  return TetrominoData.TetrominoNames.map((shape) => {
    const tetromino = getTetrominoByName(shape);
    const cells = tetromino.drawPositions.map((x) => Grid.createCellUIRRect(x));
    return {
      path: createTetrominoPath(tetromino.drawPositions),
      cells,
      tetromino,
    };
  });
};

export const getNextTetromino = (): Tetromino.UITetromino => {
  'worklet';
  return tetrominoToUI(getRandomTetromino());
};
