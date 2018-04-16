using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.Models
{
    public class Guest
    {
        [Key]
        public int Id { get; set; }
        public int? DodId { get; set; }
        public string FirstName { get; set; }
        [MaxLength(1)]
        public string MiddleInitial { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string CommPhone { get; set; }
        public string DsnPhone { get; set; }
        public int? Chalk { get; set; }
        public int? ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
        public int? RankId { get; set; }
        [ForeignKey("RankId")]
        public Rank Rank { get; set; }
        public int? UnitId { get; set; }
        [ForeignKey("UnitId")]
        public Unit Unit { get; set; }

        public ICollection<GuestReservation> GuestReservations { get; set; }

        // public Guest()
        // {
        //     Reservations = new Collection<Reservation>();
        // }
    }
}

/* [Required(ErrorMessage = "Your must provide a PhoneNumber")]
[Display(Name = "Home Phone")]
[DataType(DataType.PhoneNumber)]
[RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid Phone number")]
public string PhoneNumber { get; set; } */