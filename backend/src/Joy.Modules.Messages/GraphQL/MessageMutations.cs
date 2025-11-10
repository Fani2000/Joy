using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Messages.Models;
using Joy.Modules.Messages.Services;
using Joy.Modules.Messages.DTOs;

namespace Joy.Modules.Messages.GraphQL;

[ExtendObjectType("Mutation")]
public class MessageMutations
{
    public async Task<Message> SendMessage(
        [Service] IMessageService messageService,
        string senderEmail,
        CreateMessageInput input)
    {
        var dto = new CreateMessageDto
        {
            Content = input.Content,
            RecipientEmail = input.RecipientEmail,
            MessageType = input.MessageType ?? "birthday"
        };

        return await messageService.CreateMessageAsync(dto, senderEmail);
    }
}

public class CreateMessageInput
{
    public string Content { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string? MessageType { get; set; }
}

