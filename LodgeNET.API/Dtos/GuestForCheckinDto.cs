using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.Dtos
{
    public class GuestForCheckinDto
    {
        public int DodId { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public int ServiceId { get; set; }
        public int RankId { get; set; }
        public int UnitId { get; set; }
        public int Chalk { get; set; }
        public string Email { get; set; }
        public string DsnPhone { get; set; }
        public string CommPhone { get; set; }
        public int roomId { get; set; }
        public int GuestId { get; set; }
        public Rank Rank { get; set; }
        public Unit GuestUnit { get; set; }
        public Service Service { get; set; }
    }
}