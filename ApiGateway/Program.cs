using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);


// Adding ocelot to the container.
builder.Services.AddOcelot(builder.Configuration);
builder.Configuration.AddJsonFile("ocelot.json");

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

// Using Ocelot Middleware
app.UseOcelot().Wait();

app.Run();
