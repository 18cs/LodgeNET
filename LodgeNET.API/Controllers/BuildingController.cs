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
            var buildingTypeListResult = await _buildingCategoryRepo.GetAsync();
            var buildingsDataDto = new BuildingsDataDto()
            {
                BuildingList = _mapper.Map<IEnumerable<BuildingDataDto>>(buildingListResult),
                BuildingTypeList = _mapper.Map<IEnumerable<BuildingCategoryDataDto>>(buildingTypeListResult)
            };
            
            // var BuildingList = await _repo.Get();
            int totalLodgingCapacity = 0;
            int totalLodgingCurrentGuests = 0;

            int totalVacantCapacity = 0;
            int totalVacantCurrentGuests = 0;

            int totalUnaccompanyCapacity = 0;
            int totalUnaccompanyGuests = 0;

            int totalEmergencyCapacity = 0;
            int totalEmergencyGuests = 0;

            foreach (BuildingDataDto b in buildingsDataDto.BuildingList)
            {
                b.CurrentGuests = _stayRepo.GetCount(s => s.CheckedOut == false && 
                                                        s.CheckedIn == true &&
                                                        !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) && 
                                                        s.BuildingId == b.Id);
                b.Capacity = _roomRepo.GetSum(r => r.Capacity, r => r.BuildingId == b.Id);    
                
                if(b.BuildingCategoryId == 1) {
                    totalLodgingCapacity += b.Capacity;
                    totalLodgingCurrentGuests += b.CurrentGuests;
                }
                else if(b.BuildingCategoryId == 2) {
                    totalVacantCapacity += b.Capacity;
                    totalVacantCurrentGuests += b.CurrentGuests;
                }
                else if(b.BuildingCategoryId == 3)
                {
                    totalUnaccompanyCapacity += b.Capacity;
                    totalUnaccompanyGuests += b.CurrentGuests;
                }
                else if(b.BuildingCategoryId == 4)
                {
                    totalEmergencyCapacity += b.Capacity;
                    totalEmergencyCapacity += b.CurrentGuests;
                }
            }

            foreach (BuildingCategoryDataDto bcat in buildingsDataDto.BuildingTypeList)
            {
                if (bcat.Id == 1)
                {
                    bcat.Capacity = totalLodgingCapacity;
                    bcat.CurrentGuests = totalLodgingCurrentGuests;
                }
                else if(bcat.Id == 2)
                {
                    bcat.Capacity = totalVacantCapacity;
                    bcat.CurrentGuests = totalVacantCurrentGuests;
                }
                else if(bcat.Id == 3) 
                {
                    bcat.Capacity = totalUnaccompanyCapacity;
                    bcat.CurrentGuests = totalUnaccompanyGuests;
                }
                else if(bcat.Id == 4)
                {
                    bcat.Capacity = totalEmergencyCapacity;
                    bcat.CurrentGuests = totalEmergencyGuests;
                }
            }
            return Ok(buildingsDataDto);
        }

        [HttpPost("edit")]
        public async Task<IActionResult> SaveBuilding([FromBody] BuildingDataDto building)
        {
            var bldg = await _repo.GetFirstOrDefault(b => b.Id == building.Id);

            bldg.Name = building.Name;

            _repo.SaveAsync();

            return Ok();
        }
    }
}