using Joy.Modules.Gifts.Models;

namespace Joy.Modules.Gifts.Services;

public interface IMessageBroker
{
    Task PublishGiftCreatedAsync(Gift gift);
}

