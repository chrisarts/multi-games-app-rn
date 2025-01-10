import { getDeviceDimensions } from '@games/shared';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { useGameStatus } from '../../hooks/useGameStatus';
import { GridPosition } from '../../models/GridPosition.model';
import type { BoardMatrix } from '../../old-models/Board.model';
import { TetrisCell } from './TetrisCell';

interface BoardHeaderProps {
  gameState: ReturnType<typeof useGameStatus>;
  nextShape: BoardMatrix;
}
export const BoardHeader = ({ gameState, nextShape }: BoardHeaderProps) => {
  const { score, level, rows } = gameState;
  const getItem = (label: string, value: string | number) => {
    return (
      <View style={styles.content}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ gap: 5 }}>
        {getItem('SCORE', score)}
        {getItem('LINES', rows)}
      </View>
      <View style={{ gap: 5 }}>
        <View style={[styles.content, styles.nextContainer]}>
          <Text style={styles.title}>Next</Text>
          <FlatList
            scrollEnabled={false}
            horizontal
            data={nextShape}
            renderItem={({ item: row, index: rowIndex }) => (
              <FlatList
                scrollEnabled={false}
                horizontal
                data={row}
                renderItem={({ item, index }) => (
                  <TetrisCell
                    board={nextShape}
                    cell={item}
                    coords={GridPosition.create({ x: rowIndex, y: index })}
                    size='small'
                  />
                )}
              />
            )}
          />
        </View>
      </View>
      <View
        style={{
          gap: 5,
        }}
      >
        {getItem('LEVEL', level)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  nextContainer: {
    paddingTop: '5%',
    overflow: 'visible',
    height: getDeviceDimensions().WIDTH * 0.2,
  },
  content: {
    paddingVertical: '10%',
    paddingHorizontal: 10,
    width: getDeviceDimensions().WIDTH * 0.3,
    height: getDeviceDimensions().WIDTH * 0.15,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Digital-Bold',
    fontSize: 16,
  },
  valueText: {
    color: 'white',
    fontFamily: 'Digital-Italic',
    fontSize: 14,
  },
});
