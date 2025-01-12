import * as Array from 'effect/Array';
import * as HashSet from 'effect/HashSet';
import * as Position from './Position.domain';

export interface GridConfig {
  screen: {
    width: number;
    height: number;
  };
  size: {
    rows: number;
    columns: number;
  };
}

export interface CellLayout {
  size: number;
  spacing: number;
  containerSize: number;
}

export interface GridLayout extends GridConfig {
  initialPosition: Position.Position;
  canvas: GridConfig['screen'];
  cell: CellLayout;
}

const createGridColumns = (atRow: number, size: number) =>
  Array.makeBy(size, (n) => Position.Position({ row: atRow, column: n }));

const createGridRows = (rows: number, columns: number): Position.Position[][] =>
  Array.makeBy(rows, (n) => createGridColumns(n, columns));

export const makePositions = (size: GridConfig['size']) =>
  HashSet.fromIterable(Array.flatten(createGridRows(size.rows, size.columns)));

export const makeBy =
  <A>(f: (position: Position.Position) => A) =>
  (size: GridConfig['size']): A[] =>
    Array.flatMap(
      Array.makeBy(size.rows, (n) => createGridColumns(n, size.columns)),
      (rows) => rows.map(f),
    );
