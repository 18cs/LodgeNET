using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL {
    public class RoomRepository : GenericRepository<Room>, IRoomRepository {

        public RoomRepository (DataContext context) : base (context) {

        }

        public async Task<PagedList<Room>> GetRoomsPagination (
            RoomUserParams userParams,
            Expression<Func<Room, bool>> filter = null,
            Expression<Func<Room, object>>[] includeProperties = null

        ) {
            var rooms = _context.Rooms.OrderBy (r => r.RoomNumber).AsQueryable ();

            if (includeProperties != null) {
                foreach (Expression<Func<Room, object>> includeProperty in includeProperties) {
                    rooms = rooms.Include<Room, object> (includeProperty);
                }
            }

            if (filter != null) {
                rooms = rooms.Where (filter);
            }

            if (userParams.BuildingId != null) {
                rooms = rooms.Where (r => r.BuildingId == userParams.BuildingId);
            }

            if (!String.IsNullOrWhiteSpace (userParams.RoomNumber)) {
                rooms = rooms.Where (r => r.RoomNumber.Equals (userParams.RoomNumber));
            }

            if (userParams.OnlyAvailableRooms) {
                var stays = _context.Stays.AsQueryable ();

                if (userParams.OnlyAvailableRooms == true && userParams.BuildingId != 0) {
                    stays = _context.Stays.Where (s => s.CheckedOut == false &&
                        s.CheckedIn == true &&
                        !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
                        s.BuildingId == userParams.BuildingId);
                }

                rooms = rooms.Where (r => (stays.Where (s => s.RoomId == r.Id).Count ()) < r.Capacity);
            }

            return await PagedList<Room>.CreateAsync (rooms, userParams.PageNumber, userParams.PageSize);
        }

        // public async Task<PagedList<Room>> GetRooms (RoomUserParams userParams, Expression<Func<Room, bool>> filter = null) {
        //     var stays = _context.Stays.AsQueryable ();

        //     if (userParams.OnlyAvailableRooms == true && userParams.BuildingId != 0) {
        //         stays = _context.Stays.Where (s => s.CheckedOut == false &&
        //             s.CheckedIn == true &&
        //             !(DateTime.Compare (s.CheckInDate, DateTime.Today) > 0) &&
        //             s.BuildingId == userParams.BuildingId);
        //     }

        //     var rooms = _context.Rooms.OrderBy (r => r.RoomNumber).AsQueryable ();

        //     if (userParams.BuildingId != 0) {
        //         rooms = rooms.Where (r => r.BuildingId == userParams.BuildingId);
        //     }

        //     if (filter != null) {
        //         rooms = rooms.Where (filter);
        //     }

        //     if (userParams.OnlyAvailableRooms) {
        //         rooms = rooms.Where (r => (stays.Where (s => s.RoomId == r.Id).Count ()) < r.Capacity);
        //     }
        //     return await PagedList<Room>.CreateAsync (rooms, userParams.PageNumber, userParams.PageSize);
        // }
    }
}