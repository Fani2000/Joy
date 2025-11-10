import { executeGraphQL } from './client';
import { Gift, GiftInput } from './types';

/**
 * Gift Service
 * Handles all gift-related API operations
 */

/**
 * Fetch all gifts for a specific sender
 */
export const getGifts = async (senderEmail: string): Promise<Gift[]> => {
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

