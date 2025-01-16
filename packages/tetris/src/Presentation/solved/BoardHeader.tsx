import {
  FillType,
  Group,
  Path,
  Skia,
  StrokeCap,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { makeGridState } from '../../Domain/Grid.domain';
import * as Position from '../../Domain/Position.domain';
import { getTetrominoInitialPos } from '../../Domain/Tetromino.domain';
import { useGameStore } from '../hooks/useStore';
import { useTetrominoPath } from '../hooks/useTetromino';
import { calculateUICellDraw } from '../worklets/cell.worklet';

export const BoardHeader = ({ insets }: { insets: EdgeInsets }) => {
  const lines = useGameStore((x) => x.game.lines);
  const grid = useGameStore((x) => x.grid);

  const { cellsGrid, infoSquare } = useMemo(() => {
    const infoSquare = {
      width: grid.layout.screen.width / 3,
      height: grid.layout.screen.width / 3,
    };
    const cellsGrid = makeGridState({
      screen: infoSquare,
      size: {
        columns: 6,
        rows: 6,
      },
    }).layout;
    return {
      cellsGrid,
      infoSquare,
    };
  }, [grid]);

  const nextTetromino = useGameStore((x) => x.tetromino.next);

  const { tetrominoPath } = useTetrominoPath({
    layout: cellsGrid.cell,
    position: getTetrominoInitialPos(
      Position.of({ column: nextTetromino.bounds.max.column, row: 0 }),
      nextTetromino,
    ),
    tetromino: nextTetromino,
  });

  const cellSize = calculateUICellDraw(
    Position.of({ column: 3, row: 0 }),
    cellsGrid.cell,
  );

  const containerCells = useMemo(() => {
    const path = Skia.Path.Make();
    const cells = Array(3)
      .fill(null)
      .map((_, i) =>
        createCellContainer({
          ...infoSquare,
          spacing: cellsGrid.cell.spacing,
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
  }, [cellsGrid, infoSquare]);

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
