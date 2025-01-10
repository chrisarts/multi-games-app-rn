import { keysOf } from '@games/shared';
import * as Data from 'effect/Data';

export type GridBlockEnum = Data.TaggedEnum<{
  O: { name: 'O'; color: string; value: number[][] };
  I: { name: 'I'; color: string; value: number[][] };
  J: { name: 'J'; color: string; value: number[][] };
  L: { name: 'L'; color: string; value: number[][] };
  S: { name: 'S'; color: string; value: number[][] };
  T: { name: 'T'; color: string; value: number[][] };
  Z: { name: 'Z'; color: string; value: number[][] };
}>;
const GridBlockEnum = Data.taggedEnum<GridBlockEnum>();

export const GridBlockShapes = {
  // 🟥
  O: GridBlockEnum.O({
    name: 'O',
    value: [
      [1, 1],
      [1, 1],
    ],
    color: 'rgba(223, 217, 36,1)',
  }),
  I: GridBlockEnum.I({
    name: 'I',
    value: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: 'rgba(80, 227, 230, 1)',
  }),
  J: GridBlockEnum.J({
    name: 'J',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: 'rgba(36, 95, 223,1)',
  }),
  L: GridBlockEnum.L({
    name: 'L',
    value: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: 'rgba(223, 173, 36,1)',
  }),
  S: GridBlockEnum.S({
    name: 'S',
    value: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(48, 211, 56,1)',
  }),
  T: GridBlockEnum.T({
    name: 'T',
    value: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    color: 'rgba(132, 61, 198,1)',
  }),
  Z: GridBlockEnum.Z({
    name: 'Z',
    value: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'rgba(227, 78, 78,1)',
  }),
};

export const GridBlockNames = keysOf(GridBlockShapes);
