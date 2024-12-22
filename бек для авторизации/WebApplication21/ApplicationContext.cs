using Microsoft.EntityFrameworkCore;

public class ApplicationContext : DbContext
{
    public DbSet<Client> Clients { get; set; } = null!;

    public ApplicationContext(DbContextOptions<ApplicationContext> options)
        : base(options)
    {
        // Для работы с миграциями используйте Database.Migrate(), если хотите автоматически применить миграции
        Database.Migrate();
    }
}
