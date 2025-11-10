using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Messages.Models;
using Joy.Modules.Messages.Services;

namespace Joy.Modules.Messages.GraphQL;

[ExtendObjectType("Query")]
public class MessageQueries
{
    public async Task<IEnumerable<Message>> GetMessages(
        [Service] IMessageService messageService,
        string senderEmail)
    {
        return await messageService.GetMessagesBySenderAsync(senderEmail);
    }

    public async Task<Message?> GetMessage(
        [Service] IMessageService messageService,
        string id)
    {
        return await messageService.GetMessageByIdAsync(id);
    }

    public async Task<IEnumerable<Message>> GetReceivedMessages(
        [Service] IMessageService messageService,
        string recipientEmail)
    {
        return await messageService.GetMessagesByRecipientAsync(recipientEmail);
    }
}

