import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import 'text-encoding-polyfill';
import App from './App';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: true, // Reanimated runs in strict mode by default
});

registerRootComponent(App);
