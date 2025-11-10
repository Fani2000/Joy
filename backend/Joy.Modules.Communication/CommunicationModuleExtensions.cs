using Joy.Modules.Communication.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Joy.Modules.Communication;

public static class CommunicationModuleExtensions
{
    public static IServiceCollection AddCommunicationModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<EmailService>();
        services.AddSingleton<SMSService>();
        services.AddSingleton<WhatsAppService>();
        
        return services;
    }
}

