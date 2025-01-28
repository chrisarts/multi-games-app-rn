import {
  Group,
  Image,
  PaintStyle,
  RoundedRect,
  type SkHostRect,
  type SkRect,
  Skia,
  StrokeCap,
  StrokeJoin,
  Text,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import type { ReactNode } from 'react';
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { TetrominoColors } from '../Data/Tetrominos.data';
import { type GridMatrix, gridSizeToMatrix } from '../Domain/Grid.domain';
import type {
  TetrisBoardState,
  TetrisGameState,
  TetrisPlayerState,
} from '../Domain/Tetris.domain';
import { useTetrisFont } from './hooks/useTetrisFont';

interface BoardInfoProps {
  board: TetrisBoardState;
  game: TetrisGameState;
  player: TetrisPlayerState;
}

export const BoardInfo = ({ board, game, player }: BoardInfoProps) => {
  const { fontItalicBold } = useTetrisFont();
  const infoSquare = useDerivedValue(() => board.gridConfig.value.infoSquareRect);
  const nextShapesRect = useDerivedValue(() =>
    rect(
      board.gridConfig.value.infoSquareRect.x,
      board.gridConfig.value.content.y,
      infoSquare.value.width * 0.9,
      board.gridConfig.value.infoSquareRect.width * 2.5,
    ),
  );
  const linesRect = useDerivedValue(() =>
    rect(
      board.gridConfig.value.infoSquareRect.x,
      nextShapesRect.value.y * 1.1 + nextShapesRect.value.height,
      infoSquare.value.width * 0.9,
      board.gridConfig.value.infoSquareRect.width,
    ),
  );
  const scoreRect = useDerivedValue(() =>
    rect(
      board.gridConfig.value.infoSquareRect.x,
      linesRect.value.y + linesRect.value.height * 1.2,
      infoSquare.value.width * 0.9,
      board.gridConfig.value.infoSquareRect.width,
    ),
  );
  const maxPad = '000000';
  const lines = useDerivedValue(() => {
    const fullNumber = `${game.lines.value}`;
    const lessPad = maxPad.length - fullNumber.length;
    return fullNumber.padStart(lessPad, '0');
  });
  const level = useDerivedValue(() => {
    const fullNumber = `${game.level.value}`;
    const lessPad = maxPad.length - fullNumber.length;
    return fullNumber.padStart(lessPad, '0');
  });

  return (
    <Group>
      <BoardInfoRect contentRect={nextShapesRect} text='next'>
        <NextShapesImage container={nextShapesRect} playerState={player} />
      </BoardInfoRect>
      <BoardInfoRect contentRect={linesRect} text='Lines'>
        <Text text={lines} font={fontItalicBold} />
      </BoardInfoRect>
      <BoardInfoRect contentRect={scoreRect} text='Level'>
        <Text text={level} font={fontItalicBold} />
      </BoardInfoRect>
    </Group>
  );
};

interface NextShapesImageProps {
  playerState: TetrisPlayerState;
  container: SharedValue<SkHostRect>;
}

const NextShapesImage = ({ playerState, container }: NextShapesImageProps) => {
  const nextShapesImageRect = useDerivedValue(() =>
    rect(4, container.value.y * 0.25, container.value.width, container.value.height),
  );
  const gridMatrix = gridSizeToMatrix(
    { columns: 5, rows: 12 },
    nextShapesImageRect.value.height / 15,
  );
  const cellSize = useDerivedValue(() => nextShapesImageRect.value.height / 15);

  const image = useSharedValue(drawNextShapesGrid(container.value, gridMatrix));

  const shapesImage = useDerivedValue(() => {
    const surface = Skia.Surface.MakeOffscreen(
      nextShapesImageRect.value.width,
      nextShapesImageRect.value.height,
    );
    const canvas = surface?.getCanvas();
    let lastCellY = 0;
    for (const shape of playerState.bag.value) {
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
      <Image image={image} rect={nextShapesImageRect} />
      <Image image={shapesImage} rect={nextShapesImageRect} />
    </Group>
  );
};

const drawNextShapesGrid = (container: SkRect, gridMatrix: GridMatrix) => {
  // const cellSize = container.height / 15;
  const surface = Skia.Surface.Make(container.width, container.height);
  const canvas = surface?.getCanvas();

  for (const cell of gridMatrix.flat()) {
    const skPath = Skia.Path.Make();
    // skPath.addRRect(rrect(getCellUIRect(cell.point, cellSize), 3, 3));
    skPath.addRRect(rrect(cell, 3, 3));
    const paint = Skia.Paint();

    if (cell.value === 0) {
      paint.setStyle(PaintStyle.Stroke);
      paint.setColor(Skia.Color('white'));
      paint.setStrokeWidth(0.2);
      paint.setStrokeJoin(StrokeJoin.Round);
      paint.setStrokeCap(StrokeCap.Round);
      skPath.simplify();
      skPath.computeTightBounds();
    } else {
      paint.setColor(Skia.Color(TetrominoColors[cell.value]));
    }

    canvas?.drawPath(skPath, paint);
  }

  surface?.flush();
  return surface?.makeImageSnapshot() ?? null;
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
