using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL {
    public class GuestRepository : GenericRepository<Guest>, IGuestRepository {
        public GuestRepository (DataContext context) : base (context) {

        }

        public async Task<bool> IsGuestCheckedIn (int guestId) {
            if (_context.Stays.FirstOrDefault (s => s.GuestId == guestId && s.CheckedOut == false && s.CheckedIn == true) != null) {
                return true;
            }

            return false;
        }

        public async Task<PagedList<Guest>> GetGuestPagination (
            GuestUserParams userParams) {
            var guests = _context.Guests.AsQueryable ();

            return await PagedList<Guest>.CreateAsync(guests, userParams.PageNumber, userParams.PageSize);
        }

    }
}