import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { MoveDirection } from '../models';
import { hasCollisions, playerMoves } from '../utils';
import { useAnimatedTetris } from './useAnimatedTetris';

type TetrisHook = ReturnType<typeof useAnimatedTetris>;

export const useBoardGestures = (
  { player, animatedBoard }: TetrisHook,
  downFast: () => void,
) => {
  const isEnabled = useSharedValue(true);
  const lastTouchX = useSharedValue(0);
  const lastTouchY = useSharedValue(0);
  const hasDownLastBlock = useSharedValue(false);

  const moveXAxis = (value: number) => {
    let pos = 0;
    const id = setInterval(() => {
      if (value < 0 ? pos <= value : pos >= value) {
        clearInterval(id);
        isEnabled.value = true;
        return;
      }
      pos = value < 0 ? (pos -= 1) : (pos += 1);
      const newValue = value < 0 ? -1 : 1;
      if (
        !hasCollisions(
          animatedBoard.value,
          {
            collided: player.collided.value,
            currentBlock: player.currentBlock.value,
            currentShape: player.currentShape.value,
            position: player.position.value,
          },
          playerMoves.left(newValue),
        )
      ) {
        player.movePosition({
          board: animatedBoard.value,
          dir: MoveDirection.RIGHT,
          value: newValue,
        });
      }
    }, 50);
  };

  const swipeDown = () => {
    downFast();
    const interval = setInterval(() => {
      if (
        !hasCollisions(
          animatedBoard.value,
          {
            collided: player.collided.value,
            currentBlock: player.currentBlock.value,
            currentShape: player.currentShape.value,
            position: player.position.value,
          },
          playerMoves.down(1),
        )
      ) {
        player.movePosition({
          board: animatedBoard.value,
          dir: MoveDirection.DOWN,
          value: 1,
        });
      } else {
        clearInterval(interval);
        isEnabled.value = true;
      }
    }, 40);
  };

  const panGestureY = Gesture.Pan()
    .maxPointers(1)
    .shouldCancelWhenOutside(false)
    .activeOffsetY([0, 30])
    .minDistance(30)
    .minVelocityY(30)
    .onStart((e) => {
      lastTouchY.value = 0;
      console.log('Y_GESTURE: ', e.x);
    })
    .onUpdate((e) => {
      if (!isEnabled.value) {
        return;
      }
      console.log('Y_GESTURE: ', lastTouchY.value);
      if (lastTouchY.value > 30 * 2 && !hasDownLastBlock.value) {
        console.log('RUN_GESTURE_Y!', lastTouchY.value);
        isEnabled.value = false;
        runOnJS(swipeDown)();
        lastTouchY.value = 0;
        hasDownLastBlock.value = true;
        return;
      }
      lastTouchY.value = e.translationY;
    })
    .onEnd(() => {
      hasDownLastBlock.value = false;
      // lastTouchY.value = 0;
    });

  const panGestureX = Gesture.Pan()
    .maxPointers(1)
    .shouldCancelWhenOutside(false)
    .activeOffsetX([-15, 15])
    .failOffsetY([-15, 15])
    .minDistance(30)
    .minVelocityX(30)
    .onStart(() => {
      lastTouchX.value = 0;
      lastTouchY.value = 0;
    })
    .onUpdate((e) => {
      if (!isEnabled.value) {
        return;
      }
      const abs = Math.abs(e.absoluteX);
      const col = Math.floor(abs / 30) - 1;
      const newCol = col - player.position.value.column;

      if (Math.abs(e.translationX) < 10) {
        lastTouchX.value = e.translationX;
        return;
      }

      if (e.translationX < lastTouchX.value) {
        runOnJS(moveXAxis)(newCol);
      } else {
        runOnJS(moveXAxis)(newCol);
      }

      isEnabled.value = false;
      lastTouchX.value = e.translationX;
    })
    .onEnd(() => {
      hasDownLastBlock.value = false;
      lastTouchX.value = 0;
      // lastTouchY.value = 0;
    })
    .simultaneousWithExternalGesture(panGestureY);

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((x) => {
      runOnJS(player.playerRotate)(animatedBoard.value);
    });

  return {
    gesture: Gesture.Race(tap, panGestureY, panGestureX),
  };
};
