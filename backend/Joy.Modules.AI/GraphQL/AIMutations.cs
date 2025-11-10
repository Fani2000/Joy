using Joy.Modules.AI.Models;
using Joy.Modules.AI.Services;

namespace Joy.Modules.AI.GraphQL;

[ExtendObjectType("Mutation")]
public class AIMutations
{
    public async Task<AIMessageResult> GenerateMessage(
        AIMessageInput input,
        [Service] AIMessageService aiService)
    {
        var request = new AIMessageRequest
        {
            Occasion = input.Occasion,
            RecipientName = input.RecipientName,
            Tone = input.Tone,
            AdditionalDetails = input.AdditionalDetails
        };

        var response = await aiService.GenerateMessageAsync(request);

        return new AIMessageResult
        {
            Message = response.Message,
            Suggestions = response.Suggestions
        };
    }
}

