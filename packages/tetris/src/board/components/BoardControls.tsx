import { View } from "react-native";
import { BoardButton } from "./BoardButton";
import { GameState } from "../../models";

interface BoardControlsProps {
  gameState: GameState;
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
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
      }}
    >
      {gameState === GameState.PLAYING ? (
        <>
          <BoardButton label="Left" action={moveLeft} />
          <BoardButton label="Down" action={moveDown} />
          <BoardButton label="Right" action={moveRight} />
          <BoardButton label="Rotate" action={rotate} />
        </>
      ) : (
        <>
          <BoardButton label="Start" action={startGame} />
        </>
      )}
    </View>
  );
};
