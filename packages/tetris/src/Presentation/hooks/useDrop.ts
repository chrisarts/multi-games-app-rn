import { point, vec } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const useDrop = () => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const [dropPosition, setDropPosition] = useState(vec(0, 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setDropPosition((prev) => point(prev.x, prev.y + 1));
    }, 800);
    return () => {
      setDropPosition(vec(0, 0));
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(dropPosition.y, { duration: 800, easing: Easing.linear }),
      -1,
      false,
    );
    // translateX.value = withRepeat(
    //   withTiming(dropPosition.x, { duration: 800, easing: Easing.linear }),
    //   -1,
    //   false,
    // );
  }, [translateY, dropPosition]);

  return {
    translate: {
      y: translateY,
      x: translateX,
    },
  };
};
