using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class GuestStayController : Controller
    {

        private IRoomRepository _roomsRepo;
        private IGenericRepository<Stay> _staysRepo;
        private IMapper _mapper;
        public GuestStayController(IRoomRepository roomsRepo,
                                    IGenericRepository<Stay> staysRepo, 
                                    IMapper mapper)
        {
            _roomsRepo = roomsRepo;
            _staysRepo = staysRepo;
            _mapper = mapper;
        }

        [HttpGet("availableRooms")]
        public async Task<IActionResult> GetAvaliableRooms ([FromQuery]UserParams userParams) 
        {
            var rooms = await _roomsRepo.GetRooms(userParams);  
            var roomsToReturn = _mapper.Map<IEnumerable<RoomForCheckinDto>>(rooms);

            foreach(var room in roomsToReturn) 
            {
                room.CurrentGuestCount = _staysRepo.GetCount(s => s.DateCheckedOut == null && s.RoomId == room.Id);
                if(room.CurrentGuestCount >= room.Capacity) {
                    
                }
            }

            Response.AddPagination(rooms.CurrentPage,
                                    rooms.PageSize,
                                    rooms.TotalCount,
                                    rooms.TotalPages);

            return Ok(roomsToReturn);
        }
    }
}