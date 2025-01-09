import { useEffect, useSyncExternalStore } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { CanvasBoard } from './board/CanvasBoard';
import type { GridPoint } from './models/GridCell.model';


export const TetrisGame = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CanvasBoard />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
