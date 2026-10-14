using System.Collections.Frozen;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Visose.Api.Contact;

// The repository form definition supplies the rendered form and API constraints.
public record ContactField(
    string Name,
    string Label,
    string Type,
    bool Required,
    int? MaxLength = null,
    string[]? Options = null,
    string? Error = null);

public record ContactFormDefinition(
    int MaxBodyBytes,
    ContactField[] Form,
    string TooLong,
    string InvalidFields);

public class ContactContract
{
    static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web) { RespectRequiredConstructorParameters = true };

    public static ContactContract Current { get; } = Load();

    public int MaxBodyBytes { get; }
    public FrozenDictionary<string, ContactField> Fields { get; }
    public string TooLong { get; }
    public string InvalidFields { get; }

    ContactContract(ContactFormDefinition definition)
    {
        if (definition.MaxBodyBytes <= 0 || definition.Form is not { Length: > 0 } ||
            string.IsNullOrWhiteSpace(definition.InvalidFields) ||
            definition.TooLong is null || !definition.TooLong.Contains("{maxLength}", StringComparison.Ordinal))
        {
            throw new InvalidDataException("Invalid contact contract.");
        }

        HashSet<string> names = new(StringComparer.Ordinal);
        foreach (var field in definition.Form)
        {
            if (field is null || field.Name is null || !Regex.IsMatch(field.Name, "^[a-z][a-z0-9-]*$") ||
                string.IsNullOrWhiteSpace(field.Label) ||
                !names.Add(field.Name) || field.Type is not ("text" or "email" or "textarea" or "select") ||
                ((field.Required || field.Type is "email" or "select") && string.IsNullOrWhiteSpace(field.Error)) ||
                (field.Type == "select"
                    ? field.MaxLength is not null || field.Options is not { Length: > 0 } ||
                        field.Options.Any(string.IsNullOrWhiteSpace) ||
                        field.Options.Distinct(StringComparer.Ordinal).Count() != field.Options.Length
                    : field.MaxLength is not > 0 || field.Options is not null))
            {
                throw new InvalidDataException("Invalid contact field.");
            }
        }

        MaxBodyBytes = definition.MaxBodyBytes;
        Fields = definition.Form.ToFrozenDictionary(field => field.Name, StringComparer.Ordinal);
        TooLong = definition.TooLong;
        InvalidFields = definition.InvalidFields;
    }

    static ContactContract Load()
    {
        using var stream = typeof(ContactContract).Assembly.GetManifestResourceStream("Visose.ContactForm.json")
            ?? throw new InvalidDataException("The contact form definition is missing.");

        var definition = JsonSerializer.Deserialize<ContactFormDefinition>(stream, JsonOptions)
            ?? throw new InvalidDataException("The contact contract is missing.");

        return new(definition);
    }
}
