import * as Sk from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  type GridConfig,
  type TetrisGrid,
  getCellUIRect,
} from '../../Domain/Grid.domain';

interface GridProps {
  grid: SharedValue<TetrisGrid>;
  config: GridConfig;
}
export const TetrisGridView = ({ grid, config }: GridProps) => {
  return (
    <Sk.Group>
      {grid.get().vectors.map((point) => (
        <Sk.Group key={`cell-${point.x}:${point.y}`}>
          <Sk.RoundedRect
            rect={Sk.rrect(getCellUIRect(point, config.cellContainerSize), 5, 5)}
            color={grid.value.color}
          />
          <GridDebugRowCol
            rect={getCellUIRect(point, config.cellContainerSize)}
            cellSize={config.cellContainerSize}
          />
        </Sk.Group>
      ))}
    </Sk.Group>
  );
};

export const TetrisGridCell = ({
  rect,
  color,
  debug,
  cellSize,
}: {
  rect: Sk.SkRect;
  color: SharedValue<string>;
  cellSize: number;
  debug?: boolean;
}) => {
  return (
    <Sk.Group>
      <Sk.RoundedRect rect={Sk.rrect(rect, 5, 5)} color={color} />
      {debug ? <GridDebugRowCol rect={rect} cellSize={cellSize} /> : null}
    </Sk.Group>
  );
};

const GridDebugRowCol = ({ rect, cellSize }: { rect: Sk.SkRect; cellSize: number }) => {
  const text = `${Math.floor(rect.x / cellSize)}:${Math.floor(rect.y / cellSize)}`;

  const paragraph = useMemo(
    () => Sk.Skia.ParagraphBuilder.Make().addText(text).build(),
    [text],
  );
  return (
    <Sk.Paragraph
      width={rect.width}
      x={rect.x + cellSize / text.length - 3}
      y={rect.y + cellSize / text.length}
      color='white'
      paragraph={paragraph}
    />
  );
};
