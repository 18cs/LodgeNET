using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL {
    public class GuestStayRepo : GenericRepository<Stay>, IGuestStayRepo {
        //internal DataContext _context;

        public GuestStayRepo (DataContext context): base(context) {
           //this._context = context;
        }

        public async Task<IEnumerable<Stay>> GetGuestStays (
            GuestStayRetUserParams userParams, 
            Expression<Func<Stay, object>>[] includeProperties = null,
            Expression<Func<Stay, bool>> filter = null) {
            var stays = _context.Stays.AsQueryable ();

            if (includeProperties != null) {
                foreach (Expression<Func<Stay, object>> includeProperty in includeProperties) {
                    stays = stays.Include<Stay, object> (includeProperty);
                }
            }
            
            if (filter != null) {
                stays = stays.Where (filter);
            }

            if (userParams.DodId != null) {
                stays = stays.Where (s => s.Guest.DodId == userParams.DodId);
            }

            if (userParams.LastName != null) {
                stays = stays.Where (s => s.Guest.LastName.Contains (userParams.LastName.ToUpper ()));
            }

            if (userParams.RoomNumber != null) {
                stays = stays.Where (s => s.Room.RoomNumber.Equals(userParams.RoomNumber));
            }

            if (userParams.GuestId != null) {
                stays = stays.Where (s => s.Guest.Id == userParams.GuestId);
            }

            if (userParams.CurrentStaysOnly) {
                stays = stays.Where ( s => (s.CheckedOut == false && s.CheckedIn == true));
            } 

            return await stays.ToListAsync ();
        }
    }
}