using System.Net;
using System.Text;
using System.Text.Json;
using Azure.Core;
using Microsoft.Extensions.Configuration;
using Xunit;
using Visose.Api.Contact;

namespace Visose.Api.Tests;

public class ContactDeliveryTests
{
    [Theory]
    [InlineData(HttpStatusCode.Accepted)]
    [InlineData(HttpStatusCode.ServiceUnavailable)]
    public async Task SendsValidatedInputToConfiguredMailbox(HttpStatusCode status)
    {
        ContactSettings settings = new("sender@example.com", "recipient@example.com", ["https://visose.com"]);
        using MailTransport transport = new(status);
        using HttpClient client = new(transport);
        ContactDelivery delivery = new(client, new TestCredential(), settings);
        using MemoryStream body = new(Encoding.UTF8.GetBytes(/*lang=json,strict*/ """
            {"name":" Buyer ","email":"buyer@example.com","message":"<b>Plain text</b>","budget":"EUR 20,000"}
            """));

        var submission = ContactSubmission.Submit(body, "application/json", null, CancellationToken.None, deliver: delivery.Send);
        if (status == HttpStatusCode.Accepted)
        {
            var result = await submission;
            Assert.True(result.Body.Ok);
            Assert.False(result.Body.Simulated);
        }
        else
        {
            _ = await Assert.ThrowsAsync<HttpRequestException>(() => submission);
        }

        Assert.Equal("https://graph.microsoft.com/v1.0/users/sender%40example.com/sendMail", transport.Url);
        using var payload = JsonDocument.Parse(transport.Body!);
        var message = payload.RootElement.GetProperty("message");
        Assert.Equal("recipient@example.com", message.GetProperty("toRecipients")[0].GetProperty("emailAddress").GetProperty("address").GetString());
        Assert.Equal("buyer@example.com", message.GetProperty("replyTo")[0].GetProperty("emailAddress").GetProperty("address").GetString());
        Assert.Equal("Text", message.GetProperty("body").GetProperty("contentType").GetString());
        Assert.Contains("EUR 20,000", message.GetProperty("body").GetProperty("content").GetString());
    }

    [Fact]
    public void DeliveryRequiresExplicitMailboxesAndHttpsOrigins()
    {
        Dictionary<string, string?> values = new()
        {
            ["Contact:SenderMailbox"] = "info@visose.com",
            ["Contact:RecipientMailbox"] = "info@visose.com",
            ["Contact:AllowedOrigins"] = "https://visose.com,https://www.visose.com",
        };

        IConfiguration Config()
        {
            return new ConfigurationBuilder().AddInMemoryCollection(values).Build();
        }

        Assert.Equal(2, ContactSettings.Load(Config()).AllowedOrigins.Length);
        values["Contact:AllowedOrigins"] = "*";
        _ = Assert.Throws<InvalidOperationException>(() => ContactSettings.Load(Config()));
        _ = values.Remove("Contact:SenderMailbox");
        _ = Assert.Throws<InvalidOperationException>(() => ContactSettings.Load(Config()));
    }

    class MailTransport(HttpStatusCode status) : HttpMessageHandler
    {
        public string? Url { get; private set; }
        public string? Body { get; private set; }
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Url = request.RequestUri!.AbsoluteUri;
            Body = await request.Content!.ReadAsStringAsync(cancellationToken);
            return new(status);
        }
    }

    class TestCredential : TokenCredential
    {
        public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) =>
            new("test-token", DateTimeOffset.MaxValue);
        public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) =>
            ValueTask.FromResult(GetToken(requestContext, cancellationToken));
    }
}
