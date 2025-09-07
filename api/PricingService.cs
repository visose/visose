using System.Text.Json;
using Microsoft.Extensions.Options;
using Stripe.Checkout;

namespace Api;

record PricingData(int Init, double Decay, int Round, int MaxRobots)
{
    public int CalcPrice(int count)
    {
        double r = Math.Exp(Decay);
        double sum = Init * (Math.Pow(r, count) - 1) / (r - 1);
        var gbp = Math.Floor(sum / Round) * Round;
        return (int)(gbp * 100);
    }
}

public class PricingService(IOptions<JsonSerializerOptions> jsonOptions)
{
    readonly PricingData _data = GetData(jsonOptions.Value);

    public bool IsValidCount(int count)
    {
        return count > 0 && count <= _data.MaxRobots;
    }

    public async Task<string> CreateSession(string baseUrl, int robotCount)
    {
        int price = _data.CalcPrice(robotCount);
        var options = GetStripeOptions(baseUrl, robotCount, price);
        SessionService service = new();
        var session = await service.CreateAsync(options);
        return session.Url;
    }

    static PricingData GetData(JsonSerializerOptions options)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "pricing.json");
        using var stream = File.OpenRead(path);

        return JsonSerializer.Deserialize<PricingData>(stream, options)
            ?? throw new("Failed to deserialize pricing.");
    }

    static SessionCreateOptions GetStripeOptions(string baseUrl, int robotCount, int price)
    {
        string s = robotCount == 1 ? "" : "s";

        return new()
        {
            LineItems =
            [
                new()
                {
                    PriceData = new()
                    {
                        UnitAmount = price,
                        TaxBehavior = "exclusive",
                        Currency = "gbp",
                        Recurring = new()
                        {
                            Interval = "year",
                            IntervalCount = 1
                        },
                        ProductData = new()
                        {
                            Name = $"Robots commercial support ({robotCount} robot{s})",
                            Description = $"Annual subscription to commercial support for the software Robots. This subscription covers a single organization that uses the software with up to {robotCount} robot{s}.",
                            Images = ["https://raw.githubusercontent.com/visose/Robots/master/build/Assets/icon128.png"]
                        },
                    },
                    Quantity = 1
                },
            ],
            Metadata = new() { { "robots", robotCount.ToString() } },
            Mode = "subscription",
            BillingAddressCollection = "required",
            SuccessUrl = baseUrl + "/robots/success",
            CancelUrl = baseUrl + "/robots/canceled",
            AutomaticTax = new() { Enabled = true }
        };
    }

}
