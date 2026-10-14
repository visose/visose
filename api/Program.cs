using System.Security.Cryptography.X509Certificates;
using System.Threading.RateLimiting;
using Azure.Core;
using Azure.Identity;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Visose.Api;
using Visose.Api.Contact;

_ = ContactContract.Current;

if (args.Contains("--review", StringComparer.Ordinal))
{
    await ReviewHost.Run([.. args.Where(argument => argument != "--review")]);
    return;
}

var builder = FunctionsApplication.CreateBuilder(args);
builder.Services.AddSingleton(ContactSettings.Load(builder.Configuration));
using var certificate = X509CertificateLoader.LoadPkcs12(
    Convert.FromBase64String(Required("AZURE_CLIENT_CERTIFICATE")), null, X509KeyStorageFlags.EphemeralKeySet);
builder.Services.AddSingleton<TokenCredential>(new ClientCertificateCredential(
    Required("AZURE_TENANT_ID"), Required("AZURE_CLIENT_ID"), certificate));

builder.Services.AddHttpClient<ContactDelivery>(client => client.Timeout = TimeSpan.FromSeconds(10));

// Cap mail volume without storing visitor addresses or inquiry bodies.
builder.Services.AddSingleton(new FixedWindowRateLimiter(new()
{
    PermitLimit = 20,
    Window = TimeSpan.FromMinutes(10),
    QueueLimit = 0,
}));

builder.Build().Run();

string Required(string name)
{
    return builder.Configuration[name] is { Length: > 0 } value
    ? value : throw new InvalidOperationException($"Missing {name}.");
}
