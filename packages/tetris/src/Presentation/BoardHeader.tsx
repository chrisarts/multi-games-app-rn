import {
  FillType,
  Group,
  Path,
  Skia,
  StrokeCap,
  processTransform3d,
  rect,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { getCellUIRect, getGridConfig, getGridLayout } from '../Domain/Grid.domain';
import * as Position from '../Domain/Position.domain';
import { getRandomTetromino } from '../Domain/Tetromino.domain';
import { useGameContext } from './context/GameContext';

const dimensions = Dimensions.get('window');
export const BoardHeader = ({ insets }: { insets: EdgeInsets }) => {
  const squareGrid = getGridConfig(
    dimensions.width / 3,
    { columns: 5, rows: 5 },
    { showEmptyCells: false },
  );
  const cellLayout = getGridLayout(squareGrid, squareGrid);

  const nextTetromino = getRandomTetromino(squareGrid, squareGrid.cellContainerSize);

  const skShapePath = usePathValue((skPath) => {
    'worklet';
    for (const cell of nextTetromino.cellsMatrix.flat()) {
      if (cell.value === 0) continue;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, squareGrid.cellContainerSize), 5, 5),
      );
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            nextTetromino.position.x * squareGrid.cellContainerSize,
            nextTetromino.position.y * squareGrid.cellContainerSize,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  const containerCells = useMemo(() => {
    const path = Skia.Path.Make();
    const cells = Array(3)
      .fill(null)
      .map((_, i) =>
        createCellContainer({
          ...squareGrid,
          spacing: squareGrid.cellSpacing,
          index: i,
        }),
      );
    for (const cell of cells) {
      path.addPath(cell);
    }
    path.setFillType(FillType.InverseEvenOdd);
    path.stroke({ width: 1, cap: StrokeCap.Round, precision: 10 });
    path.simplify();
    path.close();
    return path;
  }, [squareGrid]);

  return (
    <Group transform={[{ translateY: insets.top }]}>
      <Path style='stroke' path={containerCells} color={nextTetromino.color} />
    </Group>
  );
};

const createCellContainer = ({
  height,
  spacing,
  width,
  index,
}: {
  spacing: number;
  width: number;
  height: number;
  index: number;
}) => {
  const path = Skia.Path.Make();
  const container = rect(
    width * index + spacing * 2,
    0,
    width - spacing * 4,
    height - height / 3,
  );
  path.addRRect(rrect(container, 5, 5));

  return path;
};

// const squaresPath = useMemo(() => {
//   const path = Skia.Path.Make();
//   const lines = rect(layout.cell.spacing / 3, 0, width - layout.cell.spacing, height);
//   const shape = rect(
//     width + layout.cell.spacing / 3,
//     0,
//     width - layout.cell.spacing,
//     height,
//   );
//   const score = rect(
//     width * 2 + layout.cell.spacing / 3,
//     0,
//     width - layout.cell.spacing,
//     height,
//   );

//   path.addRRect(rrect(lines, 5, 5));
//   path.addRRect(rrect(shape, 5, 5));
//   path.addRRect(rrect(score, 5, 5));
//   path.setFillType(FillType.EvenOdd);
//   path.transform(processTransform2d([]));
//   path.stroke({ width: 2 });

//   const shapeCenter = center(shape);
//   tetrominoPath.transform(
//     processTransform2d([
//       {
//         scale: 0.8,
//       },
//       {
//         translate: [
//           shapeCenter.x + tetrominoPath.getBounds().width - layout.cell.size,
//           shapeCenter.y + tetrominoPath.getBounds().y + layout.cell.size * 2,
//         ],
//       },
//     ]),
//   );
//   tetrominoPath.stroke({ width: 2 });
//   tetrominoPath.setFillType(FillType.InverseEvenOdd);
//   tetrominoPath.simplify();
//   path.addPath(tetrominoPath);
//   path.close();
//   return path;
// }, [width, height, insets, tetrominoPath, layout]);
