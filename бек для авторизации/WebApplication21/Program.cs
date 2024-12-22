using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder();

// ���������� CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://www.contoso.com")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ���������� DbContext
string connection = "Server=(localdb)\\mssqllocaldb;Database=applicationdb;Trusted_Connection=True;";
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

// ���������� �������������� � �������������� JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key")),
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

// ������������� CORS � ��������������
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// API ��� ������ � ���������
app.MapGet("/api/clients", async (ApplicationContext db) =>
{
    var clients = await db.Clients.ToListAsync();
    return Results.Json(clients);
});

app.MapPost("/api/login", async (string login, string password, ApplicationContext db) =>
{
    var client = await db.Clients
        .FirstOrDefaultAsync(c => c.Login == login && c.Password == password);

    if (client == null)
    {
        // ���������� ObjectResult ��� ����������� ������ � ����������
        return Results.Unauthorized(new { message = "Incorrect username or password" });
    }

    var token = GenerateToken(client); // ��������� JWT ������
    return Results.Ok(new { token });
});




// ��������� JWT ������
string GenerateToken(Client client)
{
    var claims = new[]
    {
        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, client.Login)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "your_issuer",
        audience: "your_audience",
        claims: claims,
        expires: DateTime.Now.AddHours(1),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}

app.Run();
