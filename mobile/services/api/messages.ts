import { executeGraphQL } from './client';
import { Message, MessageInput } from './types';

/**
 * Message Service
 * Handles all message-related API operations
 */

/**
 * Fetch all messages for a specific sender
 */
export const getMessages = async (senderEmail: string): Promise<Message[]> => {
  const query = `
    query GetMessages($senderEmail: String!) {
      messages(senderEmail: $senderEmail) {
        id
        content
        recipientEmail
        recipientName
        senderEmail
        createdAt
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ messages: Message[] }>(query, { senderEmail });
    return data.messages || [];
  } catch (error: any) {
    console.error('Failed to fetch messages:', error.message);
    throw new Error('Unable to load messages. ' + error.message);
  }
};

/**
 * Send a new message
 */
export const sendMessage = async (input: MessageInput): Promise<Message> => {
  const mutation = `
    mutation SendMessage($input: MessageInput!) {
      addMessage(input: $input) {
        id
        content
        recipientEmail
        recipientName
        senderEmail
        createdAt
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ addMessage: Message }>(mutation, { input });
    return data.addMessage;
  } catch (error: any) {
    console.error('Failed to send message:', error.message);
    throw new Error('Unable to send message. ' + error.message);
  }
};

/**
 * Delete a message by ID
 */
export const deleteMessage = async (id: string): Promise<boolean> => {
  const mutation = `
    mutation DeleteMessage($id: String!) {
      deleteMessage(id: $id)
    }
  `;

  try {
    const data = await executeGraphQL<{ deleteMessage: boolean }>(mutation, { id });
    return data.deleteMessage;
  } catch (error: any) {
    console.error('Failed to delete message:', error.message);
    throw new Error('Unable to delete message. ' + error.message);
  }
};

