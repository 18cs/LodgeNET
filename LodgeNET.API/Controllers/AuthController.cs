using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.BLL;
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
        private AuthService _authService;
        public AuthController(IAuthRepository authRepo,
                            IConfiguration config,
                            IGenericRepository<Unit> unitRepo,
                            IGenericRepository<Service> serviceRepo,
                            IGenericRepository<AccountType> accountTypeRepo,
                            IGenericRepository<Rank> rankRepo,
                            IMapper mapper,
                            AuthService authService)
        {
            _config = config;
            _authRepo = authRepo;
            _unitRepo = unitRepo;
            _serviceRepo = serviceRepo;
            _accountTypeRepo = accountTypeRepo;
            _rankRepo = rankRepo;
            _mapper = mapper;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto)
        {
            try { 
                await _authService.Register(userForRegisterDto); 
            } 
            catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            User userFromRepo;

            try {
                userFromRepo = await _authService.Login(userForLoginDto);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            if (userFromRepo == null) {
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

        [HttpGet("accountTypes")]
        public async Task<IActionResult> GetAccountTypes() 
        {
            var accountTypes = await _authService.GetAccountTypes();
            return Ok(accountTypes);
        }
    }
}