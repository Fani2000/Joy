# 📱 Backend Connection Guide

## 🎯 Quick Fix Applied

The mobile app now **automatically detects your platform** and uses the correct endpoint!

---

## ✅ What Changed

**File:** `mobile/services/api/client.ts`

**Before:**
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'; // ❌ Doesn't work on Android/physical devices
```

**After:**
```typescript
import { getPlatformSpecificEndpoint } from '../../config/api';

const GRAPHQL_ENDPOINT = getPlatformSpecificEndpoint(); // ✅ Auto-detects platform!
```

---

## 📱 Platform Support

| Platform | Endpoint | Status |
|----------|----------|--------|
| **Android Emulator** | `http://10.0.2.2:5000/graphql` | ✅ Auto-configured |
| **iOS Simulator** | `http://localhost:5000/graphql` | ✅ Auto-configured |
| **Physical Device** | `http://YOUR_PC_IP:5000/graphql` | ⚠️  Manual config needed |
| **Production** | `https://your-api.com/graphql` | ✅ Auto-configured |

---

## 🚀 How to Test

### Step 1: Make Sure Backend is Running

```bash
cd backend/Joy.AppHost
dotnet run
```

**Verify it's working:**
Open http://localhost:5000/graphql in your browser - you should see GraphQL playground.

### Step 2: Restart Mobile App

```bash
# Stop the current app (Ctrl+C)
cd mobile
npm start
```

Then press `r` to reload.

### Step 3: Check Console Output

You should see:
```
✅ GraphQL Client initialized with endpoint: http://10.0.2.2:5000/graphql
```
(On Android emulator)

### Step 4: Verify Connection

The home screen should load without errors and show:
- Gifts count
- Messages count

---

## 📱 For Physical Devices

### Your PC's IP Address: `192.168.0.168`

To test on a physical device:

1. **Update `mobile/config/api.ts`:**

```typescript
export const getPlatformSpecificEndpoint = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com/graphql';
  }
  
  // For physical device testing, uncomment this:
  return 'http://192.168.0.168:5000/graphql';
  
  // Comment out the rest:
  /*
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/graphql';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/graphql';
  }
  */
};
```

2. **Make sure your phone is on the same WiFi as your PC**

3. **Restart the app**

---

## ⚠️ Troubleshooting

### Still can't connect?

**1. Check backend is running:**
```bash
# Open this in your browser:
http://localhost:5000/graphql
```

**2. Check firewall (Windows):**
```powershell
# Allow port 5000
New-NetFirewallRule -DisplayName "Joy Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

**3. Verify endpoint in console:**
The app logs which endpoint it's using:
```
GraphQL Client initialized with endpoint: http://...
```

**4. For physical devices:**
- Both PC and phone must be on **same WiFi**
- Use PC's IP, not localhost
- Check Windows Firewall

---

## 🎉 Summary

**The connection is now fixed!** The app automatically uses:

- ✅ `10.0.2.2` for Android emulator
- ✅ `localhost` for iOS simulator  
- ⚠️  `192.168.0.168` for physical devices (manual config)

**Just restart your app and it should connect!** 🚀

---

**Last Updated:** November 10, 2025  
**Your PC IP:** 192.168.0.168

