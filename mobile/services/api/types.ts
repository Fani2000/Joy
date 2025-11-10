// Common types used across the API services

export interface Gift {
  id: string;
  title: string;
  description: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
  createdAt: string;
}

export interface GiftInput {
  title: string;
  description: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
}

export interface Message {
  id: string;
  content: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
  createdAt: string;
}

export interface MessageInput {
  content: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  birthday?: string;
}

export interface FriendInput {
  name: string;
  email: string;
  birthday?: string;
}

export interface AIMessageRequest {
  prompt: string;
  tone?: string;
  language?: string;
}

export interface AIMessageResponse {
  generatedMessage: string;
}

export interface CommunicationInput {
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  message: string;
  subject?: string;
}

export interface CommunicationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

