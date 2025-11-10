namespace Joy.Modules.Communication.Models;

public enum CommunicationType
{
    Email,
    SMS,
    WhatsApp
}

public class CommunicationRequest
{
    public CommunicationType Type { get; set; }
    public string Recipient { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Subject { get; set; }
}

public class CommunicationResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? ErrorDetails { get; set; }
}

