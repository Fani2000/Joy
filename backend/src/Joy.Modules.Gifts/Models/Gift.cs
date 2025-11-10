using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Joy.Modules.Shared.Models;

namespace Joy.Modules.Gifts.Models;

public class Gift
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("senderEmail")]
    public string SenderEmail { get; set; } = string.Empty;

    [BsonElement("recipientEmail")]
    public string RecipientEmail { get; set; } = string.Empty;

    [BsonElement("recipientName")]
    public string? RecipientName { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("status")]
    public string Status { get; set; } = "pending";
}

