using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL
{
    public class AuthRepository : GenericRepository<User>, IAuthRepository
    {
        //private readonly DataContext _context;
        public AuthRepository(DataContext context):base(context)
        {
            //_context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include("AccountType").FirstOrDefaultAsync(x => x.UserName == username);
            
            if (user == null)
            {
                return null;
            }
            
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            //auth successful   
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) 
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.UserName == username))
            {
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<User>> GetUsers(
            UserUserParams userParams, 
            Expression<Func<User, object>>[] includeProperties = null,
            Expression<Func<User, bool>> filter = null
        ) {
            var users = _context.Users.AsQueryable();

            if (includeProperties != null) {
                users = ProcessUserProperties(users, includeProperties);   
            }
            users = ProcessUserFilter(users, userParams, filter);

            return await users.ToListAsync();
        }

        public async Task<PagedList<User>> GetUsersPagination(
            UserUserParams userParams, 
            Expression<Func<User, object>>[] includeProperties = null,
            Expression<Func<User, bool>> filter = null
        ) {
            var users = _context.Users.AsQueryable();

            if (includeProperties != null) {
                users = ProcessUserProperties(users, includeProperties);   
            }
            users = ProcessUserFilter(users, userParams, filter);
            
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private IQueryable<User> ProcessUserProperties(IQueryable<User> users, Expression<Func<User, object>>[] includeProperties)
        {
            foreach (Expression<Func<User, object>> includeProperty in includeProperties) {
                users = users.Include<User, object> (includeProperty);
            }
            return users;
        }

        private IQueryable<User> ProcessUserFilter(IQueryable<User> users, UserUserParams userParams, Expression<Func<User, bool>> filter)
        {
            if(filter != null)
            {
                users = users.Where(filter);
            }

            if (userParams.AccountTypeId != null) {
                users = users.Where(u => u.AccountTypeId == userParams.AccountTypeId);
            }

            if (userParams.Approved != null) {
                users = users.Where(u => u.Approved == userParams.Approved);
            }

            if (!String.IsNullOrWhiteSpace(userParams.UserName)) {
                users = users.Where(u => u.UserName.Equals(userParams.UserName));
            }
            return users;
        }
    }
}