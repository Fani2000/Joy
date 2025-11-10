using HotChocolate;
using HotChocolate.Types;
using Joy.Modules.Shared.Models;
using Joy.Modules.Friends.Services;

namespace Joy.Modules.Friends.GraphQL;

[ExtendObjectType("Mutation")]
public class FriendMutations
{
    public async Task<User> AddFriend(
        [Service] IFriendService friendService,
        string userEmail,
        string friendEmail)
    {
        return await friendService.AddFriendAsync(userEmail, friendEmail);
    }

    public async Task<User> CreateOrUpdateUser(
        [Service] IFriendService friendService,
        string email,
        string? name = null,
        DateTime? birthday = null)
    {
        return await friendService.CreateOrUpdateUserAsync(email, name, birthday);
    }
}

