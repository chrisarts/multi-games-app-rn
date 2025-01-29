import { Canvas, Group, Image, ImageSVG, Path, point } from '@shopify/react-native-skia';
import {
  ReduceMotion,
  useDerivedValue,
  useFrameCallback,
  withTiming,
} from 'react-native-reanimated';
import { BoardInfo } from './BoardInfoRect';
import { GameGestures } from './GameGestures';
import { useGameControls } from './hooks/useGameControls';
import { useTetris } from './hooks/useTetris';
import { useTetrominoSkPath } from './hooks/useTetrominoSkPath';

export const AnimatedBoard = () => {
  const {
    actions,
    board,
    game,
    player,
    skGhostShape,
    tetrominoColor,
    translateMainGrid,
  } = useTetris();
  const { skShapePath } = useTetrominoSkPath(
    player.tetromino,
    player.position,
    board.gridConfig.value.cell,
  );
  const { platButton } = useGameControls(game, board);

  const moveByFrame = useDerivedValue(
    () =>
      board.gridConfig.value.cell.size /
      (game.turbo.value ? game.speed.value / 4 : game.speed.value),
  );

  useFrameCallback((frame) => {
    if (!frame.timeSincePreviousFrame) return;
    if (game.gameOver.value || !game.running.value) return;

    const currentY = Math.floor(player.position.y.value + moveByFrame.value);
    const collision = board.checkCollisions(
      point(player.position.x.value, currentY + 1),
      player.tetromino.value,
    );

    if (collision.merge) {
      if (collision.at.y <= 1) {
        actions.onGameOver();
        return;
      }

      actions.mergeCurrentTetromino();
      return;
    }

    if (!collision.merge && !collision.outsideGrid) {
      const nextY = player.position.y.value + moveByFrame.value;
      player.position.y.value = withTiming(nextY, {
        duration: frame.timeSincePreviousFrame * 0.8,
        // easing: Easing.linear,
        reduceMotion: ReduceMotion.System,
      });
    }

    // withTiming(moveBy, {
    //   duration: frame.timeSincePreviousFrame * 0.8,
    //   easing: Easing.linear,
    // });

    // const elapsed = Date.now() - game.startTime.value;
    // const toSpeed = game.turbo.value ? 100 : game.speed.value;

    // if (elapsed > toSpeed) {
    //   game.startTime.value = Date.now();
    //   if (!game.running.value || game.gameOver.value) return;

    //   const nextPos = add(
    //     point(player.position.x.value, player.position.y.value),
    //     point(0, 1),
    //   );

    //   const collision = board.checkCollisions(nextPos, player.tetromino.value);

    //   if (!collision.merge && !collision.outsideGrid) {
    //     player.position.y.value = withTiming(nextPos.y, {
    //       duration: 100,
    //       easing: Easing.linear,
    //     });
    //   }

    //   if (collision.merge) {
    //     if (collision.at.y <= 1) {
    //       actions.onGameOver();
    //       return;
    //     }

    //     actions.mergeCurrentTetromino();
    //   }
    // }
  });

  return (
    <GameGestures
      checkCollisions={board.checkCollisions}
      gridConfig={board.gridConfig}
      lastTouchedX={player.lastTouchedX}
      moveShapeXAxis={actions.moveShapeXAxis}
      position={player.position}
      running={game.running}
      startNewGame={actions.startNewGame}
      tetromino={player.tetromino}
      turbo={game.turbo}
    >
      <Canvas style={board.gridConfig.value.screen} mode='continuous'>
        <Group color='white'>
          <ImageSVG svg={platButton.svg} rect={platButton.iconRect} color='red' />
        </Group>

        <BoardInfo
          gridConfig={board.gridConfig}
          game={game}
          tetrominosBag={player.tetrominosBag}
        />
        <Group transform={translateMainGrid}>
          <Image
            image={board.boardImage}
            width={board.gridConfig.value.size.width}
            height={board.gridConfig.value.size.height}
          />
          <Path path={skShapePath} color={tetrominoColor} />
          <Path path={skGhostShape} color='white' style='stroke' />
        </Group>
      </Canvas>
    </GameGestures>
  );
};
