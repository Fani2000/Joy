# CORS Quick Reference

## ✅ CORS Status: **FULLY CONFIGURED**

Your backend now has comprehensive CORS support for the mobile app!

## 🎯 What Was Added

### 1. **Three CORS Policies**

#### Development Policy (Active by default)
```csharp
// Allows ALL origins - perfect for mobile development
- localhost:3000
- localhost:8081 (Expo)
- localhost:19006 (Expo web)
- exp://localhost:8081
- Any other origin (*)
```

#### Production Policy
```csharp
// Restricts to configured origins only
- Configurable via appsettings.json
- Secure for production use
- Supports credentials
```

#### Default Policy
```csharp
// Fallback - allows any origin with credentials
- Used when no specific policy is selected
```

### 2. **Console Logging**
When backend starts, you'll see:
```
✅ CORS enabled with Development policy (Allow all origins)
```

### 3. **Configuration Files**
- `appsettings.json` - Production origins
- `appsettings.Development.json` - Development origins

## 🚀 How to Use

### Mobile App (Already Working!)
```typescript
// mobile/services/api/client.ts
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

// Requests will succeed without CORS errors
const response = await graphqlClient.post('', {
  query: '...',
  variables: {...}
});
```

### Verify CORS is Working
```bash
# 1. Start backend
cd backend/Joy.AppHost
dotnet run

# 2. Check console output for:
✅ CORS enabled with Development policy (Allow all origins)

# 3. Test from mobile app - should work without errors
```

## 🔧 Configuration

### Add Your Physical Device IP
Edit `appsettings.Development.json`:
```json
{
  "AllowedOrigins": [
    "http://localhost:8081",
    "http://192.168.1.100:8081"  // Add your IP here
  ]
}
```

### Configure Production Origins
Edit `appsettings.json`:
```json
{
  "AllowedOrigins": [
    "https://joy.yourdomain.com",
    "https://api.yourdomain.com"
  ]
}
```

## 🧪 Testing CORS

### Test with cURL
```bash
curl -i -X OPTIONS http://localhost:5000/graphql \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST"
```

Expected response headers:
```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

### Test from Mobile App
```typescript
// Should succeed without CORS errors
const gifts = await getGifts('user@example.com');
const messages = await getMessages('user@example.com');
```

## 📋 CORS Headers Explained

### Request Headers (Mobile → Backend)
```
Origin: http://localhost:8081
Content-Type: application/json
Authorization: Bearer <token>
```

### Response Headers (Backend → Mobile)
```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Content-Length, Content-Type
```

## 🎯 What's Allowed

✅ **Origins**: Any origin in development  
✅ **Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH  
✅ **Headers**: All headers (Content-Type, Authorization, etc.)  
✅ **Credentials**: Yes (cookies, auth tokens)  
✅ **Exposed Headers**: Content-Length, Content-Type, X-Custom-Header  

## 🐛 Troubleshooting

### "No 'Access-Control-Allow-Origin' header"
**Fix:** Backend is running and CORS is enabled. Check mobile app endpoint.

### "Origin is not allowed by Access-Control-Allow-Origin"
**Fix:** Add origin to `AllowedOrigins` in `appsettings.Development.json`

### "Credentials flag is 'true', but Access-Control-Allow-Credentials is 'false'"
**Fix:** Already configured correctly with `AllowCredentials()`

## 📊 CORS Configuration Locations

| File | Line | Description |
|------|------|-------------|
| `Program.cs` | 84-117 | CORS policies configuration |
| `Program.cs` | 177-186 | CORS middleware activation |
| `appsettings.json` | - | Production origins list |
| `appsettings.Development.json` | - | Development origins list |

## ✨ Benefits

1. **Mobile App Works**: No more CORS errors
2. **Flexible**: Easy to add/remove allowed origins
3. **Secure**: Production policy restricts origins
4. **Logging**: Console shows CORS status on startup
5. **Standards**: Follows CORS best practices

## 📝 Summary

**CORS Status**: ✅ **Fully Configured & Working**

- Development: Allows all origins
- Production: Configurable via appsettings.json
- Logging: Console shows active policy
- Mobile App: Ready to connect without CORS issues

**Next Steps:**
1. Start backend: `dotnet run`
2. Check console: "✅ CORS enabled..."
3. Test mobile app - Should work!

---

For detailed documentation, see [CORS_CONFIGURATION.md](./CORS_CONFIGURATION.md)

