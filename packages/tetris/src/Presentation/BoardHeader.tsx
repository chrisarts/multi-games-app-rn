import {
  FillType,
  Group,
  PaintStyle,
  Path,
  RoundedRect,
  type SkImage,
  Skia,
  StrokeCap,
  StrokeJoin,
  rect,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { type TetrisGrid, gridSizeToMatrix } from '../Domain/Grid.domain';
import type { TetrisBoardState, TetrisGameState } from '../Domain/Tetris.domain';
import { useTetrisFont } from './hooks/useTetrisFont';

interface BoardHeaderProps {
  board: TetrisBoardState;
  game: TetrisGameState;
}

export const BoardHeader = ({ board, game }: BoardHeaderProps) => {
  const nextShapeGrid = useSharedValue(gridSizeToMatrix({ columns: 6, rows: 5 }));

  const { fontItalicBold } = useTetrisFont();
  const squareWidth = useDerivedValue(
    () => board.gridConfig.value.infoSquareRect.width * 0.8,
  );
  const squareHeight = useDerivedValue(() => squareWidth.value * 1.3);
  const nextShapeImage = useSharedValue<SkImage | null>(null);
  const nextShapeColor = useDerivedValue(() => board.tetromino.next.value.color);

  useAnimatedReaction(
    () => board.tetromino.next,
    (shape) => {
      nextShapeGrid.value = gridSizeToMatrix({ columns: 6, rows: 5 });
      for (const cell of shape.value.cellsMatrix.flat()) {
        if (cell.value === 0) continue;
        nextShapeGrid.value[cell.point.y][cell.point.x] = {
          color: cell.color,
          point: cell.point,
          value: 1,
        };
      }

      const surface = Skia.Surface.Make(
        board.gridConfig.value.screen.width * 2,
        board.gridConfig.value.size.height,
      );
      const canvas = surface?.getCanvas();
      const cellSize = squareWidth.value * 2;
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(shape.value.color));
      const skPath = getShapePath(shape.value, cellSize);
      canvas?.drawPath(skPath, paint);

      // canvas?.drawPath(skPath, paint);

      surface?.flush();

      nextShapeImage.value = surface?.makeImageSnapshot() ?? null;
    },
  );

  const nextShapePath = usePathValue((skPath) => {
    'worklet';
    const cellSize = squareWidth.value / nextShapeGrid.value.length;
    for (const cell of nextShapeGrid.value.flat()) {
      if (cell.value === 0) continue;
      skPath.addRRect(
        rrect(
          rect(
            (cell.point.x + 1) * cellSize,
            (cell.point.y + 1) * cellSize,
            cellSize - 1,
            cellSize - 1,
          ),
          3,
          3,
        ),
      );
    }
  });

  const textPath = usePathValue((skPath) => {
    'worklet';

    const container = rect(
      0,
      squareWidth.value * -0.4,
      squareWidth.value,
      squareWidth.value * 0.3,
    );
    skPath.addRRect(rrect(container, 3, 3));

    if (fontItalicBold) {
      const text = Skia.Path.MakeFromText(
        'Next',
        squareWidth.value * 0.25,
        squareWidth.value * -0.17,
        fontItalicBold,
      );
      if (text) {
        text.stroke({
          cap: StrokeCap.Round,
          join: StrokeJoin.Round,
        });
        text.setFillType(FillType.InverseEvenOdd);
        skPath.addPath(text);
      }
    }
  });

  if (!fontItalicBold) {
    return null;
  }
  const textPaint = Skia.Paint();
  textPaint.setColor(Skia.Color('white'));
  textPaint.setStyle(PaintStyle.Fill);
  return (
    <Group
      transform={[
        {
          translateY: board.gridConfig.value.content.y * 2,
        },
      ]}
    >
      <RoundedRect
        rect={rrect(
          rect(0, squareWidth.value * -0.2, squareWidth.value, squareHeight.value),
          5,
          5,
        )}
        color='white'
        style='stroke'
      />
      <Path
        path={textPath}
        color='white'
        fillType='evenOdd'
        paint={textPaint}
        // x={board.gridConfig.value.content.x * 0.2}
        // y={board.gridConfig.value.content.y * -0.2}
      />
      <Path path={nextShapePath} color={nextShapeColor} />
    </Group>
  );
};
const getShapePath = (nextShape: TetrisGrid, cellSize: number) => {
  'worklet';
  const skPath = Skia.Path.Make();
  for (const cell of nextShape.cellsMatrix.flat()) {
    if (cell.value === 0) continue;
    skPath.addRRect(
      rrect(
        rect(
          (cell.point.x + nextShape.position.x) * cellSize,
          (cell.point.y * cellSize + 1),
          cellSize - 4,
          cellSize - 4,
        ),
        3,
        3,
      ),
    );
  }

  return skPath;
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
