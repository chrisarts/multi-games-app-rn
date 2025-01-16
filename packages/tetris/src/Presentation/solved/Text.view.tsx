import { type SkPoint, Text, useFont } from '@shopify/react-native-skia';

interface TextViewProps {
  fontSize: number;
  point: SkPoint;
  text: string;
}
export const TextView = ({ fontSize, point, text }: TextViewProps) => {
  const font = useFont(require('../../Data/fonts/Digital-Regular.ttf'), fontSize);

  if (!font) return null;

  return <Text font={font} text={text} x={point.x} y={point.y} color='white' />;
};
