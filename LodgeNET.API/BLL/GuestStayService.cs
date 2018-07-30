using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Dtos;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.BLL {
    public class GuestStayService {
        private IRoomRepository _roomsRepo;
        private IGenericRepository<Stay> _staysRepo;
        private IGuestRepository _guestRepo;
        private IGenericRepository<Service> _serviceRepo;
        private IGuestStayRepo _guestStayRepo;
        private IMapper _mapper;
        public GuestStayService (IRoomRepository roomsRepo,
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

        public async Task<PagedList<Room>> GetAvailableRoomsPagination (RoomUserParams userParams) {
            var rooms = await _roomsRepo.GetRoomsPagination (userParams);

            return (rooms);
        }

        public async Task<int> GetAvailableRoomCount (int id) {
            var roomCount = await _staysRepo.GetCount (s => s.CheckedOut == false &&
                s.CheckedIn == true &&
                !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                s.RoomId == id);
            
            return (roomCount);
        }

        public async Task<Room> EditRoom (Room room) {
            var rm = await _roomsRepo.GetFirstOrDefault (b => b.Id == room.Id);

            if (rm != null) {
                rm.RoomNumber = room.RoomNumber;
                rm.SurgeMultiplier = room.SurgeMultiplier;
                rm.Capacity = room.Capacity;
                rm.SquareFootage = room.SquareFootage;
                rm.Floor = room.Floor;
                rm.BuildingId = room.BuildingId;
            }

            await _roomsRepo.SaveAsync ();

            return (rm);
        }

        public async Task<Room> AddRoom (Room room) {
            if ((await _roomsRepo.GetFirstOrDefault (
                    r => r.RoomNumber == room.RoomNumber &&
                    r.BuildingId == room.BuildingId)) != null) {
                throw new System.ArgumentException ("Room Number for this Building already exists", string.Empty);
            }

            room.Building = null;

            await _roomsRepo.Insert (room);

            await _roomsRepo.SaveAsync ();

            return (room);
        }

        public async Task<Room> DeleteRoomById (int id) {
            var room = await _roomsRepo.GetFirstOrDefault (b => b.Id == id);

            await _roomsRepo.Delete (room.Id);

            await _roomsRepo.SaveAsync ();

            return (room);
        }

        public async Task<PagedList<Room>> GetRooms (RoomUserParams userParams) {
            var rms = await _roomsRepo.GetRoomsPagination (
                userParams,
                null,
                new Expression<Func<Room, object>>[] {
                    r => r.Building
                });

            return (rms);
        }

        public async Task<Stay> CheckinGuest (GuestStayForCheckInDto guestStayDto) {

            var guest = await _guestRepo.GetFirstOrDefault (g => g.DodId == guestStayDto.DodId);

            if (guest == null) {
                guest = _mapper.Map<Guest> (guestStayDto);
            } else {
                guestStayDto.GuestId = guest.Id;
                _mapper.Map (guestStayDto, guest);
            }

            if (await _guestRepo.IsGuestCheckedIn (guest.Id)) {
                throw new System.ArgumentException ("Guest already checked in.", string.Empty);
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

            return (stay);
        }

        public async Task<Stay> CheckOutGuest (Stay guestStayDto) {
            var guestStay = await _staysRepo.GetFirstOrDefault (s => s.Id == guestStayDto.Id);

            if (guestStay == null) {
                throw new System.ArgumentException ("Room Number for this Building already exists", string.Empty);
            }

            guestStay.CheckOutDate = DateTime.Today;

            guestStay.CheckedOut = true;
            await _staysRepo.SaveAsync ();

            return (guestStay);
        }

        public async Task<Guest> GetExistentGuest (int dodId) {
            return await _guestRepo.GetFirstOrDefault (g => g.DodId == dodId, new Expression<Func<Guest, object>>[] { g => g.Rank, g => g.Unit });
        }

        public async Task<IEnumerable<Stay>> GetGuestStays (GuestStayRetUserParams guestStayParams) {
            return await _guestStayRepo.GetGuestStays (
                    guestStayParams,
                    new Expression<Func<Stay, object>>[] {
                        s => s.Guest,
                            s => s.Guest.Rank,
                            s => s.Guest.Unit,
                            s => s.Room,
                            s => s.Building
                    }
                );
        }

        public async Task<PagedList<Stay>> GetGuestStaysPagination (GuestStayRetUserParams guestStayParams) {
            return await _guestStayRepo.GetGuestStaysPagination (
                    guestStayParams,
                    new Expression<Func<Stay, object>>[] {
                        s => s.Guest,
                            s => s.Guest.Rank,
                            s => s.Guest.Unit,
                            s => s.Room,
                            s => s.Building
                    }
                );
        }

        public async Task<Stay> UpdateGuestStay (GuestStayForEditDto guestStayDto) {
            
            var gueststay = await _guestStayRepo.GetFirstOrDefault (s => s.Id == guestStayDto.Id);

            if (gueststay == null) {
                throw new System.ArgumentException ("Unable to update guest", string.Empty);
            }

            //EF errors if values are not null for update
            guestStayDto.Guest = null;
            guestStayDto.Building = null;
            guestStayDto.Room = null;

            _mapper.Map (guestStayDto, gueststay);
            await _guestRepo.SaveAsync ();

            return (gueststay);
        }

        public async Task<PagedList<Guest>> GetGuestsPagination (GuestUserParams userParams) {
            var guests = await _guestRepo.GetGuestPagination (userParams,
                new Expression<Func<Guest, object>>[] {
                    g => g.Rank,
                        g => g.Unit
                });

            return (guests);
        }

        public async Task<Guest> UpdateGuest (GuestForEditDto updatedGuestDto) {
            var guest = await _guestRepo.GetFirstOrDefault (g => g.Id == updatedGuestDto.Id);

            if (guest == null) {
                throw new System.ArgumentException ("Unable to update unit", string.Empty);
            }

            _mapper.Map (updatedGuestDto, guest);
            await _guestRepo.SaveAsync ();

            return (guest);
        }

        public async Task<int> DeleteGuestById (int id) {
            var guest = await _guestRepo.GetFirstOrDefault (g => g.Id == id);

            if (guest == null) {
                throw new System.ArgumentException ("Unable to delete guest", string.Empty);
            }

            await _guestRepo.Delete (guest);
            await _guestRepo.SaveAsync ();

            return (id);
        }
    }
}