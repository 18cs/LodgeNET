using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using LodgeNET.API.BLL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IConfiguration _config;
        private AuthService _authService;
        public AuthController(
                            IConfiguration config,
                            AuthService authService)
        {
            _config = config;
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
            var registerFormDto = await _authService.GetRegisterFormData();

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