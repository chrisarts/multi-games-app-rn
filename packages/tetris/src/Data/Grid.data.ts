// import { bounds, rect, vec } from '@shopify/react-native-skia';
// import { Dimensions } from 'react-native';
// import { makeGridState } from '../Domain/Grid.domain';

// export const defaultCellColor: string = 'rgba(131, 126, 126, 0.3)';
// const dims = Dimensions.get('window');

// const GRID_SIZE = { columns: 10, rows: 15 };

// export const TETRIS_GRID = makeGridState({
//   screen: dims,
//   size: GRID_SIZE,
// });

// const GRID_CELL = TETRIS_GRID.layout.cell;

// const CELL_SPACING = GRID_CELL.spacing / 3;
// const CELL_SIZE = Math.floor(GRID_CELL.containerSize - CELL_SPACING);

// const GRID_VECTORS = TETRIS_GRID.cellPoints.map(({ x, y }) =>
//   vec(
//     Math.floor(x * GRID_CELL.containerSize) + CELL_SPACING,
//     Math.floor(y * GRID_CELL.containerSize) + CELL_SPACING,
//   ),
// );
// const CELLS = GRID_VECTORS.map(({ x, y }) => rect(x, y, CELL_SIZE, CELL_SIZE));

// export const GRID = {
//   vectors: GRID_VECTORS,
//   cells: CELLS,
//   cellSpacing: CELL_SPACING,
//   sizePlusSpace: Math.floor(GRID_CELL.containerSize + CELL_SPACING),
//   cellSize: CELL_SIZE,
//   fullCellSize: GRID_CELL.containerSize,
//   gridRect: bounds(CELLS),
//   rows: GRID_SIZE.rows,
//   columns: GRID_SIZE.columns,
// };
