using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Joy.Modules.Gifts.Models;

namespace Joy.Modules.Gifts.Services;

public class RabbitMQMessageBroker : IMessageBroker, IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private const string ExchangeName = "joy_exchange";
    private const string GiftCreatedQueue = "gift_created";

    public RabbitMQMessageBroker(IConnection connection)
    {
        _connection = connection;
        _channel = _connection.CreateModel();
        
        _channel.ExchangeDeclare(ExchangeName, ExchangeType.Topic, durable: true);
        _channel.QueueDeclare(GiftCreatedQueue, durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind(GiftCreatedQueue, ExchangeName, "gift.created");
    }

    public async Task PublishGiftCreatedAsync(Gift gift)
    {
        var message = JsonSerializer.Serialize(new
        {
            GiftId = gift.Id,
            Title = gift.Title,
            RecipientEmail = gift.RecipientEmail,
            SenderEmail = gift.SenderEmail,
            CreatedAt = gift.CreatedAt
        });

        var body = Encoding.UTF8.GetBytes(message);
        
        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true;

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: "gift.created",
            basicProperties: properties,
            body: body);

        await Task.CompletedTask;
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}

