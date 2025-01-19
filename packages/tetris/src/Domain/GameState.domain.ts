import type { SkPoint } from '@shopify/react-native-skia';

export interface GameState {
  tetromino: {
    current: any;
    next: any;
    position: SkPoint;
  };
  game: {
    status: GameRunState;
    lines: number;
    speed: number;
  };
  grid: any;
  debug: boolean;
}

export type GameRunState = 'InProgress' | 'GameOver' | 'Stop';

// export const collisionChecker = (check: {
//   tetromino: any;
//   position: SkPoint;
//   grid: Grid.GridState;
// }) => {
//   const drawPositions = [] as SkPoint[];
//   const invalidPositions = [] as SkPoint[];
//   const drawCells = [] as Cell.Cell[];
//   const mergedCells = [] as Cell.Cell[];
//   const nextBounds = Grid.makeBound(
//     check.tetromino.bounds.min,
//     check.tetromino.bounds.max,
//   );

//   for (const drawPos of check.tetromino.drawPositions) {
//     const pos = Position.sum(check.position, drawPos);
//     drawPositions.push(pos);

//     if (pos.x > nextBounds.max.x)
//       nextBounds.max = Position.of({ y: nextBounds.max.y, x: pos.x });
//     if (pos.x < nextBounds.min.x) 
//       nextBounds.min = Position.of({ y: nextBounds.min.y, x: pos.x });
//     if (pos.y > nextBounds.max.y) 
//       nextBounds.max = Position.of({ y: pos.y, x: nextBounds.min.x });
//     if (pos.y < nextBounds.min.y) 
//       nextBounds.min = Position.of({ y: pos.y, x: nextBounds.min.x });

//     const cell = Option.getOrNull(HashMap.get(check.grid.cellsMap, pos));
//     if (cell) drawCells.push(cell);
//     if (cell && cell.state.merged) mergedCells.push(cell);
//     if (!cell) invalidPositions.push(pos);
//   }

//   const hasInvalidPosition = invalidPositions.length > 0;
//   const hasCellCollisions = mergedCells.length > 0;
//   const isGameOver = hasCellCollisions && drawPositions.some((x) => x.y <= 1);
//   const isBeyondOrAtMaxRow = Position.Order.rowGreatThanOrEquals(
//     check.grid.bounds.max,
//     check.position,
//   );
//   return {
//     checks: {
//       hasInvalidPosition,
//       hasCellCollisions,
//       isGameOver,
//       isBeyondOrAtMaxRow,
//     },
//     data: {
//       drawPositions,
//       invalidPositions,
//       drawCells,
//       mergedCells,
//       nextBounds,
//     },
//   };
// };
