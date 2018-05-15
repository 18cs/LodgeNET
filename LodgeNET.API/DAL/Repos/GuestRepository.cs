using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.EntityFrameworkCore;

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
            GuestUserParams userParams,
            Expression<Func<Guest, object>>[] includeProperties = null,
            Expression<Func<Guest, bool>> filter = null)
        {
            var guests = _context.Guests.AsQueryable ();

             if (includeProperties != null) {
                foreach (Expression<Func<Guest, object>> includeProperty in includeProperties) {
                    guests = guests.Include<Guest, object> (includeProperty);
                }
            }

            if(filter != null)
            {
                guests = guests.Where(filter);
            }

            return await PagedList<Guest>.CreateAsync(guests, userParams.PageNumber, userParams.PageSize);
        }

    }
}