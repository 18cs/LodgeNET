using LodgeNET.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<Building> Buildings { get; set; } 
        public DbSet<BuildingCategory> BuildingCategories { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Rank> Ranks { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Stay> Stays { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // modelBuilder.Entity<GuestReservation>()
            //     .HasKey(t => new { t.GuestId, t.ReservationId});

            // modelBuilder.Entity<GuestReservation>()
            //     .HasOne(gr => gr.Guest)
            //     .WithMany(g => g.GuestReservations)
            //     .HasForeignKey(gr => gr.GuestId);

            // modelBuilder.Entity<GuestReservation>()
            //     .HasOne(gr => gr.Reservation)
            //     .WithMany(r => r.GuestReservations)
            //     .HasForeignKey(gr => gr.ReservationId);

            modelBuilder.Entity<Unit>()
                .HasOne(u => u.ParentUnit);
        }
    }
}