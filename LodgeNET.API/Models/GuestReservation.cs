using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.Models
{
    public class GuestReservation
    {
        public int GuestId { get; set; }
        [ForeignKey("GuestId")]
        public Guest Guest { get; set; }
        public int ReservationId { get; set; }
        [ForeignKey("ReservationId")]
        public Reservation Reservation { get; set; }
    }
}