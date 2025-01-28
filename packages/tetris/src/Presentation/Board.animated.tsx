import { Canvas, Group, Image, ImageSVG, Path } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';
import { useGameControls } from './hooks/useGameControls';
import { useTetris } from './hooks/useTetris';
import { useTetrominoSkPath } from './hooks/useTetrominoSkPath';

export const AnimatedBoard = () => {
  const { gestures, board, game, player, ghostShapeSkPath, dropPosition } = useTetris();
  const { skShapePath } = useTetrominoSkPath(
    player.tetromino,
    player.position,
    board.gridConfig.value.cell,
  );
  const { platButton } = useGameControls(game, board);
  const tetrominoColor = useDerivedValue(() => player.tetromino.value.color);

  const translateGhostShape = useDerivedValue(() => [
    {
      translate: [
        player.position.x.value * board.gridConfig.value.cell.size,
        (dropPosition.value.y - player.tetrominoMaxY.value) *
          board.gridConfig.value.cell.size,
      ] as const,
    },
  ]);

  return (
    <GestureDetector gesture={Gesture.Race(...gestures)}>
      <Canvas style={board.gridConfig.value.screen} debug>
        <Group color='white'>
          <ImageSVG svg={platButton.svg} rect={platButton.iconRect} color='red' />
        </Group>

        {/* <BoardInfo board={board} game={game} player={player} /> */}
        <Group
          transform={[
            {
              translate: [
                board.gridConfig.value.content.x,
                board.gridConfig.value.content.y,
              ],
            },
          ]}
        >
          <Path path={skShapePath} color={tetrominoColor} />
          <Path
            path={ghostShapeSkPath}
            transform={translateGhostShape}
            color='white'
            style='stroke'
          />
          <Image
            image={board.boardImage}
            width={board.gridConfig.value.size.width}
            height={board.gridConfig.value.size.height}
          />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
