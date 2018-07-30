using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
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
            Expression<Func<Guest, bool>> filter = null) {
            var guests = _context.Guests.AsQueryable ();

            if (includeProperties != null) {
                foreach (Expression<Func<Guest, object>> includeProperty in includeProperties) {
                    guests = guests.Include<Guest, object> (includeProperty);
                }
            }

            if (filter != null) {
                guests = guests.Where (filter);
            }

            if (!String.IsNullOrWhiteSpace (userParams.LastName)) {
                guests = guests.Where (g => g.LastName.Equals (userParams.LastName));
            }

            if (userParams.ServiceId != null && userParams.ServiceId != 0) {
                guests = guests.Where (g => g.Rank.ServiceId == userParams.ServiceId);
            }

            if (userParams.RankId != null && userParams.RankId != 0) {
                guests = guests.Where (g => g.RankId == userParams.RankId);
            }

            if (userParams.DodId != null && userParams.DodId !=0) {
                guests = guests.Where (g => g.DodId == userParams.DodId);
            }

            if (userParams.UnitId != null && userParams.UnitId != 0) {
                guests = guests.Where (g => g.UnitId == userParams.UnitId);
            }

            if (!String.IsNullOrWhiteSpace (userParams.Gender)) {
                guests = guests.Where (g => g.Gender.Equals (userParams.Gender));
            }

            return await PagedList<Guest>.CreateAsync (guests, userParams.PageNumber, userParams.PageSize);
        }

    }
}