using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Joy.Modules.Friends.Services;

namespace Joy.Modules.Friends;

public static class FriendsModuleExtensions
{
    public static IServiceCollection AddFriendsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IFriendService>(sp =>
        {
            var database = sp.GetRequiredService<IMongoDatabase>();
            return new FriendService(database);
        });

        return services;
    }
}

