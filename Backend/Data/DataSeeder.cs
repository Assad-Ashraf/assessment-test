using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Check if we already have data
            if (await context.Users.AnyAsync())
            {
                return; // Database has been seeded
            }

            var users = new List<User>
            {
                // Admin users
                new User
                {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                    Email = "admin@example.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new User
                {
                    Username = "superadmin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("super123"),
                    Role = "Admin",
                    Email = "superadmin@company.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new User
                {
                    Username = "manager",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"),
                    Role = "Admin",
                    Email = "manager@business.org",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },

                // Regular users
                new User
                {
                    Username = "user",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                    Role = "User",
                    Email = "user@example.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-28)
                },
                new User
                {
                    Username = "alice.johnson",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("alice123"),
                    Role = "User",
                    Email = "alice.johnson@email.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-22)
                },
                new User
                {
                    Username = "bob.smith",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("bob123"),
                    Role = "User",
                    Email = "bob.smith@mail.org",
                    CreatedAt = DateTime.UtcNow.AddDays(-18)
                },
                new User
                {
                    Username = "charlie.brown",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("charlie123"),
                    Role = "User",
                    Email = "charlie.brown@test.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new User
                {
                    Username = "diana.prince",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("diana123"),
                    Role = "User",
                    Email = "diana.prince@demo.net",
                    CreatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new User
                {
                    Username = "edward.norton",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("edward123"),
                    Role = "User",
                    Email = "edward.norton@sample.io",
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new User
                {
                    Username = "fiona.gallagher",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("fiona123"),
                    Role = "User",
                    Email = "fiona.gallagher@example.co",
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new User
                {
                    Username = "george.washington",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("george123"),
                    Role = "User",
                    Email = "george.washington@historic.gov",
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new User
                {
                    Username = "helen.troy",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("helen123"),
                    Role = "User",
                    Email = "helen.troy@mythology.org",
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new User
                {
                    Username = "ivan.petrov",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("ivan123"),
                    Role = "User",
                    Email = "ivan.petrov@international.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new User
                {
                    Username = "julia.roberts",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("julia123"),
                    Role = "User",
                    Email = "julia.roberts@hollywood.com",
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new User
                {
                    Username = "kevin.hart",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("kevin123"),
                    Role = "User",
                    Email = "kevin.hart@comedy.net",
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new User
                {
                    Username = "laura.croft",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("laura123"),
                    Role = "User",
                    Email = "laura.croft@adventure.game",
                    CreatedAt = DateTime.UtcNow.AddHours(-12)
                },
                new User
                {
                    Username = "michael.jordan",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("michael123"),
                    Role = "User",
                    Email = "michael.jordan@basketball.pro",
                    CreatedAt = DateTime.UtcNow.AddHours(-6)
                },
                new User
                {
                    Username = "natalie.portman",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("natalie123"),
                    Role = "User",
                    Email = "natalie.portman@actress.com",
                    CreatedAt = DateTime.UtcNow.AddHours(-3)
                },
                new User
                {
                    Username = "oscar.wilde",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("oscar123"),
                    Role = "User",
                    Email = "oscar.wilde@literature.org",
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new User
                {
                    Username = "penelope.cruz",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("penelope123"),
                    Role = "User",
                    Email = "penelope.cruz@spanish.cinema",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-30)
                }
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}