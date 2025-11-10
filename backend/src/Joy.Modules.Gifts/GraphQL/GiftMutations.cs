using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Gifts.Models;
using Joy.Modules.Gifts.Services;
using Joy.Modules.Gifts.DTOs;

namespace Joy.Modules.Gifts.GraphQL;

[ExtendObjectType("Mutation")]
public class GiftMutations
{
    public async Task<Gift> SendGift(
        [Service] IGiftService giftService,
        string senderEmail,
        CreateGiftInput input)
    {
        var dto = new CreateGiftDto
        {
            Title = input.Title,
            Description = input.Description,
            RecipientEmail = input.RecipientEmail
        };

        return await giftService.CreateGiftAsync(dto, senderEmail);
    }
}

public class CreateGiftInput
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
}

