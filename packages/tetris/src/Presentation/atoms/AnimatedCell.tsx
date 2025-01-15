import { Group, Paragraph, RoundedRect } from '@shopify/react-native-skia';
import type * as Grid from '../../Domain/Grid.domain';
import type * as Position from '../../Domain/Position.domain';
import { useCellState } from '../hooks/useCell';

interface CellViewProps {
  position: Position.Position;
  cellLayout: Grid.CellLayout;
}

export const TetrisCellSvg = ({ cellLayout, position }: CellViewProps) => {
  const { cellState, paragraph, dimensions } = useCellState(position, cellLayout);

  return (
    <Group>
      <RoundedRect
        height={dimensions.height}
        width={dimensions.width}
        r={5}
        x={dimensions.x}
        y={dimensions.y}
        style='fill'
        color={cellState.color}
      />
      <Paragraph
        paragraph={paragraph}
        width={cellLayout.size * 0.9}
        x={dimensions.x + cellLayout.spacing}
        y={dimensions.y + cellLayout.spacing}
      />
    </Group>
  );
};
