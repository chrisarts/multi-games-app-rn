import { StyleSheet, Text, View } from "react-native";
import { useGameStatus } from "../../hooks/useGameStatus";

interface BoardHeaderProps {
  gameState: ReturnType<typeof useGameStatus>;
}
export const BoardHeader = ({ gameState }: BoardHeaderProps) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  container: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "Digital-Bold",
    fontSize: 16,
  },
  valueText: {
    color: "white",
    fontFamily: "Digital-Italic",
    fontSize: 16,
  },
});
