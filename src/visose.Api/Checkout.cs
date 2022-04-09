using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;
using visose.Shared;

namespace visose.Api;

public static class Checkout
{
    [FunctionName("checkout")]
    public static IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        // domain
        string? environment = Environment.GetEnvironmentVariable("AZURE_FUNCTIONS_ENVIRONMENT");
        var isDevelopment = string.Equals(environment, "Development");
        string domain = isDevelopment ? "http://localhost:4280" : "https://visose.com";

        // stripe
        var stripeKey = Environment.GetEnvironmentVariable("StripeKey");
        StripeConfiguration.ApiKey = stripeKey;

        // get form values
        if (!req.Form.TryGetValue("robots", out var value)
            || value.Count != 1
            || !int.TryParse(value[0], out var robotCount)
            || robotCount < 1
            || robotCount > 6)
            return new BadRequestResult();

        string s = robotCount == 1 ? "" : "s";

        // set payment
        int price = RobotsPricing.Default.CalcPrice(robotCount);

        var options = new SessionCreateOptions
        {
            LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = price,
                        Currency = "gbp",
                        Recurring = new SessionLineItemPriceDataRecurringOptions
                        {
                            Interval = "year",
                            IntervalCount = 1
                        },
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Robots commercial support ({robotCount} robot{s})",
                            Description = $"Annual subscription to commercial support for the software Robots. This subscription covers a single organization that uses the software with up to {robotCount} robot{s}.",
                            Images = new List<string> { "https://raw.githubusercontent.com/visose/Robots/master/build/Assets/icon128.png" }
                        },
                    },
                    Quantity = 1
                  },
                },
            Metadata = new Dictionary<string, string>
            {
                { "robots", robotCount.ToString() }
            },
            Mode = "subscription",
            BillingAddressCollection = "required",
            SuccessUrl = domain + "/success.html",
            CancelUrl = domain + "/cancel.html",
            //AutomaticTax = new SessionAutomaticTaxOptions { Enabled = true },
        };

        var service = new SessionService();
        Session session = service.Create(options);
        req.HttpContext.Response.Headers.Add("Location", session.Url);

        log.LogInformation($"Checkout for Robots commercial support ({robotCount} robots).");
        return new StatusCodeResult(303);
    }
}
