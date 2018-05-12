using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
         int GetCount(Expression<Func<User, bool>> filter = null);
    }
}