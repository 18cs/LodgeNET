using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class UnitController : Controller
    {
        private readonly IGenericRepository<Unit> _repo;
        public UnitController(IGenericRepository<Unit> repo)
        {
            _repo = repo;
        }

        [HttpGet]

        public async Task<IActionResult> GetUnits()
        {
            var units = await _repo.GetAsync();

            return Ok(units);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _repo.GetByID(id);

            return Ok(unit);
        }
    }
}