using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Gifts.Models;
using Joy.Modules.Gifts.Services;

namespace Joy.Modules.Gifts.GraphQL;

[ExtendObjectType("Query")]
public class GiftQueries
{
    public async Task<IEnumerable<Gift>> GetGifts(
        [Service] IGiftService giftService,
        string senderEmail)
    {
        return await giftService.GetGiftsBySenderAsync(senderEmail);
    }

    public async Task<Gift?> GetGift(
        [Service] IGiftService giftService,
        string id)
    {
        return await giftService.GetGiftByIdAsync(id);
    }

    public async Task<IEnumerable<Gift>> GetReceivedGifts(
        [Service] IGiftService giftService,
        string recipientEmail)
    {
        return await giftService.GetGiftsByRecipientAsync(recipientEmail);
    }
}

