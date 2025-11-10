using Joy.Modules.Communication.Services;

namespace Joy.Modules.Communication.GraphQL;

[ExtendObjectType("Mutation")]
public class CommunicationMutations
{
    public async Task<CommunicationResponse> SendCommunication(
        CommunicationInput input,
        [Service] EmailService emailService,
        [Service] SMSService smsService,
        [Service] WhatsAppService whatsAppService)
    {
        try
        {
            bool success = false;
            var type = input.Type.ToLower();

            switch (type)
            {
                case "email":
                    var subject = input.Subject ?? "Message from Joy App";
                    success = await emailService.SendEmailAsync(input.Recipient, subject, input.Message);
                    break;

                case "sms":
                    success = await smsService.SendSMSAsync(input.Recipient, input.Message);
                    break;

                case "whatsapp":
                    success = await whatsAppService.SendWhatsAppAsync(input.Recipient, input.Message);
                    break;

                default:
                    return new CommunicationResponse
                    {
                        Success = false,
                        Message = $"Unsupported communication type: {type}"
                    };
            }

            return new CommunicationResponse
            {
                Success = success,
                Message = success
                    ? $"Message sent successfully via {type}"
                    : $"Failed to send message via {type}"
            };
        }
        catch (Exception ex)
        {
            return new CommunicationResponse
            {
                Success = false,
                Message = $"Error: {ex.Message}"
            };
        }
    }
}

