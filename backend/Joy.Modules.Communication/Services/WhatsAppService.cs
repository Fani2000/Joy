using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Joy.Modules.Communication.Services;

public class WhatsAppService
{
    private readonly IConfiguration _configuration;

    public WhatsAppService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendWhatsAppAsync(string toPhoneNumber, string message)
    {
        try
        {
            var accountSid = _configuration["Twilio:AccountSid"];
            var authToken = _configuration["Twilio:AuthToken"];
            var fromNumber = _configuration["Twilio:WhatsAppNumber"];

            if (string.IsNullOrEmpty(accountSid) || string.IsNullOrEmpty(authToken))
            {
                // Demo mode - simulate success
                await Task.Delay(500);
                Console.WriteLine($"[DEMO] WhatsApp would be sent to {toPhoneNumber}: {message}");
                return true;
            }

            TwilioClient.Init(accountSid, authToken);

            var messageResource = await MessageResource.CreateAsync(
                body: message,
                from: new Twilio.Types.PhoneNumber($"whatsapp:{fromNumber}"),
                to: new Twilio.Types.PhoneNumber($"whatsapp:{toPhoneNumber}")
            );

            return messageResource.Status != MessageResource.StatusEnum.Failed;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WhatsApp send error: {ex.Message}");
            return false;
        }
    }
}

