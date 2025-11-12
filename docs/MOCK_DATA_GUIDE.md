# Mock Data Guide

## Overview

The mobile app now supports **mock data mode** so you can develop and test without connecting to the backend. This is perfect for when you can't run the app in an emulator or deploy the backend.

## Quick Start

### Enable Mock Data

In `mobile/config/api.ts`, set:

```typescript
export const USE_MOCK_DATA = true;  // Use fake data
```

### Disable Mock Data (Use Real API)

```typescript
export const USE_MOCK_DATA = false;  // Connect to backend
```

## What's Included

### Mock Gifts (3 items)
- 🎂 Birthday Cake
- 🎁 Gift Card
- 🌹 Flower Bouquet

### Mock Messages (3 items)
- Happy Birthday messages with emojis
- Sent to different recipients
- Various timestamps

### Mock Friends (5 people)
- Jane Smith
- John Doe
- Sarah Johnson
- Mike Wilson
- Emily Brown

## Features

✅ **Full CRUD Operations**: Create, Read, Delete
✅ **Simulated Network Delay**: 500ms delay for realistic experience
✅ **In-Memory Storage**: Changes persist during app session
✅ **Console Logging**: See when mock data is being used
✅ **Type-Safe**: Uses the same types as the real API

## Console Output

When using mock data, you'll see:
- `📦 Using mock data for gifts`
- `💌 Using mock data for messages`
- `👥 Using mock data for friends`

## How It Works

1. **Config Flag**: `USE_MOCK_DATA` controls which data source to use
2. **Mock API**: Located in `mockData.ts` with all sample data
3. **Service Layer**: Each service (gifts, messages, friends) checks the flag
4. **Automatic Switching**: Change one flag to switch between mock and real API

## Usage Examples

### Viewing Data
- Open the app and navigate to Gifts, Messages, or Profile tabs
- You'll see the mock data loaded automatically
- Pull to refresh works with mock data

### Adding New Items
- Send a new gift or message
- It will be added to the in-memory mock storage
- The new item will appear in the list immediately

### Deleting Items
- Swipe or tap to delete (if implemented in UI)
- Item will be removed from mock storage

### Resetting Mock Data
If you want to reset to the original mock data (in development):

```typescript
import { resetMockData } from './services/api/mockData';

// Reset all mock data to defaults
resetMockData();
```

## Switching Back to Real API

When your backend is ready:

1. Set `USE_MOCK_DATA = false` in `config/api.ts`
2. Ensure backend is running
3. Restart the app
4. The app will now connect to the real GraphQL API

## Mock User Email

The mock user email is: `demo@example.com`

All mock data is associated with this email address. When querying gifts or messages, they're filtered by this sender email.

## Customizing Mock Data

To add or modify mock data, edit `mobile/services/api/mockData.ts`:

```typescript
// Add a new gift
export const mockGifts: Gift[] = [
  {
    id: generateId(),
    title: '🎈 Birthday Balloons',
    description: 'Colorful birthday balloons',
    recipientEmail: 'friend@example.com',
    recipientName: 'Friend Name',
    senderEmail: MOCK_USER_EMAIL,
    createdAt: new Date().toISOString(),
  },
  // ... existing items
];
```

## Benefits

✅ **No Backend Required**: Develop UI/UX without backend setup
✅ **Faster Development**: No network delays (except simulated ones)
✅ **Offline Testing**: Test app behavior offline
✅ **Physical Device Testing**: Works on physical devices without network config
✅ **Consistent Data**: Same data every time you restart
✅ **Easy Toggle**: Switch between mock and real API instantly

## Notes

- Mock data persists during the app session only
- Restarting the app resets to the default mock data
- The mock API simulates network delays (500ms) for realistic UX
- All GraphQL queries/mutations are bypassed when using mock data
- Authentication still works normally with mock data

## Troubleshooting

### Not seeing mock data?
- Check that `USE_MOCK_DATA = true` in `config/api.ts`
- Look for console logs like `📦 Using mock data for gifts`
- Restart the app after changing the flag

### Want to test real API?
- Set `USE_MOCK_DATA = false`
- Make sure backend is running on `http://localhost:5000/graphql`
- Check network connectivity

### Mock data not updating?
- Changes persist during the app session
- Restart the app to reset to defaults
- Or call `resetMockData()` programmatically

## Files Modified

1. ✅ `mobile/services/api/mockData.ts` - New file with all mock data
2. ✅ `mobile/config/api.ts` - Added `USE_MOCK_DATA` flag
3. ✅ `mobile/services/api/gifts.ts` - Added mock data support
4. ✅ `mobile/services/api/messages.ts` - Added mock data support
5. ✅ `mobile/services/api/friends.ts` - Added mock data support

---

**Ready to develop!** 🚀 Your app now works with mock data without any backend connection.

