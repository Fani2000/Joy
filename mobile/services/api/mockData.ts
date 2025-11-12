import { Gift, Message, Friend } from './types';

/**
 * Mock Data for Development
 * Use this when you can't connect to the backend
 */

// Mock user email for consistent data
export const MOCK_USER_EMAIL = 'demo@example.com';

// Generate fake IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Gifts Data
export const mockGifts: Gift[] = [
  {
    id: generateId(),
    title: '🎂 Birthday Cake',
    description: 'A delicious chocolate birthday cake!',
    recipientEmail: 'jane@example.com',
    recipientName: 'Jane Smith',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: generateId(),
    title: '🎁 Gift Card',
    description: '$50 Amazon gift card for your special day',
    recipientEmail: 'john@example.com',
    recipientName: 'John Doe',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: generateId(),
    title: '🌹 Flower Bouquet',
    description: 'Beautiful roses for someone special',
    recipientEmail: 'sarah@example.com',
    recipientName: 'Sarah Johnson',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

// Mock Messages Data
export const mockMessages: Message[] = [
  {
    id: generateId(),
    content: 'Happy Birthday! 🎉 Wishing you an amazing day filled with joy and laughter!',
    recipientEmail: 'jane@example.com',
    recipientName: 'Jane Smith',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: generateId(),
    content: 'Have a wonderful birthday celebration! 🎂 May all your dreams come true!',
    recipientEmail: 'john@example.com',
    recipientName: 'John Doe',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: generateId(),
    content: 'Sending you warm birthday wishes and lots of love! ❤️',
    recipientEmail: 'mike@example.com',
    recipientName: 'Mike Wilson',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

// Helper to create upcoming birthdays (next few days from today)
const getUpcomingBirthdayDate = (daysFromNow: number): string => {
  const today = new Date();
  const birthday = new Date(today);
  birthday.setDate(today.getDate() + daysFromNow);
  // Format as YYYY-MM-DD but with year set to a birth year (e.g., 1990)
  const birthYear = 1990 + Math.floor(Math.random() * 10);
  return `${birthYear}-${String(birthday.getMonth() + 1).padStart(2, '0')}-${String(birthday.getDate()).padStart(2, '0')}`;
};

// Mock Friends Data with some upcoming birthdays
export const mockFriends: Friend[] = [
  {
    id: generateId(),
    name: 'Jane Smith',
    email: 'jane@example.com',
    birthday: getUpcomingBirthdayDate(2), // Birthday in 2 days
  },
  {
    id: generateId(),
    name: 'John Doe',
    email: 'john@example.com',
    birthday: getUpcomingBirthdayDate(5), // Birthday in 5 days
  },
  {
    id: generateId(),
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    birthday: getUpcomingBirthdayDate(15), // Birthday in 15 days (won't show in 7-day view)
  },
  {
    id: generateId(),
    name: 'Mike Wilson',
    email: 'mike@example.com',
    birthday: getUpcomingBirthdayDate(4), // Birthday in 4 days
  },
  {
    id: generateId(),
    name: 'Emily Brown',
    email: 'emily@example.com',
    birthday: '1994-05-18', // Past birthday this year (won't show)
  },
];

// In-memory storage for new items (simulates database)
let giftsStorage = [...mockGifts];
let messagesStorage = [...mockMessages];
let friendsStorage = [...mockFriends];

// Helper to simulate network delay
export const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API Functions
export const mockApi = {
  // Gifts
  getGifts: async (senderEmail: string): Promise<Gift[]> => {
    await simulateDelay();
    // For demo purposes, return mock data for any user
    // In a real app, this would filter by actual sender email
    return giftsStorage;
  },

  sendGift: async (input: any): Promise<Gift> => {
    await simulateDelay();
    const newGift: Gift = {
      id: generateId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    giftsStorage.push(newGift);
    return newGift;
  },

  deleteGift: async (id: string): Promise<boolean> => {
    await simulateDelay();
    const initialLength = giftsStorage.length;
    giftsStorage = giftsStorage.filter(g => g.id !== id);
    return giftsStorage.length < initialLength;
  },

  // Messages
  getMessages: async (senderEmail: string): Promise<Message[]> => {
    await simulateDelay();
    // For demo purposes, return mock data for any user
    // In a real app, this would filter by actual sender email
    return messagesStorage;
  },

  sendMessage: async (input: any): Promise<Message> => {
    await simulateDelay();
    const newMessage: Message = {
      id: generateId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    messagesStorage.push(newMessage);
    return newMessage;
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    await simulateDelay();
    const initialLength = messagesStorage.length;
    messagesStorage = messagesStorage.filter(m => m.id !== id);
    return messagesStorage.length < initialLength;
  },

  // Friends
  getFriends: async (): Promise<Friend[]> => {
    await simulateDelay();
    return friendsStorage;
  },

  addFriend: async (input: any): Promise<Friend> => {
    await simulateDelay();
    const newFriend: Friend = {
      id: generateId(),
      ...input,
    };
    friendsStorage.push(newFriend);
    return newFriend;
  },

  deleteFriend: async (id: string): Promise<boolean> => {
    await simulateDelay();
    const initialLength = friendsStorage.length;
    friendsStorage = friendsStorage.filter(f => f.id !== id);
    return friendsStorage.length < initialLength;
  },

  getUpcomingBirthdays: async (days: number = 7): Promise<Friend[]> => {
    await simulateDelay();
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return friendsStorage.filter(friend => {
      if (!friend.birthday) return false;
      const birthday = new Date(friend.birthday);
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
      return thisYearBirthday >= today && thisYearBirthday <= futureDate;
    });
  },
};

// Reset function for testing
export const resetMockData = () => {
  giftsStorage = [...mockGifts];
  messagesStorage = [...mockMessages];
  friendsStorage = [...mockFriends];
};

