import type { SharedValue } from "react-native-reanimated";

export interface GameStatusWorklet {
  /**
   * 0 - `Stop`
   * 1 - `Running`
   * 2 - `GameOver`
   */
  runState: SharedValue<number>
  speed: SharedValue<number>;
  level: SharedValue<number>;
}