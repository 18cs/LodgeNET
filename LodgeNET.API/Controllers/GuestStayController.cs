using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class GuestStayController : Controller
    {

        private IRoomRepository _roomsRepo;
        private IMapper _mapper;
        public GuestStayController(IRoomRepository roomsRepo, IMapper mapper)
        {
            _roomsRepo = roomsRepo;
            _mapper = mapper;
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms ([FromQuery]UserParams userParams) 
        {
            var rooms = await _roomsRepo.GetRooms(userParams);  
            // var roomsToReturn = _mapper.Map<IEnumerable<RoomForDisplayDto>>(rooms);

            // foreach(var room in roomsToReturn) 
            // {
            //     room.CurrentGuestCount = 
            // }

            Response.AddPagination(rooms.CurrentPage, rooms.PageSize, rooms.TotalCount, rooms.TotalPages);
            return Ok(rooms);
        }
    }
}