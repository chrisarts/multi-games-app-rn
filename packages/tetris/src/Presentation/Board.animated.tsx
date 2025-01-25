import {
  Canvas,
  Group,
  Image,
  ImageSVG,
  Path,
  point,
  processTransform3d,
  rect,
  rrect,
  usePathValue,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';
import { getCellUIRect } from '../Domain/Grid.domain';
import { BoardHeader } from './BoardHeader';
import { useTetris } from './hooks/useTetris';
import { useTetrisGridPath } from './hooks/useTetrisGridPath';
import { playIconSvg } from './icons/PlayIcon';

export const AnimatedBoard = () => {
  const { gestures, board, gridSkImage, game, gridManager } = useTetris();
  const { skShapePath } = useTetrisGridPath(
    board.tetromino.current,
    board.dropPosition,
    board.gridConfig.value,
  );
  const tetrominoColor = useDerivedValue(() => board.tetromino.current.value.color);

  const playIconSvgValue = useDerivedValue(() =>
    game.running.value ? null : playIconSvg,
  );
  const playIconRect = useDerivedValue(() =>
    game.running.value
      ? rect(0, 0, 0, 0)
      : rect(
          board.gridConfig.value.screen.width / 2 -
            board.gridConfig.value.cell.size * 1.5,
          board.gridConfig.value.screen.height / 2,
          board.gridConfig.value.cell.size * 3,
          board.gridConfig.value.cell.size * 3,
        ),
  );

  const ghostShapePath = usePathValue((skPath) => {
    'worklet';
    const position = point(
      Math.floor(board.dropPosition.x.value),
      Math.floor(board.dropPosition.y.value),
    );
    let finalPoint = point(position.x, position.y);
    for (const row of board.grid.value) {
      const gridPoint = point(position.x, board.grid.value.indexOf(row));
      if (finalPoint.y !== position.y) continue;

      const collision = gridManager.checkCollisions(
        gridPoint,
        board.tetromino.current.value,
      );
      if (collision.merge) {
        finalPoint = point(gridPoint.x, gridPoint.y - 1);
      }
    }
    console.log({
      position: position.y,
      final: finalPoint.y,
    });
    for (const cell of board.tetromino.current.value.cellsMatrix.flat()) {
      if (cell.value === 0) continue;
      skPath.addRRect(
        rrect(getCellUIRect(cell.point, board.gridConfig.value.cell.size), 5, 5),
      );
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
        <BoardHeader game={game} board={board} />
        <Group color='white'>
          <ImageSVG svg={playIconSvgValue} rect={playIconRect} color='red' />
        </Group>

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
