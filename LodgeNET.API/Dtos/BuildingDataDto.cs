namespace LodgeNET.API.Dtos
{
    public class BuildingDataDto
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public int BuildingCategoryId { get; set; }
        public int BuildingOccupancy { get; set; }
    }
}