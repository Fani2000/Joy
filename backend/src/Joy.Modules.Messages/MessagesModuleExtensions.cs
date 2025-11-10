using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using RabbitMQ.Client;
using Joy.Modules.Messages.Services;

namespace Joy.Modules.Messages;

public static class MessagesModuleExtensions
{
    public static IServiceCollection AddMessagesModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IMessageBroker>(sp =>
        {
            var connection = sp.GetRequiredService<IConnection>();
            return new RabbitMQMessageBroker(connection);
        });

        services.AddScoped<IMessageService>(sp =>
        {
            var database = sp.GetRequiredService<IMongoDatabase>();
            var messageBroker = sp.GetRequiredService<IMessageBroker>();
            return new MessageService(database, messageBroker);
        });

        return services;
    }
}

