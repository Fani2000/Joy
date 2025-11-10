# Migration Guide: Old graphql.ts → New API Services

This guide explains the migration from the old monolithic `services/graphql.ts` to the new modular API service structure.

## 🔄 What Changed

### Old Structure (Single File)
```
services/
└── graphql.ts  (260 lines - everything in one file)
```

### New Structure (Modular)
```
services/api/
├── client.ts          # GraphQL client configuration
├── types.ts           # All TypeScript interfaces
├── gifts.ts           # Gift operations
├── messages.ts        # Message operations
├── friends.ts         # Friend operations
├── ai.ts              # AI generation
├── communication.ts   # Email/SMS/WhatsApp
└── index.ts          # Central exports
```

## 📝 Migration Checklist

All imports have been automatically updated in:
- ✅ `app/(tabs)/index.tsx`
- ✅ `app/(tabs)/gifts.tsx`
- ✅ `app/(tabs)/messages.tsx`
- ✅ `app/(tabs)/profile.tsx`
- ✅ `app/send-gift.tsx`
- ✅ `app/send-message.tsx`

## 🔧 Import Changes

### Before (Old):
```typescript
import { getGifts, sendGift } from '../../services/graphql';
import { getMessages, sendMessage } from '../../services/graphql';
import { requestAIMessage } from '../../services/graphql';
```

### After (New):
```typescript
import { getGifts, sendGift, Gift } from '../../services/api';
import { getMessages, sendMessage, Message } from '../../services/api';
import { requestAIMessage } from '../../services/api';
```

**Note:** All imports now come from `services/api` which exports everything from `services/api/index.ts`

## 🆕 What's New

### 1. **Better Error Handling**
Network errors now provide clear, actionable messages:

```typescript
// Old: Generic axios errors
catch (error) {
  console.log(error); // Unclear error
}

// New: User-friendly error messages
catch (error: any) {
  // Error messages like:
  // "Cannot connect to server. Please ensure the backend is running at http://localhost:5000/graphql"
  // "Request timeout. Please check your internet connection."
  // "Authentication failed. Please login again."
  Alert.alert('Error', error.message);
}
```

### 2. **Endpoint Fixed to localhost:5000**
No more platform-specific endpoints by default:

```typescript
// services/api/client.ts
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';
```

To use a different endpoint (Android emulator, physical device), edit `client.ts`.

### 3. **Organized by Domain**
Each service file focuses on one domain:

```typescript
// services/api/gifts.ts - Only gift operations
export const getGifts = async (...) => { ... };
export const sendGift = async (...) => { ... };
export const deleteGift = async (...) => { ... };

// services/api/messages.ts - Only message operations
export const getMessages = async (...) => { ... };
export const sendMessage = async (...) => { ... };
export const deleteMessage = async (...) => { ... };
```

### 4. **Type Safety**
All types are centralized in `types.ts`:

```typescript
// Import types alongside functions
import { getGifts, Gift, Message } from '../../services/api';

const gifts: Gift[] = await getGifts(email);
```

### 5. **Better Documentation**
- Each service file has JSDoc comments
- Clear function descriptions
- Usage examples
- Error handling guidance

### 6. **Consistent Error Messages**
All services throw errors with consistent format:

```typescript
throw new Error('Unable to load gifts. ' + error.message);
throw new Error('Unable to send message. ' + error.message);
```

## 🐛 Breaking Changes

### Communication API Changed
The `sendCommunication` function signature changed:

```typescript
// Old (from graphql.ts)
sendCommunication(type, recipient, message);

// New (from communication.ts)
sendEmail(recipientEmail, subject, body);
sendSMS(phoneNumber, message);
sendWhatsApp(phoneNumber, message);
```

**Already Fixed in:** `app/send-message.tsx`

### AI Message Request Changed
The AI request now uses a simpler interface:

```typescript
// Old
generateAIMessage({
  occasion: 'birthday',
  recipientName: 'Sarah',
  tone: 'warm',
  additionalDetails: '...'
});

// New
requestAIMessage('Generate a birthday message for Sarah');
// Or with custom params:
generateCustomAIMessage({
  prompt: 'Generate a message',
  tone: 'warm',
  language: 'English'
});
```

**Already Fixed in:** `app/send-message.tsx`

## ✅ What Stays the Same

- All GraphQL queries and mutations remain identical
- Function names are the same (getGifts, sendMessage, etc.)
- Return types are the same
- Authentication token handling is automatic
- No changes needed in component logic

## 🧪 Testing After Migration

1. **Start Backend:**
   ```bash
   cd backend/Joy.AppHost
   dotnet run
   ```
   Verify it's running at `http://localhost:5000/graphql`

2. **Start Mobile App:**
   ```bash
   cd mobile
   npm start
   ```

3. **Test Each Feature:**
   - ✅ Login
   - ✅ View home stats (gifts + messages count)
   - ✅ Send a gift
   - ✅ Send a message
   - ✅ Generate AI message (click sparkle icon)
   - ✅ View gifts list
   - ✅ View messages list
   - ✅ Profile stats
   - ✅ Logout

4. **Check Console:**
   - Should see: `GraphQL Client initialized with endpoint: http://localhost:5000/graphql`
   - No error messages (unless backend is down)

5. **Test Error Scenarios:**
   - Stop backend → Try to load data → Should see clear error message
   - Wrong endpoint → Should see "Cannot connect to server" message

## 🔍 Troubleshooting

### "Cannot find module '../../services/api'"
- Run `npm install` in the mobile directory
- Restart Metro bundler: `Ctrl+C` then `npm start --clear`

### "Cannot connect to server"
- Ensure backend is running on port 5000
- Check `backend/Joy.AppHost` is started
- Verify Aspire dashboard shows Joy.Api as running

### Still importing from old path
Search for any remaining imports:
```bash
cd mobile
grep -r "from '.*graphql'" app/
```

Should return no results.

## 📚 Additional Resources

- [API Services README](./README.md) - Complete API documentation
- [Client Configuration](./client.ts) - GraphQL client setup
- [Types Reference](./types.ts) - All TypeScript interfaces

## ✨ Benefits of New Structure

1. **Maintainability**: Each file is small and focused
2. **Testability**: Easy to test individual services
3. **Discoverability**: Clear organization by domain
4. **Error Handling**: Comprehensive, user-friendly errors
5. **Type Safety**: Better TypeScript support
6. **Documentation**: Each service is well-documented
7. **Scalability**: Easy to add new services

---

Migration completed successfully! 🎉

For any issues, check the [main documentation](./README.md) or the [SETUP.md](../../../SETUP.md) guide.

