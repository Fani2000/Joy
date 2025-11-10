using Joy.Modules.AI.Models;

namespace Joy.Modules.AI.GraphQL;

public class AIMessageInput
{
    public string Occasion { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string Tone { get; set; } = "friendly";
    public string? AdditionalDetails { get; set; }
}

public class AIMessageResult
{
    public string Message { get; set; } = string.Empty;
    public List<string> Suggestions { get; set; } = new();
}

public class AIMessageType : ObjectType<AIMessageResult>
{
    protected override void Configure(IObjectTypeDescriptor<AIMessageResult> descriptor)
    {
        descriptor.Field(f => f.Message).Type<NonNullType<StringType>>();
        descriptor.Field(f => f.Suggestions).Type<ListType<StringType>>();
    }
}

