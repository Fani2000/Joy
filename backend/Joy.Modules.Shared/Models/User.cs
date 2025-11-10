using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Joy.Modules.Shared.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("name")]
    public string? Name { get; set; }

    [BsonElement("birthday")]
    public DateTime? Birthday { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

