namespace LodgeNET.API.Dtos
{
    public class RoomForDisplayDto
    {
        public string RoomNumber { get; set; }
        public int SurgeCapacity { get; set; }
        public int Capacity { get; set; }
        public int SquareFootage { get; set; }
        public string BuildingName { get; set; }
        public int BuildingNumber { get; set; }
        
    }
}