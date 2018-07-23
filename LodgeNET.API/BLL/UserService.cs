using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

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

        // [HttpGet]
        // public async Task<IActionResult> GetUsers()
        // {
        //     var users = await _authRepo.GetAsync();

        //     return Ok(users);
            
        // }

        public async Task<PagedList<User>> GetUsersPagination(UserUserParams userParams) {
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

        public async Task<User> UpdateUser(UserForEditDto updatedUserDto) {


            var user = await _authRepo.GetFirstOrDefault(u => u.Id == updatedUserDto.Id);

            if (user == null) {
                ModelState.AddModelError("error", "Unable to update user");
                return BadRequest(ModelState);
            }
            updatedUserDto.UserName = updatedUserDto.UserName.ToUpper();

            _mapper.Map(updatedUserDto, user);
            await _authRepo.SaveAsync();

            return Ok();
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

        public Task<int> GetPendingAcctCount()
        {
            //TODOBLL
            var acctCnt = await _authRepo.GetCount(u => u.Approved == false);
            return (acctCnt);
        }
    }
}