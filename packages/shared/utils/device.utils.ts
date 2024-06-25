import { Dimensions } from "react-native";

export const getDeviceDimensions = () => {
  const dimensions = Dimensions.get("window");
  return {
    WIDTH: dimensions.width,
    HEIGHT: dimensions.height,
  };
};
