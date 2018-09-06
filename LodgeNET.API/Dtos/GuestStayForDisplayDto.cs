using System;

namespace LodgeNET.API.Dtos {
    public class GuestStayForDisplayDto {
        public int? DodId { get; set; }
        public string FirstName { get; set; }
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
        public int? Chalk { get; set; }
        public string Rank { get; set; }
        public string Service { get; set; }
        public string Unit { get; set; }
        public string RoomNumber { get; set; }
        public int? BuildingNumber { get; set; }
        public string BuildingName { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
    }
}