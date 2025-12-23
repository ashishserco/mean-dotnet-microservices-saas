using ClaimsService.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace ClaimsService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClaimsController : ControllerBase
{
    private readonly IMongoCollection<Claim> _claimsCollection;
    private readonly IConnection _rabbitConnection;

    public ClaimsController(IConfiguration config)
    {
        var mongoClient = new MongoClient(config["MongoDbSettings:ConnectionString"]);
        var mongoDatabase = mongoClient.GetDatabase(config["MongoDbSettings:DatabaseName"]);
        _claimsCollection = mongoDatabase.GetCollection<Claim>("Claims");

        var factory = new ConnectionFactory { HostName = config["RabbitMqSettings:HostName"] };
        // In a real app, handle connection failures/retries
        try {
            _rabbitConnection = factory.CreateConnection();
        } catch {
            // Fallback or log error
        }
    }

    [HttpGet]
    public async Task<List<Claim>> Get()
    {
        // In real app: Extract TenantId from JWT
        return await _claimsCollection.Find(_ => true).ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post(Claim newClaim)
    {
        // In real app: Set UserId and TenantId from JWT
        newClaim.Status = ClaimStatus.Pending;
        newClaim.CreatedAt = DateTime.UtcNow;

        await _claimsCollection.InsertOneAsync(newClaim);

        // Publish to RabbitMQ for AI Analysis
        PublishToQueue(newClaim);

        return CreatedAtAction(nameof(Get), new { id = newClaim.Id }, newClaim);
    }

    private void PublishToQueue(Claim claim)
    {
        if (_rabbitConnection == null) return;

        using var channel = _rabbitConnection.CreateModel();
        channel.QueueDeclare(queue: "claim_analysis_queue",
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);

        var message = new { claimId = claim.Id, description = claim.Description };
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        channel.BasicPublish(exchange: "",
                             routingKey: "claim_analysis_queue",
                             basicProperties: null,
                             body: body);
    }
}
