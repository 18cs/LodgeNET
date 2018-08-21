using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL {
    public interface IGuestRepository : IGenericRepository<Guest>
    {
        Task<bool> IsGuestCheckedIn (int guestId);

        Task<IEnumerable<Guest>> GetGuests (
            GuestUserParams userParams,
            Expression<Func<Guest, object>>[] includeProperties = null,
            Expression<Func<Guest, bool>> filter = null);
            
        Task<PagedList<Guest>> GetGuestPagination (
            GuestUserParams userParams, 
            Expression<Func<Guest, object>>[] includeProperties = null,
            Expression<Func<Guest, bool>> filter = null);
    }
}