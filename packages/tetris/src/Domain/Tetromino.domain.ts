// import {
//   type SkHostRect,
//   type SkPath,
//   type SkPoint,
//   type SkRect,
//   type Vector,
//   add,
//   vec,
// } from '@shopify/react-native-skia';
// import * as TetrominoData from '../Data/Tetrominos.data';

// export interface Tetromino {
//   name: string;
//   color: string;
//   matrix: TetrominoData.TetrominoMatrix;
//   drawPositions: SkPoint[];
// }
// export interface UITetromino {
//   color: string;
//   bounds: SkRect;
//   vectors: SkPoint[];
//   rects: SkHostRect[];
//   position: SkPoint;
//   skPath: SkPath;
//   merged: boolean;
// }

// export interface MergedTetromino {
//   color: string;
//   drawPoints: SkPoint[];
//   position: Vector;
//   sweep: boolean;
//   path: SkPath;
// }

// export const of = (tetromino: Tetromino): Tetromino => tetromino;

// export const fromConfig = (config: TetrominoData.TetrominoConfig): Tetromino => {
//   const drawPositions = getMatrixPositions(config.value);

//   return {
//     drawPositions,
//     name: config.name,
//     color: config.color,
//     matrix: config.value,
//   };
// };

// export const fromName = (name: TetrominoData.TetrominoConfig['name']): Tetromino =>
//   fromConfig(TetrominoData.TetrominosData[name]);

// export const getRandomTetromino = (): Tetromino =>
//   fromName(
//     TetrominoData.TetrominoNames[
//       Math.floor(Math.random() * TetrominoData.TetrominoNames.length)
//     ],
//   );

// export const moveTetromino = (tetromino: Tetromino, to: SkPoint): Tetromino =>
//   of({
//     ...tetromino,
//     drawPositions: getMatrixPositions(tetromino.matrix, to),
//   });

// export const rotateTetromino = (tetromino: Tetromino) => {
//   // Make the rows to become cols (transpose)
//   const shape = tetromino.matrix.map((_, i) =>
//     tetromino.matrix.map((column) => column[i]),
//   );
//   // Reverse each row to get a rotated matrix
//   const nextMatrix = shape.map((row) => row.reverse());
//   const nextPositions = getMatrixPositions(nextMatrix, vec(0, 0));

//   return of({
//     ...tetromino,
//     matrix: nextMatrix,
//     drawPositions: nextPositions,
//   });
// };

// const getMatrixPositions = (
//   matrix: TetrominoData.TetrominoConfig['value'],
//   sumPos = vec(0, 0),
// ): SkPoint[] =>
//   matrix
//     .map((rows, y) =>
//       rows.map((column, x) => {
//         if (column === 0) return null;
//         return add(vec(x, y), sumPos);
//       }),
//     )
//     .flatMap((x) => x.filter((y) => y !== null));
