using System.Collections.Generic;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.Dtos
{
    public class BuildingsDataDto
    {
        public IEnumerable<BuildingDataDto> BuildingList { get; set; }
        public List<BuildingTypeDataDto> BuildingTypeList { get; set; }
    }
}