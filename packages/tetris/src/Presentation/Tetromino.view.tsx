import { Path, type SkPath } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';

interface CurrentTetrominoView {
  layout: any;
  data: {
    tetromino: any;
    path: SkPath;
  };
  position: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  };
}

export const CurrentTetrominoView = ({ data, position }: CurrentTetrominoView) => {
  const transforms = useDerivedValue(() => [
    {
      translate: [position.x.value, position.y.value] as const,
    },
  ]);
  return (
    <Path
      path={data.path}
      transform={transforms}
      style='fill'
      color={data.tetromino.color}
    />
  );
};

interface MergedTetrominoView {
  layout: any;
  path: SkPath;
  color: string;
}

export const MergedTetrominoView = ({ layout, path, color }: MergedTetrominoView) => {
  // const path = useTetromino(layout, tetromino);
  // console.log('MERGED_AT: ', position);
  console.log('MERGED: ', path.getLastPt());
  return <Path path={path} style='fill' color={color} />;
};
