import { Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface BoardButtonProps {
  action: () => void;
  icon: keyof (typeof MaterialCommunityIcons)['glyphMap'];
}
export const BoardButton = ({ action, icon }: BoardButtonProps) => {
  return (
    <Pressable onPress={action}>
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
