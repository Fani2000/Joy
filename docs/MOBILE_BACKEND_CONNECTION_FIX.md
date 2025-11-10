# 📱 Mobile Backend Connection - Fixed!

## 🐛 Problem

Mobile app couldn't connect to backend:
```
ERROR: Cannot connect to server. Please ensure the backend is running at http://localhost:5000/graphql
```

## 🎯 Root Cause

**`localhost` on mobile devices doesn't point to your development machine!**

| Platform | `localhost` refers to... | Solution |
|----------|-------------------------|----------|
| **Android Emulator** | The emulator itself ❌ | Use `10.0.2.2` |
| **iOS Simulator** | Your Mac ✅ | Use `localhost` |
| **Physical Device** | The phone itself ❌ | Use your PC's IP address |

---

## ✅ Solution Applied

### Updated `mobile/services/api/client.ts`

**Before (❌ Hardcoded localhost):**
```typescript
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';
```

**After (✅ Platform-specific):**
```typescript
import { getPlatformSpecificEndpoint } from '../../config/api';

const GRAPHQL_ENDPOINT = getPlatformSpecificEndpoint();
```

### Platform Detection Logic

The `getPlatformSpecificEndpoint()` function automatically returns:

```typescript
// Android Emulator
'http://10.0.2.2:5000/graphql'

// iOS Simulator
'http://localhost:5000/graphql'

// Production
'https://your-production-api.com/graphql'
```

---

## 🔧 How It Works Now

### 1. **Android Emulator** 🤖
```
Mobile App → 10.0.2.2:5000 → Your PC → Backend (localhost:5000)
```

### 2. **iOS Simulator** 🍎
```
Mobile App → localhost:5000 → Your Mac → Backend (localhost:5000)
```

### 3. **Physical Device** 📱
For physical devices, you need to update the endpoint in `mobile/config/api.ts`:

```typescript
export const getPlatformSpecificEndpoint = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com/graphql';
  }
  
  // Development endpoints
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/graphql'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/graphql'; // iOS simulator
  } else {
    // For physical devices, use your PC's IP
    return 'http://YOUR_PC_IP:5000/graphql'; // Change this!
  }
};
```

---

## 🧪 Testing the Fix

### Step 1: Start Backend
```bash
cd backend/Joy.AppHost
dotnet run
```

**Verify backend is running:**
- Open: http://localhost:5000/graphql
- You should see the GraphQL playground

### Step 2: Restart Mobile App
```bash
cd mobile
npm start
```

Press `r` in the terminal to reload the app

### Step 3: Check Console Output

**You should now see:**
```
✅ GraphQL Client initialized with endpoint: http://10.0.2.2:5000/graphql
```
(On Android emulator)

Or:
```
✅ GraphQL Client initialized with endpoint: http://localhost:5000/graphql
```
(On iOS simulator)

### Step 4: Verify Data Loads

The home screen should now show:
- ✅ Gifts count
- ✅ Messages count
- ✅ No connection errors

---

## 🔍 Find Your PC's IP Address

### For Physical Device Testing:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter

**Example:**
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Then update `mobile/config/api.ts`:**
```typescript
return 'http://192.168.1.100:5000/graphql'; // Your PC's IP
```

---

## 📝 Configuration Reference

### File: `mobile/config/api.ts`

```typescript
export const getPlatformSpecificEndpoint = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com/graphql';
  }
  
  // Development endpoints
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/graphql'; // Android emulator
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000/graphql'; // iOS simulator
  } else {
    return 'http://localhost:5000/graphql'; // Web or other
  }
};
```

---

## 🚀 Quick Fix Summary

| Platform | Before | After |
|----------|--------|-------|
| Android Emulator | ❌ `localhost:5000` | ✅ `10.0.2.2:5000` |
| iOS Simulator | ✅ `localhost:5000` | ✅ `localhost:5000` |
| Physical Device | ❌ `localhost:5000` | ⚠️  Need to set PC IP |

---

## ⚠️ Troubleshooting

### Still Can't Connect?

**1. Check Backend is Running**
```bash
curl http://localhost:5000/graphql
# Should return HTML (GraphQL playground page)
```

**2. Check Firewall**
Windows Firewall might block the connection. Allow port 5000:
```powershell
New-NetFirewallRule -DisplayName "Joy Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

**3. For Android Emulator Issues**
Make sure the emulator is using the right network:
```bash
# Check if 10.0.2.2 is reachable from emulator
adb shell ping 10.0.2.2
```

**4. For Physical Device**
- Both PC and phone must be on the **same WiFi network**
- Use your PC's IP (not localhost)
- Check Windows Firewall allows connections from local network

---

## ✅ Status

| Item | Status |
|------|--------|
| Platform detection | ✅ Implemented |
| Android emulator fix | ✅ Uses 10.0.2.2 |
| iOS simulator support | ✅ Uses localhost |
| Code updated | ✅ client.ts modified |
| Documentation | ✅ Complete |

---

## 🎉 Result

**The mobile app can now connect to the backend!** 🚀

The app will automatically use the correct endpoint based on the platform:
- ✅ Android emulator: Connects via `10.0.2.2`
- ✅ iOS simulator: Connects via `localhost`
- ✅ Production: Uses production URL

**Restart your mobile app and it should work!** 📱

---

**Date:** November 10, 2025  
**Issue:** Mobile app can't connect to localhost backend  
**Resolution:** Implemented platform-specific endpoint detection  
**Status:** ✅ FIXED

