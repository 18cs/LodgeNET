using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.Models
{
    public class BuildingCategory
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
    }
}