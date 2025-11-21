import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isWeb = Platform.OS === 'web';
export const isMobile = !isWeb;

// Responsive dimensions
export const screenWidth = width;
export const screenHeight = height;

// Breakpoints
export const isTablet = width >= 768;
export const isSmallScreen = width < 375;

// Responsive spacing
export const spacing = {
  xs: isSmallScreen ? 4 : 6,
  sm: isSmallScreen ? 8 : 12,
  md: isSmallScreen ? 16 : 20,
  lg: isSmallScreen ? 24 : 32,
  xl: isSmallScreen ? 32 : 40,
};

// Responsive font sizes
export const fontSize = {
  xs: isSmallScreen ? 12 : 14,
  sm: isSmallScreen ? 14 : 16,
  md: isSmallScreen ? 16 : 18,
  lg: isSmallScreen ? 24 : 28,
  xl: isSmallScreen ? 28 : 32,
  xxl: isSmallScreen ? 32 : 40,
};

// Max width for web
export const maxContentWidth = 600;

// Responsive padding
export const getPadding = () => {
  if (isWeb) {
    return isTablet ? 32 : 24;
  }
  return isSmallScreen ? 16 : 24;
};

