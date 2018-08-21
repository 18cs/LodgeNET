using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL.Dtos
{
    public class GuestStayForCheckInDto
    {
        public int DodId { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public int ServiceId { get; set; }
        public int? RankId { get; set; }
        public int UnitId { get; set; }
        public int? Chalk { get; set; }
        public string Email { get; set; }
        public string DsnPhone { get; set; }
        public string CommPhone { get; set; }
        public int RoomId { get; set; }
        public int? GuestId { get; set; }
    }
}