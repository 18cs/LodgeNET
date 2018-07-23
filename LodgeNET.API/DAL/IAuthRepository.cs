using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IAuthRepository : IGenericRepository<User>
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
         Task<PagedList<User>> GetUsersPagination(
            UserUserParams userParams, 
            Expression<Func<User, object>>[] includeProperties = null,
            Expression<Func<User, bool>> filter = null
        );
    }
}