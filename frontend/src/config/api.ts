// API Configuration
// For local development, use your machine's IP or localhost
// For web: http://localhost:3000
// For mobile/emulator: http://10.0.2.2:3000 (Android) or http://localhost:3000 (iOS)
// For physical device: http://YOUR_IP_ADDRESS:3000

const getApiUrl = () => {
  // Check if we're on web
  if (typeof window !== 'undefined') {
    return 'http://localhost:3000';
  }
  
  // For React Native, check if we're in development
  // @ts-ignore - __DEV__ is a global in React Native
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    // For iOS simulator, use localhost
    // For Android emulator, use 10.0.2.2
    // For physical device, you'll need to set this manually
    return 'http://localhost:3000';
  }
  
  // Production API URL - can be set via environment variable
  // @ts-ignore
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
};

export const API_BASE_URL = getApiUrl();

