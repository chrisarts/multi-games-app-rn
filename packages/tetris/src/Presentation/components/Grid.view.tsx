import * as Sk from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { GRID } from '../../Data/Grid.data';

export const TetrominoCellsView = ({
  cells,
  color,
}: { cells: Sk.SkHostRect[]; color: string }) => {
  return (
    <Sk.Group>
      {cells.map((rect) => (
        <Sk.Group key={`cell-${rect.x}:${rect.y}`}>
          <Sk.RoundedRect rect={Sk.rrect(rect, 5, 5)} color={color} width={GRID.cellSize} height={GRID.cellSize} />
          <GridDebugRowCol rect={rect} />
        </Sk.Group>
      ))}
    </Sk.Group>
  );
};

export const GridDebugView = ({
  cells,
  color,
}: { cells: SharedValue<Sk.SkHostRect[]>; color: SharedValue<string> }) => {
  return (
    <Sk.Group>
      {cells.get().map((rect) => (
        <Sk.Group key={`cell-${rect.x}:${rect.y}`}>
          <Sk.RoundedRect rect={Sk.rrect(rect, 5, 5)} color={color} />
          <GridDebugRowCol rect={rect} />
        </Sk.Group>
      ))}
    </Sk.Group>
  );
};

const GridDebugRowCol = ({ rect }: { rect: Sk.SkRect }) => {
  const text = `${Math.floor(rect.x / GRID.cellSize)}:${Math.floor(rect.y / GRID.cellSize)}`;

  const paragraph = useMemo(
    () => Sk.Skia.ParagraphBuilder.Make().addText(text).build(),
    [text],
  );
  return (
    <Sk.Paragraph
      width={rect.width}
      x={rect.x + GRID.cellSize / text.length - 3}
      y={rect.y + GRID.cellSize / text.length - 1}
      color='white'
      paragraph={paragraph}
    />
  );
};
