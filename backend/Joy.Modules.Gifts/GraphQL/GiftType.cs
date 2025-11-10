using HotChocolate.Types;
using Joy.Modules.Gifts.Models;

namespace Joy.Modules.Gifts.GraphQL;

public class GiftType : ObjectType<Gift>
{
    protected override void Configure(IObjectTypeDescriptor<Gift> descriptor)
    {
        // HotChocolate will auto-infer types, but we can customize if needed
    }
}

