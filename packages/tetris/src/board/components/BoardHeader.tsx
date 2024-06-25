import { Text, View } from "react-native";
import { useGameStatus } from "../../hooks/useGameStatus";

interface BoardHeaderProps {
  gameState: ReturnType<typeof useGameStatus>;
}
export const BoardHeader = ({ gameState }: BoardHeaderProps) => {
  const { score, level, rows } = gameState;
  const getItem = (label: string, value: string | number) => {
    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          borderColor: "white",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>{label}</Text>
        <Text style={{ color: "white" }}>{value}</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      {getItem("SCORE", score)}
      {getItem("LINES", rows)}
      {getItem("LEVEL", level)}
    </View>
  );
};
