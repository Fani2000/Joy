import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * GraphQL Client Configuration
 * 
 * Endpoint: http://localhost:5000/graphql
 * 
 * Note: For Android emulator, you may need to use http://10.0.2.2:5000/graphql
 * For iOS simulator, localhost works fine
 * For physical devices, use your machine's IP address
 */

// GraphQL endpoint - Set to localhost:5000 as requested
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

export const graphqlClient = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Log the endpoint for debugging
console.log('GraphQL Client initialized with endpoint:', GRAPHQL_ENDPOINT);

// Add authentication token to requests
graphqlClient.interceptors.request.use(
  async (config) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.log('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
graphqlClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      if (status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (status === 404) {
        throw new Error('API endpoint not found. Please check your backend is running.');
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Request was made but no response
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      } else if (error.message.includes('Network Error')) {
        throw new Error(
          'Cannot connect to server. Please ensure the backend is running at ' + GRAPHQL_ENDPOINT
        );
      }
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

// Helper function to execute GraphQL queries/mutations
export const executeGraphQL = async <T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  try {
    const response = await graphqlClient.post('', {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessage = response.data.errors
        .map((err: any) => err.message)
        .join(', ');
      throw new Error(`GraphQL Error: ${errorMessage}`);
    }

    return response.data.data;
  } catch (error: any) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

