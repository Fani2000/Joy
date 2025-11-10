namespace Joy.Modules.AI.Models;

public class AIMessageRequest
{
    public string Occasion { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string Tone { get; set; } = "friendly";
    public string? AdditionalDetails { get; set; }
}

public class AIMessageResponse
{
    public string Message { get; set; } = string.Empty;
    public List<string> Suggestions { get; set; } = new();
}

