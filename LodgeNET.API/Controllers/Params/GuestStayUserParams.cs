namespace LodgeNET.API.Helpers
{
    public class GuestStayUserParams : PagUserParams
    {
        public int? DodId { get; set; }
        public string LastName { get; set; }
        public string RoomNumber { get; set; }
        public int? RoomId { get; set; }
        public int? GuestId { get; set; }
        public bool CurrentStaysOnly { get; set; }
        public int? BuildingId { get; set; }
        public int? ServiceId { get; set; }
    }
}