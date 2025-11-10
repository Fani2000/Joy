var builder = DistributedApplication.CreateBuilder(args);

// Configure dashboard URLs if not already set
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    Environment.SetEnvironmentVariable("ASPNETCORE_URLS", "http://localhost:15000");
}

if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_DASHBOARD_OTLP_ENDPOINT_URL")))
{
    Environment.SetEnvironmentVariable("DOTNET_DASHBOARD_OTLP_ENDPOINT_URL", "http://localhost:4317");
}

// Allow unsecured transport for development (HTTP instead of HTTPS)
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPIRE_ALLOW_UNSECURED_TRANSPORT")))
{
    Environment.SetEnvironmentVariable("ASPIRE_ALLOW_UNSECURED_TRANSPORT", "true");
}

var mongodb = builder.AddMongoDB("mongodb");

var rabbitmq = builder.AddRabbitMQ("rabbitmq");

// Aspire 9: Use WaitFor to ensure dependencies are ready before starting the API
var api = builder.AddProject<Projects.Joy_Api>("joy-api")
    .WithReference(mongodb)
    .WithReference(rabbitmq)
    .WaitFor(mongodb)
    .WaitFor(rabbitmq)
    .WithHttpEndpoint(env: "ASPIRE_HTTP_PORT")
    .WithHttpsEndpoint(env: "ASPIRE_HTTPS_PORT");

Console.WriteLine("✅ Aspire 9 configured with WaitFor for MongoDB and RabbitMQ");

builder.Build().Run();

