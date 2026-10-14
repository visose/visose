using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Visose.Api.Contact;

namespace Visose.Api;

public static class ReviewHost
{
    public static Uri ParseAddress(string[] args)
    {
        var address = args.Length switch
        {
            0 => "http://127.0.0.1:7071",
            2 when args[0] == "--urls" => args[1],
            _ => throw new ArgumentException("Use --review [--urls http://127.0.0.1:7071].", nameof(args)),
        };
        if (!Uri.TryCreate(address, UriKind.Absolute, out var uri) ||
            uri.Scheme != Uri.UriSchemeHttp || uri.AbsolutePath != "/" ||
            uri.Query.Length > 0 || uri.Fragment.Length > 0 || uri.UserInfo.Length > 0 ||
            !(uri.Host == "localhost" || IPAddress.TryParse(uri.Host, out var ip) && IPAddress.IsLoopback(ip)))
        {
            throw new ArgumentException("The review host requires one HTTP loopback URL.", nameof(args));
        }

        return uri;
    }

    public static async Task Run(string[] args)
    {
        var address = ParseAddress(args);
        var builder = WebApplication.CreateSlimBuilder(new WebApplicationOptions
        {
            Args = [],
            EnvironmentName = Environments.Development,
        });

        // Ignore environment/appsettings endpoints: this host can only listen on loopback.
        builder.Configuration.Sources.Clear();
        _ = builder.WebHost.ConfigureKestrel(server =>
        {
            _ = server.Configure(new ConfigurationBuilder().Build());
            server.Listen(IPAddress.Loopback, address.Port);
            server.Limits.MaxRequestBodySize = ContactContract.Current.MaxBodyBytes;
        });

        _ = builder.Logging.ClearProviders();

        var app = builder.Build();
        _ = app.MapGet("/api/review", () => Results.Json(new { ready = true, simulated = true }));
        _ = app.MapPost("/api/contact", async (HttpContext context) =>
        {
            var request = context.Request;
            var result = await ContactSubmission.Submit(request.Body, request.ContentType, request.ContentLength,
                context.RequestAborted);

            if (result.Body.Ok && request.Headers["X-Review-Outcome"] == "error")
                result = new(HttpStatusCode.ServiceUnavailable, new(false, true, "Simulation failed. Nothing has been sent or saved.", []));

            context.Response.Headers.CacheControl = "no-store";
            return Results.Json(result.Body, statusCode: (int)result.Status);
        });

        await app.RunAsync();
    }
}
