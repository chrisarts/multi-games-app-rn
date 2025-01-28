import { keysOf } from '@games/shared';
import { point } from '@shopify/react-native-skia';

const OBlock = () => {
  'worklet';
  return {
    name: 'O',
    value: [
      [1, 1],
      [1, 1],
    ],
    color: 'rgba(223, 217, 36,1)',
  };
};
const IBlock = () => {
  'worklet';
  return {
    name: 'I',
    value: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: 'rgba(80, 227, 230, 1)',
  };
};
const JBlock = () => {
  'worklet';
  return {
    name: 'J',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: 'rgba(36, 95, 223,1)',
  };
};

const LBlock = () => {
  'worklet';
  return {
    name: 'L',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: 'rgba(223, 173, 36,1)',
  };
};

const SBlock = () => {
  'worklet';
  return {
    name: 'S',
    value: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(48, 211, 56,1)',
  };
};
const TBlock = () => {
  'worklet';
  return {
    name: 'T',
    value: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(132, 61, 198,1)',
  };
};

const ZBlock = () => {
  'worklet';
  return {
    name: 'Z',
    value: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'rgba(227, 78, 78,1)',
  };
};

export const TetrominosData = {
  O: OBlock,
  I: IBlock,
  J: JBlock,
  L: LBlock,
  S: SBlock,
  T: TBlock,
  Z: ZBlock,
} as const;

const createTetromino = (config: TetrominoConfig) => {
  'worklet';
  const shapes = [config.value];

  let stop = false;
  while (!stop) {
    const lastShape = shapes[shapes.length - 1];
    const nextShape = lastShape
      .map((_, iy) => lastShape.map((cells) => cells[iy]))
      .map((row) => row.toReversed());

    const nextShapeID = nextShape.flat().join('');
    stop = shapes.some((shape) => shape.flat().join('') === nextShapeID);
    shapes.push(nextShape);
  }

  const allShapes = shapes.map((shape) =>
    shape
      .flatMap((row, iy) => row.map((_, ix) => (_ > 0 ? point(ix, iy) : null)))
      .filter((_) => _ !== null),
  );
  const maxX = allShapes[0].sort((a, b) => b.x - a.x)[0].x + 1;
  const maxY = allShapes[0].sort((a, b) => b.y - a.y)[0].y + 1;

  return {
    color: config.color,
    id: Object.keys(TetrominosData).indexOf(config.name) + 1,
    shapes: allShapes,
    position: point(maxX > maxY ? maxX : maxY, 0),
    shape: allShapes[0],
    rotation: 0,
  };
};

export type TetrominoNames = keyof typeof TetrominosData;
export const TetrominoNames = keysOf(TetrominosData);
export const GameTetrominos = TetrominoNames.map((name) =>
  createTetromino(TetrominosData[name]()),
);

export const TetrominoColors = Object.fromEntries(
  GameTetrominos.map((shape) => [shape.id, shape.color] as const),
);

type TetrominoConfig = {
  name: string;
  value: number[][];
  color: string;
};
