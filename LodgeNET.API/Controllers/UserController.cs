using System.Threading.Tasks;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;
using LodgeNET.API.DAL;
using Microsoft.AspNetCore.Authorization;
using LodgeNET.API.Helpers;
using System.Linq.Expressions;
using System;
using System.Collections.Generic;
using AutoMapper;
using LodgeNET.API.Dtos;
using System.Security.Claims;

namespace LodgeNET.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IAuthRepository _authRepo;
        private IMapper _mapper { get; set; }

        public UserController(IAuthRepository repo,
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

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] UserUserParams userParams) {
            var users = await _authRepo.GetUsersPaginiation(
                userParams,
                new Expression<Func<User, object>>[] {
                    u => u.AccountType,
                    u => u.Rank
                });
            var usersToReturn = _mapper.Map<IEnumerable<UserForEditDto>>(users);

             Response.AddPagination(users.CurrentPage,
                users.PageSize,
                users.TotalCount,
                users.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _authRepo.GetByID(id);

            return Ok(user);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserForEditDto updatedUserDto) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserById(int id)
        {
            var user = await _authRepo.GetFirstOrDefault(u => u.Id == id);

            if ( user == null ) {
                ModelState.AddModelError("error", "Unable to delete user");
                return BadRequest(ModelState);
            }

            await _authRepo.Delete(user.Id);

            await _authRepo.SaveAsync();

            return Ok();
        }

        [HttpGet("pendingAcctCount")]
        public IActionResult GetPendingAcctCount()
        {
            var acctCnt = _authRepo.GetCount(u => u.Approved == false);
            return Ok(acctCnt);
        }
    }
}