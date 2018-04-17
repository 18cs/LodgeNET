using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public bool Canceled { get; set; }
        public DateTime DateCreated { get; set; }

        public ICollection<GuestReservation> GuestReservations { get; set; }

        public Reservation()
        {
            DateCreated = DateTime.Now;
            // Guests = new Collection<Guest>();
        }
    }
}