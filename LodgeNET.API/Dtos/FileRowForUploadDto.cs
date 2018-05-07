namespace LodgeNET.API.Dtos
{
    public class FileRowForUploadDto
    {
         public string FirstName { get; set; }
         public string LastName { get; set; }
         public int RoomId { get; set; }
         public int RoomNumber { get; set; }
         public int BuildingId { get; set; }
         public int BuildingNumber { get; set; }
         public int UnitId { get; set; }
         public string UnitName { get; set; }
    }
}