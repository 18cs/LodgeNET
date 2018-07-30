using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL {
    public interface IRoomRepository : IGenericRepository<Room> {
        Task<PagedList<Room>> GetRoomsPagination (
            RoomUserParams userParams,
            Expression<Func<Room, bool>> filter = null,
            Expression<Func<Room, object>>[] includeProperties = null
        );
        // Task<PagedList<Room>> GetRooms (
        //     RoomUserParams userParams, 
        //     Expression<Func<Room, bool>> filter = null);
        //   Task<Room> GetFirstOrDefault(Expression<Func<Room, bool>> filter, Expression<Func<Room, object>>[] includeProperties = null);
    }
}