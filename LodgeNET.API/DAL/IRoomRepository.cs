using System.Threading.Tasks;
using LodgeNET.API.Helpers;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IRoomRepository
    {
         Task<PagedList<Room>> GetRooms(UserParams userParams);
    }
}