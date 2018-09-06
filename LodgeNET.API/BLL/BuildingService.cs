using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using LodgeNET.API.DAL;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Dtos;
using LodgeNET.API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace LodgeNET.API.BLL
{
    public class BuildingService
    {
        private readonly IBuildingRepository _buildingsRepo;
        private readonly IGenericRepository<BuildingCategory> _buildingCategoryRepo;
        private readonly IGenericRepository<Stay> _stayRepo;
        private readonly IGenericRepository<Room> _roomRepo;
        private readonly IMapper _mapper;
        public BuildingService(IBuildingRepository buildingsRepo,
            IGenericRepository<BuildingCategory> buildingCategoryRepo,
            IGenericRepository<Stay> stayRepo,
            IGenericRepository<Room> roomRepo,
            IMapper mapper)
        {
            _mapper = mapper;
            _buildingsRepo = buildingsRepo;
            _buildingCategoryRepo = buildingCategoryRepo;
            _stayRepo = stayRepo;
            _roomRepo = roomRepo;
        }

        public async Task<Building> GetBuilding(int id)
        {
            var building = await _buildingsRepo.GetByID(id);

            return (building);
        }

        public async Task<IEnumerable<Building>> GetBuildings(BuildingUserParams userParams = null)
        {
            var buildings = await _buildingsRepo.GetBuildings(
                userParams,
                new Expression<Func<Building, object>>[] {
                    b => b.BuildingCategory
                });
            return (buildings);
        }

        public async Task<PagedList<Building>> GetBuildingsPagination(BuildingUserParams pageParams)
        {
            var bldgs = await _buildingsRepo.GetBuildingsPagination(
                pageParams,
                new Expression<Func<Building, object>>[] {
                    b => b.BuildingCategory
                });

            return (bldgs);
        }

        public async Task<IEnumerable<BuildingCategory>> GetBuildingTypes()
        {

            var buildingTypes = await _buildingCategoryRepo.GetAsync();

            return (buildingTypes);
        }

        public async Task<PagedList<BuildingCategory>> GetBuildingTypesPagiantion(PagUserParams userParams)
        {
            var buildingTypes = await _buildingsRepo.GetBuildingTypesPagination(
                userParams
            );

            return (buildingTypes);
        }

        //TODO use other class methods to calculate
        public async Task<BuildingsDataDto> buildingDashboardData()
        {
            var buildingListResult = await _buildingsRepo.GetAsync();
            var buildingTypeListResult = await _buildingCategoryRepo.GetAsync();
            var buildingsDataDto = new BuildingsDataDto()
            {
                BuildingList = _mapper.Map<IEnumerable<BuildingDataDto>>(buildingListResult),
                BuildingTypeList = _mapper.Map<List<BuildingTypeDataDto>>(buildingTypeListResult.ToList())
            };

            foreach (BuildingDataDto b in buildingsDataDto.BuildingList)
            {
                b.CurrentGuests = await _stayRepo.GetCount(s => s.CheckedOut == false &&
                   s.CheckedIn == true &&
                   !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
                   s.BuildingId == b.Id);
                b.Capacity = await _roomRepo.GetSum(r => r.Capacity, r => r.BuildingId == b.Id);

                var bcat = buildingsDataDto.BuildingTypeList.Find(t => t.Id == b.BuildingCategoryId);
                if (bcat != null)
                {
                    bcat.Capacity += b.Capacity;
                    bcat.CurrentGuests += b.CurrentGuests;
                }
            }
            return (buildingsDataDto);
        }
        public async Task<int> GetBuildingCurrentGuests(int buildingId)
        {
            return await _stayRepo.GetCount(s => s.CheckedOut == false &&
               s.CheckedIn == true &&
               !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
               s.BuildingId == buildingId);
        }

        public async Task<int> GetBuildingTypeCurrentGuests(int buildingTypeId)
        {
            return await _stayRepo.GetCount(s => s.CheckedOut == false &&
               s.CheckedIn == true &&
               !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
               s.Building.BuildingCategoryId == buildingTypeId);
        }

        public async Task<int> GetBuildingTypeCurrentGuests(string buildingType)
        {
            return await _stayRepo.GetCount(s => s.CheckedOut == false &&
               s.CheckedIn == true &&
               !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
               s.Building.BuildingCategory.Type == buildingType);
        }

        public async Task<int> GetBuildingCurrentGuestsPerService(int buildingTypeId, int serviceId)
        {
            return await _stayRepo.GetCount(s => s.CheckedOut == false &&
               s.CheckedIn == true &&
               !(DateTime.Compare(s.CheckInDate, DateTime.Today) > 0) &&
               s.Building.BuildingCategoryId == buildingTypeId &&
               s.Guest.Rank.ServiceId == serviceId);
        }

        public async Task<int> GetBuildingCapacity(int buildingId)
        {
            return await _roomRepo.GetSum(r => r.Capacity, r => r.BuildingId == buildingId);
        }

        public async Task<int> GetBuildingTypeCapacity(int buildingTypeId)
        {
            return await _roomRepo.GetSum(r => r.Capacity,
                r => r.Building.BuildingCategoryId == buildingTypeId);
        }

        public async Task<int> GetBuildingTypeCapacity(string buildingType)
        {
            return await _roomRepo.GetSum(r => r.Capacity,
                r => r.Building.BuildingCategory.Type == buildingType);
        }

        public async Task<Building> SaveBuilding(BuildingDataDto building)
        {
            var bldg = await _buildingsRepo.GetFirstOrDefault(b => b.Id == building.Id);

            if (bldg != null)
            {
                bldg.Name = building.Name;
                bldg.BuildingCategoryId = building.BuildingCategoryId;
            }

            await _buildingsRepo.SaveAsync();

            return (bldg);
        }

        public async Task<Building> AddBuilding(Building building)
        {
            if ((await _buildingsRepo.GetFirstOrDefault(b => b.Number == building.Number)) != null)
            {
                throw new System.ArgumentException("Building Number already exists", string.Empty);
            }

            building.BuildingCategory = null;

            await _buildingsRepo.Insert(building);

            await _buildingsRepo.SaveAsync();

            return (building);
        }

        public async Task<BuildingCategory> SaveBuildingType(BuildingTypeDataDto buildingType)
        {
            var bldgType = await _buildingCategoryRepo.GetFirstOrDefault(b => b.Id == buildingType.Id);

            if (bldgType != null)
            {
                bldgType.Type = buildingType.Type;
                bldgType.InSurge = buildingType.InSurge;
            }

            await _buildingCategoryRepo.SaveAsync();

            return (bldgType);
        }

        public async Task<BuildingCategory> AddBuildingType(BuildingCategory buildingType)
        {
            var bldgTypeToAdd = _mapper.Map<BuildingCategory>(buildingType);

            await _buildingCategoryRepo.Insert(bldgTypeToAdd);

            await _buildingCategoryRepo.SaveAsync();

            return (bldgTypeToAdd);
        }

        public async Task<BuildingCategory> DeleteBuildingTypeById(int id)
        {
            var bldgType = await _buildingCategoryRepo.GetFirstOrDefault(b => b.Id == id);

            await _buildingCategoryRepo.Delete(bldgType.Id);

            await _buildingCategoryRepo.SaveAsync();

            return (bldgType);
        }
        public async Task<Building> DeleteBuildingById(int id)
        {
            var bldg = await _buildingsRepo.GetFirstOrDefault(b => b.Id == id);

            await _buildingsRepo.Delete(bldg.Id);

            await _buildingsRepo.SaveAsync();

            return (bldg);
        }

    }
}