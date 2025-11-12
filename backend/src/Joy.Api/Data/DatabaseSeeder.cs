using MongoDB.Driver;
using MongoDB.Bson;
using Joy.Modules.Gifts.Models;
using Joy.Modules.Messages.Models;
using Joy.Modules.Friends.Models;

namespace Joy.Api.Data;

public class DatabaseSeeder
{
    private readonly IMongoDatabase _database;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(IMongoDatabase database, ILogger<DatabaseSeeder> logger)
    {
        _database = database;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        _logger.LogInformation("🌱 Starting database seeding...");

        try
        {
            await SeedGiftsAsync();
            await SeedMessagesAsync();
            await SeedFriendshipsAsync();

            _logger.LogInformation("✅ Database seeding completed successfully!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error during database seeding");
            throw;
        }
    }

    private async Task SeedGiftsAsync()
    {
        var giftsCollection = _database.GetCollection<Gift>("gifts");
        var count = await giftsCollection.CountDocumentsAsync(FilterDefinition<Gift>.Empty);

        if (count > 0)
        {
            _logger.LogInformation("📦 Gifts collection already contains data. Skipping gifts seed.");
            return;
        }

        _logger.LogInformation("📦 Seeding gifts...");

        var gifts = new List<Gift>
        {
            new Gift
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Birthday Surprise Box",
                Description = "A beautiful gift box filled with chocolates and flowers",
                SenderEmail = "john.doe@example.com",
                RecipientEmail = "sarah.smith@example.com",
                RecipientName = "Sarah Smith",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new Gift
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Anniversary Gift Card",
                Description = "Gift card to favorite restaurant",
                SenderEmail = "john.doe@example.com",
                RecipientEmail = "mike.johnson@example.com",
                RecipientName = "Mike Johnson",
                CreatedAt = DateTime.UtcNow.AddDays(-7)
            },
            new Gift
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Congratulations Flowers",
                Description = "Beautiful bouquet of roses and lilies",
                SenderEmail = "sarah.smith@example.com",
                RecipientEmail = "emily.brown@example.com",
                RecipientName = "Emily Brown",
                CreatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new Gift
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Thank You Gift Basket",
                Description = "Gourmet food basket with wines and cheeses",
                SenderEmail = "mike.johnson@example.com",
                RecipientEmail = "john.doe@example.com",
                RecipientName = "John Doe",
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Gift
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Get Well Soon Care Package",
                Description = "Care package with books, tea, and comfort items",
                SenderEmail = "emily.brown@example.com",
                RecipientEmail = "sarah.smith@example.com",
                RecipientName = "Sarah Smith",
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        await giftsCollection.InsertManyAsync(gifts);
        _logger.LogInformation($"✅ Seeded {gifts.Count} gifts");
    }

    private async Task SeedMessagesAsync()
    {
        var messagesCollection = _database.GetCollection<Message>("messages");
        var count = await messagesCollection.CountDocumentsAsync(FilterDefinition<Message>.Empty);

        if (count > 0)
        {
            _logger.LogInformation("💌 Messages collection already contains data. Skipping messages seed.");
            return;
        }

        _logger.LogInformation("💌 Seeding messages...");

        var messages = new List<Message>
        {
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Happy Birthday! 🎉 Wishing you a day filled with love, laughter, and all your favorite things. May this year bring you endless joy and success!",
                SenderEmail = "john.doe@example.com",
                RecipientEmail = "sarah.smith@example.com",
                RecipientName = "Sarah Smith",
                CreatedAt = DateTime.UtcNow.AddDays(-12)
            },
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Happy Anniversary! 💕 Celebrating the beautiful journey you've shared together. Here's to many more years of love and happiness!",
                SenderEmail = "sarah.smith@example.com",
                RecipientEmail = "mike.johnson@example.com",
                RecipientName = "Mike Johnson",
                CreatedAt = DateTime.UtcNow.AddDays(-8)
            },
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Congratulations on your promotion! 🎊 Your hard work and dedication truly paid off. So proud of you!",
                SenderEmail = "mike.johnson@example.com",
                RecipientEmail = "emily.brown@example.com",
                RecipientName = "Emily Brown",
                CreatedAt = DateTime.UtcNow.AddDays(-6)
            },
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Thank you so much for everything! 🙏 Your kindness and support mean the world to me. I'm truly grateful to have you in my life.",
                SenderEmail = "emily.brown@example.com",
                RecipientEmail = "john.doe@example.com",
                RecipientName = "John Doe",
                CreatedAt = DateTime.UtcNow.AddDays(-4)
            },
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Get well soon! 💐 Sending healing thoughts your way. Hope you feel better soon and are back on your feet in no time!",
                SenderEmail = "john.doe@example.com",
                RecipientEmail = "emily.brown@example.com",
                RecipientName = "Emily Brown",
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Message
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Content = "Happy Birthday to an amazing friend! 🎂 May your special day be filled with wonderful surprises and unforgettable moments!",
                SenderEmail = "sarah.smith@example.com",
                RecipientEmail = "mike.johnson@example.com",
                RecipientName = "Mike Johnson",
                CreatedAt = DateTime.UtcNow.AddHours(-12)
            }
        };

        await messagesCollection.InsertManyAsync(messages);
        _logger.LogInformation($"✅ Seeded {messages.Count} messages");
    }

    private async Task SeedFriendshipsAsync()
    {
        var friendshipsCollection = _database.GetCollection<Friendship>("friendships");
        var count = await friendshipsCollection.CountDocumentsAsync(FilterDefinition<Friendship>.Empty);

        if (count > 0)
        {
            _logger.LogInformation("👥 Friendships collection already contains data. Skipping friendships seed.");
            return;
        }

        _logger.LogInformation("👥 Seeding friendships...");

        var friendships = new List<Friendship>
        {
            // John Doe's friends
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "john.doe@example.com",
                FriendEmail = "sarah.smith@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "john.doe@example.com",
                FriendEmail = "mike.johnson@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "john.doe@example.com",
                FriendEmail = "emily.brown@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            
            // Sarah Smith's friends
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "sarah.smith@example.com",
                FriendEmail = "john.doe@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "sarah.smith@example.com",
                FriendEmail = "emily.brown@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            },
            
            // Mike Johnson's friends
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "mike.johnson@example.com",
                FriendEmail = "john.doe@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "mike.johnson@example.com",
                FriendEmail = "emily.brown@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            
            // Emily Brown's friends
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "emily.brown@example.com",
                FriendEmail = "john.doe@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-20)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "emily.brown@example.com",
                FriendEmail = "sarah.smith@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            },
            new Friendship
            {
                Id = ObjectId.GenerateNewId().ToString(),
                UserEmail = "emily.brown@example.com",
                FriendEmail = "mike.johnson@example.com",
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            }
        };

        await friendshipsCollection.InsertManyAsync(friendships);
        _logger.LogInformation($"✅ Seeded {friendships.Count} friendships");
    }
}

