using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.BLL;
using LodgeNET.API.DAL;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class GuestStayController : Controller {

        private IRoomRepository _roomsRepo;
        private IGenericRepository<Stay> _staysRepo;
        private IGuestRepository _guestRepo;
        private IGenericRepository<Service> _serviceRepo;
        private IGuestStayRepo _guestStayRepo;
        private IMapper _mapper;
        private GuestStayService _guestStayService;
        public GuestStayController (IRoomRepository roomsRepo,
            IGenericRepository<Stay> staysRepo,
            IGuestRepository guestRepo,
            IGenericRepository<Service> serviceRepo,
            IGuestStayRepo guestStayRepo,
            IMapper mapper,
            GuestStayService guestStayService) {
            _roomsRepo = roomsRepo;
            _staysRepo = staysRepo;
            _guestRepo = guestRepo;
            _serviceRepo = serviceRepo;
            _guestStayRepo = guestStayRepo;
            _mapper = mapper;
            _guestStayService = guestStayService;
        }

        [HttpGet ("availableRooms")]
        public async Task<IActionResult> GetAvaliableRooms ([FromQuery] RoomUserParams userParams) {
            var rooms = await _guestStayService.GetAvailableRoomsPagination(userParams);
            var roomsToReturn = _mapper.Map<IEnumerable<RoomForCheckinDto>> (rooms);

            foreach (var room in roomsToReturn) {
                room.CurrentGuestCount = await _guestStayService.GetAvailableRoomCount(room.Id);
            }

            Response.AddPagination (rooms.CurrentPage,
                rooms.PageSize,
                rooms.TotalCount,
                rooms.TotalPages);

            return Ok (roomsToReturn);
        }

        [HttpPost ("editroom")]
        public async Task<IActionResult> EditRoom ([FromBody] Room room) {
            await _guestStayService.EditRoom(room);

            return Ok ();
        }

        [HttpPost ("addroom")]
        public async Task<IActionResult> AddRoom ([FromBody] Room room) {
            try { 
                await _guestStayService.AddRoom(room); 
            } 
            catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok ();
        }

        [HttpDelete ("room/{id}")]
        public async Task<IActionResult> DeleteRoomById (int id) {
            await _guestStayService.DeleteRoomById(id);

            return Ok ();
        }

        [HttpGet ("getrooms")]
        public async Task<IActionResult> GetRooms ([FromQuery] RoomUserParams userParams) {
            var rms = await _guestStayService.GetRooms(userParams);

            Response.AddPagination (rms.CurrentPage,
                rms.PageSize,
                rms.TotalCount,
                rms.TotalPages);

            return Ok (rms);
        }

        [HttpPost ("checkin")]
        public async Task<IActionResult> CheckinGuest ([FromBody] GuestStayForCheckInDto guestStayDto) {
            //TODOBLL
            var guest = await _guestRepo.GetFirstOrDefault (g => g.DodId == guestStayDto.DodId);

            if (guest == null) {
                guest = _mapper.Map<Guest> (guestStayDto);
            } else {
                guestStayDto.GuestId = guest.Id;
                _mapper.Map (guestStayDto, guest);
            }

            if (await _guestRepo.IsGuestCheckedIn (guest.Id)) {
                ModelState.AddModelError ("Guest", "Guest Already Checked In");
                return BadRequest (ModelState);
            }

            if (guest.Id != 0) {
                await _guestRepo.SaveAsync ();
            } else {
                await _guestRepo.Insert (guest);
                await _guestRepo.SaveAsync ();
            }

            var room = await _roomsRepo.GetFirstOrDefault (r => r.Id == guestStayDto.RoomId);
            var stay = _mapper.Map<Stay> (guestStayDto);

            stay.GuestId = guest.Id;
            stay.BuildingId = room.BuildingId;
            stay.CheckedIn = true;
            await _staysRepo.Insert (stay);
            await _staysRepo.SaveAsync ();

            return Ok ();
        }

        [HttpPost ("checkout")]
        public async Task<IActionResult> CheckOutGuest ([FromBody] Stay guestStayDto) {
            try {
                await _guestStayService.CheckOutGuest(guestStayDto);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok ();
        }

        [HttpGet ("existentguest")]
        public async Task<IActionResult> GetExistentGuest (int dodId) {
            var guest = await _guestStayService.GetExistentGuest(dodId);

            if (guest == null) {
                return Ok ();
            }

            //TODOBLL
            var guestStayForRetrieve = _mapper.Map<GuestForCheckinDto> (guest);
            guestStayForRetrieve.Service = await _serviceRepo
                .GetFirstOrDefault (
                    s => s.Id == guestStayForRetrieve.Rank.ServiceId,
                    new Expression<Func<Service, object>>[] {
                        s => s.Ranks
                    });

            return Ok (guestStayForRetrieve);
        }

        [HttpGet ("getgueststays")]
        public async Task<IActionResult> GetGuestStays ([FromQuery] GuestStayRetUserParams guestStayParams) {
            var guestStaysToReturn = _mapper.Map<IEnumerable<GuestStayForEditDto>> (
                await _guestStayService.GetGuestStays (guestStayParams));
            return Ok (guestStaysToReturn);
        }

        [HttpPost ("updategueststay")]
        public async Task<IActionResult> UpdateGuestStay ([FromBody] GuestStayForEditDto guestStayDto) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }
            //TODOBLL
            var gueststay = await _guestStayRepo.GetFirstOrDefault (s => s.Id == guestStayDto.Id);

            if (gueststay == null) {
                ModelState.AddModelError ("error", "Unable to update guest");
                return BadRequest (ModelState);
            }

            //EF errors if values are not null for update
            guestStayDto.Guest = null;
            guestStayDto.Building = null;
            guestStayDto.Room = null;

            _mapper.Map (guestStayDto, gueststay);
            await _guestRepo.SaveAsync ();

            return Ok ();
        }

        [HttpGet ("getguests")]
        public async Task<IActionResult> GetGuests ([FromQuery] GuestUserParams userParams) {
            var guests = await _guestStayService.GetGuestsPagination(userParams);

            var guestsToReturn = _mapper.Map<IEnumerable<GuestForEditDto>> (guests);

            Response.AddPagination (guests.CurrentPage,
                guests.PageSize,
                guests.TotalCount,
                guests.TotalPages);

            return Ok (guestsToReturn);
        }

        [HttpPost ("updateguest")]
        public async Task<IActionResult> UpdateGuest ([FromBody] GuestForEditDto updatedGuestDto) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }
            //TODOBLL
            try {
                await _guestStayService.UpdateGuest(updatedGuestDto);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }
            
            return Ok ();
        }

        [HttpDelete ("deleteguest/{id}")]
        public async Task<IActionResult> DeleteGuestById (int id) {
            try {
                await _guestStayService.DeleteGuestById(id);
            } catch (ArgumentException e) { 
                ModelState.AddModelError("Exception", e.Message); 
                return BadRequest(ModelState); 
            }

            return Ok ();
        }
    }
}