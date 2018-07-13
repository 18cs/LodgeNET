namespace LodgeNET.API.Helpers
{
    public class GuestStayRetUserParams
    {
        public int? DodId { get; set; }
        public string LastName { get; set; }
        public string RoomNumber { get; set; }
        public int? GuestId { get; set; }
        public bool CurrentStaysOnly { get; set; }
    }
}