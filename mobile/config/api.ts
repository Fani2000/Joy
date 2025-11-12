import { Platform } from 'react-native';

/**
 * API Configuration
 * Configure your backend GraphQL endpoint here
 */

// Set to true to use mock data instead of real API
// Change to false when backend is available
export const USE_MOCK_DATA = true;

// Backend API configuration
export const API_CONFIG = {
  // GraphQL endpoint - Currently set to localhost:5000
  // For Android emulator, use 10.0.2.2 to access localhost
  // For iOS simulator, use localhost
  // For physical devices, use your machine's IP address (e.g., 192.168.1.100:5000)
  GRAPHQL_ENDPOINT: 'http://localhost:5000/graphql',
    
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Helper function to get the API URL
export const getApiUrl = () => API_CONFIG.GRAPHQL_ENDPOINT;

/**
 * Platform-specific endpoint helper
 * Uncomment this and use it in client.ts if you need platform-specific endpoints
 */
export const getPlatformSpecificEndpoint = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com/graphql';
  }
  
  // Development endpoints
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/graphql'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/graphql'; // iOS simulator
  } else {
    return 'http://localhost:5000/graphql'; // Web or other
  }
  
  // For PHYSICAL DEVICES, uncomment and use your PC's IP address:
  // Your PC IP: 192.168.0.168
  // return 'http://192.168.0.168:5000/graphql';
};

