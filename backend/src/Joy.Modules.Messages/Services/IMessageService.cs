using Joy.Modules.Messages.Models;
using Joy.Modules.Messages.DTOs;

namespace Joy.Modules.Messages.Services;

public interface IMessageService
{
    Task<Message> CreateMessageAsync(CreateMessageDto dto, string senderEmail);
    Task<IEnumerable<Message>> GetMessagesBySenderAsync(string senderEmail);
    Task<Message?> GetMessageByIdAsync(string id);
    Task<IEnumerable<Message>> GetMessagesByRecipientAsync(string recipientEmail);
}

