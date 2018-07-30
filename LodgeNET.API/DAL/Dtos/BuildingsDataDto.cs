using System.Collections.Generic;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL.Dtos
{
    public class BuildingsDataDto
    {
        public IEnumerable<BuildingDataDto> BuildingList { get; set; }
        public List<BuildingCategoryDataDto> BuildingTypeList { get; set; }
    }
}