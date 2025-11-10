import { executeGraphQL } from './client';
import { CommunicationInput, CommunicationResponse } from './types';

/**
 * Communication Service
 * Handles sending messages via email, SMS, and WhatsApp
 */

/**
 * Send a message via email, SMS, or WhatsApp
 */
export const sendCommunication = async (
  type: 'email' | 'sms' | 'whatsapp',
  recipient: string,
  message: string,
  subject?: string
): Promise<boolean> => {
  const input: CommunicationInput = {
    type,
    recipient,
    message,
    subject,
  };

  return sendCommunicationRequest(input);
};

/**
 * Send an email
 */
export const sendEmail = async (
  recipientEmail: string,
  subject: string,
  body: string
): Promise<boolean> => {
  const mutation = `
    mutation SendEmail($request: SendEmailRequest!) {
      sendEmail(request: $request) {
        success
        message
        error
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ sendEmail: CommunicationResponse }>(mutation, {
      request: {
        recipientEmail,
        subject,
        body,
      },
    });
    
    if (!data.sendEmail.success && data.sendEmail.error) {
      throw new Error(data.sendEmail.error);
    }
    
    return data.sendEmail.success;
  } catch (error: any) {
    console.error('Failed to send email:', error.message);
    // Don't throw - email sending is optional
    console.log('Email sending failed, continuing anyway');
    return false;
  }
};

/**
 * Send an SMS
 */
export const sendSMS = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  const mutation = `
    mutation SendSms($request: SendMessageRequest!) {
      sendSms(request: $request) {
        success
        message
        error
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ sendSms: CommunicationResponse }>(mutation, {
      request: {
        recipient: phoneNumber,
        message,
      },
    });
    
    if (!data.sendSms.success && data.sendSms.error) {
      throw new Error(data.sendSms.error);
    }
    
    return data.sendSms.success;
  } catch (error: any) {
    console.error('Failed to send SMS:', error.message);
    // Don't throw - SMS sending is optional
    return false;
  }
};

/**
 * Send a WhatsApp message
 */
export const sendWhatsApp = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  const mutation = `
    mutation SendWhatsAppMessage($request: SendWhatsAppMessageRequest!) {
      sendWhatsAppMessage(request: $request) {
        success
        message
        error
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ sendWhatsAppMessage: CommunicationResponse }>(
      mutation,
      {
        request: {
          recipientPhoneNumber: phoneNumber,
          message,
        },
      }
    );
    
    if (!data.sendWhatsAppMessage.success && data.sendWhatsAppMessage.error) {
      throw new Error(data.sendWhatsAppMessage.error);
    }
    
    return data.sendWhatsAppMessage.success;
  } catch (error: any) {
    console.error('Failed to send WhatsApp message:', error.message);
    // Don't throw - WhatsApp sending is optional
    return false;
  }
};

/**
 * Internal helper to send communication request
 */
const sendCommunicationRequest = async (
  input: CommunicationInput
): Promise<boolean> => {
  const mutation = `
    mutation SendCommunication($input: CommunicationInput!) {
      sendCommunication(input: $input) {
        success
        message
        error
      }
    }
  `;

  try {
    const data = await executeGraphQL<{ sendCommunication: CommunicationResponse }>(
      mutation,
      { input }
    );
    
    if (!data.sendCommunication.success && data.sendCommunication.error) {
      console.error('Communication error:', data.sendCommunication.error);
    }
    
    return data.sendCommunication.success;
  } catch (error: any) {
    console.error('Failed to send communication:', error.message);
    // Don't throw - communication is optional
    return false;
  }
};

