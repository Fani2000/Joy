# Joy Mobile App 💝

A beautiful React Native app for sending gifts and birthday messages to friends, powered by GraphQL and AI.

## 🎯 Features

### ✅ Authentication
- **Login Screen** with email and password
- Secure token-based authentication
- Session persistence with AsyncStorage
- Auto-redirect to login when not authenticated

### 🏠 Home Screen
- Welcome banner with gradient background
- Real-time stats (gifts sent, messages sent)
- Quick action buttons for sending gifts and messages
- Pull-to-refresh functionality
- Beautiful animations and modern UI

### 🎁 Send Gifts
- Gift title and description
- Recipient name and email
- Direct integration with GraphQL backend
- Success notifications

### 💌 Send Messages
- Write custom birthday messages
- **AI Generate Button** - Automatically generate messages using AI
- Recipient information
- Email delivery (if configured in backend)
- Pull-to-refresh to reload

### 📜 History
- **Gifts Tab**: View all sent gifts with details
- **Messages Tab**: View all sent messages
- Beautiful card layouts
- Pull-to-refresh on both tabs

### 👤 Profile
- User email display
- Real-time statistics
- Account settings (placeholder)
- **Logout** functionality with confirmation

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm start

# For iOS simulator
npm run ios

# For Android emulator
npm run android
```

## 🔧 Configuration

### Backend Connection
The app automatically detects your platform and uses the correct endpoint:
- **Android Emulator**: `http://10.0.2.2:5000/graphql`
- **iOS Simulator**: `http://localhost:5000/graphql`

For physical devices, edit `mobile/config/api.ts` and replace with your machine's IP address.

### API Configuration File
```typescript
// mobile/config/api.ts
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: Platform.OS === 'android' 
    ? 'http://10.0.2.2:5000/graphql'  // Android
    : 'http://localhost:5000/graphql', // iOS
  REQUEST_TIMEOUT: 10000,
};
```

## 📱 Screens

### 1. Login (`app/login.tsx`)
- Email and password inputs
- Form validation
- Beautiful gradient background
- Demo mode (any credentials work)

### 2. Home (`app/(tabs)/index.tsx`)
- Stats dashboard
- Quick actions
- Recent activity
- Upcoming birthdays

### 3. Send Gift (`app/send-gift.tsx`)
- Gift form
- Backend integration
- Success feedback

### 4. Send Message (`app/send-message.tsx`)
- Message composer
- AI generation button
- Email delivery integration

### 5. Gifts List (`app/(tabs)/gifts.tsx`)
- All sent gifts
- Card layout
- Pull-to-refresh

### 6. Messages List (`app/(tabs)/messages.tsx`)
- All sent messages
- Card layout
- Pull-to-refresh

### 7. Profile (`app/(tabs)/profile.tsx`)
- User info
- Statistics
- Settings
- Logout

## 🎨 Tech Stack

- **React Native** 0.81.5
- **Expo SDK** 54
- **TypeScript** 5.9.2
- **Axios** for GraphQL queries
- **AsyncStorage** for local data
- **React Navigation** for routing
- **Expo Router** for file-based routing
- **Linear Gradient** for beautiful backgrounds
- **Vector Icons** (Ionicons)

## 🔐 Authentication Flow

```
1. App loads → Check AsyncStorage for user data
2. If no user → Redirect to /login
3. User logs in → Save to AsyncStorage
4. Redirect to /(tabs) → Home screen
5. All API requests include auth token
6. Logout → Clear AsyncStorage → Redirect to /login
```

## 📊 GraphQL Integration

All screens use the GraphQL service (`services/graphql.ts`) which provides:
- `getGifts(email)` - Fetch user's gifts
- `getMessages(email)` - Fetch user's messages
- `sendGift(data)` - Create new gift
- `sendMessage(data)` - Create new message
- `requestAIMessage(prompt)` - Generate AI message
- `sendCommunication(type, recipient, message)` - Send via email/SMS/WhatsApp

## 🎯 Key Components

### AuthContext (`contexts/AuthContext.tsx`)
Manages user authentication state across the app:
```typescript
const { user, login, logout, isLoading } = useAuth();
```

### API Config (`config/api.ts`)
Centralized API configuration for different platforms.

### GraphQL Service (`services/graphql.ts`)
All backend communication with automatic authentication headers.

## 🎨 Design System

### Colors
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#ec4899` (Pink)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

### Typography
- Headers: 18-28px, bold (900)
- Body: 14-16px, medium (600)
- Captions: 12-14px, regular (400)

### Spacing
- Base unit: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

## 🐛 Debugging

Enable debugging:
```bash
# Clear cache and restart
npx expo start --clear

# Check for errors in Metro bundler
# Look for red error screens on device/emulator
```

Common issues:
1. **Cannot connect to backend**: Ensure backend is running on port 5000
2. **Authentication not working**: Clear AsyncStorage data
3. **GraphQL errors**: Check backend logs in Aspire dashboard

## 📝 Environment

The app automatically detects `__DEV__` mode:
- Development: Uses localhost/10.0.2.2
- Production: Uses production API URL (configure in `config/api.ts`)

## 🎉 Demo Mode

For demonstration purposes:
- Login works with **any email and password**
- Backend may return mock data if not fully configured
- AI generation works with mock responses if Azure OpenAI not configured

## 📄 License

Private project for Joy App.

---

Made with ❤️ using React Native and Expo
