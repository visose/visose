using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Stripe;
using Api;

var builder = FunctionsApplication.CreateBuilder(args);
var services = builder.Services;
var config = builder.Configuration;

services.Configure<JsonSerializerOptions>(options =>
{
    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.PropertyNameCaseInsensitive = false;
});

services.AddSingleton<PricingService>();

StripeConfiguration.ApiKey = config["StripeKey"];

var host = builder.Build();
host.Run();
