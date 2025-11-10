using HotChocolate.Types;
using Joy.Modules.Messages.Models;

namespace Joy.Modules.Messages.GraphQL;

public class MessageType : ObjectType<Message>
{
    protected override void Configure(IObjectTypeDescriptor<Message> descriptor)
    {
        // HotChocolate will auto-infer types, but we can customize if needed
    }
}

