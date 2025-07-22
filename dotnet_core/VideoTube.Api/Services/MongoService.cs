using Microsoft.Extensions.Options;
using MongoDB.Driver;
using VideoTube.API.Configuration;

namespace VideoTube.API.Services;

public class MongoService : IMongoService
{
    private readonly IMongoDatabase _database;

    public MongoService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        var client = new MongoClient(mongoDBSettings.Value.ConnectionString);
        _database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string name)
    {
        return _database.GetCollection<T>(name);
    }
}