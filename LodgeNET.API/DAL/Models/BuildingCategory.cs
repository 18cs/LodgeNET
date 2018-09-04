using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.DAL.Models
{
    public class BuildingCategory
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
        public bool InSurge { get; set; }
    }
}