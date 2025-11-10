namespace Joy.Modules.Communication.GraphQL;

public class CommunicationInput
{
    public string Type { get; set; } = "email";
    public string Recipient { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Subject { get; set; }
}

public class CommunicationResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class CommunicationType : ObjectType<CommunicationResponse>
{
    protected override void Configure(IObjectTypeDescriptor<CommunicationResponse> descriptor)
    {
        descriptor.Field(f => f.Success).Type<NonNullType<BooleanType>>();
        descriptor.Field(f => f.Message).Type<NonNullType<StringType>>();
    }
}

