import * as Data from 'effect/Data';

export type TetrominoMatrix = number[][];

export type TetrominoConfig = Data.TaggedEnum<{
  O: { name: 'O'; color: string; value: TetrominoMatrix };
  I: { name: 'I'; color: string; value: TetrominoMatrix };
  J: { name: 'J'; color: string; value: TetrominoMatrix };
  L: { name: 'L'; color: string; value: TetrominoMatrix };
  S: { name: 'S'; color: string; value: TetrominoMatrix };
  T: { name: 'T'; color: string; value: TetrominoMatrix };
  Z: { name: 'Z'; color: string; value: TetrominoMatrix };
}>;
const TetrominoConfig = Data.taggedEnum<TetrominoConfig>();

export const TetrominosData = {
  O: TetrominoConfig.O({
    name: 'O',
    value: [
      [1, 1],
      [1, 1],
    ],
    color: 'rgba(223, 217, 36,1)',
  }),
  I: TetrominoConfig.I({
    name: 'I',
    value: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: 'rgba(80, 227, 230, 1)',
  }),
  J: TetrominoConfig.J({
    name: 'J',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: 'rgba(36, 95, 223,1)',
  }),
  L: TetrominoConfig.L({
    name: 'L',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: 'rgba(223, 173, 36,1)',
  }),
  S: TetrominoConfig.S({
    name: 'S',
    value: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(48, 211, 56,1)',
  }),
  T: TetrominoConfig.T({
    name: 'T',
    value: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(132, 61, 198,1)',
  }),
  Z: TetrominoConfig.Z({
    name: 'Z',
    value: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'rgba(227, 78, 78,1)',
  }),
};

export const TetrominoNames: TetrominoConfig['_tag'][] = [
  'I',
  'J',
  'L',
  'O',
  'S',
  'T',
  'Z',
];
