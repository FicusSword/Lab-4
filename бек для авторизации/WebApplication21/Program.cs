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
                              policy.WithOrigins("http://localhost:5173")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowCredentials();
                          });
});

string connection = "Server=(localdb)\\mssqllocaldb;Database=applicationdb;Trusted_Connection=True;";
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
            ValidIssuer = "mydomain.com",
            ValidAudience = "mydomain.com",
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// Генерация токена
string GenerateJwtToken(int clientId, string name)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.Name, name),
        new Claim("ClientId", clientId.ToString())
    };

    var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
    var token = new JwtSecurityToken(
        issuer: "mydomain.com",
        audience: "mydomain.com",
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(5),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Авторизация
app.MapPost("/api/auth/login", async (Client loginData, ApplicationContext db, HttpContext httpContext) =>
{
    try
    {
        var client = await db.Clients.FirstOrDefaultAsync(c => c.Name == loginData.Name);

        if (client == null || !BCrypt.Net.BCrypt.Verify(loginData.Age.ToString(), client.Age))
        {
            return Results.Json(new { message = "Invalid username or password" }, statusCode: 401);
        }

        var accessToken = GenerateJwtToken(client.Id, client.Name);
        // Генерация рефреш токена
        var refreshToken = Guid.NewGuid().ToString();
        client.RefreshToken = refreshToken;
        await db.SaveChangesAsync();

        httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(1) 
        });

        httpContext.Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(5)
        });

        return Results.Json(new { message = "Login successful"});
    }
    catch (Exception ex)
    {
        return Results.Json(new { message = "Internal server error", details = ex.Message }, statusCode: 500);
    }
});

// Удаления куки файлов
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


// Проверка токена на валидность
app.MapGet("/api/check-token", (HttpContext httpContext) =>
{
    var token = httpContext.Request.Cookies["accessToken"];
    return token != null
        ? Results.Json(new { token })
        : Results.Json(new { message = "Token not found" }, statusCode: 401);
});

// Проверка на наличие рефрешь токена для продления сессии
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

            var newAccessToken = GenerateJwtToken(client.Id, client.Name);

            var newRefreshToken = Guid.NewGuid().ToString();
            client.RefreshToken = newRefreshToken;
            await db.SaveChangesAsync();

            httpContext.Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(5) 
            });

            httpContext.Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(1)
            });

            return Results.Json(new { message = "Token refreshed" });
        }
        catch (Exception ex)
        {
            return Results.Json(new { message = "Internal server error", details = ex.Message }, statusCode: 500);
        }
});

// таблица с логинами и паролями 
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

// таблица с продукцией сайта
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

app.MapPost("/api/products", async (Product product, ApplicationContext db) =>
{
    await db.Products.AddAsync(product);
    await db.SaveChangesAsync();
    return Results.Json(product);
});

app.MapPut("/api/products/{id:int}", async (int id, Product productData, ApplicationContext db) =>
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

app.MapDelete("/api/products/{id:int}", async (int id, ApplicationContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product == null)
        return Results.NotFound(new { message = "Product not found" });

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.Json(product);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Добавление нового отзыва
app.MapPost("/api/reviews", [Authorize] async (Review review, HttpContext httpContext, ApplicationContext db) =>
{
    // Извлекаем userName из токена, используя Claims
    var userName = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

    if (string.IsNullOrEmpty(userName))
    {
        return Results.Unauthorized(); // Если пользователь не авторизован
    }

    // Проверка на дублирование отзыва
    var existingReview = await db.Reviews
        .FirstOrDefaultAsync(r => r.ProductId == review.ProductId && r.UserName == userName);

    if (existingReview != null)
    {
        return Results.BadRequest("You have already reviewed this product.");
    }

    // Присваиваем userName отзыву
    review.UserName = userName;
    review.CreatedAt = DateTime.UtcNow;

    // Сохраняем отзыв в базе данных
    await db.Reviews.AddAsync(review);
    await db.SaveChangesAsync();

    return Results.Json(review);
});


// Получение всех отзывов для продукта
app.MapGet("/api/products/{id:int}/reviews", async (int id, ApplicationContext db) =>
{
    var reviews = await db.Reviews
        .Where(r => r.ProductId == id)
        .OrderByDescending(r => r.CreatedAt) // Сортировка от новых к старым
        .ToListAsync();

    return Results.Json(reviews);
});


// Получение среднего рейтинга для продукта
app.MapGet("/api/products/{id:int}/rating", async (int id, ApplicationContext db) =>
{
    var averageRating = await db.Reviews
        .Where(r => r.ProductId == id)
        .AverageAsync(r => (double?)r.Rating) ?? 0;

    return Results.Json(new { ProductId = id, AverageRating = averageRating });
});



app.Run();