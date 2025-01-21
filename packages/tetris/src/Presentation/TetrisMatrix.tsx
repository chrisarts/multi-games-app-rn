import {
  Group,
  Paragraph,
  RoundedRect,
  Skia,
  rect,
  rrect,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { GridConfig, TetrisAnimatedMatrix } from '../Domain/Grid.domain';

export const TetrisMatrixView = ({
  matrix,
  config,
}: { matrix: TetrisAnimatedMatrix[][]; config: GridConfig }) => {
  return (
    <Group>
      {matrix.map((row, i) => (
        <TetrisMatrixRowView
          key={`matrix-${row.length}-${i}`}
          row={row}
          config={config}
        />
      ))}
    </Group>
  );
};

const TetrisMatrixRowView = ({
  row,
  config,
}: { row: TetrisAnimatedMatrix[]; config: GridConfig }) => {
  return (
    <Group>
      {row.map((cell, i) => (
        <TetrisMatrixCellView
          key={`matrix-cell${row.length}-${i}`}
          cell={cell}
          config={config}
        />
      ))}
    </Group>
  );
};

const TetrisMatrixCellView = ({
  cell,
  config,
}: { cell: TetrisAnimatedMatrix; config: GridConfig }) => {
  const text = `${cell.point.x}:${cell.point.y}`;
  const paragraph = useMemo(() => {
    const p = Skia.ParagraphBuilder.Make();
    p.addText(text);
    return p.build();
  }, [text]);


  return (
    <Group style='fill'>
      <RoundedRect
        rect={rrect(
          rect(
            cell.point.x * config.cellContainerSize,
            cell.point.y * config.cellContainerSize,
            config.cellContainerSize - config.cellSpacing / 3,
            config.cellContainerSize - config.cellSpacing / 3,
          ),
          5,
          5,
        )}
        color={cell.color}
      />
      <Paragraph
        paragraph={paragraph}
        width={config.cellContainerSize - config.cellSpacing}
        x={cell.point.x * config.cellContainerSize + config.cellSize / text.length - 5}
        y={cell.point.y * config.cellContainerSize + config.cellSize / text.length}
      />
    </Group>
  );
};
