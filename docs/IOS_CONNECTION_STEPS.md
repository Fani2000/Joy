# iOS Connection Steps

## Current Status
- ✅ Backend is running on `http://localhost:5000/graphql`
- ✅ CORS is properly configured
- ✅ Mobile app is set to connect to backend (`USE_MOCK_DATA = false`)
- ✅ iOS uses `localhost:5000` (correct for iOS simulator)

## Steps to Connect iOS

### 1. Stop All Running Services
```bash
# Press Ctrl+C in any terminals running Expo or backend
```

### 2. Start Backend
```bash
cd backend/src/Joy.AppHost
dotnet run
```

Wait until you see:
```
✅ Now listening on: http://localhost:5000
```

### 3. Start Mobile App (New Terminal)
```bash
cd mobile
npx expo start --clear
```

### 4. Open iOS Simulator
In the Expo terminal, press `i` to open iOS simulator

### 5. Watch for Connection
Look in the Metro bundler console for:
```
GraphQL Client initialized with endpoint: http://localhost:5000/graphql
```

## Troubleshooting

### If iOS Still Won't Connect:

#### Option 1: Switch Back to Mock Data (Quick Fix)
Edit `mobile/config/api.ts`:
```typescript
export const USE_MOCK_DATA = true; // Switch back to mock data
```

Then restart Expo:
```bash
npx expo start --clear
```

#### Option 2: Check Backend is Running
```bash
# Test the endpoint
curl -X POST http://localhost:5000/graphql -H "Content-Type: application/json" -d "{\"query\":\"{__typename}\"}"
```

Should return:
```json
{"data":{"__typename":"Query"}}
```

#### Option 3: Check iOS Simulator Network
In iOS Simulator:
- Open Safari
- Go to: `http://localhost:5000/graphql`
- Should see GraphQL Banana Cake Pop interface

### If You See CORS Errors:
The backend CORS is already configured correctly. If you still see CORS errors:

1. Restart the backend completely
2. Clear mobile app cache: `npx expo start --clear`
3. In iOS Simulator: Device → Erase All Content and Settings

### Common Error Messages:

**"Cannot connect to server"**
- Backend is not running on port 5000
- Solution: Start the backend first

**"Request timeout"**
- Backend is slow to respond
- Solution: Check backend console for errors

**"Network Error"**
- iOS simulator can't reach localhost
- Solution: Use mock data instead (see Option 1)

## Quick Switch Between Mock/Real Data

### Use Mock Data (No backend needed):
```typescript
// mobile/config/api.ts
export const USE_MOCK_DATA = true;
```

### Use Real Backend:
```typescript
// mobile/config/api.ts
export const USE_MOCK_DATA = false;
```

**Remember**: Always restart Expo with `--clear` flag after changing this setting!

## Verification Checklist

- [ ] Backend is running on port 5000
- [ ] Can access `http://localhost:5000/graphql` in browser
- [ ] `USE_MOCK_DATA` is set correctly in `mobile/config/api.ts`
- [ ] Expo server restarted with `--clear` flag
- [ ] iOS simulator is open and app is running
- [ ] Check Expo console for "GraphQL Client initialized" message
- [ ] Check app logs for any error messages

## Need More Help?

If the app still won't connect:
1. Share the error message from the Expo console
2. Share any red errors in the app
3. Confirm backend is showing requests in its console

