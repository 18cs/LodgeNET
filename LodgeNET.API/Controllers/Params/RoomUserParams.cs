namespace LodgeNET.API.Helpers
{
    public class RoomUserParams : PagUserParams
     {
        public int? BuildingId { get; set; }
        public bool OnlyAvailableRooms { get; set; }
        public string RoomNumber { get; set; }
    }
}