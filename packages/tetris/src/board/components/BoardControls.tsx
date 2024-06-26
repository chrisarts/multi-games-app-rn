import { BoardButton } from "./BoardButton";
import { GameState } from "../../models";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface BoardControlsProps {
  gameState: SharedValue<GameState>;
  startGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
}
export const BoardControls = ({
  gameState,
  moveLeft,
  moveRight,
  rotate,
  startGame,
  moveDown,
}: BoardControlsProps) => {
  const controlStyles = useAnimatedStyle(() => {
    return {
      display: gameState.value === GameState.PLAYING ? "flex" : "none",
    };
  });
  const startStyles = useAnimatedStyle(() => {
    return {
      display: gameState.value === GameState.STOP ? "flex" : "none",
    };
  });
  return (
    <Animated.View
      style={{
        marginTop: 10,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          { justifyContent: "space-between", flexDirection: "row" },
          controlStyles,
        ]}
      >
        <BoardButton label="Left" action={moveLeft} />
        <BoardButton label="Down" action={moveDown} />
        <BoardButton label="Right" action={moveRight} />
        <BoardButton label="Rotate" action={rotate} />
      </Animated.View>

      <Animated.View
        style={[
          { justifyContent: "space-between", flexDirection: "row" },
          startStyles,
        ]}
      >
        <BoardButton label="Start" action={startGame} />
      </Animated.View>
    </Animated.View>
  );
};
