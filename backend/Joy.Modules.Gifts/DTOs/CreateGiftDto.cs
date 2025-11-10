namespace Joy.Modules.Gifts.DTOs;

public class CreateGiftDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
}

