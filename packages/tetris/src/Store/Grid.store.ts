import { type CustomStore, createStore } from '@games/shared';
import { Dimensions } from 'react-native';
import * as GridDomain from '../Domain/Grid.domain';

export interface GridStore extends CustomStore<GridDomain.GridState> {}

export const GridStore = createStore<GridDomain.GridState>(
  GridDomain.makeGridState({
    screen: Dimensions.get('screen'),
    size: { rows: 15, columns: 10 },
  }),
);
