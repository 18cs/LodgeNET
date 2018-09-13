namespace LodgeNET.API.Dtos
{
    public class BuildingTypeDataDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public bool InSurge { get; set; }
        public int CurrentGuests { get; set; }
        public int Capacity { get; set; }
        public int SurgeCapacity { get; set; }
    }
}