import { getDeviceDimensions } from "@games/shared";
import { Pressable, StyleSheet, Text } from "react-native";

interface BoardButtonProps {
  label: string;
  action: () => void;
}
export const BoardButton = ({ action, label }: BoardButtonProps) => {
  return (
    <Pressable onPress={action} style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    aspectRatio: 1,
    borderRadius: getDeviceDimensions().WIDTH,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
