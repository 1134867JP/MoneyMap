import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling
const baseWidth = 375;
const baseHeight = 812;

export const wp = (widthPercent) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

export const hp = (heightPercent) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};

export const scale = (size) => (SCREEN_WIDTH / baseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / baseHeight) * size;

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isLargeDevice = SCREEN_WIDTH >= 768;