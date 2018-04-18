using System.Collections.Generic;
using LodgeNET.API.Models;
using Newtonsoft.Json;

namespace LodgeNET.API.DAL.SeedData
{
    public class Seed
    {
        private readonly DataContext _context;

        public Seed(DataContext context)
        {
            this._context = context;
        }

        public void SeedUsers()
        {
            // _context.Users.RemoveRange(_context.Users);
            // _context.SaveChanges();

            var userData = System.IO.File.ReadAllText("SeedData/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach (var user in users)
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.UserName = user.UserName.ToLower();

                _context.Users.Add(user);
            }
            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public void SeedAccountTypes()
        {
            var accountTypeData = System.IO.File.ReadAllText("DAL/SeedData/AccountTypeSeedData.json");
            var accountTypes = JsonConvert.DeserializeObject<List<AccountType>>(accountTypeData);
            foreach(var accountType in accountTypes)
            {
                _context.AccountTypes.Add(accountType);
            }
            _context.SaveChanges();
        }

        public void SeedBuildingCategories()
        {
            var buildingCategoryData = System.IO.File.ReadAllText("DAL/SeedData/BuildingCategorySeedData.json");
            var buildingCategories = JsonConvert.DeserializeObject<List<BuildingCategory>>(buildingCategoryData);
            foreach(var buildingCategory in buildingCategories)
            {
                _context.BuildingCategories.Add(buildingCategory);
            }
            _context.SaveChanges();
        }

        public void SeedBuildings()
        {
            var buildingData = System.IO.File.ReadAllText("DAL/SeedData/BuildingSeedData.json");
            var buildings = JsonConvert.DeserializeObject<List<Building>>(buildingData);
            foreach(var building in buildings)
            {
                _context.Buildings.Add(building);
                _context.SaveChanges();
            }
            
        }

        public void SeedReservation()
        {
            var reservationData = System.IO.File.ReadAllText("DAL/SeedData/ReservationSeedData.json");
            var reservations = JsonConvert.DeserializeObject<List<Reservation>>(reservationData);
            foreach(var reservation in reservations)
            {
                _context.Reservations.Add(reservation);
            }
            _context.SaveChanges();
        }

        public void SeedServices()
        {
            var serviceData = System.IO.File.ReadAllText("DAL/SeedData/ServiceSeedData.json");
            var services = JsonConvert.DeserializeObject<List<Service>>(serviceData);
            foreach(var service in services)
            {
                _context.Services.Add(service);
            }
            _context.SaveChanges();
        }

        public void SeedRanks()
        {
            var rankData = System.IO.File.ReadAllText("DAL/SeedData/RankSeedData.json");
            var ranks = JsonConvert.DeserializeObject<List<Rank>>(rankData);
            foreach(var rank in ranks)
            {
                _context.Ranks.Add(rank);
                
            }
            _context.SaveChanges();
        }

        public void SeedRooms()
        {
            var roomData = System.IO.File.ReadAllText("DAL/SeedData/RoomSeedData.json");
            var rooms = JsonConvert.DeserializeObject<List<Room>>(roomData);
            foreach(var room in rooms)
            {
                _context.Rooms.Add(room);
                
            }
            _context.SaveChanges();
        }

        public void SeedGuests()
        {
            var guestData = System.IO.File.ReadAllText("DAL/SeedData/GuestSeedData.json");
            var guests = JsonConvert.DeserializeObject<List<Guest>>(guestData);
            foreach(var guest in guests)
            {
                _context.Guests.Add(guest);
            }
            _context.SaveChanges();
        }

        public void SeedUnits()
        {
            var unitData = System.IO.File.ReadAllText("DAL/SeedData/UnitSeedData.json");
            var units = JsonConvert.DeserializeObject<List<Unit>>(unitData);
            foreach(var unit in units)
            {
                _context.Units.Add(unit);
                _context.SaveChanges();
            }
        }
    }
}