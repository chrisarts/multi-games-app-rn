import { Path } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import type { GridState } from '../Domain/Grid.domain';
import { useTetrominoPath } from './hooks/useTetromino';

interface TetrominoViewProps {
  grid: GridState;
}

export const TetrominoView = ({ grid }: TetrominoViewProps) => {
  const { tetrominoPath, tetromino, transforms } = useTetrominoPath(grid);

  return <Path path={tetrominoPath} color={tetromino.color} transform={transforms} />;
};
