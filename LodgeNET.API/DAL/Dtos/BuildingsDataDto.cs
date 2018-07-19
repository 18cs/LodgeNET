using System.Collections.Generic;
using LodgeNET.API.Models;

namespace LodgeNET.API.Dtos
{
    public class BuildingsDataDto
    {
        public IEnumerable<BuildingDataDto> BuildingList { get; set; }
        public List<BuildingCategoryDataDto> BuildingTypeList { get; set; }
    }
}