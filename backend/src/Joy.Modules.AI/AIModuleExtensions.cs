using Joy.Modules.AI.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Joy.Modules.AI;

public static class AIModuleExtensions
{
    public static IServiceCollection AddAIModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<AIMessageService>();
        
        return services;
    }
}

