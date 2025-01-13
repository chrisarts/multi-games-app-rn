import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GridView } from './Presentation/GridSvg.view';
// import { GridView } from './Presentation/Grid.view';
// import { CanvasBoard } from '../board/CanvasBoard';

export const TetrisGame = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GridView />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
