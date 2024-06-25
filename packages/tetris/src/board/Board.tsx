import { FlatList, StyleSheet } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useTetrisBoard } from "../hooks/useTetrisBoard";
import { usePlayer } from "../hooks/usePlayer";
import { useInterval } from "../hooks/useInterval";
import { GameState, MoveDirection } from "../models";
import { hasCollisions, playerMoves } from "../utils";
import { BoardControls } from "./components/BoardControls";

export const TetrisBoard = () => {
  const { player, updatePlayerPosition, resetPlayer, movePlayer, rotateShape } =
    usePlayer();
  const { board, startGame, tickSpeed, gameState, setGameState, setTickSpeed } =
    useTetrisBoard(player, resetPlayer);

  const drop = () => {
    const dropMove = playerMoves.down(1);
    if (!hasCollisions(board, player, dropMove)) {
      updatePlayerPosition(dropMove, false);
    } else {
      if (player.position.row < 1) {
        setGameState(GameState.STOP);
        setTickSpeed(null);
      }
      updatePlayerPosition(playerMoves.zero(), true);
    }
  };

  useInterval(() => {
    if (gameState !== GameState.PLAYING) return;
    drop();
  }, tickSpeed);

  return (
    <FlatList
      scrollEnabled={false}
      data={board}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item: columns }) => (
        <FlatList
          scrollEnabled={false}
          data={columns}
          horizontal
          renderItem={({ item: cell }) => {
            return <TetrisCell cell={cell} />;
          }}
        />
      )}
      ListFooterComponent={() => (
        <BoardControls
          gameState={gameState}
          moveLeft={() =>
            movePlayer({ board, dir: MoveDirection.LEFT, value: -1 })
          }
          moveDown={() =>
            movePlayer({ board, dir: MoveDirection.DOWN, value: 1 })
          }
          moveRight={() =>
            movePlayer({ board, dir: MoveDirection.RIGHT, value: 1 })
          }
          rotate={() => rotateShape(board)}
          startGame={startGame}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
