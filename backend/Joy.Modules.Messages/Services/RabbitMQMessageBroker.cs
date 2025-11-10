using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Joy.Modules.Messages.Models;

namespace Joy.Modules.Messages.Services;

public class RabbitMQMessageBroker : IMessageBroker, IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private const string ExchangeName = "joy_exchange";
    private const string MessageCreatedQueue = "message_created";

    public RabbitMQMessageBroker(IConnection connection)
    {
        _connection = connection;
        _channel = _connection.CreateModel();
        
        _channel.ExchangeDeclare(ExchangeName, ExchangeType.Topic, durable: true);
        _channel.QueueDeclare(MessageCreatedQueue, durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind(MessageCreatedQueue, ExchangeName, "message.created");
    }

    public async Task PublishMessageCreatedAsync(Message message)
    {
        var messageData = JsonSerializer.Serialize(new
        {
            MessageId = message.Id,
            Content = message.Content,
            RecipientEmail = message.RecipientEmail,
            SenderEmail = message.SenderEmail,
            MessageType = message.MessageType,
            CreatedAt = message.CreatedAt
        });

        var body = Encoding.UTF8.GetBytes(messageData);
        
        var properties = _channel.CreateBasicProperties();
        properties.Persistent = true;

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: "message.created",
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

