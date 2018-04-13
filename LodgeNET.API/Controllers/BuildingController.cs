using Microsoft.AspNetCore.Mvc;
using LodgeNET.API.DAL;
using System.Threading.Tasks;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class BuildingController : Controller
    {
        private readonly GenericRepository<Building> _repo;
        public BuildingController(GenericRepository<Building> repo)
        {
            _repo = repo;
        }

        [HttpGet]

        public async Task<IActionResult> GetBuildings()
        {
            var buildings = await _repo.Get();

            return Ok(buildings);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetBuilding(int id)
        {
            var building = await _repo.GetByID(id);

            return Ok(building);
        }
    }
}