using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.DAL.Models
{
    public class Stay
    {
        [Key]
        public int Id { get; set; }
        public int GuestId { get; set; }
        [ForeignKey("GuestId")]        
        public Guest Guest { get; set; }
        public int RoomId { get; set; }
        [ForeignKey("RoomId")]
        public Room Room { get; set; }
        public int? BuildingId { get; set; }
        [ForeignKey("BuildingId")]
        public Building Building { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public bool Canceled { get; set; }
        public bool CheckedIn { get; set; }
        public bool CheckedOut { get; set; }
        public DateTime DateCreated { get; set; }

        public Stay()
        {
            DateCreated = DateTime.Now;
            CheckInDate = DateTime.Now;
        }
    }
}