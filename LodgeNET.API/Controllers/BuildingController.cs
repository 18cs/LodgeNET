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
using System.Collections.Generic;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class BuildingController : Controller
    {
        private readonly IGenericRepository<Building> _repo;
        private readonly IGenericRepository<BuildingCategory> _buildingCategoryRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IMapper _mapper;
        public BuildingController(IGenericRepository<Building> repo,
                            IGenericRepository<BuildingCategory> buildingCategoryRepo,
                            IGenericRepository<Stay> stayRepo,
                            IGenericRepository<Room> roomRepo,
                            IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
            _buildingCategoryRepo = buildingCategoryRepo;
            _stayRepo = stayRepo;
            _roomRepo = roomRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetBuildings()
        {
            var buildings = await _repo.GetAsync();

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
            var buildingListResult = await _repo.GetAsync();
            var buildingsDataDto = new BuildingsDataDto()
            {
                BuildingList = _mapper.Map<IEnumerable<BuildingDataDto>>(buildingListResult),
                BuildingTypeList = await _buildingCategoryRepo.GetAsync()
            };
            
            // var BuildingList = await _repo.Get();
            while(buildingsDataDto.BuildingList == null) {}

            foreach (BuildingDataDto b in buildingsDataDto.BuildingList)
            {
                int staysCount = _stayRepo.GetCount(s => s.DateCheckedOut == null && s.BuildingId == b.Id);
                int capacitySum = _roomRepo.GetSum(r => r.Capacity, r => r.BuildingId == b.Id);
                if(capacitySum != 0)
                {
                    b.BuildingOccupancy = (int)(((double)staysCount / capacitySum) * 100);
                }
                else
                {
                    b.BuildingOccupancy = 0;
                }
                
            }

            return Ok(buildingsDataDto);
        }
    }
}