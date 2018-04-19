using System.Collections.Generic;
using LodgeNET.API.Models;

namespace LodgeNET.API.Dtos
{
    public class BuildingDashboardDto
    {
        public IEnumerable<Building> BuildingList { get; set; }
        public IEnumerable<BuildingCategory> BuildingTypeList { get; set; }
    }
}