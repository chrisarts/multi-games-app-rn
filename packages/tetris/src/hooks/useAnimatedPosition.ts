import { SharedValue, useSharedValue } from "react-native-reanimated";
import { BoardPosition } from "../models";

export const useAnimatedPosition = () => {
  const position: SharedValue<BoardPosition> = useSharedValue({
    column: 3,
    row: 0,
  });
  const playerCollide = useSharedValue(false);

  const updatePosition = (nextPosition: BoardPosition, collided: boolean) => {
    "worklet";
    position.value = {
      column: position.value.column + nextPosition.column,
      row: position.value.row + nextPosition.row,
    };
    if (collided !== playerCollide.value) {
      playerCollide.value = collided;
    }
  };

  return {
    animated: position,
    updatePosition,
    playerCollide,
  };
};
