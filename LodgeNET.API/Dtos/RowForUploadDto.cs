namespace LodgeNET.API.Dtos
{
    public class RowForUploadDto
    {
         public string FirstName { get; set; }
         public string LastName { get; set; }
         public int RoomId { get; set; }
         public string RoomNumber { get; set; }
         public int BuildingId { get; set; }
         public string BuildingNumber { get; set; }
         public int UnitId { get; set; }
         public string UnitName { get; set; }
    }
}