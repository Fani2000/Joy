using Joy.Modules.Messages.Models;

namespace Joy.Modules.Messages.Services;

public interface IMessageBroker
{
    Task PublishMessageCreatedAsync(Message message);
}

