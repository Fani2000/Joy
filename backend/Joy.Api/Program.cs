using Joy.Api.GraphQL;
using Joy.Api.Data;
using Joy.Modules.Gifts;
using Joy.Modules.Gifts.GraphQL;
using Joy.Modules.Messages;
using Joy.Modules.Messages.GraphQL;
using Joy.Modules.Friends;
using Joy.Modules.Friends.GraphQL;
using Joy.Modules.AI;
using Joy.Modules.AI.GraphQL;
using Joy.Modules.Communication;
using Joy.Modules.Communication.GraphQL;
using Joy.Modules.Shared;
using MongoDB.Driver;
using RabbitMQ.Client;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Driver.Core.Connections;

var builder = WebApplication.CreateBuilder(args);

// Note: When running through Aspire AppHost, the OTLP endpoint URL and other
// environment variables are automatically set by the AppHost.
// No need to call AddServiceDefaults() - AppHost handles the configuration.

// Add MongoDB - when running through Aspire, the client is injected via reference
// For standalone, we configure it manually
var mongoConnectionString = builder.Configuration.GetConnectionString("mongodb");
if (!string.IsNullOrEmpty(mongoConnectionString) && 
    !builder.Services.Any(s => s.ServiceType == typeof(IMongoClient)))
{
    builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoConnectionString));
}

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("joy");
});

// Health checks will be added after services are configured

// Add RabbitMQ - connection will be configured by Aspire
// For now, we'll create connection from configuration
builder.Services.AddSingleton<RabbitMQ.Client.IConnection>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("rabbitmq") 
        ?? "amqp://guest:guest@localhost:5672"; // Default fallback
    
    var connectionFactory = new ConnectionFactory
    {
        Uri = new Uri(connectionString)
    };
    return connectionFactory.CreateConnection();
});

// Register modules
builder.Services.AddGiftsModule(builder.Configuration);
builder.Services.AddMessagesModule(builder.Configuration);
builder.Services.AddFriendsModule(builder.Configuration);
builder.Services.AddAIModule(builder.Configuration);
builder.Services.AddCommunicationModule(builder.Configuration);

// Register database seeder
builder.Services.AddScoped<DatabaseSeeder>();

// Add GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddType<GiftType>()
    .AddType<MessageType>()
    .AddType<FriendType>()
    .AddType<AIMessageType>()
    .AddType<CommunicationType>()
    .AddTypeExtension<GiftQueries>()
    .AddTypeExtension<GiftMutations>()
    .AddTypeExtension<MessageQueries>()
    .AddTypeExtension<MessageMutations>()
    .AddTypeExtension<FriendQueries>()
    .AddTypeExtension<FriendMutations>()
    .AddTypeExtension<AIMutations>()
    .AddTypeExtension<CommunicationMutations>();

// Add CORS - Enhanced configuration for mobile app
builder.Services.AddCors(options =>
{
    // Development policy - Allow all origins (for mobile development)
    options.AddPolicy("DevelopmentPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Content-Length", "Content-Type");
    });

    // Production policy - Restrict to specific origins
    options.AddPolicy("ProductionPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
            ?? new[] { "https://your-production-domain.com" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Content-Length", "Content-Type");
    });

    // Default policy for easy access
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(_ => true) // Allow any origin in development
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Content-Length", "Content-Type", "X-Custom-Header");
    });
});

// Add controllers for REST API (optional, for compatibility)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Note: Aspire 9 WaitFor handles dependency readiness automatically
// No need for manual retry logic - MongoDB and RabbitMQ will be ready when API starts

// Enable CORS - Use appropriate policy based on environment
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentPolicy");
    Console.WriteLine("✅ CORS enabled with Development policy (Allow all origins)");
}
else
{
    app.UseCors("ProductionPolicy");
    Console.WriteLine("✅ CORS enabled with Production policy (Restricted origins)");
}

// Seed database with initial data
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
}

// Map GraphQL endpoint
app.MapGraphQL();

// Map REST API endpoints (optional)
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();

