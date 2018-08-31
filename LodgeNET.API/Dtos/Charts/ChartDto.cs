using System.Collections.Generic;

namespace LodgeNET.API.Dtos.Charts
{
    public class ChartDto<SeriesType>
    {
        public List<string> Columns { get; set; }
        public List<SeriesType> Series { get; set; }
    }
}