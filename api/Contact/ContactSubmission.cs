using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Text.Json;

namespace Visose.Api.Contact;

public record ContactResponse(bool Ok, bool Simulated, string Message, Dictionary<string, string> FieldErrors);
public record ContactResult(HttpStatusCode Status, ContactResponse Body);

// Both hosts share validation. The loopback host supplies no delivery callback.
public static class ContactSubmission
{
    static readonly JsonSerializerOptions JsonOptions = new() { AllowDuplicateProperties = false };

    public static async Task<ContactResult> Submit(
        Stream body, string? contentType, long? contentLength, CancellationToken cancellationToken,
        Func<IReadOnlyDictionary<string, string>, CancellationToken, Task>? deliver = null)
    {
        ContactResult Result(HttpStatusCode status, string message, Dictionary<string, string>? errors = null)
        {
            return new(status, new(status == HttpStatusCode.Accepted, deliver is null, message, errors ?? []));
        }

        var contract = ContactContract.Current;

        if (contentLength > contract.MaxBodyBytes)
            return Result(HttpStatusCode.RequestEntityTooLarge, "The request is too large.");

        if (!string.Equals(contentType?.Split(';', 2)[0].Trim(), "application/json", StringComparison.OrdinalIgnoreCase))
            return Result(HttpStatusCode.UnsupportedMediaType, "Use JSON content.");

        var bytes = new byte[contract.MaxBodyBytes + 1];
        var length = await body.ReadAtLeastAsync(bytes, bytes.Length, false, cancellationToken);

        if (length > contract.MaxBodyBytes)
            return Result(HttpStatusCode.RequestEntityTooLarge, "The request is too large.");

        Dictionary<string, string>? fields;
        try
        {
            fields = JsonSerializer.Deserialize<Dictionary<string, string>>(bytes.AsSpan(0, length), JsonOptions);
        }
        catch (JsonException)
        {
            return Result(HttpStatusCode.BadRequest, "The request body must contain JSON text fields.");
        }

        if (fields is null || fields.Any(field => field.Value is null || !contract.Fields.ContainsKey(field.Key)))
            return Result(HttpStatusCode.BadRequest, "The request contains invalid fields.");

        Dictionary<string, string> errors = [];
        foreach (var field in contract.Fields.Values)
        {
            var value = fields.GetValueOrDefault(field.Name, "").Trim();
            if (field.Required && value.Length == 0)
            {
                errors[field.Name] = field.Error!;
            }
            else if (field.MaxLength is { } maxLength && value.Length > maxLength)
            {
                errors[field.Name] = contract.TooLong.Replace("{maxLength}", maxLength.ToString(CultureInfo.InvariantCulture), StringComparison.Ordinal);
            }
            else if (field.Type == "email" && value.Length > 0 &&
                (!MailAddress.TryCreate(value, out var email) || email.Address != value || value.Any(char.IsWhiteSpace)))
            {
                errors[field.Name] = field.Error!;
            }
            else if (field.Options is { } options && value.Length > 0 && !options.Contains(value, StringComparer.Ordinal))
            {
                errors[field.Name] = field.Error!;
            }
        }

        if (errors.Count > 0)
            return Result(HttpStatusCode.BadRequest, contract.InvalidFields, errors);

        if (deliver is not null)
        {
            await deliver(fields.ToDictionary(field => field.Key, field => field.Value.Trim()), cancellationToken);
            return Result(HttpStatusCode.Accepted, "Your inquiry has been sent.");
        }

        return Result(HttpStatusCode.Accepted, "This was a simulation. Nothing has been sent or saved.");
    }
}
