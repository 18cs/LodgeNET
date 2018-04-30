using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IGuestStayRepo
    {
         Task<IEnumerable<Stay>> GetGuestStays (GuestStayRetUserParams userParams, Expression<Func<Stay, object>>[] includeProperties = null);
    }
}