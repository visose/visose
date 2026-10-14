using System.Net;
using System.Net.Http.Json;
using Azure.Core;
using Microsoft.Extensions.Configuration;

namespace Visose.Api.Contact;

public record ContactSettings(string Sender, string Recipient, string[] AllowedOrigins)
{
    public static ContactSettings Load(IConfiguration configuration)
    {
        string Required(string key)
        {
            return configuration[$"Contact:{key}"] is { Length: > 0 } value
            ? value : throw new InvalidOperationException($"Missing Contact:{key}.");
        }

        var sender = Required("SenderMailbox");
        var recipient = Required("RecipientMailbox");
        var origins = Required("AllowedOrigins").Split(',', StringSplitOptions.TrimEntries);
        if (new[] { sender, recipient }.Any(value => !System.Net.Mail.MailAddress.TryCreate(value, out var address) || address.Address != value) ||
            origins.Any(value => !Uri.TryCreate(value, UriKind.Absolute, out var uri) || uri.Scheme != "https" ||
                uri.IsLoopback || uri.AbsolutePath != "/" || uri.Query.Length > 0 || uri.Fragment.Length > 0 || uri.UserInfo.Length > 0 ||
                value != uri.GetLeftPart(UriPartial.Authority)))
        {
            throw new InvalidOperationException("Contact settings require valid mailboxes and exact HTTPS origins without trailing slashes.");
        }

        return new(sender, recipient, origins);
    }
}

public class ContactDelivery(HttpClient client, TokenCredential credential, ContactSettings settings)
{
    public async Task Send(IReadOnlyDictionary<string, string> fields, CancellationToken cancellationToken)
    {
        var token = await credential.GetTokenAsync(new(["https://graph.microsoft.com/.default"]), cancellationToken);
        using HttpRequestMessage request = new(HttpMethod.Post,
            $"https://graph.microsoft.com/v1.0/users/{Uri.EscapeDataString(settings.Sender)}/sendMail");

        request.Headers.Authorization = new("Bearer", token.Token);
        request.Content = JsonContent.Create(new
        {
            message = new
            {
                subject = "visose website inquiry",
                body = new
                {
                    contentType = "Text",
                    content = string.Join("\n\n", ContactContract.Current.Fields.Values
                        .Where(field => !string.IsNullOrWhiteSpace(fields.GetValueOrDefault(field.Name)))
                        .Select(field => $"{field.Label}:\n{fields[field.Name]}")),
                },
                toRecipients = new[] { new { emailAddress = new { address = settings.Recipient } } },
                replyTo = new[] { new { emailAddress = new { address = fields["email"], name = fields["name"] } } },
            },
            saveToSentItems = true,
        });

        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

        if (response.StatusCode != HttpStatusCode.Accepted)
            throw new HttpRequestException($"Mail service returned HTTP {(int)response.StatusCode}.");
    }
}
