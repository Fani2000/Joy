using HotChocolate.Types;
using Joy.Modules.Shared.Models;

namespace Joy.Modules.Friends.GraphQL;

public class FriendType : ObjectType<User>
{
    protected override void Configure(IObjectTypeDescriptor<User> descriptor)
    {
        // HotChocolate will auto-infer types, but we can customize if needed
    }
}

