import { type SkPoint, add, point } from '@shopify/react-native-skia';
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { createGame } from '../../Domain/Game.domain';
import type { TetrisAnimatedMatrix, TetrisGrid } from '../../Domain/Grid.domain';
import { timing, useAnimation, wait, waitUntil } from './animation.hooks';

const { getRandomShapeIndex, gridConfig, tetrisGrid, allShapes } = createGame();

export const useAnimatedGame = () => {
  const { position, tetromino, collided, grid } = useGame();

  return {
    position: position,
    tetromino,
    tetrisGrid,
    collided,
    grid,
  };
};

const useGame = () => {
  const { getMatrixCellAt, shapeCollisionsAt, mergeShapeAt, matrix } = useGridMatrix();
  const speed = useSharedValue(800);
  const shapeIndex = useSharedValue(getRandomShapeIndex());
  const gameOver = useSharedValue(false);
  const running = useSharedValue(true);
  const position = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const resetPosition = () => {
    'worklet';
    position.x.value = 0;
    position.y.value = 0;
  };

  const currentShape = useDerivedValue(() => allShapes[shapeIndex.value]);
  const color = useDerivedValue(() => currentShape.value.color);
  const cells = useDerivedValue(() => currentShape.value.cells);

  const collided = useDerivedValue(() => {
    const currentPoint = point(position.x.value, position.y.value);
    if (!Number.isInteger(currentPoint.x) || !Number.isInteger(currentPoint.y)) {
      return false;
    }
    const cell = getMatrixCellAt(currentPoint);
    if (!cell) console.log('COLLIDED');
    return !!cell;
  });

  useAnimation(function* () {
    'worklet';
    let to = position.y.value + 1;
    while (true) {
      const collisions = shapeCollisionsAt({ x: position.x.value, y: to }, currentShape);

      if (!collisions.outsideGrid && !collisions.merge) {
        yield* timing(position.y, { to, duration: 100 });
        to = to + 1;
      }

      if (collisions.merge) {
        console.log('CHECK', collisions);
        mergeShapeAt(point(position.x.value, position.y.value), currentShape);
        resetPosition();
        shapeIndex.value = getRandomShapeIndex();
        to = 1;

        if (!collisions.outsideGrid && collisions.at.y <= 1) {
          console.log('GAME_OVER', collisions);
          gameOver.value = true;
          running.value = false;
          yield* waitUntil(running);
        }
      }

      yield* wait(speed.value);
    }
  });

  return {
    position,
    speed,
    collided,
    resetPosition,
    tetromino: {
      cells,
      color,
    },
    grid: {
      matrix,
      gridConfig,
    },
  };
};

const useGridMatrix = () => {
  const matrix: TetrisAnimatedMatrix[][] = tetrisGrid.matrix.map((row, iy) =>
    row.map((column, ix) => ({
      point: point(ix, iy),
      value: useSharedValue(column),
      color: useSharedValue('rgba(131, 126, 126, 0.3)'),
    })),
  );

  const getMatrixCellAt = (point: SkPoint) => {
    'worklet';
    const row = matrix[point.y];
    if (!row) return undefined;
    const cell = row[point.x];

    return cell;
  };

  const shapeCollisionsAt = (at: SkPoint, shape: SharedValue<TetrisGrid>) => {
    'worklet';
    for (const shapeCell of shape.value.cells) {
      const gridPoint = add(at, shapeCell.point);
      const gridCell = getMatrixCellAt(gridPoint);
      if (shapeCell.value === 0) continue;

      if (!gridCell) {
        return {
          at: gridPoint,
          merge: gridPoint.y >= gridConfig.rows,
          outsideGrid: true,
        };
      }
      if (gridCell.value.value > 0) {
        return {
          at: gridPoint,
          merge: true,
          outsideGrid: false,
        };
      }
    }

    return {
      outsideGrid: false,
      merge: false,
      at: point(0, 0),
    };
  };

  const mergeShapeAt = (point: SkPoint, shape: SharedValue<TetrisGrid>) => {
    'worklet';
    for (const shapeCell of shape.value.cells) {
      const gridPoint = add(point, shapeCell.point);
      const gridCell = getMatrixCellAt(gridPoint);
      if (shapeCell.value === 0) continue;

      if (!gridCell) {
        throw new Error('merging at invalid position');
      }
      gridCell.color.value = shape.value.color;
      gridCell.value.value = shapeCell.value;
    }

    return matrix;
  };

  return {
    matrix,
    getMatrixCellAt,
    shapeCollisionsAt,
    mergeShapeAt,
  };
};
