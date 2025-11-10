using MongoDB.Driver;
using Joy.Modules.Gifts.Models;
using Joy.Modules.Gifts.DTOs;
using Joy.Modules.Shared.Models;

namespace Joy.Modules.Gifts.Services;

public class GiftService : IGiftService
{
    private readonly IMongoCollection<Gift> _gifts;
    private readonly IMongoCollection<User> _users;
    private readonly IMessageBroker _messageBroker;

    public GiftService(IMongoDatabase database, IMessageBroker messageBroker)
    {
        _gifts = database.GetCollection<Gift>("gifts");
        _users = database.GetCollection<User>("users");
        _messageBroker = messageBroker;
    }

    public async Task<Gift> CreateGiftAsync(CreateGiftDto dto, string senderEmail)
    {
        var recipient = await _users.Find(u => u.Email == dto.RecipientEmail).FirstOrDefaultAsync();
        
        var gift = new Gift
        {
            Title = dto.Title,
            Description = dto.Description,
            SenderEmail = senderEmail,
            RecipientEmail = dto.RecipientEmail,
            RecipientName = recipient?.Name,
            CreatedAt = DateTime.UtcNow,
            Status = "pending"
        };

        await _gifts.InsertOneAsync(gift);

        // Publish message to RabbitMQ
        await _messageBroker.PublishGiftCreatedAsync(gift);

        return gift;
    }

    public async Task<IEnumerable<Gift>> GetGiftsBySenderAsync(string senderEmail)
    {
        return await _gifts.Find(g => g.SenderEmail == senderEmail)
            .SortByDescending(g => g.CreatedAt)
            .ToListAsync();
    }

    public async Task<Gift?> GetGiftByIdAsync(string id)
    {
        return await _gifts.Find(g => g.Id == id).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Gift>> GetGiftsByRecipientAsync(string recipientEmail)
    {
        return await _gifts.Find(g => g.RecipientEmail == recipientEmail)
            .SortByDescending(g => g.CreatedAt)
            .ToListAsync();
    }
}

