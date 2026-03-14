using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder();

builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins,
                          policy =>
                          {
                              policy.SetIsOriginAllowed(_ => true)
                                    .AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowCredentials();
                          });
});

string connection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

var secretKey = builder.Configuration["Jwt:SecretKey"];
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "ficussword.top",
            ValidAudience = "ficussword.top",
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// app.UseHttpsRedirection(); // Отключено для работы через локальную сеть
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// ��������� ������
string GenerateJwtToken(int clientId, string name, bool isAdmin = false, string? nickname = null)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.Name, name),
        new Claim("ClientId", clientId.ToString()),
        new Claim("IsAdmin", isAdmin.ToString()),
        new Claim("Nickname", nickname ?? name)
    };

    var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
    var token = new JwtSecurityToken(
        issuer: "ficussword.top",
        audience: "ficussword.top",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(8),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// �����������
app.MapPost("/api/auth/login", async (Client loginData, ApplicationContext db, HttpContext httpContext) =>
{
    try
    {
        var client = await db.Clients.FirstOrDefaultAsync(c => c.Name == loginData.Name);

        if (client == null || !BCrypt.Net.BCrypt.Verify(loginData.Age.ToString(), client.Age))
        {
            return Results.Json(new { message = "Invalid username or password" }, statusCode: 401);
        }

        var accessToken = GenerateJwtToken(client.Id, client.Name, client.IsAdmin, client.Nickname);
        var refreshToken = Guid.NewGuid().ToString();
        client.RefreshToken = refreshToken;
        await db.SaveChangesAsync();

        // ����� ��������� ��� ���� cookies
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,  // ���������� Lax ��� �����
            Domain = "ficussword.top",
            Expires = DateTime.UtcNow.AddDays(1)
        };

        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,  // ���������� Lax ��� �����
            Domain = "ficussword.top",
            Expires = DateTime.UtcNow.AddMinutes(5)
        };

        httpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        httpContext.Response.Cookies.Append("accessToken", accessToken, accessCookieOptions);

        return Results.Json(new { message = "Login successful" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { message = "Internal server error", details = ex.Message }, statusCode: 500);
    }
});

// �������� ���� ������
app.MapPost("/api/auth/logout", (HttpContext httpContext) =>
{
    try
    {
        httpContext.Response.Cookies.Delete("accessToken");
        httpContext.Response.Cookies.Delete("refreshToken");

        return Results.Json(new { message = "Logout successful" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { message = "Internal server error", details = ex.Message }, statusCode: 500);
    }
});


// �������� ������ �� ����������
app.MapGet("/api/check-token", (HttpContext httpContext) =>
{
    var token = httpContext.Request.Cookies["accessToken"];
    return token != null
        ? Results.Json(new { token })
        : Results.Json(new { message = "Token not found" }, statusCode: 401);
});

// �������� �� ������� ������� ������ ��� ��������� ������
app.MapPost("/api/auth/refresh", async (HttpContext httpContext, ApplicationContext db) =>
{
    try
    {
        var refreshToken = httpContext.Request.Cookies["refreshToken"];
        if (refreshToken == null)
        {
            return Results.Json(new { message = "Refresh token not found" }, statusCode: 401);
        }

        var client = await db.Clients.FirstOrDefaultAsync(c => c.RefreshToken == refreshToken);
        if (client == null)
        {
            return Results.Json(new { message = "Invalid refresh token" }, statusCode: 401);
        }

        var newAccessToken = GenerateJwtToken(client.Id, client.Name, client.IsAdmin, client.Nickname);
        var newRefreshToken = Guid.NewGuid().ToString();
        client.RefreshToken = newRefreshToken;
        await db.SaveChangesAsync();

        // ���������� �� �� ��������� ��� � � login
        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Domain = "ficussword.top",
            Expires = DateTime.UtcNow.AddMinutes(5)
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Domain = "ficussword.top",
            Expires = DateTime.UtcNow.AddDays(1)
        };

        httpContext.Response.Cookies.Append("accessToken", newAccessToken, accessCookieOptions);
        httpContext.Response.Cookies.Append("refreshToken", newRefreshToken, refreshCookieOptions);

        return Results.Json(new { message = "Token refreshed" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { message = "Internal server error", details = ex.Message }, statusCode: 500);
    }
});

// ������� � �������� � �������� 
app.MapGet("/api/clients", async (ApplicationContext db) =>
{
    var clients = await db.Clients.ToListAsync();
    return Results.Json(clients);
});

app.MapGet("/api/clients/{id:int}", async (int id, ApplicationContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client == null)
        return Results.NotFound(new { message = "Error" });

    return Results.Json(client);
});

app.MapDelete("/api/clients/{id:int}", async (int id, ApplicationContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    if (client == null)
        return Results.NotFound(new { message = "Error" });

    db.Clients.Remove(client);
    await db.SaveChangesAsync();
    return Results.Json(client);
});

app.MapPost("/api/clients", async (Client client, ApplicationContext db) =>
{

   client.Age = BCrypt.Net.BCrypt.HashPassword(client.Age);

   await db.Clients.AddAsync(client);
   await db.SaveChangesAsync();
   return client;
});

app.MapPut("/api/clients", async (Client clientData, ApplicationContext db) =>
{
    var client = await db.Clients.FindAsync(clientData.Id);
    if (client == null)
        return Results.NotFound(new { message = "Error" });

    client.Age = clientData.Age;
    client.Name = clientData.Name;
    await db.SaveChangesAsync();
    return Results.Json(client);
});

// ������� � ���������� �����
app.MapGet("/api/products", async (ApplicationContext db) =>
{
    var products = await db.Products.ToListAsync();
    return Results.Json(products);
});

app.MapGet("/api/products/{id:int}", async (int id, ApplicationContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
        return Results.NotFound(new { message = "Product not found" });

    return Results.Json(product);
});

app.MapPost("/api/products", [Authorize] async (Product product, ApplicationContext db) =>
{
    await db.Products.AddAsync(product);
    await db.SaveChangesAsync();
    return Results.Json(product);
});

app.MapPut("/api/products/{id:int}", [Authorize] async (int id, Product productData, ApplicationContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
        return Results.NotFound(new { message = "Product not found" });

    product.Title = productData.Title;
    product.Description = productData.Description;
    product.Image = productData.Image;
    product.Engine = productData.Engine;
    product.Horsepower = productData.Horsepower;
    product.Torque = productData.Torque;

    await db.SaveChangesAsync();
    return Results.Json(product);
});

app.MapDelete("/api/products/{id:int}", [Authorize] async (int id, ApplicationContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
        return Results.NotFound(new { message = "Product not found" });

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.Json(product);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Admin login — проверяет IsAdmin из обычного JWT в куке
app.MapGet("/api/admin/check", (HttpContext httpContext) =>
{
    var token = httpContext.Request.Cookies["accessToken"];
    if (token == null) return Results.Json(new { isAdmin = false }, statusCode: 401);

    try
    {
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);
        var isAdmin = jwt.Claims.FirstOrDefault(c => c.Type == "IsAdmin")?.Value == "True";
        if (!isAdmin) return Results.Json(new { isAdmin = false }, statusCode: 403);
        return Results.Json(new { isAdmin = true });
    }
    catch
    {
        return Results.Json(new { isAdmin = false }, statusCode: 401);
    }
});


// ���������� ������ ������
app.MapPost("/api/reviews", [Authorize] async (Review review, HttpContext httpContext, ApplicationContext db) =>
{
    // ��������� userName �� ������, ��������� Claims
    var userName = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized(); // ���� ������������ �� �����������
    }

    // �������� �� ������������ ������
    var existingReview = await db.Reviews
        .FirstOrDefaultAsync(r => r.ProductId == review.ProductId && r.UserName == userName);

    if (existingReview != null)
    {
        return Results.BadRequest("You have already reviewed this product.");
    }

    // ����������� userName ������
    review.UserName = userName;
    review.CreatedAt = DateTime.UtcNow;

    // ��������� ����� � ���� ������
    await db.Reviews.AddAsync(review);
    await db.SaveChangesAsync();

    return Results.Json(review);
});


// ��������� ���� ������� ��� ��������
app.MapGet("/api/products/{id:int}/reviews", async (int id, ApplicationContext db) =>
{
    var reviews = await db.Reviews
        .Where(r => r.ProductId == id)
        .OrderByDescending(r => r.CreatedAt) // ���������� �� ����� � ������
        .ToListAsync();

    return Results.Json(reviews);
});


// ��������� �������� �������� ��� ��������
app.MapGet("/api/products/{id:int}/rating", async (int id, ApplicationContext db) =>
{
    var averageRating = await db.Reviews
        .Where(r => r.ProductId == id)
        .AverageAsync(r => (double?)r.Rating) ?? 0;

    return Results.Json(new { ProductId = id, AverageRating = averageRating });
});



// Schedule CRUD
app.MapGet("/api/schedule", async (ApplicationContext db) =>
{
    var schedules = await db.Schedules.ToListAsync();
    return Results.Json(schedules);
});

app.MapPost("/api/schedule", [Authorize] async (Schedule schedule, ApplicationContext db) =>
{
    await db.Schedules.AddAsync(schedule);
    await db.SaveChangesAsync();
    return Results.Json(schedule);
});

app.MapPut("/api/schedule/{id:int}", [Authorize] async (int id, Schedule scheduleData, ApplicationContext db) =>
{
    var schedule = await db.Schedules.FindAsync(id);
    if (schedule == null)
        return Results.NotFound(new { message = "Schedule not found" });

    schedule.AnimeTitle = scheduleData.AnimeTitle;
    schedule.DayOfWeek = scheduleData.DayOfWeek;
    schedule.Time = scheduleData.Time;
    schedule.Episode = scheduleData.Episode;

    await db.SaveChangesAsync();
    return Results.Json(schedule);
});

app.MapDelete("/api/schedule/{id:int}", [Authorize] async (int id, ApplicationContext db) =>
{
    var schedule = await db.Schedules.FindAsync(id);
    if (schedule == null)
        return Results.NotFound(new { message = "Schedule not found" });

    db.Schedules.Remove(schedule);
    await db.SaveChangesAsync();
    return Results.Json(schedule);
});

app.Run();

public record AdminLoginRequest(string Username, string Password);