# Database Seeding

This directory contains the database seeding functionality for the Joy API.

## 📁 Files

- `DatabaseSeeder.cs` - Main seeding logic for all collections
- `SeedData.cs` - Predefined seed data templates and demo users

## 🌱 How It Works

### Automatic Seeding

The database is automatically seeded when the application starts in **Development mode**:

1. Application starts
2. Checks if collections have data
3. If empty, seeds with sample data
4. Logs seeding progress to console

### Seeded Data

#### Gifts (5 items)
- Birthday Surprise Box
- Anniversary Gift Card
- Congratulations Flowers
- Thank You Gift Basket
- Get Well Soon Care Package

#### Messages (6 items)
- Birthday wishes
- Anniversary congratulations
- Promotion celebration
- Thank you notes
- Get well wishes

#### Friends (6 items)
- Connected to demo users
- Include birthday dates
- Represent friendship relationships

## 👥 Demo Users

The following demo users are referenced in seed data:

| Email | Name | Purpose |
|-------|------|---------|
| john.doe@example.com | John Doe | Primary demo user |
| sarah.smith@example.com | Sarah Smith | Secondary demo user |
| mike.johnson@example.com | Mike Johnson | Tertiary demo user |
| emily.brown@example.com | Emily Brown | Additional demo user |
| user@example.com | Demo User | Generic test user |

**Password for all demo users:** `password123`

## 🔧 Configuration

### Enable/Disable Seeding

Edit `Program.cs`:

```csharp
// To disable seeding in development:
if (app.Environment.IsDevelopment())
{
    // Comment out or remove this block
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
}
```

### Production Seeding

By default, seeding only runs in **Development**. To enable in production:

```csharp
// Seed in all environments (not recommended)
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}
```

## 🧪 Testing Seed Data

### View Seeded Data

1. **Start Backend:**
   ```bash
   cd backend/Joy.AppHost
   dotnet run
   ```

2. **Check Console Output:**
   ```
   🌱 Starting database seeding...
   📦 Seeding gifts...
   ✅ Seeded 5 gifts
   💌 Seeding messages...
   ✅ Seeded 6 messages
   👥 Seeding friends...
   ✅ Seeded 6 friends
   ✅ Database seeding completed successfully!
   ```

3. **Query via GraphQL:**
   ```graphql
   # Get all gifts
   query {
     gifts(senderEmail: "john.doe@example.com") {
       id
       title
       description
       recipientName
     }
   }
   
   # Get all messages
   query {
     messages(senderEmail: "john.doe@example.com") {
       id
       content
       recipientName
     }
   }
   ```

### Mobile App Testing

Login with any demo user:
- **Email:** `user@example.com`
- **Password:** `password123`

You'll see seeded gifts and messages in the app!

## 🔄 Re-seeding

### Clear Database and Re-seed

```bash
# Option 1: Stop backend and delete MongoDB data
docker stop mongodb-container
docker rm mongodb-container

# Option 2: Drop collections manually
mongo
use joy
db.gifts.drop()
db.messages.drop()
db.friends.drop()
exit

# Restart backend - will auto-seed
cd backend/Joy.AppHost
dotnet run
```

### Force Re-seed

Modify `DatabaseSeeder.cs` to always seed:

```csharp
// Comment out the count check
// if (count > 0)
// {
//     _logger.LogInformation("Collection already has data");
//     return;
// }
```

## 📊 Seed Data Statistics

| Collection | Items | Date Range |
|------------|-------|------------|
| Gifts | 5 | Last 10 days |
| Messages | 6 | Last 12 days |
| Friends | 6 | Various birthdays |

## 🎯 Use Cases

### Development
- ✅ Quick testing with realistic data
- ✅ UI/UX testing with populated lists
- ✅ Demo presentations
- ✅ Integration testing

### Testing
- ✅ Automated tests can use seed data
- ✅ Consistent test data across environments
- ✅ Known data for assertion checks

## 🛡️ Safety Features

### Idempotent Seeding
- Checks if data exists before seeding
- Won't duplicate data on restart
- Safe to run multiple times

### Environment-Aware
- Only seeds in Development by default
- Prevents accidental production seeding
- Configurable per environment

### Logging
- Detailed console output
- Shows what's being seeded
- Reports success/failure

## 🔍 Troubleshooting

### "Seeding failed" Error

**Check MongoDB Connection:**
```bash
# Ensure MongoDB is running
docker ps | grep mongo

# Check logs
docker logs mongodb-container
```

**Check Database Access:**
```csharp
// Verify connection in Program.cs
var mongoClient = app.Services.GetRequiredService<IMongoClient>();
await mongoClient.ListDatabaseNamesAsync();
```

### "Collection already has data"

This is normal! Seeding is idempotent and skips if data exists.

To re-seed:
1. Drop the collections
2. Restart the backend

### No Console Output

Ensure seeding is enabled:
```csharp
if (app.Environment.IsDevelopment())
{
    // This block should be present
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
}
```

## 📝 Customizing Seed Data

### Add More Gifts

Edit `DatabaseSeeder.cs`:
```csharp
new Gift
{
    Id = Guid.NewGuid().ToString(),
    Title = "Your Custom Gift",
    Description = "Custom description",
    SenderEmail = "sender@example.com",
    RecipientEmail = "recipient@example.com",
    RecipientName = "Recipient Name",
    CreatedAt = DateTime.UtcNow
}
```

### Add More Messages

```csharp
new Message
{
    Id = Guid.NewGuid().ToString(),
    Content = "Your custom message here",
    SenderEmail = "sender@example.com",
    RecipientEmail = "recipient@example.com",
    RecipientName = "Recipient Name",
    CreatedAt = DateTime.UtcNow
}
```

### Add More Demo Users

Edit `SeedData.cs`:
```csharp
public static readonly (string Email, string Name, string Password)[] DemoUsers = new[]
{
    ("newuser@example.com", "New User", "password123"),
    // ... existing users
};
```

## 🚀 Best Practices

1. **Keep Seed Data Realistic**
   - Use realistic names and emails
   - Set realistic dates
   - Create logical relationships

2. **Don't Seed Sensitive Data**
   - Avoid real user data
   - Use fake emails
   - Don't include passwords in seed data

3. **Make It Idempotent**
   - Always check if data exists
   - Don't duplicate on restart
   - Use unique IDs

4. **Log Everything**
   - Log what's being seeded
   - Log success/failure
   - Make debugging easy

5. **Environment-Specific**
   - Development: Seed freely
   - Staging: Limited seed
   - Production: No seeding (usually)

## 📚 Related Files

- `Program.cs` - Seeding initialization
- `DatabaseSeeder.cs` - Seeding logic
- `SeedData.cs` - Seed data templates
- Module models - Data structures

---

**Database seeding is ready!** Start the backend and watch the console for seeding logs. 🌱

