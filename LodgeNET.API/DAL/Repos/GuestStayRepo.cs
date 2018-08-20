using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL {
    public class GuestStayRepo : GenericRepository<Stay>, IGuestStayRepo {

        public GuestStayRepo (DataContext context) : base (context) { }

        public async Task<IEnumerable<Stay>> GetGuestStays (
            GuestStayUserParams userParams,
            Expression<Func<Stay, object>>[] includeProperties = null,
            Expression<Func<Stay, bool>> filter = null) {
            var stays = _context.Stays.AsQueryable ();

            if (includeProperties != null)
                stays = this.ProcessProperties (stays, includeProperties);

            stays = this.ProcessFilter (stays, userParams, filter);

            return await stays.ToListAsync ();
        }
        public async Task<PagedList<Stay>> GetGuestStaysPagination (
            GuestStayUserParams userParams,
            Expression<Func<Stay, object>>[] includeProperties = null,
            Expression<Func<Stay, bool>> filter = null) {
            var stays = _context.Stays.AsQueryable ();

            if (includeProperties != null)
                stays = this.ProcessProperties (stays, includeProperties);

            stays = this.ProcessFilter (stays, userParams, filter);

            return await PagedList<Stay>.CreateAsync (stays, userParams.PageNumber, userParams.PageSize);
        }

        private IQueryable<Stay> ProcessProperties (IQueryable<Stay> stays, Expression<Func<Stay, object>>[] includeProperties) {
            foreach (Expression<Func<Stay, object>> includeProperty in includeProperties) {
                stays = stays.Include<Stay, object> (includeProperty);
            }
            return stays;
        }

        private IQueryable<Stay> ProcessFilter (IQueryable<Stay> stays, GuestStayUserParams userParams, Expression<Func<Stay, bool>> filter) {
            if (filter != null)
                stays = stays.Where (filter);

            if (userParams.DodId != null) {
                stays = stays.Where (s => s.Guest.DodId == userParams.DodId);
            }

            if (!String.IsNullOrWhiteSpace (userParams.LastName)) {
                stays = stays.Where (s => s.Guest.LastName.Contains (userParams.LastName.ToUpper ()));
            }

            if (userParams.RoomNumber != null) {
                stays = stays.Where (s => s.Room.RoomNumber.Equals (userParams.RoomNumber));
            }

            if (userParams.GuestId != null) {
                stays = stays.Where (s => s.Guest.Id == userParams.GuestId);
            }

            if (userParams.CurrentStaysOnly) {
                stays = stays.Where (s => (s.CheckedOut == false && s.CheckedIn == true));
            }

            if (userParams.BuildingId != null) {
                stays = stays.Where (s => s.BuildingId == userParams.BuildingId);
            }
            return stays;
        }
    }
}