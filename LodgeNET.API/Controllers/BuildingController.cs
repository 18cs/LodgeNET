using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.BLL;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class BuildingController : Controller
    {
        private readonly IMapper _mapper;
        private readonly BuildingService _buildingService;
        public BuildingController(
            IMapper mapper,
            BuildingService buildingService)
        {
            _mapper = mapper;
            _buildingService = buildingService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuildingbyId(int id)
        {
            var building = await _buildingService.GetBuilding(id);

            return Ok(building);
        }

        [HttpGet("getbuildings")]
        public async Task<IActionResult> GetBuildings([FromQuery] BuildingUserParams buildingParams)
        {
            var buildings = await _buildingService.GetBuildings(buildingParams);

            return Ok(buildings);
        }

        [HttpGet("getbuildingspagination")]
        public async Task<IActionResult> GetBuildingsPagination([FromQuery] BuildingUserParams userParams)
        {
            var bldgs = await _buildingService.GetBuildingsPagination(userParams);

            var bldgsToReturn = _mapper.Map<IEnumerable<Building>>(bldgs);

            Response.AddPagination(bldgs.CurrentPage,
                bldgs.PageSize,
                bldgs.TotalCount,
                bldgs.TotalPages);

            return Ok(bldgsToReturn);
        }

        [HttpGet("getbuildingdisplay")]
        public async Task<IActionResult> GetBuildingsDisplay([FromQuery] BuildingUserParams userParams)
        {
            var buildingToDisplay = _mapper.Map<IEnumerable<BuildingForDisplay>>(
                await _buildingService.GetBuildings(userParams)
            );
            return Ok(buildingToDisplay);
        }

        [HttpGet("getbuildingtypespagination")]
        public async Task<IActionResult> GetBuildingTypesPagination([FromQuery] PagUserParams userParams)
        {
            var buildingTypes = await _buildingService.GetBuildingTypesPagiantion(userParams);
            var bldgTypesToReturn = _mapper.Map<IEnumerable<BuildingTypeDataDto>>(buildingTypes);

            Response.AddPagination(buildingTypes.CurrentPage,
                buildingTypes.PageSize,
                buildingTypes.TotalCount,
                buildingTypes.TotalPages);

            return Ok(bldgTypesToReturn);
        }

        [HttpGet("getbuildingtypes")]
        public async Task<IActionResult> GetBuildingTypes()
        {
            var buildingTypes = await _buildingService.GetBuildingTypes();
            return Ok(buildingTypes);
        }

        [HttpGet("getbuildingtypesdisplay")]
        public async Task<IActionResult> GetBuildingTypesDisplay()
        {
            var buildingTypes = _mapper.Map<IEnumerable<BuildingTypeForDisplayDto>>(
                await _buildingService.GetBuildingTypes()
            );
            return Ok(buildingTypes);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> buildingDashboardData()
        {
            var buildingListResult = await _buildingService.GetBuildings();
            var buildingTypeListResult = await _buildingService.GetBuildingTypes();
            var buildingsDataDto = new BuildingsDataDto()
            {
                BuildingList = _mapper.Map<IEnumerable<BuildingDataDto>>(buildingListResult),
                BuildingTypeList = _mapper.Map<List<BuildingTypeDataDto>>(buildingTypeListResult.ToList())
            };

            foreach (BuildingDataDto b in buildingsDataDto.BuildingList)
            {
                b.CurrentGuests = await _buildingService.GetBuildingCurrentGuests(b.Id);
                b.Capacity = await _buildingService.GetBuildingCapacity(b.Id);

                var bcat = buildingsDataDto.BuildingTypeList.Find(t => t.Id == b.BuildingCategoryId);
                if (bcat != null)
                {
                    bcat.Capacity += b.Capacity;
                    bcat.CurrentGuests += b.CurrentGuests;
                }
            }
            return Ok(buildingsDataDto);
        }

        [HttpPost("edit")]
        public async Task<IActionResult> SaveBuilding([FromBody] BuildingDataDto building)
        {
            var bldg = await _buildingService.SaveBuilding(building);

            return Ok();
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddBuilding([FromBody] Building building)
        {
            try
            {
                await _buildingService.AddBuilding(building);
            }
            catch (ArgumentException e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [HttpPost("edittype")]
        public async Task<IActionResult> SaveBuildingType([FromBody] BuildingTypeDataDto buildingType)
        {
            await _buildingService.SaveBuildingType(buildingType);

            return Ok();
        }

        [HttpPost("addtype")]
        public async Task<IActionResult> AddBuildingType([FromBody] BuildingCategory buildingType)
        {
            await _buildingService.AddBuildingType(buildingType);

            return Ok();
        }

        [HttpDelete("buildingtype/{id}")]
        public async Task<IActionResult> DeleteBuildingTypeById(int id)
        {
            await _buildingService.DeleteBuildingTypeById(id);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuildingById(int id)
        {
            await _buildingService.DeleteBuildingById(id);

            return Ok();
        }
    }
}