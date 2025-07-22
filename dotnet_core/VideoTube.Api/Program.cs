using VideoTube.API.Configuration;
using VideoTube.API.Middleware;
using VideoTube.API.Services;

var builder = WebApplication.CreateBuilder(args);

// === Add services to the dependency injection container ===

// 1. Configure Settings
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<S3Settings>(builder.Configuration.GetSection("S3Settings")); // New S3 settings

// 2. Add Database Service
builder.Services.AddSingleton<IMongoService, MongoService>();

// 3. Add our custom application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IS3Service, S3Service>(); // Register S3 Service
builder.Services.AddScoped<IJwtService, JwtService>();
// builder.Services.AddScoped<ICloudinaryService, CloudinaryService>(); // Remove this line

// 4. Add controllers and CORS
builder.Services.AddControllers();

var allowedOrigins = builder.Configuration.GetSection("CorsSettings:AllowedOrigin").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// === Build the application ===
var app = builder.Build();

// === Configure the HTTP request pipeline ===
app.UseMiddleware<ErrorHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();
app.Run();
