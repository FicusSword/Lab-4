using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
public class ApplicationContext : DbContext
{
    public DbSet<Client> Clients { get; set; } = null!;
    public ApplicationContext(DbContextOptions<ApplicationContext> options)
    : base(options)
    {
        Database.EnsureCreated(); 
    }
}
