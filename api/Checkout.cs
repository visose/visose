using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;

namespace Api;

public record CheckoutRequest(int Robots);
public record CheckoutResponse(string Url);

public class Checkout(PricingService pricing, IConfiguration config)
{
    [Function("checkout")]
    public async Task<HttpResponseData> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
    {
        var data = await req.ReadFromJsonAsync<CheckoutRequest>()
            ?? throw new("Unable to deserialize body.");

        var robotCount = data.Robots;

        if (!pricing.IsValidCount(robotCount))
            return req.CreateResponse(HttpStatusCode.BadRequest);

        var baseUrl = config.GetValue("BaseUrl", "https://visose.com");
        var sessionUrl = await pricing.CreateSession(baseUrl, robotCount);

        var res = req.CreateResponse(HttpStatusCode.OK);
        await res.WriteAsJsonAsync(new CheckoutResponse(sessionUrl));
        return res;
    }
}
