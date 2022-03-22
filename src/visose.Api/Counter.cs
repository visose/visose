using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure;
using Azure.Data.Tables;

namespace visose.Api;

class CountEntity : ITableEntity
{
    public int Count { get; set; }
    public string PartitionKey { get; set; } = default!;
    public string RowKey { get; set; } = default!;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}

record Body(string page);

public static class Counter
{
    [FunctionName("count")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        var body = await JsonSerializer.DeserializeAsync<Body>(req.Body);
        var page = body?.page;

        if (page is null)
            return new BadRequestResult();

        var connectionString = Environment.GetEnvironmentVariable("AzureStorage");
        var table = new TableClient(connectionString, "visose");

        int retries = 10;

        while (retries-- > 0)
        {
            try
            {
                CountEntity countEntity = await table.GetEntityAsync<CountEntity>("visose", page);
                countEntity.Count++;
                await table.UpdateEntityAsync(countEntity, countEntity.ETag);
                return new OkResult();
            }
            catch (RequestFailedException e)
            {
                if (e.Status != 412)
                    throw;

                log.LogWarning($"Retrying increment count... {e.Message}");
                await Task.Delay(200);
            }
        }

        log.LogError("Count failed to increment.");
        return new BadRequestResult();
    }
}
