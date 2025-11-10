using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Shared.Models;
using Joy.Modules.Friends.Services;

namespace Joy.Modules.Friends.GraphQL;

[ExtendObjectType("Query")]
public class FriendQueries
{
    public async Task<IEnumerable<User>> GetFriends(
        [Service] IFriendService friendService,
        string userEmail)
    {
        return await friendService.GetFriendsAsync(userEmail);
    }

    public async Task<User?> GetUser(
        [Service] IFriendService friendService,
        string email)
    {
        return await friendService.GetUserByEmailAsync(email);
    }
}

