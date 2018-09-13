using System;

namespace LodgeNET.API.Dtos {
    public class FileRowForUploadDto {
        public string Gender { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int RoomId { get; set; }
        public string RoomNumber { get; set; }
        public int BuildingId { get; set; }
        public int BuildingNumber { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public bool CheckedIn { get; set; }
        public int? RankId { get; set; }
        public string RankName { get; set; }
        public int? ServiceId { get; set; }
        public string ServiceName { get; set; }
        public int? UploadId { get; set; }
    }
}