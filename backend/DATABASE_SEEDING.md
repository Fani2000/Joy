# 🌱 Database Seeding Documentation

## Overview

The Joy API automatically seeds the MongoDB database with sample data when it starts. This feature is **configurable** and can be enabled/disabled as needed.

---

## ✅ How It Works

### Automatic Seeding

When the API starts, it will:

1. ✅ Check if seeding is enabled in configuration
2. ✅ Check if it should only run in Development mode
3. ✅ Create a scope and get the `DatabaseSeeder` service
4. ✅ Call `SeedAsync()` to populate the database
5. ✅ Display console messages with progress

### Console Output

**When seeding runs:**
```
🌱 Starting database seeding...
🌱 Starting database seeding...
📦 Seeding gifts...
✅ Seeded 5 gifts
💌 Seeding messages...
✅ Seeded 6 messages
👥 Seeding friendships...
✅ Seeded 10 friendships
✅ Database seeding completed successfully!
✅ Database seeding completed successfully!
```

**When data already exists:**
```
🌱 Starting database seeding...
🌱 Starting database seeding...
📦 Gifts collection already contains data. Skipping gifts seed.
💌 Messages collection already contains data. Skipping messages seed.
👥 Friendships collection already contains data. Skipping friendships seed.
✅ Database seeding completed successfully!
✅ Database seeding completed successfully!
```

**When seeding is disabled:**
```
⏭️  Database seeding skipped (disabled in configuration or not in Development mode)
```

**If seeding fails:**
```
🌱 Starting database seeding...
❌ Database seeding failed: Unable to connect to MongoDB
```

*Note: The application will continue to run even if seeding fails!*

---

## 🔧 Configuration

### appsettings.json (Production)

```json
{
  "DatabaseSeeding": {
    "Enabled": true,
    "OnlyInDevelopment": true
  }
}
```

### appsettings.Development.json (Development)

```json
{
  "DatabaseSeeding": {
    "Enabled": true,              // Set to false to disable seeding
    "OnlyInDevelopment": true     // Set to false to seed in all environments
  }
}
```

---

## ⚙️ Configuration Options

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `Enabled` | `bool` | `true` | Enables or disables database seeding entirely |
| `OnlyInDevelopment` | `bool` | `true` | If true, seeding only runs when `ASPNETCORE_ENVIRONMENT=Development` |

---

## 🎯 Seeding Behavior

### Scenario 1: Development Environment (Default)

```json
{
  "DatabaseSeeding": {
    "Enabled": true,
    "OnlyInDevelopment": true
  }
}
```

**Result:** ✅ Seeding runs automatically on API startup in Development mode only

---

### Scenario 2: Disable Seeding

```json
{
  "DatabaseSeeding": {
    "Enabled": false,
    "OnlyInDevelopment": true
  }
}
```

**Result:** ⏭️ Seeding is completely disabled (all environments)

---

### Scenario 3: Seed in All Environments

```json
{
  "DatabaseSeeding": {
    "Enabled": true,
    "OnlyInDevelopment": false
  }
}
```

**Result:** ✅ Seeding runs in Development, Staging, AND Production

⚠️ **Warning:** Use with caution in production!

---

### Scenario 4: No Configuration

If `DatabaseSeeding` section is missing from `appsettings.json`:

**Default Values:**
- `Enabled`: `true`
- `OnlyInDevelopment`: `true`

**Result:** ✅ Seeding runs in Development mode only (safe default)

---

## 📊 Sample Data

The seeder creates the following data:

### Users (Demo)
- `john.doe@example.com`
- `sarah.smith@example.com`
- `mike.johnson@example.com`
- `emily.brown@example.com`

### Gifts (5 total)
1. Birthday Surprise Box
2. Anniversary Gift Card
3. Congratulations Flowers
4. Thank You Gift Basket
5. Get Well Soon Care Package

### Messages (6 total)
1. Birthday message
2. Anniversary message
3. Congratulations message
4. Thank you message
5. Get well message
6. Another birthday message

### Friendships (10 total)
- Bidirectional friendships between all demo users
- John knows Sarah, Mike, Emily
- Sarah knows John, Emily
- Mike knows John, Emily
- Emily knows everyone

---

## 🔄 Idempotent Seeding

The seeder is **idempotent**, meaning:

- ✅ **Safe to run multiple times**
- ✅ **Checks if data exists before inserting**
- ✅ **Won't create duplicates**
- ✅ **Won't fail if data already exists**

### How It Works

```csharp
var giftsCollection = _database.GetCollection<Gift>("gifts");
var count = await giftsCollection.CountDocumentsAsync(FilterDefinition<Gift>.Empty);

if (count > 0)
{
    _logger.LogInformation("📦 Gifts collection already contains data. Skipping gifts seed.");
    return;
}

// Only seeds if collection is empty!
```

---

## 🛡️ Error Handling

### Graceful Failure

If seeding fails, the API will:

1. ✅ Log the error to console
2. ✅ Log the error with ILogger
3. ✅ **Continue to run normally**
4. ❌ **NOT crash the application**

### Example Error Handling

```csharp
try
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
    
    Console.WriteLine("✅ Database seeding completed successfully!");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Database seeding failed: {ex.Message}");
    // Log but don't stop the application
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to seed database. Application will continue to run.");
}
```

**Result:** API starts even if MongoDB is not available during seeding!

---

## 🧪 Testing Seeding

### Test 1: Fresh Database

```bash
# Drop the database
docker exec -it mongodb mongosh
use joy
db.dropDatabase()
exit

# Restart API
cd backend/Joy.AppHost
dotnet run

# Expected output:
# 🌱 Starting database seeding...
# 📦 Seeding gifts...
# ✅ Seeded 5 gifts
# 💌 Seeding messages...
# ✅ Seeded 6 messages
# ...
```

### Test 2: Existing Data

```bash
# Restart API (without dropping database)
cd backend/Joy.AppHost
dotnet run

# Expected output:
# 🌱 Starting database seeding...
# 📦 Gifts collection already contains data. Skipping gifts seed.
# 💌 Messages collection already contains data. Skipping messages seed.
# ...
```

### Test 3: Disable Seeding

```json
// Update appsettings.Development.json
{
  "DatabaseSeeding": {
    "Enabled": false
  }
}
```

```bash
cd backend/Joy.AppHost
dotnet run

# Expected output:
# ⏭️  Database seeding skipped (disabled in configuration or not in Development mode)
```

---

## 📝 Implementation Details

### Files Involved

| File | Purpose |
|------|---------|
| `backend/Joy.Api/Data/DatabaseSeeder.cs` | Main seeding logic |
| `backend/Joy.Api/Program.cs` | Seeding invocation (lines 146-176) |
| `backend/Joy.Api/appsettings.json` | Configuration (production) |
| `backend/Joy.Api/appsettings.Development.json` | Configuration (development) |

### Service Registration

```csharp
// In Program.cs
builder.Services.AddScoped<DatabaseSeeder>();
```

**Scope:** `Scoped` - A new instance is created for each seeding operation

### Seeding Flow

```
1. API Starts
   ↓
2. Check Configuration (Enabled? OnlyInDevelopment?)
   ↓
3. If conditions met → Create Scope
   ↓
4. Get DatabaseSeeder from DI
   ↓
5. Call SeedAsync()
   ↓
6. Seed Gifts → Seed Messages → Seed Friendships
   ↓
7. Log Success or Failure
   ↓
8. Continue API Startup (even if failed)
```

---

## 🔍 Troubleshooting

### Issue: Seeding not running

**Check:**
1. Is `ASPNETCORE_ENVIRONMENT=Development`?
2. Is `DatabaseSeeding:Enabled` set to `true`?
3. Is MongoDB running?

**Solution:**
```bash
# Check environment
echo $ASPNETCORE_ENVIRONMENT  # Should be "Development"

# Check configuration
cat backend/Joy.Api/appsettings.Development.json | grep -A 3 DatabaseSeeding

# Check MongoDB
docker ps | grep mongo
```

---

### Issue: Seeding runs every time

**Cause:** Database is being dropped or data is being deleted

**Check:**
```bash
# Connect to MongoDB
docker exec -it mongodb mongosh

# Check collections
use joy
show collections

# Check counts
db.gifts.count()
db.messages.count()
db.friendships.count()
```

**Expected:** If counts > 0, seeding should skip those collections

---

### Issue: Seeding fails with connection error

**Cause:** MongoDB is not available yet

**Solution:**
- Aspire 9's `WaitFor` should handle this, but if running standalone:

```bash
# Make sure MongoDB is running
docker ps | grep mongo

# Test connection
docker exec -it mongodb mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## 🚀 Best Practices

### ✅ DO

1. **Keep seeding enabled in Development**
   - Helps new developers get started quickly
   - Provides sample data for testing

2. **Disable in Production**
   ```json
   {
     "DatabaseSeeding": {
       "Enabled": false,
       "OnlyInDevelopment": true
     }
   }
   ```

3. **Use idempotent seeds**
   - Check if data exists before inserting
   - Use unique identifiers (GUIDs)

4. **Log seeding operations**
   - Makes debugging easier
   - Helps understand what's happening

### ❌ DON'T

1. **Don't seed production databases automatically**
   - Use migration scripts instead
   - Seed manually with caution

2. **Don't seed sensitive data**
   - Use fake/demo data only
   - Never seed real user information

3. **Don't let seeding failures crash the app**
   - Already handled in current implementation

---

## 📚 References

- **DatabaseSeeder:** `backend/Joy.Api/Data/DatabaseSeeder.cs`
- **Seeding Invocation:** `backend/Joy.Api/Program.cs` (lines 146-176)
- **Configuration:** `backend/Joy.Api/appsettings.json`

---

## ✅ Summary

| Feature | Status |
|---------|--------|
| Automatic seeding on startup | ✅ Implemented |
| Configurable enable/disable | ✅ Yes |
| Development-only option | ✅ Yes |
| Idempotent (safe to re-run) | ✅ Yes |
| Graceful error handling | ✅ Yes |
| Console logging | ✅ Yes |
| Sample data included | ✅ Yes (5 gifts, 6 messages, 10 friendships) |

**Database seeding is fully configured and ready to use!** 🌱

---

**Last Updated:** November 10, 2025  
**Status:** ✅ Complete

