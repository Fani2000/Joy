import { executeGraphQL } from './client';
import { Gift, GiftInput } from './types';
import { USE_MOCK_DATA } from '../../config/api';
import { mockApi } from './mockData';

/**
 * Gift Service
 * Handles all gift-related API operations
 */

/**
 * Fetch all gifts for a specific sender
 */
export const getGifts = async (senderEmail: string): Promise<Gift[]> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data for gifts');
    return mockApi.getGifts(senderEmail);
  }

  const query = `
    query GetGifts($senderEmail: String!) {
      gifts(senderEmail: $senderEmail) {
        id
        title
        description
        recipientEmail
        recipientName
        senderEmail
        createdAt
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ gifts: Gift[] }>(query, { senderEmail });
    return data.gifts || [];
  } catch (error: any) {
    console.error('Failed to fetch gifts:', error.message);
    throw new Error('Unable to load gifts. ' + error.message);
  }
};

/**
 * Send a new gift
 */
export const sendGift = async (input: GiftInput): Promise<Gift> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data to send gift');
    return mockApi.sendGift(input);
  }

  const mutation = `
    mutation SendGift($input: GiftInput!) {
      addGift(input: $input) {
        id
        title
        description
        recipientEmail
        recipientName
        senderEmail
        createdAt
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ addGift: Gift }>(mutation, { input });
    return data.addGift;
  } catch (error: any) {
    console.error('Failed to send gift:', error.message);
    throw new Error('Unable to send gift. ' + error.message);
  }
};

/**
 * Delete a gift by ID
 */
export const deleteGift = async (id: string): Promise<boolean> => {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data to delete gift');
    return mockApi.deleteGift(id);
  }

  const mutation = `
    mutation DeleteGift($id: String!) {
      deleteGift(id: $id)
    }
  `;

  try {
    const data = await executeGraphQL<{ deleteGift: boolean }>(mutation, { id });
    return data.deleteGift;
  } catch (error: any) {
    console.error('Failed to delete gift:', error.message);
    throw new Error('Unable to delete gift. ' + error.message);
  }
};

