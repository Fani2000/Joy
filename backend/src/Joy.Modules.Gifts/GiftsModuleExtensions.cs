using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using RabbitMQ.Client;
using Joy.Modules.Gifts.Services;

namespace Joy.Modules.Gifts;

public static class GiftsModuleExtensions
{
    public static IServiceCollection AddGiftsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<IMessageBroker>(sp =>
        {
            var connection = sp.GetRequiredService<IConnection>();
            return new RabbitMQMessageBroker(connection);
        });

        services.AddScoped<IGiftService>(sp =>
        {
            var database = sp.GetRequiredService<IMongoDatabase>();
            var messageBroker = sp.GetRequiredService<IMessageBroker>();
            return new GiftService(database, messageBroker);
        });

        return services;
    }
}

