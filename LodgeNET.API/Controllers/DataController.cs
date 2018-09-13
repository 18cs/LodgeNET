using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.BLL;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using LodgeNET.API.Dtos.Charts;
using LodgeNET.API.Dtos.Charts.SeriesTypes;
using System;

namespace LodgeNET.API.Controllers
{
    [Route("api/[controller]")]
    public class DataController : Controller
    {
        private IMapper _mapper;
        private BuildingService _buildingService;
        private GuestStayService _guestStayService;
        private UnitService _unitService;
        private DataService _dataService;

        public DataController(IMapper mapper,
            BuildingService buildingService,
            GuestStayService guestStayService,
            UnitService unitService,
            DataService dataService)
        {
            _mapper = mapper;
            _buildingService = buildingService;
            _guestStayService = guestStayService;
            _unitService = unitService;
            _dataService = dataService;
        }

        [HttpGet("buildingtypeoccupancyservice")]
        public async Task<IActionResult> GetBldgTypeOccupancyByService()
        {
            const string VACENT = "Vacant";
            const string UNKNOWN = "Unknown";
            var chart = _dataService.GetChart<ServiceOccupancySeries>();
            chart.Columns = (await _buildingService.GetBuildingTypes()).Select(btype => btype.Type).ToList();
            chart.Series = new List<ServiceOccupancySeries>();

            var services = await _unitService.GetServices();

            var seriesCats = services.Select(u => u.ServiceName).ToList();
            seriesCats.Add(VACENT);
            seriesCats.Add(UNKNOWN);

            foreach (var series in seriesCats)
            {
                chart.Series.Add(new ServiceOccupancySeries()
                {
                    Name = series,
                    Data = new List<int>()
                });
            }

            foreach (var column in chart.Columns)
            {
                foreach (var series in chart.Series)
                {
                    if (series.Name.Equals(VACENT))
                    {
                        var bldgType = await _buildingService.GetBuildingType(column);

                        if (!bldgType.InSurge)
                        {
                            series.Data.Add((await _buildingService.GetBuildingTypeCapacity(column)) - (await _buildingService.GetBuildingTypeCurrentGuests(column)));
                        } else {
                            series.Data.Add((await _buildingService.GetBuildingTypeSurgeCapacity(column)) - (await _buildingService.GetBuildingTypeCurrentGuests(column)));
                        }
                    }
                    else if (series.Name.Equals(UNKNOWN))
                    {
                        series.Data.Add(
                             (await _guestStayService.GetGuestStays(
                                null,
                                s => s.CheckedOut == false &&
                                s.CheckedIn == true &&
                                !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
                                s.Building.BuildingCategory.Type.Equals(column) &&
                                (s.Guest.RankId == null || s.Guest.RankId == 0))
                            ).Count()
                        );
                    }
                    else
                    {
                        series.Data.Add(
                            (await _guestStayService.GetGuestStays(null,
                                s => s.CheckedOut == false &&
                                s.CheckedIn == true &&
                                !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
                                s.Guest.Rank.Service.ServiceName.Equals(series.Name) &&
                                s.Building.BuildingCategory.Type.Equals(column))).Count()
                        );
                    }
                }
            }
            return Ok(chart);
        }
    }
}