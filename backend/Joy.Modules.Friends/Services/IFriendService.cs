using Joy.Modules.Shared.Models;

namespace Joy.Modules.Friends.Services;

public interface IFriendService
{
    Task<User> AddFriendAsync(string userEmail, string friendEmail);
    Task<IEnumerable<User>> GetFriendsAsync(string userEmail);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User> CreateOrUpdateUserAsync(string email, string? name = null, DateTime? birthday = null);
}

