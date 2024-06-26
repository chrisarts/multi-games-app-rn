import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TetrisGame } from '@games/tetris';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Digital-Regular': require('./assets/fonts/Digital-Regular.ttf'),
    'Digital-Bold': require('./assets/fonts/Digital-Bold.ttf'),
    'Digital-Italic': require('./assets/fonts/Digital-Italic.ttf'),
    'Digital-ItalicBold': require('./assets/fonts/Digital-ItalicBold.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TetrisGame />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // justifyContent: "center",
    // alignItems: "center",
  },
});
