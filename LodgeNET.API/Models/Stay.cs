using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.Models
{
    public class Stay
    {
        [Key]
        public int Id { get; set; }
        public int GuestId { get; set; }
        [ForeignKey("GuestId")]        
        public Guest Guest { get; set; }
        public int? ReservationId { get; set; }
        [ForeignKey("ReservationId")]
        public Reservation Reservation { get; set; }
        public int? RoomId { get; set; }
        [ForeignKey("RoomId")]
        public Room Room { get; set; }
        public int BuildingId { get; set; }
        [ForeignKey("BuildingId")]
        public Building Building { get; set; }
        public DateTime DateCheckedIn { get; set; }
        public DateTime? DateCheckedOut { get; set; }
    }
}