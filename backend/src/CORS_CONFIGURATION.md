# CORS Configuration Guide

## 🔒 Cross-Origin Resource Sharing (CORS) Setup

The Joy backend has CORS properly configured to allow requests from the mobile app and other clients.

## 📋 Current Configuration

### Three CORS Policies:

1. **DevelopmentPolicy** - Used in development environment
   - Allows **all origins** (`AllowAnyOrigin`)
   - Allows **all HTTP methods** (GET, POST, PUT, DELETE, etc.)
   - Allows **all headers**
   - Exposes standard response headers

2. **ProductionPolicy** - Used in production environment
   - Restricts to **configured origins only**
   - Allows **all HTTP methods**
   - Allows **all headers**
   - **Allows credentials** (cookies, authorization headers)
   - Configured via `appsettings.json`

3. **DefaultPolicy** - Fallback policy
   - Dynamically allows any origin in development
   - Allows credentials
   - Most permissive for ease of development

## 🚀 How It Works

### In Development:
```csharp
// Automatically uses DevelopmentPolicy
// Allows requests from:
// - localhost:8081 (Expo mobile)
// - localhost:19006 (Expo web)
// - Any other origin
```

### In Production:
```csharp
// Uses ProductionPolicy
// Only allows requests from origins listed in appsettings.json
```

## ⚙️ Configuration Files

### `appsettings.Development.json`
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:19006",
    "exp://localhost:8081",
    "*"
  ]
}
```

### `appsettings.json` (Production)
```json
{
  "AllowedOrigins": [
    "https://your-production-domain.com",
    "https://app.yourdomain.com"
  ]
}
```

## 🔧 Customizing CORS

### Add More Allowed Origins (Development)

Edit `appsettings.Development.json`:
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:8081",
    "http://192.168.1.100:8081",  // Add your IP for physical device
    "exp://192.168.1.100:8081"
  ]
}
```

### Configure Production Origins

Edit `appsettings.json`:
```json
{
  "AllowedOrigins": [
    "https://joy.yourdomain.com",
    "https://api.yourdomain.com",
    "capacitor://localhost"  // For Capacitor apps
  ]
}
```

### Modify CORS Policy in Code

Edit `Joy.Api/Program.cs`:
```csharp
// Add a custom policy
options.AddPolicy("CustomPolicy", policy =>
{
    policy.WithOrigins("https://specific-domain.com")
          .WithMethods("GET", "POST")  // Restrict methods
          .WithHeaders("Content-Type", "Authorization")  // Restrict headers
          .AllowCredentials();
});
```

## 🧪 Testing CORS

### 1. Check CORS Headers
```bash
curl -i -X OPTIONS http://localhost:5000/graphql \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST"
```

Expected response:
```
Access-Control-Allow-Origin: http://localhost:8081
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 2. Test from Mobile App
```typescript
// In mobile app
const response = await fetch('http://localhost:5000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '{ __typename }'
  })
});

// Should succeed without CORS errors
```

### 3. Check Browser Console
```javascript
// If using web, check for CORS errors in console
// Should NOT see:
// "No 'Access-Control-Allow-Origin' header is present"
```

## 🐛 Common CORS Issues & Solutions

### Issue 1: "No 'Access-Control-Allow-Origin' header"

**Solution:**
- Ensure `app.UseCors()` is called BEFORE `app.MapGraphQL()`
- Check that CORS middleware is registered

### Issue 2: "Credentials mode requires specific origin"

**Problem:**
```csharp
policy.AllowAnyOrigin()
      .AllowCredentials(); // ❌ Won't work
```

**Solution:**
```csharp
policy.WithOrigins("http://localhost:8081")
      .AllowCredentials(); // ✅ Works
// OR
policy.SetIsOriginAllowed(_ => true)
      .AllowCredentials(); // ✅ Works
```

### Issue 3: Preflight (OPTIONS) requests failing

**Solution:**
Ensure all HTTP methods are allowed:
```csharp
policy.AllowAnyMethod()  // Includes OPTIONS
      .AllowAnyHeader();
```

### Issue 4: Custom headers not accessible

**Solution:**
Expose the headers:
```csharp
policy.WithExposedHeaders("X-Custom-Header", "X-Total-Count");
```

## 📱 Mobile App Configuration

The mobile app is configured to work with CORS:

### iOS (Simulator & Device)
```
Origin: http://localhost:5000
✅ Works out of the box
```

### Android (Emulator)
```
Origin: http://10.0.2.2:5000
✅ Configure in mobile/services/api/client.ts
```

### Physical Devices
```
Origin: http://YOUR_IP:5000
✅ Update mobile/services/api/client.ts with your IP
```

## 🔍 Debugging CORS

### Enable CORS Logging
Add to `appsettings.Development.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.AspNetCore.Cors": "Debug"
    }
  }
}
```

### View CORS Policy Selection
Check console output when app starts:
```
✅ CORS enabled with Development policy (Allow all origins)
```

### Inspect Preflight Requests
Use browser DevTools or Postman to see:
- Request headers
- Response headers
- CORS-specific headers

## 🎯 Best Practices

1. **Development:**
   - Use `DevelopmentPolicy` (already configured)
   - Allow all origins for ease of testing
   - Log CORS events for debugging

2. **Production:**
   - Use `ProductionPolicy` (already configured)
   - Explicitly list allowed origins
   - Never use `AllowAnyOrigin()` with `AllowCredentials()`
   - Review origins periodically

3. **Security:**
   - Keep production origins list minimal
   - Use HTTPS in production
   - Validate origin patterns carefully
   - Don't expose sensitive headers

4. **Mobile Apps:**
   - Consider using `SetIsOriginAllowed(_ => true)` for Capacitor/Cordova
   - Handle platform-specific origins (localhost, file://, capacitor://)

## 📚 Related Files

- **CORS Configuration:** `Joy.Api/Program.cs` (lines 84-120, 151-162)
- **Development Settings:** `Joy.Api/appsettings.Development.json`
- **Production Settings:** `Joy.Api/appsettings.json`
- **Mobile Client:** `mobile/services/api/client.ts`

## 🆘 Getting Help

If CORS isn't working:

1. Check the origin in mobile app matches allowed origins
2. Verify backend is running and responding
3. Enable CORS debug logging
4. Use browser DevTools Network tab
5. Check Aspire dashboard for backend errors

## ✅ Verification Checklist

- ✅ CORS middleware registered in `Program.cs`
- ✅ `app.UseCors()` called before `app.MapGraphQL()`
- ✅ Development policy allows mobile app origin
- ✅ Console shows "CORS enabled" message on startup
- ✅ Mobile app can make GraphQL requests
- ✅ No CORS errors in console/logs

---

**Your CORS is configured and ready!** The mobile app can now communicate with the backend without any cross-origin issues. 🎉

