import { FlatList, StyleSheet, View } from "react-native";
import { TetrisCell } from "./components/TetrisCell";
import { useAnimatedTetris } from "../hooks/useAnimatedTetris";
import { BoardHeader } from "./components/BoardHeader";
import { GestureDetector } from "react-native-gesture-handler";
import { BoardControls } from "./components/BoardControls";
import { useBoardGestures } from "../hooks/useBoardGestures";

export const TetrisBoard = () => {
  const tetris = useAnimatedTetris();

  const { gesture } = useBoardGestures(tetris);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.listContainer}>
          <FlatList
            scrollEnabled={false}
            data={tetris.animatedBoard.value}
            renderItem={({ item: columns, index: rowIndex }) => (
              <View style={styles.rowContainer}>
                <FlatList
                  scrollEnabled={false}
                  data={columns}
                  horizontal
                  renderItem={({ item: cell, index: colIndex }) => {
                    return (
                      <TetrisCell
                        cell={cell}
                        board={tetris.animatedBoard}
                        coords={{ column: colIndex, row: rowIndex }}
                      />
                    );
                  }}
                />
              </View>
            )}
            ListHeaderComponent={
              <BoardHeader
                gameState={tetris.status}
                nextShape={tetris.player.nextShapeBoard}
              />
            }
            ListFooterComponent={
              <BoardControls
                gameState={tetris.gameState}
                moveLeft={tetris.playerMovements.moveLeft}
                moveDown={tetris.playerMovements.moveDown}
                moveRight={tetris.playerMovements.moveRight}
                rotate={() =>
                  tetris.player.playerRotate(tetris.animatedBoard.value)
                }
                startGame={tetris.startGame}
              />
            }
          />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 10,
  },
  rowContainer: { alignItems: "center" },
});
