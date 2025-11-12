import { executeGraphQL } from './client';
import { Friend, FriendInput } from './types';
import { USE_MOCK_DATA } from '../../config/api';
import { mockApi } from './mockData';

/**
 * Friends Service
 * Handles all friend-related API operations
 */

/**
 * Fetch all friends
 */
export const getFriends = async (): Promise<Friend[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('👥 Using mock data for friends');
    return mockApi.getFriends();
  }

  const query = `
    query GetFriends {
      friends {
        id
        name
        email
        birthday
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ friends: Friend[] }>(query);
    return data.friends || [];
  } catch (error: any) {
    console.error('Failed to fetch friends:', error.message);
    throw new Error('Unable to load friends. ' + error.message);
  }
};

/**
 * Add a new friend
 */
export const addFriend = async (input: FriendInput): Promise<Friend> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('👥 Using mock data to add friend');
    return mockApi.addFriend(input);
  }

  const mutation = `
    mutation AddFriend($input: FriendInput!) {
      addFriend(input: $input) {
        id
        name
        email
        birthday
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ addFriend: Friend }>(mutation, { input });
    return data.addFriend;
  } catch (error: any) {
    console.error('Failed to add friend:', error.message);
    throw new Error('Unable to add friend. ' + error.message);
  }
};

/**
 * Delete a friend by ID
 */
export const deleteFriend = async (id: string): Promise<boolean> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('👥 Using mock data to delete friend');
    return mockApi.deleteFriend(id);
  }

  const mutation = `
    mutation DeleteFriend($id: String!) {
      deleteFriend(id: $id)
    }
  `;

  try {
    const data = await executeGraphQL<{ deleteFriend: boolean }>(mutation, { id });
    return data.deleteFriend;
  } catch (error: any) {
    console.error('Failed to delete friend:', error.message);
    throw new Error('Unable to delete friend. ' + error.message);
  }
};

/**
 * Get friends with upcoming birthdays
 */
export const getUpcomingBirthdays = async (days: number = 7): Promise<Friend[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('👥 Using mock data for upcoming birthdays');
    return mockApi.getUpcomingBirthdays(days);
  }

  const query = `
    query GetUpcomingBirthdays($days: Int!) {
      upcomingBirthdays(days: $days) {
        id
        name
        email
        birthday
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ upcomingBirthdays: Friend[] }>(query, { days });
    return data.upcomingBirthdays || [];
  } catch (error: any) {
    console.error('Failed to fetch upcoming birthdays:', error.message);
    // Return empty array if this query is not supported
    return [];
  }
};

