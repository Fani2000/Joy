using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Joy.Modules.Messages.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("senderEmail")]
    public string SenderEmail { get; set; } = string.Empty;

    [BsonElement("recipientEmail")]
    public string RecipientEmail { get; set; } = string.Empty;

    [BsonElement("recipientName")]
    public string? RecipientName { get; set; }

    [BsonElement("messageType")]
    public string MessageType { get; set; } = "birthday";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

