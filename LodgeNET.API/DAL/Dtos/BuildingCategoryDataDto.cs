namespace LodgeNET.API.DAL.Dtos
{
    public class BuildingCategoryDataDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public int CurrentGuests { get; set; }
        public int Capacity { get; set; }
    }
}