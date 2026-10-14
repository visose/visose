using System.Net;
using System.Text.Json;
using System.Threading.RateLimiting;
using Azure.Identity;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Visose.Api.Contact;

public partial class ContactFunction(ContactDelivery delivery, ContactSettings settings, FixedWindowRateLimiter limiter, ILogger<ContactFunction> logger)
{
    [Function("Contact")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "contact")] HttpRequestData request,
        CancellationToken cancellationToken)
    {
        if (!settings.AllowedOrigins.Contains(Header(request, "Origin"), StringComparer.Ordinal))
            return await Respond(request, new(HttpStatusCode.Forbidden, new(false, false, "Origin is not allowed.", [])));

        using var permit = limiter.AttemptAcquire();
        if (!permit.IsAcquired)
        {
            var limited = await Respond(request, new(HttpStatusCode.TooManyRequests, new(false, false, "Please try again later or contact us by email.", [])));
            limited.Headers.Add("Retry-After", "600");
            return limited;
        }

        try
        {
            var result = await ContactSubmission.Submit(request.Body, Header(request, "Content-Type"),
                long.TryParse(Header(request, "Content-Length"), out var length) && length >= 0 ? length : null,
                cancellationToken, deliver: delivery.Send);

            return await Respond(request, result);
        }
        catch (Exception exception) when (exception is HttpRequestException or AuthenticationFailedException or OperationCanceledException)
        {
            // Do not log inquiry data or provider error payloads.
            DeliveryFailed(logger, exception.GetType().Name);
            return await Respond(request, new(HttpStatusCode.ServiceUnavailable, new(false, false, "Unable to confirm delivery. Please contact us by email.", [])));
        }
    }

    [LoggerMessage(Level = LogLevel.Warning, Message = "Contact delivery failed ({failureType}).")]
    static partial void DeliveryFailed(ILogger logger, string failureType);

    static async Task<HttpResponseData> Respond(HttpRequestData request, ContactResult result)
    {
        var response = request.CreateResponse(result.Status);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.Headers.Add("Cache-Control", "no-store");
        await response.WriteStringAsync(JsonSerializer.Serialize(result.Body, JsonSerializerOptions.Web));
        return response;
    }

    static string? Header(HttpRequestData request, string name) =>
        request.Headers.TryGetValues(name, out var values) && values.ToArray() is [var value] ? value : null;
}
