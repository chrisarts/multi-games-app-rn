import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const useLoop = (duration: number) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(progress.value + 1, { duration, easing: Easing.exp }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [duration, progress]);

  return progress;
};
