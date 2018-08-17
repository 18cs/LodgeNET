using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.BLL;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UnitController : Controller
    {
        private IMapper _mapper { get; set; }
        private readonly IUnitRepository _unitRepo;

        private readonly UnitService _unitService;
        public UnitController(IUnitRepository unitRepo,
                            IMapper mapper,
                            UnitService unitService)
        {
            _unitRepo = unitRepo;
            _mapper = mapper;
            _unitService = unitService;
        }

        [HttpGet("getunitpagination")]
        public async Task<IActionResult> GetUnitsPagination([FromQuery] UnitUserParams userParams)
        {
            var units = await _unitService.GetUnitsPagination(userParams);

             Response.AddPagination(units.CurrentPage,
                units.PageSize,
                units.TotalCount,
                units.TotalPages);

            return Ok(units);
        }

        [HttpGet]
        public async Task<IActionResult> GetUnits() {
            var units = await _unitService.GetUnits();

            return Ok(units);
        }

        [HttpGet("service")]
        public async Task<IActionResult> GetServices() {
            var services = await _unitService.GetServices();

            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _unitService.GetUnit(id);

            return Ok(unit);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] Unit updateUnit) {
             var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }
            //TODOBLL
            try {
                await _unitService.Update(updateUnit);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok();
        }

        [HttpDelete ("deleteunit/{id}")]
        public async Task<IActionResult> DeleteUnitById (int id) {
            try {
                await _unitService.DeleteUnitById(id);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok ();
        }
    }
}