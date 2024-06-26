import { Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface BoardButtonProps {
  action: () => void;
  icon: keyof (typeof MaterialCommunityIcons)['glyphMap'];
}
export const BoardButton = ({ action, icon }: BoardButtonProps) => {
  return (
    <Pressable onPress={action} style={styles.container}>
      <MaterialCommunityIcons
        name={icon}
        color='rgba(131, 126, 126, 1)'
        size={80}
        style={{
          paddingRight: 4,
          paddingTop: 3,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderRadius: 140,
    // width: 70,
    // height: 70,
    // borderColor: ,
    // borderWidth: 2,
    // aspectRatio: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
