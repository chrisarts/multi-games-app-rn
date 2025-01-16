import { useSharedValue } from 'react-native-reanimated';

export const useGameState = () => {
  const dropPositionX = useSharedValue(0);
  const dropPositionY = useSharedValue(0);

  return {
    dropPosition: {
      x: dropPositionX,
      y: dropPositionY,
    },
  };
};
