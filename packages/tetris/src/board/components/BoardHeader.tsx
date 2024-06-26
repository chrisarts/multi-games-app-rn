import { FlatList, StyleSheet, Text, View } from "react-native";
import { useGameStatus } from "../../hooks/useGameStatus";
import { BoardMatrix } from "../../models";
import { SharedValue } from "react-native-reanimated";
import { TetrisCell } from "./TetrisCell";

interface BoardHeaderProps {
  gameState: ReturnType<typeof useGameStatus>;
  nextShape: SharedValue<BoardMatrix>;
}
export const BoardHeader = ({ gameState, nextShape }: BoardHeaderProps) => {
  const { score, level, rows } = gameState;
  const getItem = (label: string, value: string | number) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.content}>
      {getItem("SCORE", score)}
      {getItem("LINES", rows)}
      {getItem("LEVEL", level)}
      <View style={[styles.container, styles.nextContainer]}>
        <Text style={styles.title}>Next</Text>
        <FlatList
          scrollEnabled={false}
          horizontal
          data={nextShape.value}
          renderItem={({ item: row, index: rowIndex }) => (
            <FlatList
              scrollEnabled={false}
              horizontal
              data={row}
              renderItem={({ item, index }) => (
                <TetrisCell
                  board={nextShape}
                  cell={item}
                  coords={{ row: rowIndex, column: index }}
                  size="small"
                />
              )}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  nextContainer: {
    paddingTop: "2%",
    paddingVertical: 0,
    overflow: "visible",
  },
  container: {
    paddingVertical: "5%",
    paddingHorizontal: 10,
    height: "100%",
    flex: 1,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
    aspectRatio: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Digital-Bold",
    fontSize: 14,
  },
  valueText: {
    color: "white",
    fontFamily: "Digital-Italic",
    fontSize: 12,
  },
});
