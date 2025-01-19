import {
  Group,
  Path,
  type SkHostRect,
  type SkImage,
  type SkPath,
  type SkPoint,
  type SkRect,
  drawAsImage,
} from '@shopify/react-native-skia';
import { GRID } from '../../Data/Grid.data';
import type { TetrominoMatrix } from '../../Data/Tetrominos.data';
import type * as Position from '../../Domain/Position.domain';
import { getAllTetrominos, tetrominoToUI } from './tetromino.worklet';

export interface TetrominoTexture {
  texture: SkImage;
  color: string;
  drawZeroPoints: Position.Position[];
  skPath: SkPath;
  vectors: SkPoint[];
  bounds: SkRect;
  rects: SkHostRect[];
  matrix: TetrominoMatrix;
  name: string;
}

const allTetrominos = getAllTetrominos();
export const tetrominoTextures = allTetrominos.map(({ tetromino }) => {
  const tetrominoData = tetrominoToUI(tetromino);
  return {
    texture: drawAsImage(
      <Group
        key={`tetromino.texture-${tetromino.name}-${tetromino.color}`}
        color={tetromino.color}
      >
        <Path path={tetrominoData.skPath} />
      </Group>,
      GRID.gridRect,
    ),
    color: tetromino.color,
    drawZeroPoints: tetromino.drawPositions,
    skPath: tetrominoData.skPath,
    vectors: tetrominoData.vectors,
    bounds: tetrominoData.bounds,
    rects: tetrominoData.rects,
    matrix: tetromino.matrix,
    name: tetromino.name,
  };
});
