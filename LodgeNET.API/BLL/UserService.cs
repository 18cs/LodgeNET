using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
using System.Collections;

namespace LodgeNET.API.BLL
{
    public class UserService
    {
        private readonly IAuthRepository _authRepo;
        private IMapper _mapper { get; set; }

        public UserService(IAuthRepository repo,
                            IMapper mapper)
        {
            _mapper = mapper;
            _authRepo = repo;
        }

        public async Task<IEnumerable<User>> GetUsers(UserUserParams userParams)
        {
            var users = await _authRepo.GetUsers(
                userParams,
                new Expression<Func<User, object>>[] {
                    u => u.AccountType,
                    u => u.Rank,
                    u => u.Unit
                });

            return (users);
        }

        public async Task<PagedList<User>> GetUsersPagination(UserUserParams userParams) 
        {
            var users = await _authRepo.GetUsersPagination(
                userParams,
                new Expression<Func<User, object>>[] {
                    u => u.AccountType,
                    u => u.Rank
                });

            return (users);
        }

        public async Task<User> GetUserByID(int id)
        {
            var user = await _authRepo.GetByID(id);

            return (user);
        }

        public async Task<User> UpdateUser(UserForEditDto updatedUserDto) 
        {
            var user = await _authRepo.GetFirstOrDefault(u => u.Id == updatedUserDto.Id);

            if (user == null) {
                throw new System.ArgumentException ("Unable to update user", string.Empty);
            }
            
            updatedUserDto.UserName = updatedUserDto.UserName.ToUpper();

            _mapper.Map(updatedUserDto, user);
            await _authRepo.SaveAsync();

            return (user);
        }

        public async Task<int> DeleteUserById(int id)
        {
            var user = await _authRepo.GetFirstOrDefault(u => u.Id == id);

            if ( user == null ) {
                throw new System.ArgumentException ("Unable to delete user", string.Empty);
            }

            await _authRepo.Delete(user.Id);

            await _authRepo.SaveAsync();

            return (id);
        }

        public async Task<int> GetPendingAcctCount()
        {
            var acctCnt = await _authRepo.GetCount(u => u.Approved == false);
            return (acctCnt);
        }
    }
}