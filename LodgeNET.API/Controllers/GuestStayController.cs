using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class GuestStayController : Controller
    {

        private IRoomRepository _roomsRepo;
        public GuestStayController(IRoomRepository roomsRepo)
        {
            _roomsRepo = roomsRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUser ([FromQuery]UserParams userParams) 
        {
            var rooms = await _roomsRepo.GetRooms(userParams);
            Response.AddPagination(rooms.CurrentPage, rooms.PageSize, rooms.TotalCount, rooms.TotalPages);
            return Ok(rooms);
        }
    }
}