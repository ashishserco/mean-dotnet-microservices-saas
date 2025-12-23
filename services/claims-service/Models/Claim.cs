using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ClaimsService.Models;

public class Claim
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string UserId { get; set; } = null!;
    public string TenantId { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Amount { get; set; }
    public DateTime DateOfService { get; set; }
    
    [BsonRepresentation(BsonType.String)]
    public ClaimStatus Status { get; set; } = ClaimStatus.Pending;

    public string? AiSummary { get; set; }
    public int? RiskScore { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum ClaimStatus
{
    Pending,
    Analyzing,
    ReviewNeeded,
    Approved,
    Rejected
}
