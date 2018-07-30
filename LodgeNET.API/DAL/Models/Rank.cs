using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.DAL.Models
{
    public class Rank
    {
        [Key]
        public int Id { get; set; }
        public int ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
        public string RankName { get; set; }
        public string Tier { get; set; }
        public int Grade { get; set; }
    }
}