import {
  Group,
  Image,
  RoundedRect,
  type SkHostRect,
  Skia,
  Text,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import type { GridConfig } from '../Domain/Grid.domain';
import type { TetrisGameState } from '../Domain/Tetris.domain';
import type { Tetromino } from '../Domain/Tetromino.domain';
import { useTextInfoRect } from './hooks/useInfoRect';
import { useTetrisFont } from './hooks/useTetrisFont';

interface BoardInfoProps {
  gridConfig: SharedValue<GridConfig>;
  game: TetrisGameState;
  tetrominosBag: SharedValue<Tetromino[]>;
}

export const BoardInfo = ({ gridConfig, game, tetrominosBag }: BoardInfoProps) => {
  const { fontItalicBold } = useTetrisFont();
  const infoSquare = useDerivedValue(() => gridConfig.value.infoSquareRect);
  const nextShapesRect = useDerivedValue(() =>
    rect(
      gridConfig.value.infoSquareRect.x,
      gridConfig.value.content.y,
      infoSquare.value.width * 0.9,
      gridConfig.value.infoSquareRect.width * 2.5,
    ),
  );

  const lines = useTextInfoRect(game.lines, nextShapesRect, infoSquare);
  const level = useTextInfoRect(game.level, lines.skRect, infoSquare);
  const score = useTextInfoRect(game.level, level.skRect, infoSquare);

  return (
    <Group>
      <BoardInfoRect contentRect={nextShapesRect} text='next'>
        <NextShapesImage container={nextShapesRect} tetrominosBag={tetrominosBag} />
      </BoardInfoRect>
      <BoardInfoRect contentRect={lines.skRect} text='Lines'>
        <Text text={lines.text} font={fontItalicBold} transform={lines.translate} />
      </BoardInfoRect>
      <BoardInfoRect contentRect={level.skRect} text='Level'>
        <Text text={level.text} font={fontItalicBold} transform={level.translate} />
      </BoardInfoRect>
      <BoardInfoRect contentRect={score.skRect} text='Score'>
        <Text text={score.text} font={fontItalicBold} transform={score.translate} />
      </BoardInfoRect>
    </Group>
  );
};

interface NextShapesImageProps {
  tetrominosBag: SharedValue<Tetromino[]>;
  container: SharedValue<SkHostRect>;
}

const NextShapesImage = ({ tetrominosBag, container }: NextShapesImageProps) => {
  const nextShapesImageRect = useDerivedValue(() =>
    rect(4, container.value.y * 0.25, container.value.width, container.value.height),
  );
  // const gridMatrix = gridSizeToMatrix(
  //   { columns: 5, rows: 12 },
  //   nextShapesImageRect.value.height / 15,
  // );
  const cellSize = useDerivedValue(() => nextShapesImageRect.value.height / 15);

  // const image = useSharedValue(drawNextShapesGrid(container.value, gridMatrix));

  const shapesImage = useDerivedValue(() => {
    const surface = Skia.Surface.MakeOffscreen(
      nextShapesImageRect.value.width,
      nextShapesImageRect.value.height,
    );
    const canvas = surface?.getCanvas();
    let lastCellY = 0;
    for (const shape of tetrominosBag.value) {
      const path = Skia.Path.Make();
      const maxY = shape.shape.sort((a, b) => b.y - a.y)[0].y;
      const midX = Math.round(shape.shape.sort((a, b) => b.y - a.y)[0].x / 2);
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(shape.color));

      for (const cell of shape.shape) {
        const drawRect = rect(
          (cell.x + midX) * cellSize.value,
          (cell.y + lastCellY) * cellSize.value,
          cellSize.value - 1,
          cellSize.value - 1,
        );
        path.addRRect(rrect(drawRect, 3, 3));
      }
      canvas?.drawPath(path, paint);
      lastCellY += maxY + 2;
    }
    surface?.flush();
    return surface?.makeImageSnapshot() ?? null;
  });

  return (
    <Group>
      {/* <Image image={image} rect={nextShapesImageRect} /> */}
      <Image image={shapesImage} rect={nextShapesImageRect} />
    </Group>
  );
};

interface BoardInfoRectProps {
  text: string;
  contentRect: SharedValue<SkHostRect>;
  children?: ReactNode;
}

const BoardInfoRect = ({ text, contentRect, children }: BoardInfoRectProps) => {
  const { fontItalicBold } = useTetrisFont();

  const textMeasure = useDerivedValue(
    () =>
      fontItalicBold?.measureText(text) ?? rect(0, 0, 18 * text.length, 18 * text.length),
  );
  const textTransform = useDerivedValue(() => [
    {
      translate: [
        contentRect.value.width / 2 - textMeasure.value.width / 2,
        (fontItalicBold?.getSize()! ?? 18) * 1.5,
      ] as const,
    },
  ]);

  const rounded = useDerivedValue(() =>
    rrect(rect(0, 0, contentRect.value.width, contentRect.value.height), 5, 5),
  );
  const translate = useDerivedValue(() => [
    {
      translate: [contentRect.value.x, contentRect.value.y] as const,
    },
  ]);

  return (
    <Group color='lightGray' transform={translate}>
      <Text text={text} font={fontItalicBold} color='white' transform={textTransform} />
      <RoundedRect rect={rounded} style='stroke' />
      {children}
    </Group>
  );
};

// const drawNextShapesGrid = (container: SkRect, gridMatrix: GridMatrix) => {
//   const cellSize = container.height / 15;
//   const surface = Skia.Surface.Make(container.width, container.height);
//   const canvas = surface?.getCanvas();

//   for (const cell of gridMatrix.flat()) {
//     const skPath = Skia.Path.Make();
//     const skRect = rect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
//     skPath.addRRect(rrect(skRect, 3, 3));
//     const paint = Skia.Paint();

//     if (cell.value === 0) {
//       paint.setStyle(PaintStyle.Stroke);
//       paint.setColor(Skia.Color('white'));
//       paint.setStrokeWidth(0.2);
//       paint.setStrokeJoin(StrokeJoin.Round);
//       paint.setStrokeCap(StrokeCap.Round);
//       skPath.simplify();
//       skPath.computeTightBounds();
//     } else {
//       paint.setColor(Skia.Color(TetrominoColors[cell.value]));
//     }

//     canvas?.drawPath(skPath, paint);
//   }

//   surface?.flush();
//   return surface?.makeImageSnapshot() ?? null;
// };
