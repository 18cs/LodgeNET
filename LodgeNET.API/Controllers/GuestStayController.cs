using System;
using System.Collections.Generic;
using System.Linq.Expressions;
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
        private IMapper _mapper;
        public GuestStayController (IRoomRepository roomsRepo,
            IGenericRepository<Stay> staysRepo,
            IGuestRepository guestRepo,
            IGenericRepository<Service> serviceRepo,
            IMapper mapper) {
            _roomsRepo = roomsRepo;
            _staysRepo = staysRepo;
            _guestRepo = guestRepo;
            _serviceRepo = serviceRepo;
            _mapper = mapper;
        }

        [HttpGet ("availableRooms")]
        public async Task<IActionResult> GetAvaliableRooms ([FromQuery] UserParams userParams) {
            var rooms = await _roomsRepo.GetRooms (userParams);
            var roomsToReturn = _mapper.Map<IEnumerable<RoomForCheckinDto>> (rooms);

            foreach (var room in roomsToReturn) {
                room.CurrentGuestCount = _staysRepo.GetCount (s => s.CheckedOut == false &&
                    s.CheckedIn == true &&
                    !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                    s.RoomId == room.Id);

                if (room.CurrentGuestCount >= room.Capacity) {

                }
            }

            Response.AddPagination (rooms.CurrentPage,
                rooms.PageSize,
                rooms.TotalCount,
                rooms.TotalPages);

            return Ok (roomsToReturn);
        }

        [HttpPost ("checkin")]
        public async Task<IActionResult> CheckinGuest ([FromBody] GuestStayForCheckinDto guestStayDto) {

            //var existentGuest = await _guestRepo.GetAsync(g => g.Email.Equals(guestStayDto.Email) || g.DodId );
            var guest = _mapper.Map<Guest> (guestStayDto);

            if (await _guestRepo.IsGuestCheckedIn (guest.Id)) {
                    ModelState.AddModelError ("Guest", "Guest Already Checked In");
            }
            // if (_guestRepo.GetFirstOrDefault(g => g.DodId == guest.DodId) == null){
            
            //  ModelState.AddModelError ("GuestExists", "Guest Already Checked In");
            // }

            if (!ModelState.IsValid) {
                    return BadRequest (ModelState);
                }

            var room = await _roomsRepo.GetFirstOrDefault (r => r.Id == guestStayDto.roomId);

            if (guest.Id != 0) {
                

                

                _guestRepo.Update (guest);
                _guestRepo.SaveAsync ();
            } else {
                _guestRepo.Insert (guest);
                _guestRepo.Save();
            } else {
                ModelState.AddModelError ("Guest", "Guest Already Checked In");
            }

            var stay = _mapper.Map<Stay> (guestStayDto);

            stay.GuestId = guest.Id;
            stay.BuildingId = room.BuildingId;
            stay.CheckedIn = true;
            _staysRepo.Insert (stay);
            _staysRepo.Save ();

            return Ok ();
        }

        [HttpGet ("existentguest")]
        public async Task<IActionResult> GetExistentGuest (int dodId) {
            var guest = await _guestRepo.GetFirstOrDefault (g => g.DodId == dodId, new Expression<Func<Guest, object>>[] { g => g.Rank, g => g.Unit });

            if (guest == null) {
                return Ok ();
            }

            var guestStayForRetrieve = _mapper.Map<GuestStayForRetrieveDto> (guest);
            guestStayForRetrieve.Service = await _serviceRepo
                .GetFirstOrDefault (
                    s => s.Id == guestStayForRetrieve.Rank.ServiceId,
                    new Expression<Func<Service, object>>[] {
                        s => s.Ranks
                    });

            return Ok (guestStayForRetrieve);
        }
    }
}