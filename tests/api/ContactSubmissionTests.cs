using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;
using Visose.Api.Contact;

namespace Visose.Api.Tests;

public class ContactSubmissionTests
{
    [Fact]
    public async Task AcceptsValidInputAsSimulation()
    {
        var fields = ValidFields();
        fields["budget"] = "EUR 20,000-30,000";
        fields["message"] = new('界', ContactContract.Current.Fields["message"].MaxLength!.Value);
        var result = await Submit(JsonSerializer.Serialize(fields));

        Assert.Equal(HttpStatusCode.Accepted, result.Status);
        Assert.True(result.Body.Ok);
        Assert.True(result.Body.Simulated);
        Assert.Empty(result.Body.FieldErrors);
    }

    [Fact]
    public async Task ReportsInvalidFieldsWithoutSending()
    {
        var fields = ValidFields();
        fields["name"] = " ";
        fields["email"] = "not an email";
        fields["message"] = new('a', ContactContract.Current.Fields["message"].MaxLength!.Value + 1);
        fields["area"] = "unknown option";
        fields["budget"] = new('b', ContactContract.Current.Fields["budget"].MaxLength!.Value + 1);

        using MemoryStream body = new(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(fields)));
        var result = await ContactSubmission.Submit(body, "application/json", null, CancellationToken.None,
            deliver: (_, _) => throw new InvalidOperationException("Invalid input must not reach delivery."));

        Assert.Equal(HttpStatusCode.BadRequest, result.Status);
        Assert.False(result.Body.Ok);
        Assert.False(result.Body.Simulated);
        Assert.Equal(["area", "budget", "email", "message", "name"], result.Body.FieldErrors.Keys.Order());
        foreach (var field in new[] { "name", "email", "area" })
            Assert.Equal(ContactContract.Current.Fields[field].Error, result.Body.FieldErrors[field]);
    }

    [Theory]
    [InlineData(/*lang=json,strict*/ "{\"name\": 7}")]
    [InlineData(/*lang=json,strict*/ "{\"unexpected\": \"field\"}")]
    public async Task RejectsInvalidJsonFields(string json)
    {
        var result = await Submit(json);
        Assert.Equal(HttpStatusCode.BadRequest, result.Status);
        Assert.True(result.Body.Simulated);
    }

    [Fact]
    public async Task RejectsOversizedBodyWithoutContentLength()
    {
        var result = await Submit(new(' ', ContactContract.Current.MaxBodyBytes + 1));
        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, result.Status);
    }

    [Fact]
    public void ReviewHostCannotBindPublicly()
    {
        Assert.True(ReviewHost.ParseAddress(["--urls", "http://127.0.0.1:7071"]).IsLoopback);
        _ = Assert.Throws<ArgumentException>(() => ReviewHost.ParseAddress(["--urls", "http://0.0.0.0:7071"]));
    }

    static Dictionary<string, string> ValidFields() => new()
    {
        ["name"] = "Example Buyer",
        ["email"] = "buyer@example.com",
        ["message"] = "Please help with a CAD application.",
    };

    static async Task<ContactResult> Submit(string json)
    {
        using MemoryStream body = new(Encoding.UTF8.GetBytes(json));
        return await ContactSubmission.Submit(body, "application/json", null, CancellationToken.None);
    }
}
