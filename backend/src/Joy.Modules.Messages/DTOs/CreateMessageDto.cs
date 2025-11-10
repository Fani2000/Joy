namespace Joy.Modules.Messages.DTOs;

public class CreateMessageDto
{
    public string Content { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string MessageType { get; set; } = "birthday";
}

