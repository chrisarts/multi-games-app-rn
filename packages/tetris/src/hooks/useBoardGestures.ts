import { runOnJS, useSharedValue } from "react-native-reanimated";
import { useAnimatedTetris } from "./useAnimatedTetris";
import { MoveDirection } from "../models";
import { hasCollisions, playerMoves } from "../utils";
import { Gesture } from "react-native-gesture-handler";

type TetrisHook = ReturnType<typeof useAnimatedTetris>;

export const useBoardGestures = ({ player, animatedBoard }: TetrisHook) => {
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
      player.movePosition({
        board: animatedBoard.value,
        dir: MoveDirection.RIGHT,
        value: value < 0 ? -1 : 1,
      });
    }, 40);
  };

  const swipeDown = () => {
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
          playerMoves.down(1)
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

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .shouldCancelWhenOutside(false)
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
      console.log("N-COL", col);
      console.log("Y-X", e.translationY, lastTouchX.value);
      if (lastTouchY.value > 30 * 3 && !hasDownLastBlock.value) {
        console.log("MOVE_DOWN");
        isEnabled.value = false;
        runOnJS(swipeDown)();
        lastTouchX.value = 0;
        lastTouchY.value = 0;
        hasDownLastBlock.value = true;
        return;
      }

      if (Math.abs(e.translationX) < 30) {
        lastTouchX.value = e.translationX;
        lastTouchY.value = e.translationY;
        return;
      }

      if (e.translationX < lastTouchX.value) {
        runOnJS(moveXAxis)(Math.abs(newCol) * -1);
      } else {
        console.log("MOVE_RIGHT");
        runOnJS(moveXAxis)(Math.abs(newCol));
      }

      isEnabled.value = false;
      lastTouchX.value = e.translationX;
      lastTouchY.value = e.translationY;
    })
    .onEnd(() => {
      hasDownLastBlock.value = false;
      lastTouchX.value = 0;
      lastTouchY.value = 0;
    });

  const tap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd((x) => {
      runOnJS(player.playerRotate)(animatedBoard.value);
    });

  return {
    gesture: Gesture.Race(tap, panGesture),
  };
};
