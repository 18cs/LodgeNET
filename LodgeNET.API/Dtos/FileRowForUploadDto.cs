using System;

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
         public DateTime? CheckInDate { get; set; }
         public DateTime? CheckOutDate { get; set; }
         public bool CheckedIn { get; set; }
         
    }
}