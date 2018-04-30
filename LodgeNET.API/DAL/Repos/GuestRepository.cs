using LodgeNET.API.Models;
using System.Threading.Tasks;
using System.Linq;
using LodgeNET.API.Helpers;
using System.Linq.Expressions;
using System;

namespace LodgeNET.API.DAL
{
    public class GuestRepository : GenericRepository<Guest>, IGuestRepository
    {
        public GuestRepository(DataContext context) : base(context)
        {

        }

        public async Task<bool> IsGuestCheckedIn(int guestId)
        {
            if ( _context.Stays.FirstOrDefault(s => s.GuestId == guestId && s.CheckedOut == false && s.CheckedIn == true) != null)
            {
                return true;
            }

            return false;
        }


    }
}