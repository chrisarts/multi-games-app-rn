import { keysOf } from '@games/shared';

export type TetrominoMatrix = number[][];

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

export type TetrominoNames = keyof typeof TetrominosData;
export const TetrominoNames = keysOf(TetrominosData);

export type TetrominoConfig = {
  name: string;
  value: TetrominoMatrix;
  color: string;
};
