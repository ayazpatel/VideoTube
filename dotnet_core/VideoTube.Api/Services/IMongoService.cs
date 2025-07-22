using MongoDB.Driver;

namespace VideoTube.API.Services;

public interface IMongoService
{
    IMongoCollection<T> GetCollection<T>(string name);
}