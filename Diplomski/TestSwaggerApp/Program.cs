// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Diplomski.Context;
using Diplomski.Services;
using Microsoft.AspNetCore.Identity;
using Diplomski.MailUtil;
using Diplomski.Models;

public partial class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Dodavanje servisa u kontejner.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
        builder.Services.AddScoped<IMailService, MailService>();
        builder.Services.AddScoped<ActivityService>();
        builder.Services.AddScoped<RouteService>();
        builder.Services.AddScoped<IPasswordHasher<Person>, PasswordHasher<Person>>();
        builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

        // Dodavanje CORS servisa
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
        });

        // Konfiguracija PostgreSQL veze
        builder.Services.AddDbContext<Contexts>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("Contexts")));

        var app = builder.Build();

        // Konfiguracija HTTP zahtjeva
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseCors("AllowAllOrigins");
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
