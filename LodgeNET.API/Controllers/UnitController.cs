using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
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
        public UnitController(IUnitRepository unitRepo,
                            IMapper mapper)
        {
            _unitRepo = unitRepo;
            _mapper = mapper;
        }

        [HttpGet("pagination")]
        public async Task<IActionResult> GetUnitsPagination([FromQuery] UnitUserParams userParams)
        {
            var units = await _unitRepo.GetUnitPagination(
                userParams);

             Response.AddPagination(units.CurrentPage,
                units.PageSize,
                units.TotalCount,
                units.TotalPages);

            return Ok(units);
        }

        [HttpGet]
        public async Task<IActionResult> GetUnits() {
            var units = await _unitRepo.GetAsync();

            return Ok(units);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _unitRepo.GetByID(id);

            return Ok(unit);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] Unit updateUnit) {
             var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }

            var unit = await _unitRepo.GetFirstOrDefault(u => u.Id == updateUnit.Id);

            if (unit == null) {
                ModelState.AddModelError("error", "Unable to update user");
                return BadRequest(ModelState);
            }

            unit.Name = updateUnit.Name;
            unit.ParentUnitId = updateUnit.ParentUnitId;
            await _unitRepo.SaveAsync();

            return Ok();
        }

        [HttpDelete ("deleteunit/{id}")]
        public async Task<IActionResult> DeleteGuestById (int id) {
            var unit = await _unitRepo.GetFirstOrDefault (u => u.Id == id);

            if (unit == null) {
                ModelState.AddModelError ("error", "Unable to delete unit");
                return BadRequest (ModelState);
            }

            await _unitRepo.Delete (unit);
            await _unitRepo.SaveAsync ();

            return Ok ();
        }
    }
}