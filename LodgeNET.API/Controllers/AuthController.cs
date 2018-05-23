using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _authRepo;
        private readonly IGenericRepository<Unit> _unitRepo;
        private readonly IGenericRepository<Service> _serviceRepo;
        private readonly IGenericRepository<AccountType> _accountTypeRepo;
        private readonly IGenericRepository<Rank> _rankRepo;
        private readonly IConfiguration _config;
        private IMapper _mapper { get; set; }
        public AuthController(IAuthRepository authRepo,
                            IConfiguration config,
                            IGenericRepository<Unit> unitRepo,
                            IGenericRepository<Service> serviceRepo,
                            IGenericRepository<AccountType> accountTypeRepo,
                            IGenericRepository<Rank> rankRepo,
                            IMapper mapper)
        {
            _config = config;
            _authRepo = authRepo;
            _unitRepo = unitRepo;
            _serviceRepo = serviceRepo;
            _accountTypeRepo = accountTypeRepo;
            _rankRepo = rankRepo;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            if(!string.IsNullOrEmpty(userForRegisterDto.UserName))
            {
                userForRegisterDto.UserName = userForRegisterDto.UserName.ToUpper();
            }
            
            if (await _authRepo.UserExists(userForRegisterDto.UserName))
            {
                ModelState.AddModelError("Username", "Username already exists");
            }

            // validate request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // var userToCreate = new User
            // {
            //     UserName = userForRegisterDto.UserName
            // };

            var userToCreate = _mapper.Map<User>(userForRegisterDto);
            //userToCreate.UnitId = (await _unitRepo.GetFirstOrDefault(u => u.Name.Equals(userForRegisterDto.UserUnit))).Id;
            
            var createUser = await _authRepo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _authRepo.Login(userForLoginDto.Username.ToUpper(), userForLoginDto.Password);

            if (userFromRepo == null)
            {
                ModelState.AddModelError("Unauthorized", "Username or password was incorrect.");
                return BadRequest(ModelState);
            }

            // generate token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                        new Claim(ClaimTypes.Name, userFromRepo.UserName),
                        new Claim(ClaimTypes.Role, userFromRepo.AccountType.Type)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { tokenString });
        }

        [HttpGet("register")]
        public async Task<IActionResult> RegisterFormData()
        {
            var registerFormDto = new RegisterFormDto()
            {
                ServiceList = await _serviceRepo.GetAsync(),
                AccountTypeList = await _accountTypeRepo.GetAsync(),
                UnitList = await _unitRepo.GetAsync()
            };

            foreach (var service in registerFormDto.ServiceList)
            {
                service.Ranks = await _rankRepo.GetAsync(r => r.ServiceId == service.Id);
            }
            return Ok(registerFormDto);
        }

        [HttpGet("pendingAcctCount")]
        public IActionResult GetPendingAcctCount()
        {
            var acctCnt = _authRepo.GetCount(u => u.Approved == false);
            return Ok(acctCnt);
        }

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

        [HttpGet("accountTypes")]
        public async Task<IActionResult> GetAccountTypes() 
        {
            var accountTypes = await _accountTypeRepo.GetAsync();
            return Ok(accountTypes);
        }
    }
}