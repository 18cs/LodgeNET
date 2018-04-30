using System.Threading.Tasks;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;
using LodgeNET.API.DAL;
using Microsoft.AspNetCore.Authorization;

namespace LodgeNET.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IGenericRepository<User> _repo;

        public UserController(IGenericRepository<User> repo)
        {
            _repo = repo;
        }

        [HttpGet]

        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetAsync();

            return Ok(users);
            
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetByID(id);

            return Ok(user);
        }
    }
}