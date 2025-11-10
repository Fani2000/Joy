/**
 * API Services Index
 * Central export point for all API services
 */

// Export types
export * from './types';

// Export services
export * from './gifts';
export * from './messages';
export * from './friends';
export * from './ai';
export * from './communication';

// Export client for advanced use cases
export { graphqlClient, executeGraphQL } from './client';

