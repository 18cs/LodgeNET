using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LodgeNET.API.DAL.Models
{
    public class Building
    {
        [Key]
        public int Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public int BuildingCategoryId { get; set; }
        [ForeignKey("BuildingCategoryId")]
        public BuildingCategory BuildingCategory { get; set; }
    }
}