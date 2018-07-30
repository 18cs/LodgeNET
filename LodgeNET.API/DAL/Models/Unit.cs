using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.DAL.Models
{
    public class Unit
    {
        [Key]
        public int Id { get; set; }
        public int? ParentUnitId { get; set; }
        [ForeignKey("ParentUnitId")]
        public Unit ParentUnit { get; set; }
        public string Name { get; set; }
    }
}