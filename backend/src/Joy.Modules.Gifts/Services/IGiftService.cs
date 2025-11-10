using Joy.Modules.Gifts.Models;
using Joy.Modules.Gifts.DTOs;

namespace Joy.Modules.Gifts.Services;

public interface IGiftService
{
    Task<Gift> CreateGiftAsync(CreateGiftDto dto, string senderEmail);
    Task<IEnumerable<Gift>> GetGiftsBySenderAsync(string senderEmail);
    Task<Gift?> GetGiftByIdAsync(string id);
    Task<IEnumerable<Gift>> GetGiftsByRecipientAsync(string recipientEmail);
}

