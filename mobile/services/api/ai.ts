import { executeGraphQL } from './client';
import { AIMessageRequest, AIMessageResponse } from './types';

/**
 * AI Service
 * Handles AI-powered message generation
 */

/**
 * Generate an AI-powered message
 */
export const requestAIMessage = async (prompt: string): Promise<string> => {
  const mutation = `
    mutation GenerateAIMessage($request: AIMessageRequest!) {
      generateAIMessage(request: $request) {
        generatedMessage
      }
    }
  `;

  const request: AIMessageRequest = {
    prompt,
    tone: 'warm',
    language: 'English',
  };

  try {
    const data = await executeGraphQL<{ generateAIMessage: AIMessageResponse }>(
      mutation,
      { request }
    );
    return data.generateAIMessage.generatedMessage;
  } catch (error: any) {
    console.error('Failed to generate AI message:', error.message);
    
    // Check if it's a network error
    if (error.message.includes('Cannot connect to server')) {
      throw new Error('Cannot connect to AI service. Please check your backend is running.');
    }
    
    // Provide a fallback message if AI generation fails
    console.log('AI generation failed, using fallback');
    throw new Error('AI message generation is currently unavailable. Please write your own message.');
  }
};

/**
 * Generate an AI message with custom parameters
 */
export const generateCustomAIMessage = async (
  request: AIMessageRequest
): Promise<string> => {
  const mutation = `
    mutation GenerateAIMessage($request: AIMessageRequest!) {
      generateAIMessage(request: $request) {
        generatedMessage
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ generateAIMessage: AIMessageResponse }>(
      mutation,
      { request }
    );
    return data.generateAIMessage.generatedMessage;
  } catch (error: any) {
    console.error('Failed to generate custom AI message:', error.message);
    throw new Error('Unable to generate AI message. ' + error.message);
  }
};

