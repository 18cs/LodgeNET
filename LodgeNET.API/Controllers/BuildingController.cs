using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class BuildingController : Controller
    {
        private readonly IGenericRepository<Building> _repo;
        private readonly IGenericRepository<BuildingCategory> _buildingCategoryRepo;
        private readonly IConfiguration _config;
        private IMapper _mapper { get; set; }
        public BuildingController(IGenericRepository<Building> repo,
                            IGenericRepository<BuildingCategory> buildingCategoryRepo,
                            IConfiguration config,
                            IMapper mapper)
        {
            _repo = repo;
            _buildingCategoryRepo = buildingCategoryRepo;
            _config = config;
            _mapper = mapper;
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

        [HttpGet("dashboard")]
        public async Task<IActionResult> buildingDashboardData()
        {
            var buildingDashboardDto = new BuildingDashboardDto()
            {
                BuildingList = await _repo.Get(),
                BuildingTypeList = await _buildingCategoryRepo.Get(),
            };

            return Ok(buildingDashboardDto);
        }
    }
}