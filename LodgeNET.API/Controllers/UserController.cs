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
using LodgeNET.API.BLL;

namespace LodgeNET.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IAuthRepository _authRepo;
        private IMapper _mapper { get; set; }

        private UserService _userService;

        public UserController(IAuthRepository repo,
                            IMapper mapper,
                            UserService userService)
        {
            _mapper = mapper;
            _authRepo = repo;
            _userService = userService;
        }

        // [HttpGet]
        // public async Task<IActionResult> GetUsers()
        // {
        //     var users = await _authRepo.GetAsync();

        //     return Ok(users);
            
        // }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] UserUserParams userParams) {
            var users = await _userService.GetUsersPagination(userParams);
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
            var user = await _userService.GetUserByID(id);

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
            try {
                await _userService.DeleteUserById(id);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok ();
        }

        [HttpGet("pendingAcctCount")]
        public Task<IActionResult> GetPendingAcctCount()
        {
            var acctCnt = await _userService.GetPendingAcctCount();
            return Ok(acctCnt);
        }
    }
}