using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {
        public RoomRepository(DataContext context)
            :base(context)
        {
            
        }

        public async Task<PagedList<Room>> GetRooms(UserParams userParams)
        {
            var rooms = _context.Rooms;

            return await PagedList<Room>.CreateAsync(rooms, userParams.PageNumber, userParams.PageSize)
        }
    }
}