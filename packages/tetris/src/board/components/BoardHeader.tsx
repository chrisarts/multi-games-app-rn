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
          paddingVertical: 15,
          paddingHorizontal: 25,
          borderRadius: 10,
          borderColor: "white",
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontFamily: "Digital-Bold",
            fontSize: 16,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: "white",
            fontFamily: "Digital-Italic",
            fontSize: 16,
          }}
        >
          {value}
        </Text>
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
