import {
  Canvas,
  Group,
  Image,
  ImageSVG,
  Path,
  point,
  processTransform3d,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';
import { getCellUIRect } from '../Domain/Grid.domain';
import { BoardInfo } from './BoardInfoRect';
import { useGameControls } from './hooks/useGameControls';
import { useTetris } from './hooks/useTetris';
import { useTetrominoSkPath } from './hooks/useTetrominoSkPath';

export const AnimatedBoard = () => {
  const { gestures, board, gridSkImage, game, gridManager, player } = useTetris();
  const { skShapePath } = useTetrominoSkPath(
    player.tetromino,
    player.position,
    board.gridConfig.value.cell,
  );
  const { platButton } = useGameControls(game, board);
  const tetrominoColor = useDerivedValue(() => player.tetromino.value.color);

  const ghostShapePath = usePathValue((skPath) => {
    'worklet';
    const position = point(
      Math.floor(player.position.x.value),
      Math.floor(player.position.y.value),
    );
    let finalPoint = point(position.x, position.y);
    for (const row of board.grid.value) {
      const gridPoint = point(position.x, board.grid.value.indexOf(row));
      if (finalPoint.y !== position.y) continue;

      const collision = gridManager.checkCollisions(gridPoint, player.tetromino.value);
      if (collision.merge) {
        finalPoint = point(gridPoint.x, gridPoint.y - 1);
      }
    }
    for (const cell of player.tetromino.value.shape) {
      skPath.addRRect(rrect(getCellUIRect(cell, board.gridConfig.value.cell.size), 5, 5));
    }
    skPath.transform(
      processTransform3d([
        {
          translate: [
            finalPoint.x * board.gridConfig.value.cell.size,
            finalPoint.y * board.gridConfig.value.cell.size,
          ] as const,
        },
      ]),
    );
    return skPath;
  });

  return (
    <GestureDetector gesture={Gesture.Race(...gestures)}>
      <Canvas style={board.gridConfig.value.screen} debug>
        {/* <BoardHeader game={game} board={board} /> */}
        <Group color='white'>
          <ImageSVG svg={platButton.svg} rect={platButton.iconRect} color='red' />
        </Group>

        <BoardInfo board={board} game={game} player={player} />
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
          <Path path={ghostShapePath} color='white' style='stroke' />
          <Image
            image={gridSkImage}
            width={board.gridConfig.value.size.width}
            height={board.gridConfig.value.size.height}
          />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};
