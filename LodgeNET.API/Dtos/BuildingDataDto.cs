namespace LodgeNET.API.Dtos
{
    public class BuildingDataDto
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public int BuildingCategoryId { get; set; }
        public int CurrentGuests { get; set; }
        public int Capacity { get; set; }
        public int SurgeCapacity { get; set; }
    }
}