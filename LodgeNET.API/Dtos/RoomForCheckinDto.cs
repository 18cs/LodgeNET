namespace LodgeNET.API.Dtos
{
    public class RoomForCheckinDto
    {
        public int Id { get; set; }
        public int RoomNumber { get; set; }
        public int Capacity { get; set; }
        public int Floor { get; set; }
        public int BuildingId { get; set; }
        public string RoomType { get; set; }
        public int CurrentGuestCount { get; set; }   
    }
}