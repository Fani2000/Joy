using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace Joy.Modules.Communication.Services;

public class SMSService
{
    private readonly IConfiguration _configuration;

    public SMSService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendSMSAsync(string toPhoneNumber, string message)
    {
        try
        {
            var accountSid = _configuration["Twilio:AccountSid"];
            var authToken = _configuration["Twilio:AuthToken"];
            var fromNumber = _configuration["Twilio:PhoneNumber"];

            if (string.IsNullOrEmpty(accountSid) || string.IsNullOrEmpty(authToken))
            {
                // Demo mode - simulate success
                await Task.Delay(500);
                Console.WriteLine($"[DEMO] SMS would be sent to {toPhoneNumber}: {message}");
                return true;
            }

            TwilioClient.Init(accountSid, authToken);

            var messageResource = await MessageResource.CreateAsync(
                body: message,
                from: new Twilio.Types.PhoneNumber(fromNumber),
                to: new Twilio.Types.PhoneNumber(toPhoneNumber)
            );

            return messageResource.Status != MessageResource.StatusEnum.Failed;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SMS send error: {ex.Message}");
            return false;
        }
    }
}

