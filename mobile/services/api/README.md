# API Services Documentation

This directory contains all the API service modules for the Joy mobile app. Each service is organized by domain and handles specific GraphQL operations.

## 📁 Structure

```
services/api/
├── client.ts          # GraphQL client with auth & error handling
├── types.ts           # TypeScript interfaces for all data models
├── gifts.ts           # Gift-related operations
├── messages.ts        # Message-related operations
├── friends.ts         # Friend-related operations
├── ai.ts              # AI message generation
├── communication.ts   # Email/SMS/WhatsApp sending
└── index.ts          # Central export point
```

## 🔌 Endpoint Configuration

**Current Endpoint:** `http://localhost:5000/graphql`

### Platform-Specific Endpoints:
- **iOS Simulator**: `http://localhost:5000/graphql` ✅ (current)
- **Android Emulator**: `http://10.0.2.2:5000/graphql`
- **Physical Device**: `http://YOUR_IP:5000/graphql` (e.g., `http://192.168.1.100:5000/graphql`)

To change the endpoint, edit `services/api/client.ts`:
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';
```

## 📚 Services Overview

### 1. **Gifts Service** (`gifts.ts`)

Handles gift creation, retrieval, and deletion.

```typescript
import { getGifts, sendGift, deleteGift } from './services/api';

// Get all gifts for a user
const gifts = await getGifts('user@example.com');

// Send a new gift
const gift = await sendGift({
  title: 'Birthday Present',
  description: 'A special gift for you',
  recipientEmail: 'friend@example.com',
  recipientName: 'Friend Name',
  senderEmail: 'user@example.com',
});

// Delete a gift
await deleteGift(giftId);
```

### 2. **Messages Service** (`messages.ts`)

Handles message creation, retrieval, and deletion.

```typescript
import { getMessages, sendMessage, deleteMessage } from './services/api';

// Get all messages for a user
const messages = await getMessages('user@example.com');

// Send a new message
const message = await sendMessage({
  content: 'Happy Birthday!',
  recipientEmail: 'friend@example.com',
  recipientName: 'Friend Name',
  senderEmail: 'user@example.com',
});

// Delete a message
await deleteMessage(messageId);
```

### 3. **Friends Service** (`friends.ts`)

Manages friend relationships and birthday tracking.

```typescript
import { getFriends, addFriend, deleteFriend, getUpcomingBirthdays } from './services/api';

// Get all friends
const friends = await getFriends();

// Add a new friend
const friend = await addFriend({
  name: 'John Doe',
  email: 'john@example.com',
  birthday: '1990-05-15',
});

// Get friends with upcoming birthdays (next 7 days)
const upcoming = await getUpcomingBirthdays(7);

// Delete a friend
await deleteFriend(friendId);
```

### 4. **AI Service** (`ai.ts`)

Generate AI-powered messages for any occasion.

```typescript
import { requestAIMessage, generateCustomAIMessage } from './services/api';

// Generate a simple message
const message = await requestAIMessage('Generate a birthday message for Sarah');

// Generate with custom parameters
const customMessage = await generateCustomAIMessage({
  prompt: 'Write a heartfelt birthday message',
  tone: 'warm',
  language: 'English',
});
```

### 5. **Communication Service** (`communication.ts`)

Send messages via email, SMS, or WhatsApp.

```typescript
import { sendEmail, sendSMS, sendWhatsApp, sendCommunication } from './services/api';

// Send an email
await sendEmail(
  'friend@example.com',
  'Happy Birthday!',
  'Wishing you a wonderful day...'
);

// Send an SMS
await sendSMS('+1234567890', 'Happy Birthday!');

// Send a WhatsApp message
await sendWhatsApp('+1234567890', 'Happy Birthday!');

// Generic communication method
await sendCommunication(
  'email',
  'friend@example.com',
  'Happy Birthday!',
  'Birthday Wishes'
);
```

## 🛡️ Error Handling

All services include comprehensive error handling:

### Network Errors
- **Connection Failed**: `Cannot connect to server. Please ensure the backend is running at http://localhost:5000/graphql`
- **Timeout**: `Request timeout. Please check your internet connection.`
- **401 Unauthorized**: `Authentication failed. Please login again.`
- **404 Not Found**: `API endpoint not found. Please check your backend is running.`
- **500+ Server Error**: `Server error. Please try again later.`

### GraphQL Errors
- Automatically extracts and displays GraphQL error messages
- Logs errors to console for debugging

### Usage Example:
```typescript
try {
  const gifts = await getGifts(userEmail);
  // Handle success
} catch (error: any) {
  // Error message is user-friendly
  Alert.alert('Error', error.message);
  // Detailed error is logged to console
}
```

## 🔐 Authentication

All API requests automatically include authentication tokens:

1. Token is retrieved from AsyncStorage
2. Added to request headers as `Authorization: Bearer TOKEN`
3. Handled transparently by the GraphQL client

**No manual token management required!**

## 🎯 Usage in Components

Import services from the central index:

```typescript
import {
  // Services
  getGifts,
  sendGift,
  getMessages,
  sendMessage,
  requestAIMessage,
  sendEmail,
  
  // Types
  Gift,
  Message,
  Friend,
} from '../../services/api';
```

### Example: Home Screen
```typescript
const loadStats = async () => {
  try {
    const [gifts, messages] = await Promise.all([
      getGifts(user.email),
      getMessages(user.email),
    ]);
    
    setStats({
      gifts: gifts.length,
      messages: messages.length,
    });
  } catch (error: any) {
    console.error('Failed to load stats:', error.message);
  }
};
```

### Example: Send Gift
```typescript
const handleSend = async () => {
  try {
    await sendGift({
      title: giftTitle,
      description: giftDescription,
      recipientEmail: recipientEmail,
      recipientName: recipientName,
      senderEmail: user.email,
    });
    
    Alert.alert('Success', 'Gift sent!');
  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};
```

## 🔍 Debugging

### Enable Detailed Logging
The client logs all requests and errors to the console:

```typescript
// In client.ts
console.log('GraphQL Client initialized with endpoint:', GRAPHQL_ENDPOINT);
console.error('GraphQL request failed:', error);
```

### Common Issues

**1. Cannot connect to server**
- Ensure backend is running: `cd backend/Joy.AppHost && dotnet run`
- Check endpoint matches your backend URL
- For Android emulator, use `10.0.2.2` instead of `localhost`

**2. Authentication failed**
- Clear app data and login again
- Check AsyncStorage has user data
- Verify token is being sent in headers

**3. GraphQL errors**
- Check backend logs in Aspire dashboard
- Verify GraphQL schema matches mutations/queries
- Ensure backend services are running (MongoDB, RabbitMQ)

## 📦 Types

All TypeScript interfaces are defined in `types.ts`:

```typescript
interface Gift {
  id: string;
  title: string;
  description: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  recipientEmail: string;
  recipientName?: string;
  senderEmail: string;
  createdAt: string;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  birthday?: string;
}

// ... and more
```

## 🧪 Testing

To test the API services:

```bash
# 1. Start the backend
cd backend/Joy.AppHost
dotnet run

# 2. Start the mobile app
cd mobile
npm start

# 3. Login with any credentials
# 4. Try sending gifts/messages
# 5. Check console for request logs
```

## 🚀 Adding New Services

To add a new service:

1. Create `services/api/your-service.ts`
2. Define types in `types.ts`
3. Export from `index.ts`

Example:
```typescript
// services/api/notifications.ts
import { executeGraphQL } from './client';
import { Notification } from './types';

export const getNotifications = async (): Promise<Notification[]> => {
  const query = `
    query GetNotifications {
      notifications {
        id
        message
        createdAt
      }
    }
  `;
  
  try {
    const data = await executeGraphQL<{ notifications: Notification[] }>(query);
    return data.notifications || [];
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error.message);
    throw new Error('Unable to load notifications. ' + error.message);
  }
};
```

## 📝 Best Practices

1. **Always use try-catch** when calling API services
2. **Show user-friendly errors** using Alert or Toast
3. **Log detailed errors** to console for debugging
4. **Use TypeScript types** for type safety
5. **Handle loading states** in components
6. **Implement pull-to-refresh** for data lists
7. **Cache data** when appropriate (React Query, SWR)

## 🔗 Related Documentation

- [Backend API Documentation](../../../backend/README.md)
- [GraphQL Schema](../../../backend/Joy.Api/GraphQL/README.md)
- [Mobile App Documentation](../../README.md)

---

For questions or issues, check the main [SETUP.md](../../../SETUP.md) guide.

