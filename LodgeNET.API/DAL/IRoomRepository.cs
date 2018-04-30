using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IRoomRepository
    {
         Task<PagedList<Room>> GetRooms(RoomPagUserParams userParams, Expression<Func<Room, bool>> filter = null);
          Task<Room> GetFirstOrDefault(Expression<Func<Room, bool>> filter, Expression<Func<Room, object>>[] includeProperties = null);
    }
}