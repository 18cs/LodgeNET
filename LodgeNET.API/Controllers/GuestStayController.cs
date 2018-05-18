using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Security.Claims;
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
    public class GuestStayController : Controller {

        private IRoomRepository _roomsRepo;
        private IGenericRepository<Stay> _staysRepo;
        private IGuestRepository _guestRepo;
        private IGenericRepository<Service> _serviceRepo;
        private IGuestStayRepo _guestStayRepo;
        private IMapper _mapper;
        public GuestStayController (IRoomRepository roomsRepo,
            IGenericRepository<Stay> staysRepo,
            IGuestRepository guestRepo,
            IGenericRepository<Service> serviceRepo,
            IGuestStayRepo guestStayRepo,
            IMapper mapper) {
            _roomsRepo = roomsRepo;
            _staysRepo = staysRepo;
            _guestRepo = guestRepo;
            _serviceRepo = serviceRepo;
            _guestStayRepo = guestStayRepo;
            _mapper = mapper;
        }

        [HttpGet ("availableRooms")]
        public async Task<IActionResult> GetAvaliableRooms ([FromQuery] RoomUserParams userParams) {
            var rooms = await _roomsRepo.GetRooms (userParams);
            var roomsToReturn = _mapper.Map<IEnumerable<RoomForCheckinDto>> (rooms);

            foreach (var room in roomsToReturn) {
                room.CurrentGuestCount = _staysRepo.GetCount (s => s.CheckedOut == false &&
                    s.CheckedIn == true &&
                    !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                    s.RoomId == room.Id);

                // if (room.CurrentGuestCount >= room.Capacity)
                // {

                // }
            }

            Response.AddPagination (rooms.CurrentPage,
                rooms.PageSize,
                rooms.TotalCount,
                rooms.TotalPages);

            return Ok (roomsToReturn);
        }

        [HttpPost ("checkin")]
        public async Task<IActionResult> CheckinGuest ([FromBody] GuestStayForCheckInDto guestStayDto) {

            var guest = await _guestRepo.GetFirstOrDefault (g => g.DodId == guestStayDto.DodId);

            if (guest == null) {
                guest = _mapper.Map<Guest> (guestStayDto);
            } else {
                _mapper.Map (guestStayDto, guest);
            }

            if (await _guestRepo.IsGuestCheckedIn (guest.Id)) {
                ModelState.AddModelError ("Guest", "Guest Already Checked In");
                return BadRequest (ModelState);
            }

            if (guest.Id != 0) {
                await _guestRepo.SaveAsync ();
            } else {
                _guestRepo.Insert (guest);
                await _guestRepo.SaveAsync ();
            }

            var room = await _roomsRepo.GetFirstOrDefault (r => r.Id == guestStayDto.RoomId);
            var stay = _mapper.Map<Stay> (guestStayDto);

            stay.GuestId = guest.Id;
            stay.BuildingId = room.BuildingId;
            stay.CheckedIn = true;
            _staysRepo.Insert (stay);
            await _staysRepo.SaveAsync ();

            return Ok ();
        }

        [HttpPost ("checkout")]
        public async Task<IActionResult> CheckOutGuest ([FromBody] Stay guestStayDto) {
            var guestStay = await _staysRepo.GetFirstOrDefault (s => s.Id == guestStayDto.Id);

            if (guestStay == null) {
                ModelState.AddModelError ("Guest", "Guest stay not found");
                return BadRequest (ModelState);
            }

            guestStay.CheckOutDate = DateTime.Today;

            guestStay.CheckedOut = true;
            await _staysRepo.SaveAsync ();

            return Ok ();
        }

        [HttpGet ("existentguest")]
        public async Task<IActionResult> GetExistentGuest (int dodId) {
            var guest = await _guestRepo.GetFirstOrDefault (g => g.DodId == dodId, new Expression<Func<Guest, object>>[] { g => g.Rank, g => g.Unit });

            if (guest == null) {
                return Ok ();
            }

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
            var guestStaysToReturn = _mapper.Map<IEnumerable<GuestStayForCheckOutDto>> (
                await _guestStayRepo.GetGuestStays (
                    guestStayParams,
                    new Expression<Func<Stay, object>>[] {
                        s => s.Guest,
                            s => s.Guest.Rank,
                            s => s.Guest.Unit,
                            s => s.Room,
                            s => s.Building
                    }
                ));
            return Ok (guestStaysToReturn);
        }

        [HttpPost ("updategueststay")]
        public async Task<IActionResult> UpdateGuestStay ([FromBody] GuestStayForCheckOutDto guestStayDto) {
            var currentUserId = int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value);
            //TODO add account type verification for tasks
            if (currentUserId == 0) {
                return Unauthorized ();
            }

            var gueststay = await _guestStayRepo.GetFirstOrDefault (s => s.Id == guestStayDto.Id);

            if (gueststay == null) {
                ModelState.AddModelError ("error", "Unable to update guest");
                return BadRequest (ModelState);
            }
            
            _mapper.Map (guestStayDto, gueststay);
            await _guestRepo.SaveAsync ();

            return Ok ();
        }

        [HttpGet ("getguests")]
        public async Task<IActionResult> GetGuests ([FromQuery] GuestUserParams userParams) {
            var guests = await _guestRepo.GetGuestPagination (userParams,
                new Expression<Func<Guest, object>>[] {
                    g => g.Rank,
                        g => g.Unit
                });

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

            var guest = await _guestRepo.GetFirstOrDefault (g => g.Id == updatedGuestDto.Id);

            if (guest == null) {
                ModelState.AddModelError ("error", "Unable to update guest");
                return BadRequest (ModelState);
            }

            _mapper.Map (updatedGuestDto, guest);
            await _guestRepo.SaveAsync ();

            return Ok ();
        }

        [HttpDelete ("deleteguest/{id}")]
        public async Task<IActionResult> DeleteGuestById (int id) {
            var guest = await _guestRepo.GetFirstOrDefault (g => g.Id == id);

            if (guest == null) {
                ModelState.AddModelError ("error", "Unable to delete guest");
                return BadRequest (ModelState);
            }

            await _guestRepo.Delete (guest);
            await _guestRepo.SaveAsync ();

            return Ok ();
        }
    }
}