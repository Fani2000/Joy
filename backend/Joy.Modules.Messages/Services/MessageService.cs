using MongoDB.Driver;
using Joy.Modules.Messages.Models;
using Joy.Modules.Messages.DTOs;
using Joy.Modules.Shared.Models;

namespace Joy.Modules.Messages.Services;

public class MessageService : IMessageService
{
    private readonly IMongoCollection<Message> _messages;
    private readonly IMongoCollection<User> _users;
    private readonly IMessageBroker _messageBroker;

    public MessageService(IMongoDatabase database, IMessageBroker messageBroker)
    {
        _messages = database.GetCollection<Message>("messages");
        _users = database.GetCollection<User>("users");
        _messageBroker = messageBroker;
    }

    public async Task<Message> CreateMessageAsync(CreateMessageDto dto, string senderEmail)
    {
        var recipient = await _users.Find(u => u.Email == dto.RecipientEmail).FirstOrDefaultAsync();
        
        var message = new Message
        {
            Content = dto.Content,
            SenderEmail = senderEmail,
            RecipientEmail = dto.RecipientEmail,
            RecipientName = recipient?.Name,
            MessageType = dto.MessageType,
            CreatedAt = DateTime.UtcNow
        };

        await _messages.InsertOneAsync(message);

        // Publish message to RabbitMQ
        await _messageBroker.PublishMessageCreatedAsync(message);

        return message;
    }

    public async Task<IEnumerable<Message>> GetMessagesBySenderAsync(string senderEmail)
    {
        return await _messages.Find(m => m.SenderEmail == senderEmail)
            .SortByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<Message?> GetMessageByIdAsync(string id)
    {
        return await _messages.Find(m => m.Id == id).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Message>> GetMessagesByRecipientAsync(string recipientEmail)
    {
        return await _messages.Find(m => m.RecipientEmail == recipientEmail)
            .SortByDescending(m => m.CreatedAt)
            .ToListAsync();
    }
}

