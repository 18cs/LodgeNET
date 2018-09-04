using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.DAL.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }
        public string RoomNumber { get; set; }
        public int SurgeCapacity { get; set; }
        public int Capacity { get; set; }
        public int SquareFootage { get; set; }
        public int Floor { get; set; }
        public int BuildingId { get; set; }
        [ForeignKey("BuildingId")]
        public Building Building { get; set; }
        public string RoomType { get; set; }
    }
}