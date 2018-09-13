using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace LodgeNET.API.DAL.Models {
    public class Building {
        public IEnumerable<Room> Rooms { get; private set; }
        [Key]
        public int Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public int BuildingCategoryId { get; set; }

        [ForeignKey ("BuildingCategoryId")]
        public BuildingCategory BuildingCategory { get; set; }
        public Building () { }

    }
}