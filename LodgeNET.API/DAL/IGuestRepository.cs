using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL {
    public interface IGuestRepository : IGenericRepository<Guest>
    {
        Task<bool> IsGuestCheckedIn (int guestId);
        Task<PagedList<Guest>> GetGuestPagination (GuestUserParams userParams);
    }
}